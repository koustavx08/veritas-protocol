import { Chain } from 'viem'

// Testnet-only support: Celo Alfajores
export type NetworkMode = 'testnet'

export interface NetworkConfig {
  id: number
  name: string
  network: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: {
    default: {
      http: string[]
    }
    public: {
      http: string[]
    }
  }
  blockExplorers: {
    default: { name: string; url: string }
  }
  testnet: boolean
}

// Celo Alfajores Testnet
export const CELO_ALFAJORES: NetworkConfig = {
  id: 44787,
  name: 'Celo Alfajores',
  network: 'alfajores',
  nativeCurrency: {
    decimals: 18,
    name: 'CELO',
    symbol: 'CELO',
  },
  rpcUrls: {
    default: {
      http: ['https://alfajores-forno.celo-testnet.org'],
    },
    public: {
      http: ['https://alfajores-forno.celo-testnet.org'],
    },
  },
  blockExplorers: {
    default: { name: 'CeloScan', url: 'https://alfajores.celoscan.io' },
  },
  testnet: true,
}

// Supported Networks (Testnets Only)
export const SUPPORTED_NETWORKS: NetworkConfig[] = [
  CELO_ALFAJORES,
]

export const ALL_NETWORKS = SUPPORTED_NETWORKS

export const getNetworkById = (chainId: number): NetworkConfig | undefined => {
  return ALL_NETWORKS.find((network) => network.id === chainId)
}

export const toViemChain = (network: NetworkConfig): Chain => {
  return network as unknown as Chain
}