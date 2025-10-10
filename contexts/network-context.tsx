'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { NetworkConfig, AVALANCHE_FUJI } from '@/lib/networks'
import { blockchainService } from '@/lib/blockchain'

interface NetworkContextType {
  currentNetwork: NetworkConfig
  isCorrectNetwork: boolean
  switchNetwork: () => Promise<boolean>
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined)

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(true)
  const currentNetwork = AVALANCHE_FUJI

  useEffect(() => {
    checkCurrentNetwork()
    blockchainService.setNetwork(currentNetwork)
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('chainChanged', checkCurrentNetwork)
      return () => {
        window.ethereum.removeListener('chainChanged', checkCurrentNetwork)
      }
    }
  }, [])

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

  const switchNetwork = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !window.ethereum) {
      return false
    }
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${currentNetwork.id.toString(16)}` }],
      })
      return true
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${currentNetwork.id.toString(16)}`,
                chainName: currentNetwork.name,
                nativeCurrency: currentNetwork.nativeCurrency,
                rpcUrls: currentNetwork.rpcUrls.default.http,
                blockExplorerUrls: [currentNetwork.blockExplorers.default.url],
              },
            ],
          })
          return true
        } catch (addError) {
          return false
        }
      }
      return false
    }
  }

  return (
    <NetworkContext.Provider
      value={{
        currentNetwork,
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