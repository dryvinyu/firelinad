'use client'
import { useState } from 'react'

import { LogEntry } from '@/lib/types'
import useWallet from '@/lib/hooks/useWallet'
import ExecutionLog from './components/ExecutionLog'
import RunnerStatus from './components/RunnerStatus'
import ManualActions from './components/ManualActions'
import ConfirmModal from '@/components/ui/ConfirmModal'
import RuleParameters from './components/RuleParameters'

export default function Console() {
  const { chainId, isConnected } = useWallet()
  const [isRunnerEnabled, setIsRunnerEnabled] = useState(true)
  const [runnerMode, setRunnerMode] = useState<'AUTO' | 'DRY_RUN'>('AUTO')
  const initialLogs: LogEntry[] = [
    {
      id: '1',
      action: 'pausePool',
      txHash:
        '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
      status: 'success',
      timestamp: new Date('2024-06-01T10:02:00Z'),
      blockNumber: 18234567,
    },
    {
      id: '2',
      action: 'setWithdrawLimit',
      txHash:
        '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab',
      status: 'success',
      timestamp: new Date('2024-06-01T09:59:00Z'),
      blockNumber: 18234550,
    },
    {
      id: '3',
      action: 'freezeOracle',
      txHash:
        '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
      status: 'revert',
      timestamp: new Date('2024-06-01T09:54:00Z'),
      blockNumber: 18234520,
    },
    {
      id: '4',
      action: 'snapshot',
      txHash:
        '0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      status: 'success',
      timestamp: new Date('2024-06-01T09:49:00Z'),
      blockNumber: 18234480,
    },
  ]
  const [parameters, setParameters] = useState({
    RESERVE_DROP_BPS: 500,
    PRICE_SHOCK: 1000,
    COOLDOWN_BLOCKS: 10,
    WITHDRAW_LIMIT_BPS: 2000,
    RESERVE_WINDOW_BLOCKS: 100,
  })
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    action: string
    description: string
  }>({ isOpen: false, action: '', description: '' })

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
    }

    setConfirmModal({
      isOpen: true,
      action,
      description: descriptions[action] || 'Execute this action?',
    })
  }

  const confirmAction = () => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      action: confirmModal.action,
      txHash:
        `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`.slice(
          0,
          66,
        ),
      status: Math.random() > 0.2 ? 'success' : 'revert',
      timestamp: new Date(),
      blockNumber: 18234567 + Math.floor(Math.random() * 100),
    }

    setLogs([newLog, ...logs])
    setConfirmModal({ isOpen: false, action: '', description: '' })
  }

  const handleSaveParameters = (newParams: typeof parameters) => {
    setParameters(newParams)
  }

  const [logs, setLogs] = useState<LogEntry[]>(initialLogs)

  return (
    <section className="console-bg p-4 md:p-6 lg:p-8">
      <RunnerStatus
        mode={runnerMode}
        isConnected={isConnected}
        isEnabled={isRunnerEnabled}
        onModeChange={setRunnerMode}
        chain={chainId?.toString() || ''}
        onToggle={() => setIsRunnerEnabled(!isRunnerEnabled)}
      />

      {/* Middle Section - Parameters & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        <RuleParameters parameters={parameters} onSave={handleSaveParameters} />
        <ManualActions onAction={handleManualAction} />
      </div>

      {/* Execution Log */}
      <ExecutionLog logs={logs} chain={chainId?.toString() || ''} />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({ isOpen: false, action: '', description: '' })
        }
        onConfirm={confirmAction}
        action={confirmModal.action}
        description={confirmModal.description}
      />
    </section>
  )
}
