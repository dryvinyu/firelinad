export type TxStatus = 'pending' | 'success' | 'revert'

export type ActionTx = {
  hash: string
  action: string
  status: TxStatus
  blockNumber?: number
  timestamp?: number
}

export const TRACKS = 12
export const MAX_TXS = 24

export const ACTION_LABELS: Record<string, { label: string; tooltip: string }> =
  {
    pausePool: { label: 'PA', tooltip: 'Pause pool to stop trades' },
    setWithdrawLimit: { label: 'WL', tooltip: 'Limit withdrawals' },
    freezeOracle: { label: 'FO', tooltip: 'Freeze price oracle' },
    isolate: { label: 'IS', tooltip: 'Isolate external interaction' },
    snapshot: { label: 'SN', tooltip: 'Snapshot critical state' },
    drain: { label: 'DR', tooltip: 'Drain reserves from sandbox' },
    priceShock: { label: 'PS', tooltip: 'Apply price shock to sandbox' },
    reserveChange: { label: 'RC', tooltip: 'Reserve changed on sandbox' },
  }

export const AGENT_DEFINITIONS = [
  { name: 'FLOOD', actions: ['setWithdrawLimit', 'pausePool'] },
  { name: 'BULWARK', actions: ['freezeOracle', 'isolate'] },
  { name: 'LOCK', actions: ['pausePool'] },
  { name: 'VAULT', actions: ['snapshot'] },
  { name: 'ISOLATE', actions: ['isolate'] },
]

export const CRITICAL_ACTIONS = new Set([
  'pausePool',
  'freezeOracle',
  'isolate',
])
