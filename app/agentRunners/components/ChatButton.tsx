'use client'
import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'

interface ChatButtonProps {
  onClick: () => void
  isOpen: boolean
}

export default function ChatButton({ onClick, isOpen }: ChatButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`fixed bottom-10 left-10 z-50 flex items-center justify-center w-12 h-12 rounded-full border shadow-lg transition-colors ${
        isOpen
          ? 'bg-primary border-primary text-primary-foreground'
          : 'bg-background border-border/40 text-foreground hover:border-primary/50'
      } cursor-pointer`}
      aria-label="Open AI Assistant"
    >
      <MessageSquare className="w-6 h-6" />
    </motion.button>
  )
}
