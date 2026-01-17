import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Agent Runners', path: '/' },
  { label: 'Console', path: '/console' },
  { label: 'Attack', path: '/attack' },
]

export default function NavMenu() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center gap-1">
      {navItems.map((item) => (
        <Link key={item.path} href={item.path}>
          <motion.div
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === item.path
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {item.label}
          </motion.div>
        </Link>
      ))}
    </nav>
  )
}
