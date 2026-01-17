import { FileText } from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function ActionBar() {
  const handleSign = () => {
    // Trigger the launchpad
    if ((window as any).triggerLaunch) {
      ;(window as any).triggerLaunch()
    }
  }

  return (
    <div className="relative w-full border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="flex items-center justify-between px-8 py-6">
        {/* Left side - Main actions */}
        <div className="flex items-center gap-6">
          {/* SIGN Button */}
          <button onClick={handleSign} className="btn-sign group">
            <div className="flex flex-col items-center">
              <span className="text-lg">[SIGN]</span>
              <span className="text-[10px] opacity-80 mt-1">
                Scan & Execute
              </span>
            </div>
          </button>

          {/* IF Button */}
          <button className="btn-if group">
            <div className="flex flex-col items-center">
              <span className="text-base">[ if ]</span>
              <span className="text-[10px] opacity-70 mt-1">Consider...</span>
            </div>
          </button>
        </div>

        {/* Center - Status */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="font-mono text-xs text-muted-foreground">
            SYSTEM READY
          </span>
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
