import { toast } from 'sonner'
import { create } from 'zustand'
import { ethers, type BrowserProvider, type JsonRpcSigner } from 'ethers'

type WalletState = {
  account: string
  chainId: number | null
  signer: JsonRpcSigner | null
  provider: BrowserProvider | null
  accounts: string[]

  connect: () => Promise<boolean>
  disconnect: () => void
  initializeProviderAndSigner: (accountAddress: string) => Promise<void>
  handleAccountsChanged: (eventAccounts: string[]) => void
  handleChainChanged: (chainIdHex: string) => Promise<void>
  switchNetwork: (targetChainId: number) => Promise<boolean>
  checkIsWalletConnected: () => Promise<void>
  selectAccount: (address: string) => Promise<boolean>
}

export const useWalletStore = create<WalletState>((set, get) => ({
  account: '',
  chainId: null,
  signer: null,
  provider: null,
  accounts: [],

  connect: async () => {
    if (
      typeof window === 'undefined' ||
      typeof window.ethereum === 'undefined'
    ) {
      toast.error('请先安装 MetaMask 钱包或其他以太坊钱包扩展，后再刷新页面')
      return false
    }
    try {
      if (window.ethereum?.isMetaMask) {
        try {
          await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }],
          })
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('钱包权限请求失败，尝试继续连接', err)
        }
      }
      // connect
      const nextAccounts: string[] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (!nextAccounts.length) {
        throw new Error('用户拒绝了连接请求')
      }

      set({ accounts: nextAccounts, account: nextAccounts[0] })
      await get().initializeProviderAndSigner(nextAccounts[0])
      return true
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('连接钱包失败', err)
      toast.error(err?.message || '连接钱包失败')
      return false
    }
  },

  disconnect: () => {
    set({
      account: '',
      chainId: null,
      signer: null,
      provider: null,
      accounts: [],
    })
    if (typeof window !== 'undefined') {
      window.ethereum?.removeListener(
        'accountsChanged',
        get().handleAccountsChanged,
      )
      window.ethereum?.removeListener('chainChanged', get().handleChainChanged)
    }
  },

  initializeProviderAndSigner: async (accountAddress: string) => {
    if (typeof window === 'undefined' || !window.ethereum) return
    try {
      const web3Provider = new ethers.BrowserProvider(window.ethereum)
      const network = await web3Provider.getNetwork()
      const web3Signer = await web3Provider.getSigner()

      set({
        signer: web3Signer,
        provider: web3Provider,
        account: accountAddress,
        chainId: Number(network.chainId),
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('初始化钱包失败', err)
      toast.error('初始化钱包失败，请重试')
    }
  },

  handleAccountsChanged: (eventAccounts: string[]) => {
    if (!eventAccounts || eventAccounts.length === 0) {
      get().disconnect()
      return
    }
    const nextAccount = eventAccounts[0]
    set({ accounts: eventAccounts, account: nextAccount })
    void get().initializeProviderAndSigner(nextAccount)
  },

  handleChainChanged: async (chainIdHex: string) => {
    const nextChainId = Number.parseInt(chainIdHex, 16)
    set({ chainId: nextChainId })
    // eslint-disable-next-line no-console
    console.log('连接网络变更', chainIdHex, nextChainId)
    const currentAccount = get().account
    if (currentAccount) {
      await get().initializeProviderAndSigner(currentAccount)
    }
    toast.success(`已连接到网络: ${nextChainId}`)
  },

  switchNetwork: async (targetChainId: number) => {
    if (typeof window === 'undefined' || !window.ethereum) {
      toast.error('未检测到以太坊钱包')
      return false
    }
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      })
      return true
    } catch (err: any) {
      if (err?.code === 4902) {
        toast.error('当前钱包未添加该网络，请先在钱包中添加')
      } else {
        toast.error(err?.message || '切换网络失败')
      }
      return false
    }
  },

  checkIsWalletConnected: async () => {
    if (
      typeof window === 'undefined' ||
      typeof window.ethereum === 'undefined'
    ) {
      toast.error('请先安装 MetaMask 钱包，后再刷新页面')
      return
    }
    try {
      const existingAccounts: string[] = await window.ethereum.request({
        method: 'eth_accounts',
      })
      if (existingAccounts.length > 0) {
        set({ accounts: existingAccounts, account: existingAccounts[0] })
        await get().initializeProviderAndSigner(existingAccounts[0])
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('检查钱包连接状态失败', err)
      toast.error('检查钱包连接状态失败')
    }
  },

  selectAccount: async (address: string) => {
    if (typeof window === 'undefined' || !window.ethereum) return false
    const existing = get().accounts
    if (!existing.includes(address)) return false
    set({ account: address })
    await get().initializeProviderAndSigner(address)
    return true
  },
}))
