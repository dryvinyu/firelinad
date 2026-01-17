'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { UsersRound } from 'lucide-react'

export default function DaoEntry() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setIsOpen((v) => !v)}
      className={`fixed bottom-10 left-30 z-50 flex items-center justify-center w-12 h-12 rounded-full border shadow-lg transition-colors ${
        isOpen
          ? 'bg-primary border-primary text-primary-foreground'
          : 'bg-background border-border/40 text-foreground hover:border-primary/50'
      } cursor-pointer`}
      aria-label="Open AI Assistant"
    >
      <UsersRound className="w-6 h-6" />
    </motion.button>
  )
}
