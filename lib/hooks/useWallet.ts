import { useEffect } from 'react'

import { useWalletStore } from '@/stores/wallet'

export default function useWallet() {
  const {
    signer,
    account,
    chainId,
    provider,
    accounts,
    connect,
    disconnect,
    switchNetwork,
    selectAccount,
    checkIsWalletConnected,
    handleAccountsChanged,
    handleChainChanged,
  } = useWalletStore()

  const isConnected = Boolean(account && provider && signer)

  useEffect(() => {
    void checkIsWalletConnected()
    if (!window.ethereum) return
    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)
    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum?.removeListener('chainChanged', handleChainChanged)
    }
  }, [checkIsWalletConnected, handleAccountsChanged, handleChainChanged])

  return {
    signer,
    account,
    chainId,
    provider,
    accounts,
    isConnected,
    connect,
    disconnect,
    switchNetwork,
    selectAccount,
  }
}
