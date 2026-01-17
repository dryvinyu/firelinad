import { useState } from 'react'
import { Settings, Save, Info } from 'lucide-react'

interface Parameters {
  RESERVE_DROP_BPS: number
  PRICE_SHOCK: number
  COOLDOWN_BLOCKS: number
  WITHDRAW_LIMIT_BPS: number
  RESERVE_WINDOW_BLOCKS: number
}

interface RuleParametersProps {
  parameters: Parameters
  onSave: (params: Parameters) => void
}

const parameterInfo: Record<
  keyof Parameters,
  { unit: string; description: string; min: number; max: number }
> = {
  RESERVE_DROP_BPS: {
    unit: 'bps',
    description: 'Threshold for reserve drop trigger. 100 bps = 1%',
    min: 0,
    max: 10000,
  },
  PRICE_SHOCK: {
    unit: 'bps',
    description: 'Price deviation threshold for oracle freeze. 1000 bps = 10%',
    min: 0,
    max: 10000,
  },
  COOLDOWN_BLOCKS: {
    unit: 'blocks',
    description: 'Minimum blocks between consecutive actions',
    min: 1,
    max: 1000,
  },
  WITHDRAW_LIMIT_BPS: {
    unit: 'bps',
    description: 'Maximum withdrawal as % of total reserves. 2000 bps = 20%',
    min: 0,
    max: 10000,
  },
  RESERVE_WINDOW_BLOCKS: {
    unit: 'blocks',
    description: 'Block window for reserve monitoring',
    min: 1,
    max: 10000,
  },
}

export default function RuleParameters({
  parameters,
  onSave,
}: RuleParametersProps) {
  const [editedParams, setEditedParams] = useState<Parameters>(parameters)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (key: keyof Parameters, value: number) => {
    const info = parameterInfo[key]
    const clampedValue = Math.min(Math.max(value, info.min), info.max)

    setEditedParams((prev) => ({ ...prev, [key]: clampedValue }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    onSave(editedParams)
    setHasChanges(false)
    setIsSaving(false)
  }

  const handleReset = () => {
    setEditedParams(parameters)
    setHasChanges(false)
  }

  return (
    <div className="console-panel p-4 md:p-6 h-fit">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-console-warning" />
          <h2 className="text-sm font-bold tracking-widest text-console-heading">
            RULE THRESHOLDS
          </h2>
        </div>
        {hasChanges && (
          <span className="text-xs text-yellow-500 animate-pulse">
            UNSAVED CHANGES
          </span>
        )}
      </div>

      <div className="space-y-4">
        {(Object.keys(parameterInfo) as Array<keyof Parameters>).map((key) => {
          const info = parameterInfo[key]
          const value = editedParams[key]
          const originalValue = parameters[key]
          const isChanged = value !== originalValue

          return (
            <div key={key} className="console-param-card group">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-bold tracking-wide ${isChanged ? 'text-yellow-400' : 'text-console-text'}`}
                  >
                    {key.replace(/_/g, ' ')}
                  </span>
                  <div className="group/tooltip relative">
                    <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block z-10">
                      <div className="bg-console-dark border border-console-border rounded px-3 py-2 text-xs text-console-text w-48 shadow-lg">
                        {info.description}
                      </div>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground uppercase">
                  {info.unit}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={value}
                  onChange={(e) =>
                    handleChange(key, parseInt(e.target.value) || 0)
                  }
                  min={info.min}
                  max={info.max}
                  className="console-input flex-1"
                />
                <div className="text-xs text-muted-foreground w-24 text-right">
                  {info.min} - {info.max}
                </div>
              </div>

              {/* Progress bar visualization */}
              <div className="mt-2 h-1 bg-console-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isChanged ? 'bg-yellow-500' : 'bg-console-accent'
                  }`}
                  style={{ width: `${(value / info.max) * 100}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className={`console-btn-primary flex-1 flex items-center justify-center gap-2 py-3 ${
            !hasChanges ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? 'SAVING...' : 'SAVE PARAMETERS'}</span>
        </button>

        {hasChanges && (
          <button
            onClick={handleReset}
            className="console-btn-secondary px-4 py-3"
          >
            RESET
          </button>
        )}
      </div>
    </div>
  )
}
