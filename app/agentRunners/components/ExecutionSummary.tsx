import { ChevronRight, AlertTriangle } from 'lucide-react'
import { CRITICAL_ACTIONS } from '@/app/agentRunners/data'

type ExecutionSummaryProps = {
  actionSets: { name: string; items: string[] }[]
  actionLabels: Record<string, { label: string; tooltip: string }>
}

type SummaryRow = {
  key: string
  text: string
  critical: boolean
  type: 'title' | 'item'
}

export default function ExecutionSummary({
  actionSets,
  actionLabels,
}: ExecutionSummaryProps) {
  const summaryRows = actionSets.flatMap<SummaryRow>((set, setIndex) => [
    {
      key: `${set.name}-${setIndex}-title`,
      text: set.name,
      critical: false,
      type: 'title',
    },
    ...set.items.map((item, itemIndex) => ({
      key: `${set.name}-${item}-${itemIndex}`,
      text: actionLabels[item]?.tooltip ?? item,
      critical: CRITICAL_ACTIONS.has(item),
      type: 'item',
    })),
  ])

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
          {summaryRows.length === 0 ? (
            <div className="text-xs text-muted-foreground">
              No action sets configured.
            </div>
          ) : (
            summaryRows.map((row, index) => (
              <div
                key={row.key}
                className="flex items-center gap-2 text-foreground/90 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {row.type === 'item' ? (
                  <ChevronRight
                    className={`w-3 h-3 ${
                      row.critical ? 'text-warning' : 'text-primary'
                    }`}
                  />
                ) : (
                  <span className="w-3 h-3" />
                )}
                <span
                  className={
                    row.type === 'title'
                      ? 'text-[10px] uppercase tracking-widest text-muted-foreground'
                      : row.critical
                        ? 'text-warning/90'
                        : ''
                  }
                >
                  {row.text}
                </span>
              </div>
            ))
          )}
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
