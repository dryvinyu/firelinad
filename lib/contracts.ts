import controllerAbi from '@/abi/EmergencyController.json'
import sandboxAbi from '@/abi/IncidentSandbox.json'
import decisionNftAbi from '@/abi/DecisionNFT.json'
import deployment from '@/deployments/monad.json'

export const CONTRACT_ADDRESSES = {
  controller: deployment.controller as `0x${string}`,
  sandbox: deployment.sandbox as `0x${string}`,
  decisionNft: deployment.decisionNft as `0x${string}`,
}

export const CONTRACT_ABIS = {
  controller: controllerAbi,
  sandbox: sandboxAbi,
  decisionNft: decisionNftAbi,
}

export const CHAIN_CONFIG = {
  id: Number(process.env.NEXT_PUBLIC_MONAD_CHAIN_ID || 0),
  name: deployment.network ?? 'monad',
  rpcUrl: process.env.NEXT_PUBLIC_MONAD_RPC_URL || '',
  explorerTxBaseUrl: process.env.NEXT_PUBLIC_MONAD_EXPLORER_URL || '',
}
