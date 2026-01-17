'use client'

import { useState } from 'react'
import { ethers } from 'ethers'

import useWallet from '@/lib/hooks/useWallet'
import {
  CHAIN_CONFIG,
  CONTRACT_ABIS,
  CONTRACT_ADDRESSES,
} from '@/lib/contracts'

type TxItem = {
  hash: string
  label: string
  status: 'pending' | 'success' | 'revert'
}

const DRAIN_AMOUNT = 150000n
const PRICE_SHOCK = -300n

export default function AttackPage() {
  const { signer, account, chainId, isConnected, switchNetwork } = useWallet()
  const [txs, setTxs] = useState<TxItem[]>([])
  const [error, setError] = useState<string | null>(null)

  const explorerBaseUrl =
    CHAIN_CONFIG.explorerTxBaseUrl || 'https://sepolia.etherscan.io/tx/'

  const ensureNetwork = async () => {
    if (!CHAIN_CONFIG.id || chainId === CHAIN_CONFIG.id) {
      return true
    }
    return switchNetwork(CHAIN_CONFIG.id)
  }

  const sendTx = async (
    label: string,
    action: () => Promise<ethers.TransactionResponse>,
  ) => {
    setError(null)
    try {
      const hash = await action()
      setTxs((prev) => [{ hash: hash.hash, label, status: 'pending' }, ...prev])
      const receipt = await hash.wait()
      const status = receipt?.status === 1 ? 'success' : 'revert'
      setTxs((prev) =>
        prev.map((tx) => (tx.hash === hash.hash ? { ...tx, status } : tx)),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const handleDrain = async () => {
    if (!signer || !account || !isConnected) {
      throw new Error('Connect wallet first')
    }
    const isReady = await ensureNetwork()
    if (!isReady) {
      throw new Error('Switch to the correct network first')
    }
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.sandbox,
      CONTRACT_ABIS.sandbox,
      signer,
    )
    await sendTx('DRAIN', () => contract.drain(DRAIN_AMOUNT))
  }

  const handlePriceShock = async () => {
    if (!signer || !account || !isConnected) {
      throw new Error('Connect wallet first')
    }
    const isReady = await ensureNetwork()
    if (!isReady) {
      throw new Error('Switch to the correct network first')
    }
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.sandbox,
      CONTRACT_ABIS.sandbox,
      signer,
    )
    await sendTx('SHOCK', () => contract.setPriceShock(PRICE_SHOCK))
  }

  return (
    <section className="console-bg p-4 md:p-6 lg:p-8 min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-display tracking-wide">
            Attack Console
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Trigger controlled incidents against the sandbox contract.
          </p>
        </div>

        <div className="console-panel p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={() => void handleDrain()}
              className="px-5 py-3 rounded-lg border border-red-500/40 text-red-300 font-semibold uppercase tracking-wider hover:bg-red-500/10 transition"
            >
              Drain
            </button>
            <button
              onClick={() => void handlePriceShock()}
              className="px-5 py-3 rounded-lg border border-blue-500/40 text-blue-200 font-semibold uppercase tracking-wider hover:bg-blue-500/10 transition"
            >
              Price Shock
            </button>
          </div>
          {error ? (
            <div className="mt-4 text-sm text-destructive/90">{error}</div>
          ) : null}
        </div>

        <div className="console-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
              Recent Transactions
            </h2>
            <span className="text-xs text-muted-foreground">
              Sandbox: {CONTRACT_ADDRESSES.sandbox}
            </span>
          </div>
          {txs.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No actions sent yet.
            </div>
          ) : (
            <div className="space-y-3">
              {txs.map((tx) => (
                <div
                  key={tx.hash}
                  className="flex flex-wrap items-center gap-3 text-sm"
                >
                  <span className="text-console-text font-mono">
                    {tx.label}
                  </span>
                  <span className="text-muted-foreground">{tx.status}</span>
                  <a
                    href={`${explorerBaseUrl}${tx.hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-console-accent"
                  >
                    {tx.hash.slice(0, 10)}...
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
