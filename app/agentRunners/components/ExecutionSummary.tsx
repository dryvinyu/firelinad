import { ChevronRight, AlertTriangle } from 'lucide-react'

const executionItems = [
  { text: 'Pause Pool A/B', critical: true },
  { text: 'Protect 87 users', critical: false },
  { text: 'Update Oracle feed', critical: true },
  { text: 'Snapshot system state', critical: false },
  { text: 'Lock governance', critical: true },
  { text: 'Broadcast emergency', critical: false },
]

export default function ExecutionSummary() {
  return (
    <div className="terminal-box h-full flex flex-col">
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-primary/20 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning animate-pulse" />
            <h2 className="font-display text-sm text-primary tracking-wider animate-text-flicker">
              EXECUTION SUMMARY
            </h2>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
            (WHAT WILL HAPPEN)
          </p>
        </div>

        {/* Execution Items */}
        <div className="space-y-3 font-mono text-sm flex-1">
          {executionItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-foreground/90 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ChevronRight
                className={`w-3 h-3 ${item.critical ? 'text-warning' : 'text-primary'}`}
              />
              <span className={item.critical ? 'text-warning/90' : ''}>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Badge */}
        <div className="mt-auto pt-4 border-t border-primary/20">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded bg-primary/10 border border-primary/30">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-mono text-[10px] text-primary/90 uppercase tracking-wider">
              MONAD: PARALLEL + ATOMIC
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
