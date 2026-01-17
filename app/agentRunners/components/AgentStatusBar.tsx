import { useEffect, useState } from 'react'
import {
  ArrowUp,
  Droplet,
  Shield,
  Lock,
  Archive,
  ShieldOff,
} from 'lucide-react'

import { AGENT_DEFINITIONS } from '@/app/agentRunners/data'

interface Agent {
  id: string
  name: string
  variant: 'purple' | 'cyan'
  icon: React.ElementType
  actions: string[]
}

const agents: Agent[] = [
  {
    id: 'flood',
    name: AGENT_DEFINITIONS[0].name,
    actions: AGENT_DEFINITIONS[0].actions,
    variant: 'purple',
    icon: Droplet,
  },
  {
    id: 'bulwark',
    name: AGENT_DEFINITIONS[1].name,
    actions: AGENT_DEFINITIONS[1].actions,
    variant: 'cyan',
    icon: Shield,
  },
  {
    id: 'lock',
    name: AGENT_DEFINITIONS[2].name,
    actions: AGENT_DEFINITIONS[2].actions,
    variant: 'purple',
    icon: Lock,
  },
  {
    id: 'vault',
    name: AGENT_DEFINITIONS[3].name,
    actions: AGENT_DEFINITIONS[3].actions,
    variant: 'cyan',
    icon: Archive,
  },
  {
    id: 'isolate',
    name: AGENT_DEFINITIONS[4].name,
    actions: AGENT_DEFINITIONS[4].actions,
    variant: 'purple',
    icon: ShieldOff,
  },
]

type AgentStatusBarProps = {
  activeAgents: Record<string, number>
}

export default function AgentStatusBar({ activeAgents }: AgentStatusBarProps) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    // Only run the interval if there's at least one active agent
    if (Object.keys(activeAgents).length === 0) return

    const timer = setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => clearInterval(timer)
  }, [activeAgents])

  return (
    <div className="w-full border-b border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-6 px-6 py-5">
        {agents.map((agent) => {
          const Icon = agent.icon
          const expiry = activeAgents[agent.name]
          const isActive = expiry ? expiry > now : false

          return (
            <div
              key={agent.id}
              className={`agent-pill glow-pulse ${
                agent.variant === 'cyan' ? 'agent-pill-cyan' : ''
              } ${isActive ? 'active' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span
                      className={`status-indicator ${isActive ? '' : 'opacity-30'}`}
                    />
                    <span className="text-xs">{agent.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] opacity-70 mt-0.5">
                    <ArrowUp className="w-2.5 h-2.5 animate-pull-indicator" />
                    <span>{isActive ? 'ACTIVE' : 'STANDBY'}</span>
                  </div>
                  <div className="text-[9px] opacity-60 mt-1">
                    {agent.actions.join(', ')}
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
