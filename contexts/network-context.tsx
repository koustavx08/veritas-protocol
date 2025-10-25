'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { NetworkConfig, AVALANCHE_FUJI, CELO_ALFAJORES } from '@/lib/networks'
import { blockchainService } from '@/lib/blockchain'

type Mode = 'testnet' | 'mainnet'

interface NetworkContextType {
  mode: Mode
  setMode: (mode: Mode) => void
  currentNetwork: NetworkConfig
  setCurrentNetwork: (net: NetworkConfig) => void
  availableNetworks: Record<string, NetworkConfig>
  isCorrectNetwork: boolean
  switchNetwork: (chainId: number) => Promise<boolean>
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined)

const AVAILABLE_TESTNETS: Record<string, NetworkConfig> = {
  fuji: AVALANCHE_FUJI,
  alfajores: CELO_ALFAJORES,
}

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('testnet')
  const initial = (process?.env?.NEXT_PUBLIC_VERITAS_NETWORK === 'alfajores') ? CELO_ALFAJORES : AVALANCHE_FUJI
  const [currentNetwork, setCurrentNetwork] = useState<NetworkConfig>(initial)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(true)

  useEffect(() => {
    blockchainService.setNetwork(currentNetwork)
    checkCurrentNetwork()
    if (typeof window !== 'undefined' && window.ethereum) {
      const handler = () => checkCurrentNetwork()
      window.ethereum.on('chainChanged', handler)
      return () => {
        window.ethereum.removeListener('chainChanged', handler)
      }
    }
  }, [currentNetwork])

  const checkCurrentNetwork = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setIsCorrectNetwork(false)
      return
    }
    try {
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' })
      const chainId = parseInt(chainIdHex, 16)
      setIsCorrectNetwork(chainId === currentNetwork.id)
    } catch (error) {
      setIsCorrectNetwork(false)
    }
  }

  const switchNetwork = async (chainId: number): Promise<boolean> => {
    const target = Object.values(AVAILABLE_TESTNETS).find(n => n.id === chainId)
    if (!target) return false

    if (typeof window === 'undefined' || !window.ethereum) {
      return false
    }
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${target.id.toString(16)}` }],
      })
      setCurrentNetwork(target)
      return true
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${target.id.toString(16)}`,
                chainName: target.name,
                nativeCurrency: target.nativeCurrency,
                rpcUrls: target.rpcUrls.default.http,
                blockExplorerUrls: [target.blockExplorers.default.url],
              },
            ],
          })
          setCurrentNetwork(target)
          return true
        } catch (_) {
          return false
        }
      }
      return false
    }
  }

  return (
    <NetworkContext.Provider
      value={{
        mode,
        setMode,
        currentNetwork,
        setCurrentNetwork,
        availableNetworks: AVAILABLE_TESTNETS,
        isCorrectNetwork,
        switchNetwork,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}

export function useNetwork() {
  const context = useContext(NetworkContext)
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider')
  }
  return context
}