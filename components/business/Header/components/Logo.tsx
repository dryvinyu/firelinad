import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <motion.div
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05, rotate: 5 }}
        className="relative w-10 h-10 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center overflow-hidden"
      >
        <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
      </motion.div>
      <span className="text-xl font-bold gradient-text hidden sm:block text-white">
        Firelinad
      </span>
    </Link>
  )
}
