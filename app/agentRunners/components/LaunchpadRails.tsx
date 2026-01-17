import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { TRACKS, type ActionTx } from '@/app/agentRunners/data'

type LaunchpadRailsProps = {
  txs: ActionTx[]
  actionLabels: Record<string, { label: string; tooltip: string }>
}

export default function LaunchpadRails({
  txs,
  actionLabels,
}: LaunchpadRailsProps) {
  return (
    <div className="relative w-full h-[420px] flex flex-col">
      {/* Launch area with rails */}
      <div className="flex-1 relative flex items-end justify-center px-8">
        {/* Rails container */}
        <div className="flex items-end justify-center gap-4">
          {Array.from({ length: TRACKS }).map((_, index) => {
            const tx = txs[index]
            const labelMeta = tx ? actionLabels[tx.action] : undefined
            const label =
              labelMeta?.label ?? tx?.action?.slice(0, 2).toUpperCase() ?? 'NA'
            const tooltip = labelMeta?.tooltip ?? 'Unknown action'
            const isFailed = tx?.status === 'revert'
            const isSuccess = tx?.status === 'success'
            const isCyan = index % 3 === 1

            return (
              <div key={index} className="relative flex flex-col items-center">
                {/* Rail */}
                <div
                  className={`w-3 h-[320px] rounded-full relative ${
                    isCyan ? 'launch-rail-cyan' : 'launch-rail'
                  } animate-rail-glow`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Rail glow effect */}
                  <div
                    className={`absolute inset-0 rounded-full blur-sm ${
                      isCyan ? 'bg-secondary/20' : 'bg-primary/20'
                    }`}
                  />
                </div>

                {/* Orb */}
                {tx && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`absolute bottom-4 launch-orb cursor-pointer transition-all ${
                          isFailed
                            ? 'launch-orb-failed'
                            : isCyan
                              ? 'launch-orb-cyan'
                              : 'launch-orb-success'
                        } ${isSuccess ? 'animate-orb-launch' : ''} ${
                          isFailed ? 'animate-orb-fail' : ''
                        }`}
                      >
                        {label}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-card border-primary/40 text-foreground font-mono text-xs px-3 py-2"
                    >
                      <p className="text-primary font-semibold">{label}</p>
                      <p className="text-muted-foreground">{tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Base platform with glow */}
      <div className="relative h-2 mx-8">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary/60 to-transparent rounded-full" />
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary/30 to-transparent blur-md" />
        <div className="absolute -inset-1 bg-linear-to-r from-transparent via-secondary/20 to-transparent blur-xl" />
      </div>
    </div>
  )
}
