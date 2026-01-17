import { useEffect, useState } from 'react'
import { Activity, Clock, Link2, Cpu, AlertTriangle, Pause } from 'lucide-react'

interface RunnerStatusProps {
  isOnline: boolean
  chainLabel: string
  lastBlockTime: Date | null
  emergencyMode: boolean | null
  paused: boolean | null
}

export default function RunnerStatus({
  isOnline,
  chainLabel,
  lastBlockTime,
  emergencyMode,
  paused,
}: RunnerStatusProps) {
  const [heartbeatAge, setHeartbeatAge] = useState('N/A')

  useEffect(() => {
    if (!lastBlockTime) {
      setHeartbeatAge('N/A')
      return
    }
    const interval = setInterval(() => {
      const now = new Date()
      const diff = Math.floor((now.getTime() - lastBlockTime.getTime()) / 1000)

      if (diff < 60) {
        setHeartbeatAge(`${diff}s ago`)
      } else if (diff < 3600) {
        setHeartbeatAge(`${Math.floor(diff / 60)}m ago`)
      } else {
        setHeartbeatAge(`${Math.floor(diff / 3600)}h ago`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [lastBlockTime])

  return (
    <div className="console-panel p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="w-5 h-5 text-console-accent" />
        <h2 className="text-sm font-bold tracking-widest text-console-heading">
          RUNNER STATUS
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="console-stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Status
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isOnline
                  ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse'
                  : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
              }`}
            />
            <span
              className={`text-lg font-bold ${isOnline ? 'text-green-400' : 'text-red-400'}`}
            >
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>

        <div className="console-stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Heartbeat
            </span>
          </div>
          <div className="text-lg font-bold text-console-text">
            {isOnline ? heartbeatAge : 'N/A'}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {lastBlockTime ? lastBlockTime.toLocaleTimeString() : 'N/A'}
          </div>
        </div>

        <div className="console-stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Link2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Chain
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}`}
            />
            <span className="text-lg font-bold text-console-text">
              {chainLabel || 'Monad Testnet'}
            </span>
          </div>
        </div>

        <div className="console-stat-card">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Emergency
            </span>
          </div>
          <div
            className={`text-lg font-bold ${
              emergencyMode ? 'text-yellow-400' : 'text-console-text'
            }`}
          >
            {emergencyMode === null
              ? 'N/A'
              : emergencyMode
                ? 'ACTIVE'
                : 'NORMAL'}
          </div>
        </div>

        <div className="console-stat-card col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <Pause className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Pool
            </span>
          </div>
          <div
            className={`text-lg font-bold ${
              paused ? 'text-red-400' : 'text-console-text'
            }`}
          >
            {paused === null ? 'N/A' : paused ? 'PAUSED' : 'ACTIVE'}
          </div>
        </div>
      </div>

      <div className="mt-4 h-1 bg-console-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${
            isOnline
              ? 'bg-linear-to-r from-console-accent to-cyan-400 animate-[loading_2s_ease-in-out_infinite]'
              : 'bg-red-500/50 w-0'
          }`}
          style={{ width: isOnline ? '100%' : '0%' }}
        />
      </div>
    </div>
  )
}
