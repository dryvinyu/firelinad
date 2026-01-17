import { FileText } from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type ActionBarProps = {
  onRefresh?: () => void
  lastUpdated?: Date | null
}

export default function ActionBar({ lastUpdated }: ActionBarProps) {
  return (
    <div className="relative w-full border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="flex items-center justify-between px-8 py-6">
        {/* Left side - Empty */}
        <div />

        {/* Center - Status */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="font-mono text-xs text-muted-foreground">
            SYSTEM READY
          </span>
          {lastUpdated ? (
            <span className="font-mono text-[10px] text-muted-foreground/70">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          ) : null}
        </div>

        {/* Right side - Mint NFT */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="btn-mint group flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Mint Decision NFT</span>
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="max-w-[250px] bg-card border-accent/30 text-foreground"
          >
            <p className="text-xs">
              Mint an on-chain decision record for audit and post-incident
              review.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
