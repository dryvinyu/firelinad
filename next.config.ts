import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    MONAD_RPC_URL: process.env.MONAD_RPC_URL,
    MONAD_CHAIN_ID: process.env.MONAD_CHAIN_ID,
    DEPLOYER_PRIVATE_KEY: process.env.DEPLOYER_PRIVATE_KEY,
    SANDBOX_ADDRESS: process.env.SANDBOX_ADDRESS,
    NEXT_PUBLIC_MONAD_RPC_URL: process.env.NEXT_PUBLIC_MONAD_RPC_URL,
    NEXT_PUBLIC_MONAD_CHAIN_ID: process.env.NEXT_PUBLIC_MONAD_CHAIN_ID,
  },
}

export default nextConfig
