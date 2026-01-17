import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ethers } from 'ethers'

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

const LOOKBACK_BLOCKS = 5
const POLL_INTERVAL_MS = 6000

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

  useEffect(() => {
    const handle = setInterval(() => {
      const now = Date.now()
      setActiveAgents((prev) => {
        const next: Record<string, number> = {}
        for (const [key, expiry] of Object.entries(prev)) {
          if (expiry > now) {
            next[key] = expiry
          }
        }
        return next
      })
    }, 1000)
    return () => clearInterval(handle)
  }, [])

  const poll = useCallback(async () => {
    if (!provider || !CONTRACT_ADDRESSES.controller) {
      return
    }
    try {
      const blockNumber = await provider.getBlockNumber()
      const start =
        lastBlockRef.current === null
          ? Math.max(blockNumber - LOOKBACK_BLOCKS, 0)
          : lastBlockRef.current + 1

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

          txMapRef.current.set(response.hash, item)
          if (ACTION_LABELS[action]) {
            markAgentsForAction(action)
          }
          setTxs((prev) => [item, ...prev].slice(0, MAX_TXS))
        }
      }

      lastBlockRef.current = blockNumber
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to poll chain')
    }
  }, [controllerInterface, markAgentsForAction, provider])

  useEffect(() => {
    if (!provider) {
      return
    }
    void poll()
    const handle = setInterval(() => {
      void poll()
    }, POLL_INTERVAL_MS)
    return () => clearInterval(handle)
  }, [poll, provider])

  return {
    txs,
    error,
    activeAgents,
    lastUpdated,
    refresh: poll,
  }
}
