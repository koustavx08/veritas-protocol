"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { CredentialCard } from "@/components/credential-card"
import { ProofSubmissionModal } from "@/components/proof-submission-modal"
import { User, Shield, Zap, RefreshCw, ExternalLink } from "lucide-react"
import { type Credential, blockchainService } from "@/lib/blockchain"
import { toast } from "sonner"

export default function DeveloperPortal() {
  const [isConnected, setIsConnected] = useState(false)
  const [userAddress, setUserAddress] = useState("")
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [selectedCredentials, setSelectedCredentials] = useState<Credential[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentRequestId, setCurrentRequestId] = useState<string>("")

  useEffect(() => {
    // Check for existing connection on mount
    checkExistingConnection()
  }, [])

  const checkExistingConnection = async () => {
    const address = await blockchainService.checkConnection()
    if (address) {
      handleConnect(address)
    }
  }

  const handleConnect = (address: string) => {
    setIsConnected(true)
    setUserAddress(address)
    loadCredentials(address)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setUserAddress("")
    setCredentials([])
    setSelectedCredentials([])
  }

  const loadCredentials = async (address: string) => {
    setIsLoading(true)
    try {
      const userCredentials = await blockchainService.getUserCredentials(address)
      setCredentials(userCredentials)

      if (userCredentials.length === 0) {
        toast.info("No credentials found. Ask an issuer to mint credentials for you.")
      } else {
        toast.success(`Found ${userCredentials.length} credential${userCredentials.length > 1 ? "s" : ""}`)
      }
    } catch (error) {
      toast.error("Failed to load credentials")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCredentialSelect = (credential: Credential) => {
    setSelectedCredentials((prev) => {
      const isSelected = prev.some((c) => c.tokenId === credential.tokenId)
      if (isSelected) {
        return prev.filter((c) => c.tokenId !== credential.tokenId)
      } else {
        return [...prev, credential]
      }
    })
  }

  const refreshCredentials = () => {
    if (userAddress) {
      loadCredentials(userAddress)
    }
  }

  const handleProofSubmitted = async (success: boolean, proofId?: string) => {
    if (success) {
      setSelectedCredentials([])
      toast.success("Proof submitted successfully!")

      if (proofId) {
        // Verify the proof was processed
        setTimeout(async () => {
          const result = await blockchainService.verifyProofById(proofId)
          if (result) {
            toast.success(`Proof verification: ${result.isVerified ? "✅ Valid" : "❌ Invalid"}`)
          }
        }, 2000)
      }
    }
  }

  const createDemoRequest = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    }

    try {
      const requiredCredentials = selectedCredentials.map((c) => c.credentialType)
      if (requiredCredentials.length === 0) {
        toast.error("Please select at least one credential")
        return
      }

      const requestId = await blockchainService.createProofRequest(requiredCredentials)
      if (requestId) {
        setCurrentRequestId(requestId)
        toast.success("Demo proof request created! You can now submit a proof.")
      }
    } catch (error) {
      toast.error("Failed to create proof request")
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <User className="w-8 h-8 text-green-500" />
              Developer Portal
            </h1>
            <p className="text-gray-400 mt-2">
              Manage your credentials and generate zero-knowledge proofs on Avalanche Fuji
            </p>
          </div>
          <WalletConnectButton onConnect={handleConnect} onDisconnect={handleDisconnect} showNetwork />
        </div>

        {!isConnected ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
              <p className="text-gray-400 mb-6">
                Connect your wallet to Avalanche Fuji to view your credentials and generate proofs.
              </p>
              <WalletConnectButton onConnect={handleConnect} onDisconnect={handleDisconnect} />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Shield className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{credentials.length}</p>
                      <p className="text-gray-400 text-sm">Total Credentials</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Zap className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{credentials.filter((c) => c.isValid).length}</p>
                      <p className="text-gray-400 text-sm">Valid Credentials</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <User className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{selectedCredentials.length}</p>
                      <p className="text-gray-400 text-sm">Selected for Proof</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <ExternalLink className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-lg font-bold">Fuji</p>
                      <p className="text-gray-400 text-sm">Network</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Credentials</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={refreshCredentials} disabled={isLoading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button variant="outline" onClick={createDemoRequest} disabled={selectedCredentials.length === 0}>
                  Create Demo Request
                </Button>
                <ProofSubmissionModal
                  selectedCredentials={selectedCredentials}
                  requestId={currentRequestId}
                  onProofSubmitted={handleProofSubmitted}
                />
              </div>
            </div>

            {/* Credentials Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-gray-800 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-800 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : credentials.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Shield className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Credentials Found</h3>
                  <p className="text-gray-400 mb-4">
                    You don't have any credentials yet. Ask a whitelisted issuer to mint credentials for you.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={refreshCredentials}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                    <Button variant="outline" onClick={() => window.open("https://faucet.avax.network/", "_blank")}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Get Test AVAX
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {credentials.map((credential) => (
                  <CredentialCard
                    key={credential.tokenId}
                    credential={credential}
                    onSelect={handleCredentialSelect}
                    isSelected={selectedCredentials.some((c) => c.tokenId === credential.tokenId)}
                    showSelectButton={true}
                  />
                ))}
              </div>
            )}

            {/* Selected Credentials Summary */}
            {selectedCredentials.length > 0 && (
              <Card className="border-purple-500/20 bg-purple-500/5">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Selected Credentials for Proof</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCredentials.map((cred) => (
                      <div
                        key={cred.tokenId}
                        className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm"
                      >
                        <span>{cred.credentialType}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCredentialSelect(cred)}
                          className="h-4 w-4 p-0 hover:bg-purple-500/20"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
