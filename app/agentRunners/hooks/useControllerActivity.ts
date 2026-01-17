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

const POLL_INTERVAL_MS = 10000
const LOOKBACK_BLOCKS = 50
const ACTION_NAME_MAP: Record<string, string> = {
  pause: 'pausePool',
  limit: 'setWithdrawLimit',
  freezeOracle: 'freezeOracle',
  isolate: 'isolate',
}
const SANDBOX_EVENT_MAP: Record<string, string> = {
  PriceUpdated: 'priceShock',
  ReserveChanged: 'reserveChange',
  LargeOutflow: 'drain',
}

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

      const controller = new ethers.Contract(
        CONTRACT_ADDRESSES.controller,
        CONTRACT_ABIS.controller,
        provider,
      )
      const sandbox = new ethers.Contract(
        CONTRACT_ADDRESSES.sandbox,
        CONTRACT_ABIS.sandbox,
        provider,
      )

      const [appliedLogs, snapshotLogs, reserveLogs, priceLogs, outflowLogs] =
        await Promise.all([
          controller.queryFilter(
            controller.filters.ActionApplied(),
            start,
            blockNumber,
          ),
          controller.queryFilter(
            controller.filters.SnapshotCreated(),
            start,
            blockNumber,
          ),
          sandbox.queryFilter(
            sandbox.filters.ReserveChanged(),
            start,
            blockNumber,
          ),
          sandbox.queryFilter(
            sandbox.filters.PriceUpdated(),
            start,
            blockNumber,
          ),
          sandbox.queryFilter(
            sandbox.filters.LargeOutflow(),
            start,
            blockNumber,
          ),
        ])

      const blockCache = new Map<number, number>()
      const loadTimestamp = async (blockNum: number) => {
        if (blockCache.has(blockNum)) {
          return blockCache.get(blockNum)
        }
        const block = await provider.getBlock(blockNum)
        const timestamp = block?.timestamp
          ? Number(block.timestamp) * 1000
          : undefined
        if (timestamp !== undefined) {
          blockCache.set(blockNum, timestamp)
        }
        return timestamp
      }

      const combinedLogs = [
        ...appliedLogs.map((log) => ({
          log,
          action:
            ACTION_NAME_MAP[
              'args' in log
                ? ((log.args as { actionType?: string })?.actionType ?? '')
                : ''
            ] ??
            ('args' in log
              ? ((log.args as { actionType?: string })?.actionType ?? '')
              : '') ??
            'unknown',
        })),
        ...snapshotLogs.map((log) => ({
          log,
          action: 'snapshot',
        })),
        ...reserveLogs.map((log) => ({
          log,
          action: SANDBOX_EVENT_MAP.ReserveChanged,
        })),
        ...priceLogs.map((log) => ({
          log,
          action: SANDBOX_EVENT_MAP.PriceUpdated,
        })),
        ...outflowLogs.map((log) => ({
          log,
          action: SANDBOX_EVENT_MAP.LargeOutflow,
        })),
      ].sort((a, b) => {
        if (a.log.blockNumber === b.log.blockNumber) {
          return (a.log.index ?? 0) - (b.log.index ?? 0)
        }
        return (a.log.blockNumber ?? 0) - (b.log.blockNumber ?? 0)
      })

      const foundTxs: ActionTx[] = []
      for (const entry of combinedLogs) {
        const hash = entry.log.transactionHash
        if (txMapRef.current.has(hash)) {
          continue
        }
        const timestamp = entry.log.blockNumber
          ? await loadTimestamp(entry.log.blockNumber)
          : undefined
        const item: ActionTx = {
          hash,
          action: entry.action,
          status: 'success',
          blockNumber: entry.log.blockNumber ?? undefined,
          timestamp,
        }
        txMapRef.current.set(hash, item)
        foundTxs.push(item)
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
