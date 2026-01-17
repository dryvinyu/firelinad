'use client'
import Logo from './components/Logo'
import Wallet from './components/Wallet'
import NavMenu from './components/NavMenu'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="flex items-center justify-between h-16 container mx-auto px-4">
        <Logo />
        <NavMenu />
        <Wallet />
      </div>
    </header>
  )
}
