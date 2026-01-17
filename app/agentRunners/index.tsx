'use client'
import ActionBar from './components/ActionBar'
import AgentStatusBar from './components/AgentStatusBar'
import LaunchpadRails from './components/LaunchpadRails'
import ExecutionSummary from './components/ExecutionSummary'

export default function AgentRunners() {
  return (
    <section className="bg-background cyber-grid scanline flex flex-col">
      <AgentStatusBar />

      <div className="flex-1 flex">
        {/* Left Panel - Launchpad */}
        <div className="flex-1 flex flex-col border-r border-border/30">
          <div className="px-6 py-4 border-b border-border/20">
            <h2 className="font-display text-xs text-muted-foreground tracking-widest uppercase">
              Parallel Launchpad
            </h2>
          </div>
          <div className="flex-1 flex items-center justify-center p-6">
            <LaunchpadRails />
          </div>
        </div>

        {/* Right Panel - Execution Summary */}
        <div className="w-[380px] flex flex-col">
          <div className="px-6 py-4 border-b border-border/20">
            <h2 className="font-display text-xs text-muted-foreground tracking-widest uppercase">
              Command Terminal
            </h2>
          </div>
          <div className="flex-1 p-6">
            <ExecutionSummary />
          </div>
        </div>
      </div>

      <ActionBar />
    </section>
  )
}
