'use client'
import { useState } from 'react'
import DaoEntry from './components/DaoEntry'
import ActionBar from './components/ActionBar'
import ChatModal from './components/ChatModal'
import ChatButton from './components/ChatButton'
import AgentStatusBar from './components/AgentStatusBar'
import LaunchpadRails from './components/LaunchpadRails'
import ExecutionSummary from './components/ExecutionSummary'
import useControllerActivity from './hooks/useControllerActivity'
import { ACTION_LABELS } from './data'

export default function AgentRunners() {
  const { txs, activeAgents, error, lastUpdated, refresh } =
    useControllerActivity()
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <section className="bg-background cyber-grid scanline flex flex-col relative">
      <AgentStatusBar activeAgents={activeAgents} />
      {error ? (
        <div className="px-6 py-3 text-sm text-destructive/90 border-b border-border/30">
          {error}
        </div>
      ) : null}

      <div className="flex-1 flex">
        {/* Left Panel - Launchpad */}
        <div className="flex-1 flex flex-col border-r border-border/30">
          <div className="px-6 py-4 border-b border-border/20">
            <h2 className="font-display text-xs text-muted-foreground tracking-widest uppercase">
              Parallel Launchpad
            </h2>
          </div>
          <div className="flex-1 flex items-center justify-center p-6">
            <LaunchpadRails txs={txs} actionLabels={ACTION_LABELS} />
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
            <ExecutionSummary txs={txs} actionLabels={ACTION_LABELS} />
          </div>
        </div>
      </div>

      <ActionBar lastUpdated={lastUpdated} onRefresh={refresh} />

      <ChatButton
        isOpen={isChatOpen}
        onClick={() => setIsChatOpen(!isChatOpen)}
      />
      <DaoEntry />
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </section>
  )
}
