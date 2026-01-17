import { ethers } from 'ethers'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  ACTION_LABELS,
  AGENT_DEFINITIONS,
  MAX_TXS,
  type ActionTx,
} from '@/app/agentRunners/data'
import {
  CHAIN_CONFIG,
  CONTRACT_ABIS,
  CONTRACT_ADDRESSES,
} from '@/lib/contracts'

const LOOKBACK_BLOCKS = 20
const POLL_INTERVAL_MS = 2_000

export default function useControllerActivity() {
  const [txs, setTxs] = useState<ActionTx[]>([])
  const [error, setError] = useState<string | null>(null)
  const [activeAgents, setActiveAgents] = useState<Record<string, number>>({})
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const txMapRef = useRef<Map<string, ActionTx>>(new Map())
  const lastBlockRef = useRef<number | null>(null)

  const provider = useMemo(() => {
    if (CHAIN_CONFIG.rpcUrl) {
      return new ethers.JsonRpcProvider(CHAIN_CONFIG.rpcUrl)
    }
    if (typeof window !== 'undefined' && window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum)
    }
    return null
  }, [])

  const controllerInterface = useMemo(
    () => new ethers.Interface(CONTRACT_ABIS.controller),
    [],
  )

  const markAgentsForAction = useCallback((action: string) => {
    const now = Date.now()
    setActiveAgents((prev) => {
      const next = { ...prev }
      for (const agent of AGENT_DEFINITIONS) {
        if (agent.actions.includes(action)) {
          next[agent.name] = now + 6000
        }
      }
      return next
    })
  }, [])

  const {
    data: newTxs,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [
      'controllerActivity',
      CHAIN_CONFIG.rpcUrl,
      CONTRACT_ADDRESSES.controller,
    ],
    queryFn: async () => {
      if (!provider || !CONTRACT_ADDRESSES.controller) {
        return []
      }

      const blockNumber = await provider.getBlockNumber()
      const start =
        lastBlockRef.current === null
          ? Math.max(blockNumber - LOOKBACK_BLOCKS, 0)
          : lastBlockRef.current + 1

      const foundTxs: ActionTx[] = []

      for (let bn = start; bn <= blockNumber; bn += 1) {
        const block = await provider.getBlock(bn, true)
        if (!block || !block.transactions) {
          continue
        }
        for (const tx of block.transactions) {
          const response =
            typeof tx === 'string' ? await provider.getTransaction(tx) : tx
          if (!response) {
            continue
          }
          if (
            !response.to ||
            response.to.toLowerCase() !==
              CONTRACT_ADDRESSES.controller.toLowerCase()
          ) {
            continue
          }
          if (txMapRef.current.has(response.hash)) {
            continue
          }

          let action = 'unknown'
          try {
            const decoded = controllerInterface.parseTransaction({
              data: response.data,
            })
            if (decoded?.name) {
              action = decoded.name
            }
          } catch {
            action = 'unknown'
          }

          const receipt = await provider.getTransactionReceipt(response.hash)
          const status = receipt?.status === 1 ? 'success' : 'revert'
          const item: ActionTx = {
            hash: response.hash,
            action,
            status,
            blockNumber: receipt?.blockNumber ?? bn,
            timestamp: block?.timestamp
              ? Number(block.timestamp) * 1000
              : undefined,
          }

          foundTxs.push(item)
          txMapRef.current.set(response.hash, item)
        }
      }

      lastBlockRef.current = blockNumber
      return foundTxs
    },
    enabled: !!provider && !!CONTRACT_ADDRESSES.controller,
    refetchInterval: POLL_INTERVAL_MS,
  })

  useEffect(() => {
    if (newTxs && newTxs.length > 0) {
      setTxs((prev) => {
        const updated = [...[...newTxs].reverse(), ...prev].slice(0, MAX_TXS)
        return updated
      })
      for (const tx of newTxs) {
        if (ACTION_LABELS[tx.action]) {
          markAgentsForAction(tx.action)
        }
      }
      setLastUpdated(new Date())
    } else if (newTxs) {
      // Even if no new txs, update last updated if the poll was successful
      setLastUpdated(new Date())
    }
  }, [newTxs, markAgentsForAction])

  useEffect(() => {
    if (queryError) {
      setError(
        queryError instanceof Error
          ? queryError.message
          : 'Unable to poll chain',
      )
    } else {
      setError(null)
    }
  }, [queryError])

  return {
    txs,
    error,
    activeAgents,
    lastUpdated,
    refresh: refetch,
  }
}
