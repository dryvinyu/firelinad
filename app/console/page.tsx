'use client'
import { useMemo, useState } from 'react'
import { ethers } from 'ethers'

import useWallet from '@/lib/hooks/useWallet'
import ExecutionLog from './components/ExecutionLog'
import RunnerStatus from './components/RunnerStatus'
import ManualActions from './components/ManualActions'
import ConfirmModal from '@/components/ui/ConfirmModal'
import RuleParameters from './components/RuleParameters'
import OwnerActions from './components/OwnerActions'
import useControllerActivity from '@/app/agentRunners/hooks/useControllerActivity'
import useProtocolState from '@/lib/hooks/useProtocolState'
import useAutoRunner from '@/lib/hooks/useAutoRunner'
import {
  CHAIN_CONFIG,
  CONTRACT_ABIS,
  CONTRACT_ADDRESSES,
} from '@/lib/contracts'

export default function Console() {
  const { chainId, isConnected, signer, switchNetwork } = useWallet()
  const protocolState = useProtocolState()
  const { txs, error: executionError } = useControllerActivity()
  const autoRunner = useAutoRunner({ signer, isConnected, chainId })
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    action: string
    description: string
  }>({ isOpen: false, action: '', description: '' })
  const [actionError, setActionError] = useState<string | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)

  const handleManualAction = (action: string) => {
    const descriptions: Record<string, string> = {
      pausePool:
        "This will pause all pool operations. Users won't be able to deposit or withdraw.",
      setWithdrawLimit:
        'This will set a temporary withdrawal limit to protect the protocol.',
      freezeOracle:
        'This will freeze the price oracle. Use only in case of oracle manipulation.',
      isolate:
        'This will isolate the affected market from the rest of the protocol.',
      snapshot: 'This will create a state snapshot for potential rollback.',
      resetSandbox: 'Restore sandbox state and clear pause flag.',
      resetController: 'Clear emergency flags on the controller.',
    }

    setConfirmModal({
      isOpen: true,
      action,
      description: descriptions[action] || 'Execute this action?',
    })
  }

  const executionLogs = useMemo(() => {
    return txs.map((tx) => ({
      id: tx.hash,
      action: tx.action,
      txHash: tx.hash,
      status: tx.status,
      timestamp: tx.timestamp ? new Date(tx.timestamp) : new Date(),
      blockNumber: tx.blockNumber ?? 0,
    }))
  }, [txs])

  const ensureChain = async () => {
    if (!CHAIN_CONFIG.id || chainId === CHAIN_CONFIG.id) {
      return true
    }
    return switchNetwork(CHAIN_CONFIG.id)
  }

  const confirmAction = async () => {
    setActionError(null)
    setIsExecuting(true)
    try {
      if (!signer || !isConnected) {
        throw new Error('Connect wallet first')
      }
      const isReady = await ensureChain()
      if (!isReady) {
        throw new Error('Switch to the correct network first')
      }

      const controller = new ethers.Contract(
        CONTRACT_ADDRESSES.controller,
        CONTRACT_ABIS.controller,
        signer,
      )
      const sandbox = new ethers.Contract(
        CONTRACT_ADDRESSES.sandbox,
        CONTRACT_ABIS.sandbox,
        signer,
      )

      const action = confirmModal.action
      if (action === 'pausePool') {
        await controller.pausePool()
      } else if (action === 'setWithdrawLimit') {
        if (protocolState.withdrawLimitBps === null) {
          throw new Error('Withdraw limit unavailable')
        }
        await controller.setWithdrawLimit(protocolState.withdrawLimitBps)
      } else if (action === 'freezeOracle') {
        await controller.freezeOracle()
      } else if (action === 'isolate') {
        await controller.isolate()
      } else if (action === 'snapshot') {
        await controller.snapshot()
      } else if (action === 'resetSandbox') {
        if (protocolState.reserve === null || protocolState.price === null) {
          throw new Error('Sandbox state unavailable')
        }
        const limit =
          protocolState.withdrawLimitBps === null
            ? 10000n
            : protocolState.withdrawLimitBps
        await sandbox.resetDemoState(
          protocolState.reserve,
          protocolState.price,
          false,
          limit,
        )
      } else if (action === 'resetController') {
        await controller.resetController()
      } else {
        throw new Error('Unknown action')
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setIsExecuting(false)
      setConfirmModal({ isOpen: false, action: '', description: '' })
    }
  }

  return (
    <section className="console-bg p-4 md:p-6 lg:p-8">
      <RunnerStatus
        isOnline={protocolState.isOnline}
        chainLabel={protocolState.chainLabel}
        lastBlockTime={protocolState.lastBlockTime}
        emergencyMode={protocolState.emergencyMode}
        paused={protocolState.paused}
      />
      {protocolState.error ? (
        <div className="mt-3 text-sm text-destructive/80">
          {protocolState.error}
        </div>
      ) : null}

      {/* Middle Section - Parameters & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        <RuleParameters state={protocolState} />
        <ManualActions onAction={handleManualAction} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <OwnerActions onAction={handleManualAction} />
      </div>

      {actionError ? (
        <div className="mb-4 text-sm text-destructive/80">{actionError}</div>
      ) : null}

      {executionError ? (
        <div className="mb-4 text-sm text-destructive/80">{executionError}</div>
      ) : null}

      {autoRunner.error ? (
        <div className="mb-4 text-sm text-destructive/80">
          {autoRunner.error}
        </div>
      ) : null}

      <ExecutionLog
        logs={executionLogs}
        explorerBaseUrl={CHAIN_CONFIG.explorerTxBaseUrl}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({ isOpen: false, action: '', description: '' })
        }
        onConfirm={() => {
          if (!isExecuting) {
            void confirmAction()
          }
        }}
        action={confirmModal.action}
        description={confirmModal.description}
      />
    </section>
  )
}
