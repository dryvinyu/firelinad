import { ArrowUp, Eye, Bomb, Zap, Terminal, Flag } from 'lucide-react'

interface Agent {
  id: string
  name: string
  status: string
  variant: 'purple' | 'cyan'
  icon: React.ElementType
}

const agents: Agent[] = [
  {
    id: 'lookout',
    name: 'LOOKOUT',
    status: 'SCANNING',
    variant: 'purple',
    icon: Eye,
  },
  { id: 'bomb', name: 'BOMB', status: 'ARMED', variant: 'purple', icon: Bomb },
  {
    id: 'booster',
    name: 'BOOSTER',
    status: 'READY',
    variant: 'cyan',
    icon: Zap,
  },
  {
    id: 'cmd',
    name: 'CMD',
    status: 'ACTIVE',
    variant: 'purple',
    icon: Terminal,
  },
  {
    id: 'final',
    name: 'FINAL',
    status: 'STANDBY',
    variant: 'cyan',
    icon: Flag,
  },
]

export default function AgentStatusBar() {
  return (
    <div className="w-full border-b border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-6 px-6 py-5">
        {agents.map((agent) => {
          const Icon = agent.icon
          return (
            <div
              key={agent.id}
              className={`agent-pill glow-pulse ${
                agent.variant === 'cyan' ? 'agent-pill-cyan' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="status-indicator" />
                    <span className="text-xs">{agent.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] opacity-70 mt-0.5">
                    <ArrowUp className="w-2.5 h-2.5 animate-pull-indicator" />
                    <span>{agent.status}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
