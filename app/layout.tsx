import type { Metadata } from 'next'
import localFont from 'next/font/local'

import { Toaster } from '@/components/ui/sonner'

import './globals.css'

const fira = localFont({
  src: './fonts/FiraSans-Regular.ttf',
  variable: '--font-fira',
})

export const metadata: Metadata = {
  title: 'Monad Fireline',
  description: 'Monad Fireline',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${fira.variable} antialiased`}>
        <main className="p-6 hex-pattern">{children}</main>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
