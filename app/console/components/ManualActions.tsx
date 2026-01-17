import {
  Pause,
  Shield,
  Snowflake,
  AlertTriangle,
  Camera,
  Zap,
} from 'lucide-react'

interface ManualActionsProps {
  onAction: (action: string) => void
}

const actions = [
  {
    id: 'pausePool',
    label: 'PAUSE POOL',
    icon: Pause,
    color: 'red',
    description: 'Emergency pool pause',
  },
  {
    id: 'setWithdrawLimit',
    label: 'SET LIMIT',
    icon: Shield,
    color: 'yellow',
    description: 'Withdrawal restriction',
  },
  {
    id: 'freezeOracle',
    label: 'FREEZE ORACLE',
    icon: Snowflake,
    color: 'cyan',
    description: 'Price feed freeze',
  },
  {
    id: 'isolate',
    label: 'ISOLATE',
    icon: AlertTriangle,
    color: 'orange',
    description: 'Market isolation',
  },
  {
    id: 'snapshot',
    label: 'SNAPSHOT',
    icon: Camera,
    color: 'purple',
    description: 'State checkpoint',
  },
]

const colorClasses: Record<
  string,
  { bg: string; border: string; shadow: string; text: string }
> = {
  red: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/50 hover:border-red-400',
    shadow: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]',
    text: 'text-red-400',
  },
  yellow: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/50 hover:border-yellow-400',
    shadow: 'hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]',
    text: 'text-yellow-400',
  },
  cyan: {
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-500/50 hover:border-cyan-400',
    shadow: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]',
    text: 'text-cyan-400',
  },
  orange: {
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/50 hover:border-orange-400',
    shadow: 'hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]',
    text: 'text-orange-400',
  },
  purple: {
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/50 hover:border-purple-400',
    shadow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    text: 'text-purple-400',
  },
}

export default function ManualActions({ onAction }: ManualActionsProps) {
  return (
    <div className="console-panel p-4 md:p-6 h-fit">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-red-400" />
        <h2 className="text-sm font-bold tracking-widest text-console-heading">
          MANUAL TRIGGER
        </h2>
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        Emergency actions require confirmation. Use with caution.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          const colors = colorClasses[action.color]

          return (
            <button
              key={action.id}
              onClick={() => onAction(action.id)}
              className={`
                group relative p-4 rounded-lg border-2 transition-all duration-300
                ${colors.bg} ${colors.border} ${colors.shadow}
                hover:scale-[1.02] active:scale-[0.98]
              `}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <span
                  className={`text-sm font-bold tracking-wider ${colors.text}`}
                >
                  {action.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {action.description}
                </span>
              </div>

              {/* Corner indicator */}
              <div
                className={`absolute top-2 right-2 w-2 h-2 rounded-full ${colors.text.replace('text', 'bg')} opacity-50 group-hover:opacity-100 group-hover:animate-pulse`}
              />
            </button>
          )
        })}
      </div>

      {/* Warning notice */}
      <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">
            Manual actions bypass automated checks. Ensure you understand the
            implications before triggering.
          </p>
        </div>
      </div>
    </div>
  )
}
