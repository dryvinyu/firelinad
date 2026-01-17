import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  action: string
  description: string
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  action,
  description,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative console-panel p-6 max-w-md w-full animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-console-text transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning icon */}
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-red-500/20 border border-red-500/50">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-center text-console-heading tracking-wider mb-2">
          CONFIRM ACTION
        </h3>

        {/* Action name */}
        <div className="text-center mb-4">
          <span className="inline-block px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-400 font-mono text-sm">
            {action}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground text-center mb-6">
          {description}
        </p>

        {/* Warning box */}
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mb-6">
          <p className="text-xs text-yellow-300 text-center">
            ⚠️ This action will be executed on-chain and cannot be undone.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 console-btn-secondary py-3"
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
          >
            EXECUTE
          </button>
        </div>
      </div>
    </div>
  )
}
