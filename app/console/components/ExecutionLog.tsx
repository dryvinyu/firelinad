import { useEffect, useState } from 'react'
import {
  List,
  ExternalLink,
  Copy,
  Check,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'

import type { LogEntry } from '@/lib/types'

interface ExecutionLogProps {
  logs: LogEntry[]
  explorerBaseUrl: string
}

export default function ExecutionLog({
  logs,
  explorerBaseUrl,
}: ExecutionLogProps) {
  const [filter, setFilter] = useState<'all' | 'success' | 'revert'>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [hasMounted, setHasMounted] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true
    return log.status === filter
  })

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    setLastUpdated(new Date())
  }, [logs])

  const getExplorerUrl = (txHash: string) => {
    const baseUrl =
      explorerBaseUrl || 'https://monad-testnet.socialscan.io//tx/'
    return `${baseUrl}${txHash}`
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const formatTxHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  }

  const StatusIcon = ({ status }: { status: LogEntry['status'] }) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'revert':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />
    }
  }

  return (
    <div className="console-panel p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <List className="w-5 h-5 text-console-accent" />
          <h2 className="text-sm font-bold tracking-widest text-console-heading">
            EXECUTION SUMMARY
          </h2>
          <span className="text-xs text-muted-foreground">
            ({filteredLogs.length} entries)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-1">
            {(['all', 'success', 'revert'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs font-bold rounded transition-all uppercase ${
                  filter === f
                    ? f === 'success'
                      ? 'bg-green-500/30 text-green-400 border border-green-500/50'
                      : f === 'revert'
                        ? 'bg-red-500/30 text-red-400 border border-red-500/50'
                        : 'bg-console-accent/30 text-console-accent border border-console-accent/50'
                    : 'bg-console-muted text-muted-foreground hover:text-console-text border border-transparent'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-console-border text-left">
              <th className="pb-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Status
              </th>
              <th className="pb-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Action
              </th>
              <th className="pb-3 text-xs text-muted-foreground font-medium uppercase tracking-wider hidden md:table-cell">
                TX Hash
              </th>
              <th className="pb-3 text-xs text-muted-foreground font-medium uppercase tracking-wider hidden lg:table-cell">
                Block
              </th>
              <th className="pb-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Time
              </th>
              <th className="pb-3 text-xs text-muted-foreground font-medium uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground text-sm"
                >
                  No execution logs found
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, index) => (
                <tr
                  key={log.id}
                  className={`
                    border-b border-console-border/50 
                    hover:bg-console-muted/30 transition-colors
                    ${index === 0 ? 'animate-fade-in' : ''}
                  `}
                >
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={log.status} />
                      <span
                        className={`text-xs font-bold uppercase ${
                          log.status === 'success'
                            ? 'text-green-400'
                            : log.status === 'revert'
                              ? 'text-red-400'
                              : 'text-yellow-400'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-sm font-mono text-console-text">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 hidden md:table-cell">
                    <span className="text-sm font-mono text-muted-foreground">
                      {formatTxHash(log.txHash)}
                    </span>
                  </td>
                  <td className="py-3 hidden lg:table-cell">
                    <span className="text-sm font-mono text-muted-foreground">
                      #{log.blockNumber}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-sm text-muted-foreground">
                      {hasMounted ? formatTime(log.timestamp) : 'N/A'}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => copyToClipboard(log.txHash, log.id)}
                        className="p-1.5 rounded hover:bg-console-muted transition-colors group"
                        title="Copy TX Hash"
                      >
                        {copiedId === log.id ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground group-hover:text-console-text" />
                        )}
                      </button>
                      <a
                        href={getExplorerUrl(log.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded hover:bg-console-muted transition-colors group"
                        title="View on Explorer"
                      >
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-console-accent" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-console-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">
              {logs.filter((l) => l.status === 'success').length} successful
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs text-muted-foreground">
              {logs.filter((l) => l.status === 'revert').length} reverted
            </span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">
          Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'N/A'}
        </span>
      </div>
    </div>
  )
}
