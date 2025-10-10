"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, LogOut, ExternalLink, AlertTriangle, ChevronDown } from "lucide-react"
import { blockchainService } from "@/lib/blockchain"
import { useNetwork } from "@/contexts/network-context"
import { toast } from "sonner"

interface WalletConnectButtonProps {
  onConnect?: (address: string) => void
  onDisconnect?: () => void
  showBalance?: boolean
  showNetwork?: boolean
}

export function WalletConnectButton({
  onConnect,
  onDisconnect,
  showBalance = false,
  showNetwork = true,
}: WalletConnectButtonProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string>("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [balance, setBalance] = useState<string>("")
  const { currentNetwork, isCorrectNetwork, switchNetwork } = useNetwork();

  useEffect(() => {
    checkConnection()
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkConnection = async () => {
    try {
      const connectedAddress = await blockchainService.checkConnection()
      if (connectedAddress) {
        setAddress(connectedAddress)
        setIsConnected(true)
        onConnect?.(connectedAddress)

        if (showBalance) {
          await updateBalance(connectedAddress)
        }
      }
    } catch (error) {
      console.error("Failed to check connection:", error)
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      handleDisconnect()
    } else {
      setAddress(accounts[0])
      onConnect?.(accounts[0])
      if (showBalance) {
        updateBalance(accounts[0])
      }
    }
  }

  const handleChainChanged = () => {
    // Re-check connection and network
    checkConnection()
  }

  const updateBalance = async (addr: string) => {
    try {
      // This would require additional setup with viem public client
      // For now, we'll skip balance display
      setBalance("--")
    } catch (error) {
      console.error("Failed to get balance:", error)
      setBalance("--")
    }
  }

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      const connectedAddress = await blockchainService.connectWallet()
      if (connectedAddress) {
        setAddress(connectedAddress)
        setIsConnected(true)
        onConnect?.(connectedAddress)

        if (showBalance) {
          await updateBalance(connectedAddress)
        }
      }
    } catch (error) {
      toast.error("Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSwitchNetwork = async () => {
    try {
      await switchNetwork()
      toast.success(`Switched to ${currentNetwork.name}`)
    } catch (error: any) {
      toast.error(`Failed to switch network: ${error.message}`)
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setAddress("")
    setBalance("")
    onDisconnect?.()
    toast.success("Wallet disconnected")
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const openInExplorer = () => {
    window.open(blockchainService.getExplorerUrl(address, "address"), "_blank")
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        {showNetwork && (
          <div className="flex items-center gap-1">
            <Badge
              variant="secondary"
              className={`${
                isCorrectNetwork
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20 cursor-pointer"
              }`}
              onClick={!isCorrectNetwork ? handleSwitchNetwork : undefined}
            >
              {isCorrectNetwork ? currentNetwork.name : "Wrong Network"}
              {!isCorrectNetwork && <AlertTriangle className="w-3 h-3 ml-1" />}
            </Badge>
            {currentNetwork.testnet && (
              <Badge variant="outline" className="border-purple-500/50 text-purple-400 text-xs">
                Testnet
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <div className="flex flex-col">
            <span className="text-sm font-mono text-green-400">{formatAddress(address)}</span>
            {showBalance && balance && (
              <span className="text-xs text-gray-400">
                {balance} {currentNetwork.nativeCurrency.symbol}
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={openInExplorer} className="h-6 w-6 p-0 hover:bg-green-500/20">
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          className="border-red-500/20 hover:bg-red-500/10 bg-transparent"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={handleConnect} disabled={isConnecting} className="bg-blue-600 hover:bg-blue-700">
      <Wallet className="w-4 h-4 mr-2" />
      {isConnecting ? "Connecting..." : (
        <span className="flex items-center gap-1">
          Connect to {currentNetwork.name}
          <ChevronDown className="w-3 h-3 ml-1" />
        </span>
      )}
    </Button>
  )
}
