import { useEffect, useMemo, useState } from 'react'
import { ethers } from 'ethers'

import {
  CHAIN_CONFIG,
  CONTRACT_ABIS,
  CONTRACT_ADDRESSES,
} from '@/lib/contracts'

export type ProtocolState = {
  isOnline: boolean
  chainLabel: string
  lastBlockTime: Date | null
  emergencyMode: boolean | null
  isolated: boolean | null
  oracleFrozen: boolean | null
  paused: boolean | null
  reserve: bigint | null
  price: bigint | null
  withdrawLimitBps: bigint | null
  error: string | null
}

const DEFAULT_STATE: ProtocolState = {
  isOnline: false,
  chainLabel: 'UNKNOWN',
  lastBlockTime: null,
  emergencyMode: null,
  isolated: null,
  oracleFrozen: null,
  paused: null,
  reserve: null,
  price: null,
  withdrawLimitBps: null,
  error: null,
}

export default function useProtocolState() {
  const [state, setState] = useState<ProtocolState>(DEFAULT_STATE)

  const provider = useMemo(() => {
    if (!CHAIN_CONFIG.rpcUrl) {
      return null
    }
    return new ethers.JsonRpcProvider(CHAIN_CONFIG.rpcUrl)
  }, [])

  useEffect(() => {
    if (!provider) {
      setState((prev) => ({
        ...prev,
        error: 'RPC URL missing',
        isOnline: false,
      }))
      return
    }

    let isActive = true

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

    const poll = async () => {
      try {
        const [network, block] = await Promise.all([
          provider.getNetwork(),
          provider.getBlock('latest'),
        ])
        const [
          emergencyMode,
          isolated,
          oracleFrozen,
          reserve,
          price,
          paused,
          withdrawLimitBps,
        ] = await Promise.all([
          controller.emergencyMode(),
          controller.isolated(),
          controller.oracleFrozen(),
          sandbox.reserve(),
          sandbox.price(),
          sandbox.paused(),
          sandbox.withdrawLimitBps(),
        ])

        if (!isActive) {
          return
        }

        setState({
          isOnline: true,
          chainLabel: network.name
            ? `${network.name.toUpperCase()} (${network.chainId.toString()})`
            : `CHAIN ${network.chainId.toString()}`,
          lastBlockTime: block
            ? new Date(Number(block.timestamp) * 1000)
            : null,
          emergencyMode: Boolean(emergencyMode),
          isolated: Boolean(isolated),
          oracleFrozen: Boolean(oracleFrozen),
          paused: Boolean(paused),
          reserve,
          price,
          withdrawLimitBps,
          error: null,
        })
      } catch (err) {
        if (!isActive) {
          return
        }
        setState((prev) => ({
          ...prev,
          isOnline: false,
          error: err instanceof Error ? err.message : 'Failed to read chain',
        }))
      }
    }

    void poll()
    const handle = setInterval(poll, 8000)
    return () => {
      isActive = false
      clearInterval(handle)
    }
  }, [provider])

  return state
}
