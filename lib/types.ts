export interface LogEntry {
  id: string
  action: string
  txHash: string
  status: 'success' | 'revert' | 'pending'
  timestamp: Date
  blockNumber: number
}
