import { useState, useEffect, useCallback } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface LaunchOrb {
  id: number
  code: string
  description: string
  status: 'pending' | 'launching' | 'success' | 'failed'
  railIndex: number
  delay: number
}

const orbData = [
  { code: 'PA', description: 'Pause liquidity pool' },
  { code: 'WL', description: 'Limit withdrawals' },
  { code: 'SN', description: 'Create state snapshot' },
  { code: 'FO', description: 'Freeze oracle' },
  { code: 'IS', description: 'Isolate external calls' },
  { code: 'LK', description: 'Lock governance' },
  { code: 'RV', description: 'Revert pending txs' },
  { code: 'BR', description: 'Broadcast alert' },
  { code: 'VL', description: 'Validate reserves' },
  { code: 'HT', description: 'Halt trading' },
  { code: 'CB', description: 'Circuit breaker' },
  { code: 'AU', description: 'Audit trail' },
]

const RAIL_COUNT = 12

export default function LaunchpadRails() {
  const [orbs, setOrbs] = useState<LaunchOrb[]>([])
  const [launched, setLaunched] = useState(false)

  useEffect(() => {
    // Initialize orbs - one per rail
    const initialOrbs: LaunchOrb[] = orbData.map((data, index) => ({
      id: index,
      code: data.code,
      description: data.description,
      status: 'pending',
      railIndex: index,
      delay: Math.random() * 300 + index * 50,
    }))
    setOrbs(initialOrbs)
  }, [])

  const handleLaunch = useCallback(() => {
    if (launched) return
    setLaunched(true)

    // Simulate parallel launches with some failures
    orbs.forEach((orb) => {
      setTimeout(() => {
        const willFail = Math.random() < 0.25 // 25% failure rate

        setOrbs((prev) =>
          prev.map((o) =>
            o.id === orb.id ? { ...o, status: 'launching' } : o,
          ),
        )

        setTimeout(
          () => {
            setOrbs((prev) =>
              prev.map((o) =>
                o.id === orb.id
                  ? { ...o, status: willFail ? 'failed' : 'success' }
                  : o,
              ),
            )
          },
          willFail ? 1200 : 2000,
        )
      }, orb.delay)
    })
  }, [launched, orbs])

  // Expose launch function globally for the Sign button
  useEffect(() => {
    ;(window as any).triggerLaunch = handleLaunch
    return () => {
      delete (window as any).triggerLaunch
    }
  }, [handleLaunch])

  return (
    <div className="relative w-full h-[420px] flex flex-col">
      {/* Launch area with rails */}
      <div className="flex-1 relative flex items-end justify-center px-8">
        {/* Rails container */}
        <div className="flex items-end justify-center gap-4">
          {Array.from({ length: RAIL_COUNT }).map((_, index) => {
            const orb = orbs.find((o) => o.railIndex === index)
            const isLaunching = orb?.status === 'launching'
            const isSuccess = orb?.status === 'success'
            const isFailed = orb?.status === 'failed'
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
                {orb && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`absolute bottom-4 launch-orb cursor-pointer transition-all ${
                          isFailed
                            ? 'launch-orb-failed'
                            : isCyan
                              ? 'launch-orb-cyan'
                              : 'launch-orb-success'
                        } ${isLaunching || isSuccess ? 'animate-orb-launch' : ''} ${
                          isFailed ? 'animate-orb-fail' : ''
                        }`}
                        style={{
                          animationDelay: `${orb.delay}ms`,
                        }}
                      >
                        {orb.code}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-card border-primary/40 text-foreground font-mono text-xs px-3 py-2"
                    >
                      <p className="text-primary font-semibold">{orb.code}</p>
                      <p className="text-muted-foreground">{orb.description}</p>
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
