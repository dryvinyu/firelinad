// 扩展 Window 接口以包含 ethereum 对象
interface Window {
  ethereum?: {
    request(args: { method: string; params?: any[] }): Promise<any>
    on(event: string, callback: (...args: any[]) => void): void
    removeListener(event: string, callback: (...args: any[]) => void): void
    selectedAddress: string | null
    chainId: string
    isMetaMask: boolean
  }
}
