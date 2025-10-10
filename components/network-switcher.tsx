'use client'

import { useState } from 'react'
import { useNetwork } from '@/contexts/network-context'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { NetworkConfig } from '@/lib/networks'
import { Globe, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface NetworkSwitcherProps {
  variant?: 'dropdown' | 'switch' | 'compact'
  showNetworkSelector?: boolean
}

export function NetworkSwitcher({
  variant = 'dropdown',
  showNetworkSelector = true,
}: NetworkSwitcherProps) {
  const { mode, setMode, currentNetwork, setCurrentNetwork, availableNetworks, isCorrectNetwork, switchNetwork } = useNetwork()
  const [isChanging, setIsChanging] = useState(false)

  const handleModeChange = async (newMode: 'testnet' | 'mainnet') => {
    setMode(newMode)
  }

  const handleNetworkChange = async (networkKey: string) => {
    const network = availableNetworks[networkKey]
    if (!network) return

    setIsChanging(true)
    try {
      const success = await switchNetwork(network.id)
      if (success) {
        setCurrentNetwork(network)
      }
    } finally {
      setIsChanging(false)
    }
  }

  // Switch toggle variant
  if (variant === 'switch') {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="network-mode"
            checked={mode === 'mainnet'}
            onCheckedChange={(checked) => handleModeChange(checked ? 'mainnet' : 'testnet')}
            disabled={isChanging}
          />
          <Label htmlFor="network-mode" className="cursor-pointer">
            {mode === 'testnet' ? 'Testnet' : 'Mainnet'}
          </Label>
        </div>

        {showNetworkSelector && (
          <Select
            value={Object.keys(availableNetworks).find(
              (key) => availableNetworks[key].id === currentNetwork.id
            )}
            onValueChange={handleNetworkChange}
            disabled={isChanging}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Network" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(availableNetworks).map(([key, network]) => (
                <SelectItem key={key} value={key}>
                  {network.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {!isCorrectNetwork && (
          <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Wrong Network
          </Badge>
        )}
      </div>
    )
  }

  // Compact variant (just shows current network with icon)
  if (variant === 'compact') {
    return (
      <Badge
        variant="outline"
        className={`flex items-center ${mode === 'testnet' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}
      >
        <Globe className="w-3 h-3 mr-1" />
        {currentNetwork.name} ({mode === 'testnet' ? 'Test' : 'Main'})
        {!isCorrectNetwork && <AlertTriangle className="w-3 h-3 ml-1" />}
      </Badge>
    )
  }

  // Default dropdown variant
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <Select value={mode} onValueChange={(value: 'testnet' | 'mainnet') => handleModeChange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Network Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="testnet">Testnet Mode</SelectItem>
            <SelectItem value="mainnet">Mainnet Mode</SelectItem>
          </SelectContent>
        </Select>

        {!isCorrectNetwork && (
          <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Wrong Network
          </Badge>
        )}
      </div>

      {showNetworkSelector && (
        <Select
          value={Object.keys(availableNetworks).find(
            (key) => availableNetworks[key].id === currentNetwork.id
          )}
          onValueChange={handleNetworkChange}
          disabled={isChanging}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Network" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(availableNetworks).map(([key, network]) => (
              <SelectItem key={key} value={key}>
                {network.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}