import { Chain } from 'viem'

// Avalanche Fuji Testnet Only
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

export const AVALANCHE_FUJI: NetworkConfig = {
  id: 43113,
  name: 'Avalanche Fuji',
  network: 'fuji',
  nativeCurrency: {
    decimals: 18,
    name: 'AVAX',
    symbol: 'AVAX',
  },
  rpcUrls: {
    default: {
      http: ['https://api.avax-test.network/ext/bc/C/rpc'],
    },
    public: {
      http: ['https://api.avax-test.network/ext/bc/C/rpc'],
    },
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://testnet.snowtrace.io' },
  },
  testnet: true,
}

export const toViemChain = (network: NetworkConfig): Chain => {
  return network as unknown as Chain
}