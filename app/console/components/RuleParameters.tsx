import { Settings } from 'lucide-react'

import type { ProtocolState } from '@/lib/hooks/useProtocolState'

interface RuleParametersProps {
  state: ProtocolState
}

const formatValue = (value: bigint | null) => {
  if (value === null || value === undefined) {
    return 'N/A'
  }
  return value.toString()
}

export default function RuleParameters({ state }: RuleParametersProps) {
  const rows = [
    {
      label: 'RESERVE',
      value: formatValue(state.reserve),
      unit: 'wei',
    },
    {
      label: 'PRICE',
      value: formatValue(state.price),
      unit: 'wei',
    },
    {
      label: 'WITHDRAW LIMIT',
      value: formatValue(state.withdrawLimitBps),
      unit: 'bps',
    },
    {
      label: 'ORACLE FROZEN',
      value:
        state.oracleFrozen === null ? 'N/A' : state.oracleFrozen ? 'YES' : 'NO',
      unit: '',
    },
    {
      label: 'ISOLATED',
      value: state.isolated === null ? 'N/A' : state.isolated ? 'YES' : 'NO',
      unit: '',
    },
  ]

  return (
    <div className="console-panel p-4 md:p-6 h-fit">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-console-warning" />
          <h2 className="text-sm font-bold tracking-widest text-console-heading">
            PROTOCOL STATE
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.label} className="console-param-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold tracking-wide text-console-text">
                {row.label}
              </span>
              {row.unit ? (
                <span className="text-xs text-muted-foreground uppercase">
                  {row.unit}
                </span>
              ) : null}
            </div>
            <div className="text-lg font-mono text-console-text">
              {row.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
