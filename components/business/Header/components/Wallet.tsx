import { useState } from 'react'
import { Wallet as WalletIcon } from 'lucide-react'

import { truncateAddress } from '@/lib/utils'
import useWallet from '@/lib/hooks/useWallet'
import { Button } from '@/components/ui/button'

export default function Wallet() {
  const [isConnecting, setIsConnecting] = useState(false)
  const { isConnected, account, connect, disconnect } = useWallet()

  return (
    <div className="w-32">
      <Button
        size="sm"
        disabled={isConnecting}
        className="hidden sm:flex cursor-pointer"
        variant={isConnected ? 'outline' : 'default'}
        onClick={async () => {
          if (isConnected) {
            disconnect()
          } else {
            setIsConnecting(true)
            try {
              await connect()
            } finally {
              setIsConnecting(false)
            }
          }
        }}
      >
        <WalletIcon className="w-4 h-4" />
        {isConnecting ? (
          '连接中...'
        ) : isConnected && account ? (
          <span className="font-mono text-xs">{truncateAddress(account)}</span>
        ) : (
          '连接钱包'
        )}
      </Button>
    </div>
  )
}
