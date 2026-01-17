import { useEffect, useMemo, useRef, useState } from 'react'
import { ethers } from 'ethers'

import {
  CHAIN_CONFIG,
  CONTRACT_ABIS,
  CONTRACT_ADDRESSES,
} from '@/lib/contracts'
import { RUNNER_CONFIG } from '@/lib/runnerConfig'

type ReserveState = {
  lastReserve?: bigint
  lastBlock?: bigint
}

type TriggerState = {
  lastTriggeredBlock?: bigint
}

type AutoRunnerState = {
  error: string | null
  lastAction: string | null
}

type AutoRunnerParams = {
  signer: ethers.JsonRpcSigner | null
  isConnected: boolean
  chainId: number | null
}

export default function useAutoRunner({
  signer,
  isConnected,
  chainId,
}: AutoRunnerParams) {
  const [state, setState] = useState<AutoRunnerState>({
    error: null,
    lastAction: null,
  })

  const reserveStateRef = useRef<ReserveState>({})
  const triggerStateRef = useRef<TriggerState>({})
  const isProcessingRef = useRef(false)
  const lastBlockRef = useRef<number | null>(null)

  const provider = useMemo(() => {
    if (!CHAIN_CONFIG.rpcUrl) {
      return null
    }
    return new ethers.JsonRpcProvider(CHAIN_CONFIG.rpcUrl)
  }, [])

  useEffect(() => {
    if (!provider) {
      setState((prev) => ({ ...prev, error: 'RPC URL missing' }))
      return
    }
    if (!RUNNER_CONFIG.autoMode) {
      return
    }

    const sandbox = new ethers.Contract(
      CONTRACT_ADDRESSES.sandbox,
      CONTRACT_ABIS.sandbox,
      provider,
    )
    const controller = new ethers.Contract(
      CONTRACT_ADDRESSES.controller,
      CONTRACT_ABIS.controller,
      signer ?? provider,
    )

    let active = true

    const canTrigger = async (blockNumber: bigint) => {
      if (!RUNNER_CONFIG.autoMode) return false
      if (!signer || !isConnected) return false
      if (CHAIN_CONFIG.id && chainId !== CHAIN_CONFIG.id) return false
      const last = triggerStateRef.current.lastTriggeredBlock
      if (!last) return true
      return blockNumber - last >= BigInt(RUNNER_CONFIG.cooldownBlocks)
    }

    const markTriggered = (blockNumber: bigint) => {
      triggerStateRef.current.lastTriggeredBlock = blockNumber
    }

    const fireActionSetA = async () => {
      setState((prev) => ({ ...prev, lastAction: 'actionSetA' }))
      await markTriggered(await provider.getBlockNumber().then(BigInt))
      const writes = [
        controller.setWithdrawLimit(BigInt(RUNNER_CONFIG.withdrawLimitBps)),
        controller.pausePool(),
        controller.snapshot(),
      ]
      await Promise.allSettled(writes)
    }

    const fireActionSetB = async () => {
      setState((prev) => ({ ...prev, lastAction: 'actionSetB' }))
      await markTriggered(await provider.getBlockNumber().then(BigInt))
      const writes = [
        controller.freezeOracle(),
        controller.isolate(),
        controller.snapshot(),
      ]
      await Promise.allSettled(writes)
    }

    const poll = async () => {
      if (!active || isProcessingRef.current) return
      isProcessingRef.current = true
      try {
        const blockNumber = await provider.getBlockNumber()
        const start =
          lastBlockRef.current === null
            ? Math.max(blockNumber - RUNNER_CONFIG.lookbackBlocks, 0)
            : lastBlockRef.current + 1

        const [reserveLogs, priceLogs] = await Promise.all([
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
        ])

        for (const log of reserveLogs) {
          const args = log.args as { oldReserve: bigint; newReserve: bigint }
          const oldReserve = args?.oldReserve
          const newReserve = args?.newReserve
          if (oldReserve === undefined || newReserve === undefined) continue
          const block = BigInt(log.blockNumber ?? blockNumber)

          if (reserveStateRef.current.lastReserve === undefined) {
            reserveStateRef.current.lastReserve = oldReserve
            reserveStateRef.current.lastBlock = block
            continue
          }

          const drop = oldReserve > newReserve ? oldReserve - newReserve : 0n
          const dropBps = oldReserve > 0n ? (drop * 10000n) / oldReserve : 0n
          const blocksPassed =
            block - (reserveStateRef.current.lastBlock ?? block)

          reserveStateRef.current.lastReserve = newReserve
          reserveStateRef.current.lastBlock = block

          if (
            dropBps >= BigInt(RUNNER_CONFIG.reserveDropBps) &&
            blocksPassed <= BigInt(RUNNER_CONFIG.reserveWindowBlocks) &&
            (await canTrigger(block))
          ) {
            await fireActionSetA()
          }
        }

        for (const log of priceLogs) {
          const args = log.args as { oldPrice: bigint; newPrice: bigint }
          const oldPrice = args?.oldPrice
          const newPrice = args?.newPrice
          if (oldPrice === undefined || newPrice === undefined) continue
          const delta =
            oldPrice >= newPrice ? oldPrice - newPrice : newPrice - oldPrice
          const block = BigInt(log.blockNumber ?? blockNumber)
          if (
            delta >= BigInt(RUNNER_CONFIG.priceShock) &&
            (await canTrigger(block))
          ) {
            await fireActionSetB()
          }
        }

        lastBlockRef.current = blockNumber
        if (active) {
          setState((prev) => ({ ...prev, error: null }))
        }
      } catch (err) {
        if (active) {
          setState((prev) => ({
            ...prev,
            error: err instanceof Error ? err.message : 'Runner error',
          }))
        }
      } finally {
        isProcessingRef.current = false
      }
    }

    void poll()
    const handle = setInterval(poll, RUNNER_CONFIG.pollIntervalMs)
    return () => {
      active = false
      clearInterval(handle)
    }
  }, [chainId, isConnected, provider, signer])

  return state
}
