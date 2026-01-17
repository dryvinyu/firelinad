import { useState, useEffect } from 'react'
import { Activity, Clock, Link2, Cpu, Zap, ZapOff } from 'lucide-react'

interface RunnerStatusProps {
  isEnabled: boolean
  onToggle: () => void
  mode: 'AUTO' | 'DRY_RUN'
  onModeChange: (mode: 'AUTO' | 'DRY_RUN') => void
  chain: string
  isConnected: boolean
}

export default function RunnerStatus({
  isEnabled,
  onToggle,
  mode,
  onModeChange,
  chain,
  isConnected,
}: RunnerStatusProps) {
  const [lastHeartbeat, setLastHeartbeat] = useState<Date | null>(null)
  const [heartbeatAge, setHeartbeatAge] = useState('—')

  useEffect(() => {
    if (!lastHeartbeat) {
      setHeartbeatAge('—')
      return
    }
    const interval = setInterval(() => {
      const now = new Date()
      const diff = Math.floor((now.getTime() - lastHeartbeat.getTime()) / 1000)

      if (diff < 60) {
        setHeartbeatAge(`${diff}s ago`)
      } else if (diff < 3600) {
        setHeartbeatAge(`${Math.floor(diff / 60)}m ago`)
      } else {
        setHeartbeatAge(`${Math.floor(diff / 3600)}h ago`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [lastHeartbeat])

  // Simulate heartbeat
  useEffect(() => {
    if (isEnabled && isConnected) {
      setLastHeartbeat(new Date())
      const heartbeatInterval = setInterval(() => {
        setLastHeartbeat(new Date())
      }, 30000)
      return () => clearInterval(heartbeatInterval)
    }
  }, [isEnabled, isConnected])

  return (
    <div className="console-panel p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="w-5 h-5 text-console-accent" />
        <h2 className="text-sm font-bold tracking-widest text-console-heading">
          RUNNER STATUS
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Status Indicator */}
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
                isEnabled && isConnected
                  ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse'
                  : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
              }`}
            />
            <span
              className={`text-lg font-bold ${isEnabled && isConnected ? 'text-green-400' : 'text-red-400'}`}
            >
              {isEnabled && isConnected ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {/* Last Heartbeat */}
        <div className="console-stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Heartbeat
            </span>
          </div>
          <div className="text-lg font-bold text-console-text">
            {isEnabled && isConnected ? heartbeatAge : '—'}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {lastHeartbeat ? lastHeartbeat.toLocaleTimeString() : '—'}
          </div>
        </div>

        {/* Current Chain */}
        <div className="console-stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Link2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Chain
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${chain === 'Mainnet' ? 'bg-green-500' : 'bg-yellow-500'}`}
            />
            <span className="text-lg font-bold text-console-text">
              {chain.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="console-stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Mode
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onModeChange('AUTO')}
              className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                mode === 'AUTO'
                  ? 'bg-console-accent text-black shadow-[0_0_15px_rgba(0,255,200,0.5)]'
                  : 'bg-console-muted text-muted-foreground hover:text-console-text'
              }`}
            >
              AUTO
            </button>
            <button
              onClick={() => onModeChange('DRY_RUN')}
              className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                mode === 'DRY_RUN'
                  ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]'
                  : 'bg-console-muted text-muted-foreground hover:text-console-text'
              }`}
            >
              DRY RUN
            </button>
          </div>
        </div>

        {/* Enable/Disable Toggle */}
        <div className="console-stat-card col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            {isEnabled ? (
              <Zap className="w-4 h-4 text-console-accent" />
            ) : (
              <ZapOff className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Runner
            </span>
          </div>
          <button
            onClick={onToggle}
            className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
              isEnabled
                ? 'bg-console-accent shadow-[0_0_20px_rgba(0,255,200,0.5)]'
                : 'bg-console-muted'
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${
                isEnabled ? 'left-9' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-4 h-1 bg-console-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${
            isEnabled && isConnected
              ? 'bg-gradient-to-r from-console-accent to-cyan-400 animate-[loading_2s_ease-in-out_infinite]'
              : 'bg-red-500/50 w-0'
          }`}
          style={{ width: isEnabled && isConnected ? '100%' : '0%' }}
        />
      </div>
    </div>
  )
}
