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
    <div className="min-h-screen bg-gray-900 text-white bg-dots-pattern relative">
      {/* Animated background elements */}
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-green-500/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-float delay-300"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-down">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <User className="w-8 h-8 text-green-500 animate-float" />
              <span className="gradient-text-blue-purple">Developer Portal</span>
            </h1>
            <p className="text-gray-400 mt-2 animate-fade-in delay-100">
                Manage your credentials and generate zero-knowledge proofs on Celo Alfajores
            </p>
          </div>
          <div className="animate-fade-in delay-200">
            <WalletConnectButton onConnect={handleConnect} onDisconnect={handleDisconnect} showNetwork />
          </div>
        </div>

        {!isConnected ? (
          <Card className="max-w-md mx-auto glass-card border-green-500/20 animate-scale-in">
            <CardContent className="text-center py-12">
              <Shield className="w-16 h-16 text-green-500 mx-auto mb-4 animate-float" />
              <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
              <p className="text-gray-400 mb-6">
                  Connect your wallet to Celo Alfajores to view your credentials and generate proofs.
              </p>
              <WalletConnectButton onConnect={handleConnect} onDisconnect={handleDisconnect} />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass-card border-blue-500/20 hover:border-blue-500/40 transition-smooth animate-fade-in-up delay-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg transition-smooth hover:bg-blue-500/20">
                      <Shield className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{credentials.length}</p>
                      <p className="text-gray-400 text-sm">Total Credentials</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-green-500/20 hover:border-green-500/40 transition-smooth animate-fade-in-up delay-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg transition-smooth hover:bg-green-500/20">
                      <Zap className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{credentials.filter((c) => c.isValid).length}</p>
                      <p className="text-gray-400 text-sm">Valid Credentials</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-smooth animate-fade-in-up delay-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg transition-smooth hover:bg-purple-500/20">
                      <User className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{selectedCredentials.length}</p>
                      <p className="text-gray-400 text-sm">Selected for Proof</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-orange-500/20 hover:border-orange-500/40 transition-smooth animate-fade-in-up delay-400">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg transition-smooth hover:bg-orange-500/20">
                      <ExternalLink className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <p className="text-lg font-bold">Alfajores</p>
                      <p className="text-gray-400 text-sm">Network</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between animate-fade-in delay-500">
              <h2 className="text-xl font-semibold">Your Credentials</h2>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" onClick={refreshCredentials} disabled={isLoading} className="transition-smooth hover:scale-105">
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button variant="outline" onClick={createDemoRequest} disabled={selectedCredentials.length === 0} className="transition-smooth hover:scale-105">
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
                  <Card key={i} className="glass-card border-gray-700/20 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <CardContent className="p-6">
                      <div className="h-4 shimmer rounded w-3/4 mb-4"></div>
                      <div className="h-3 shimmer rounded w-1/2 mb-2"></div>
                      <div className="h-3 shimmer rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : credentials.length === 0 ? (
              <Card className="glass-card border-gray-700/20 animate-scale-in">
                <CardContent className="text-center py-12">
                  <Shield className="w-16 h-16 text-gray-500 mx-auto mb-4 animate-float" />
                  <h3 className="text-xl font-semibold mb-2">No Credentials Found</h3>
                  <p className="text-gray-400 mb-4">
                    You don't have any credentials yet. Ask a whitelisted issuer to mint credentials for you.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={refreshCredentials} className="transition-smooth hover:scale-105">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                      <Button variant="outline" onClick={() => window.open("https://faucet.celo.org/alfajores", "_blank")} className="transition-smooth hover:scale-105">
                      <ExternalLink className="w-4 h-4 mr-2" />
                        Get Test CELO
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {credentials.map((credential, index) => (
                  <div key={credential.tokenId} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <CredentialCard
                      credential={credential}
                      onSelect={handleCredentialSelect}
                      isSelected={selectedCredentials.some((c) => c.tokenId === credential.tokenId)}
                      showSelectButton={true}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Selected Credentials Summary */}
            {selectedCredentials.length > 0 && (
              <Card className="glass-card border-purple-500/30 bg-purple-500/5 animate-fade-in-up hover:border-purple-500/50 transition-smooth">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-400" />
                    Selected Credentials for Proof
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCredentials.map((cred) => (
                      <div
                        key={cred.tokenId}
                        className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm transition-smooth hover:border-purple-500/40 hover:bg-purple-500/15"
                      >
                        <span>{cred.credentialType}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCredentialSelect(cred)}
                          className="h-4 w-4 p-0 hover:bg-purple-500/20 transition-smooth"
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
