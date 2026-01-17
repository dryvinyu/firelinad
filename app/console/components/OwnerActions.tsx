import { Shield, RefreshCcw } from 'lucide-react'

interface OwnerActionsProps {
  onAction: (action: string) => void
}

export default function OwnerActions({ onAction }: OwnerActionsProps) {
  return (
    <div className="console-panel p-4 md:p-6 h-fit">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-console-accent" />
        <h2 className="text-sm font-bold tracking-widest text-console-heading">
          OWNER RESET
        </h2>
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        Owner-only actions to restore demo state after incidents.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={() => onAction('resetSandbox')}
          className="group relative p-4 rounded-lg border-2 transition-all duration-300 bg-console-muted/60 border-console-border hover:border-console-accent hover:shadow-[0_0_20px_rgba(0,255,200,0.3)]"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 rounded-lg bg-console-muted/80">
              <RefreshCcw className="w-6 h-6 text-console-accent" />
            </div>
            <span className="text-sm font-bold tracking-wider text-console-accent">
              RESET SANDBOX
            </span>
            <span className="text-xs text-muted-foreground">
              Clear pause + restore values
            </span>
          </div>
        </button>

        <button
          onClick={() => onAction('resetController')}
          className="group relative p-4 rounded-lg border-2 transition-all duration-300 bg-console-muted/60 border-console-border hover:border-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 rounded-lg bg-console-muted/80">
              <Shield className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-sm font-bold tracking-wider text-yellow-300">
              RESET CONTROLLER
            </span>
            <span className="text-xs text-muted-foreground">
              Clear emergency flags
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}
