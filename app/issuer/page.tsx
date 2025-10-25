"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { Award, Send, Shield, CheckCircle, XCircle, ExternalLink, RefreshCw } from "lucide-react"
import { keccak256, stringToHex } from "viem"
import { blockchainService } from "@/lib/blockchain"
import { toast } from "sonner"

const CREDENTIAL_TYPES = [
  "Hackathon Winner",
  "DeFi Contributor",
  "Smart Contract Auditor",
  "Full Stack Developer",
  "Blockchain Developer",
  "Security Researcher",
  "Open Source Contributor",
  "Technical Writer",
  "Community Moderator",
  "Bug Bounty Hunter",
]

export default function IssuerDashboard() {
  const [isConnected, setIsConnected] = useState(false)
  const [issuerAddress, setIssuerAddress] = useState("")
  const [isWhitelisted, setIsWhitelisted] = useState(false)
  const [checkingWhitelist, setCheckingWhitelist] = useState(false)
  const [formData, setFormData] = useState({
    recipientAddress: "",
    credentialType: "",
    issuerName: "",
    description: "",
    additionalData: "",
  })
  const [isMinting, setIsMinting] = useState(false)
  const [recentMints, setRecentMints] = useState<any[]>([])

  useEffect(() => {
    if (isConnected && issuerAddress) {
      checkIssuerWhitelist()
    }
  }, [isConnected, issuerAddress])

  const handleConnect = (address: string) => {
    setIsConnected(true)
    setIssuerAddress(address)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setIssuerAddress("")
    setIsWhitelisted(false)
    setRecentMints([])
  }

  const checkIssuerWhitelist = async () => {
    setCheckingWhitelist(true)
    try {
      const whitelisted = await blockchainService.isWhitelistedIssuer(issuerAddress)
      setIsWhitelisted(whitelisted)

      if (!whitelisted) {
        toast.error("Your address is not whitelisted as an issuer")
      } else {
        toast.success("Issuer verification successful!")
      }
    } catch (error) {
      toast.error("Failed to check issuer status")
    } finally {
      setCheckingWhitelist(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const mintCredential = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!isWhitelisted) {
      toast.error("You are not authorized to mint credentials")
      return
    }

    if (!formData.recipientAddress || !formData.credentialType || !formData.issuerName) {
      toast.error("Please fill in all required fields")
      return
    }

    // Validate recipient address
    if (!formData.recipientAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error("Please enter a valid Ethereum address")
      return
    }

    setIsMinting(true)
    try {
      const metadata = {
        description: formData.description,
        additionalData: formData.additionalData ? JSON.parse(formData.additionalData) : {},
        issuer: issuerAddress,
        timestamp: Date.now(),
        version: "1.0",
      }

      const metadataStr = JSON.stringify(metadata)
      const metadataHash = keccak256(stringToHex(metadataStr))
      const metadataURI = `data:application/json;utf-8,${encodeURIComponent(metadataStr)}`

      const tokenId = await blockchainService.mintCredential(
        formData.recipientAddress,
        formData.credentialType,
        formData.issuerName,
        metadataHash,
        metadataURI,
      )

      if (tokenId) {
        const newMint = {
          tokenId,
          recipient: formData.recipientAddress,
          credentialType: formData.credentialType,
          issuerName: formData.issuerName,
          timestamp: Date.now(),
        }

        setRecentMints((prev) => [newMint, ...prev.slice(0, 4)])

        // Reset form
        setFormData({
          recipientAddress: "",
          credentialType: "",
          issuerName: "",
          description: "",
          additionalData: "",
        })
      }
    } catch (error) {
      console.error("Minting failed:", error)
    } finally {
      setIsMinting(false)
    }
  }

  const validateJSON = (jsonString: string) => {
    if (!jsonString.trim()) return true
    try {
      JSON.parse(jsonString)
      return true
    } catch {
      return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white relative overflow-hidden">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/20">
                <Award className="w-7 h-7 text-blue-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Issuer Dashboard
              </h1>
            </div>
            <p className="text-gray-400 text-lg ml-[52px]">
              Mint Soulbound Tokens for verified professional credentials on Celo Alfajores
            </p>
          </div>
          <div className="md:flex-shrink-0">
            <WalletConnectButton onConnect={handleConnect} onDisconnect={handleDisconnect} showNetwork />
          </div>
        </div>

        {!isConnected ? (
          <Card className="max-w-lg mx-auto bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 shadow-2xl">
            <CardContent className="text-center py-16 px-8">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6">
                <Shield className="w-16 h-16 text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-100">Connect Your Wallet</h2>
              <p className="text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
                Connect your wallet to Celo Alfajores testnet to start issuing professional credentials.
              </p>
              <WalletConnectButton onConnect={handleConnect} onDisconnect={handleDisconnect} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 shadow-2xl hover:border-gray-700/50 transition-all duration-300">
                <CardHeader className="border-b border-gray-800/50 pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                        <Send className="w-5 h-5 text-green-400" />
                      </div>
                      Mint New Credential
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {checkingWhitelist ? (
                        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1">
                          <RefreshCw className="w-3 h-3 mr-1.5 animate-spin" />
                          Verifying...
                        </Badge>
                      ) : isWhitelisted ? (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1">
                          <CheckCircle className="w-3 h-3 mr-1.5" />
                          Authorized
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1">
                          <XCircle className="w-3 h-3 mr-1.5" />
                          Unauthorized
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="recipient" className="text-sm font-medium text-gray-300">
                        Recipient Address <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="recipient"
                        placeholder="0x..."
                        value={formData.recipientAddress}
                        onChange={(e) => handleInputChange("recipientAddress", e.target.value)}
                        className="bg-gray-800/50 border-gray-700/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 font-mono text-sm transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="issuer" className="text-sm font-medium text-gray-300">
                        Issuer Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="issuer"
                        placeholder="Your organization name"
                        value={formData.issuerName}
                        onChange={(e) => handleInputChange("issuerName", e.target.value)}
                        className="bg-gray-800/50 border-gray-700/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="credentialType" className="text-sm font-medium text-gray-300">
                      Credential Type <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={formData.credentialType}
                      onValueChange={(value) => handleInputChange("credentialType", value)}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-700/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all">
                        <SelectValue placeholder="Select credential type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        {CREDENTIAL_TYPES.map((type) => (
                          <SelectItem key={type} value={type} className="focus:bg-gray-800">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-300">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the credential and achievement..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="bg-gray-800/50 border-gray-700/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm min-h-[100px] transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalData" className="text-sm font-medium text-gray-300">
                      Additional Metadata (JSON)
                    </Label>
                    <Textarea
                      id="additionalData"
                      placeholder='{"project": "DeFi Protocol", "role": "Lead Developer", "skills": ["Solidity", "React"]}'
                      value={formData.additionalData}
                      onChange={(e) => handleInputChange("additionalData", e.target.value)}
                      className={`font-mono text-xs min-h-[100px] transition-all resize-none ${
                        (!!formData.additionalData && !validateJSON(formData.additionalData)) 
                          ? "bg-red-500/5 border-red-500/50 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20" 
                          : "bg-gray-800/50 border-gray-700/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                      }`}
                    />
                    {!!formData.additionalData && !validateJSON(formData.additionalData) && (
                      <p className="text-red-400 text-xs flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Invalid JSON format
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={mintCredential}
                    disabled={
                      isMinting ||
                      !isWhitelisted ||
                      (!!formData.additionalData && !validateJSON(formData.additionalData))
                    }
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 disabled:from-gray-700 disabled:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25 transition-all duration-300 h-12 text-base font-medium"
                    size="lg"
                  >
                    {isMinting ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Minting Credential...
                      </>
                    ) : (
                      <>
                        <Award className="w-5 h-5 mr-2" />
                        Mint SBT Credential
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Mints Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 shadow-2xl sticky top-8">
                <CardHeader className="border-b border-gray-800/50 pb-6">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <Award className="w-5 h-5 text-purple-400" />
                    </div>
                    Recent Mints
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {recentMints.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="inline-flex p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 mb-4">
                        <Award className="w-10 h-10 text-gray-600" />
                      </div>
                      <p className="text-gray-500 text-sm">No recent mints yet</p>
                      <p className="text-gray-600 text-xs mt-1">Your minted credentials will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentMints.map((mint, index) => (
                        <div 
                          key={index} 
                          className="group border border-gray-800/50 bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 hover:border-gray-700/50 hover:bg-gray-800/40 transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2 py-0.5">
                              {mint.credentialType}
                            </Badge>
                            <span className="text-xs text-gray-500 font-mono">#{mint.tokenId}</span>
                          </div>
                          <p className="text-sm font-medium text-gray-200 mb-2">{mint.issuerName}</p>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs text-gray-500">To:</span>
                            <p className="text-xs text-gray-400 font-mono bg-gray-900/50 px-2 py-1 rounded border border-gray-800/50 flex-1 truncate">
                              {mint.recipient.slice(0, 10)}...{mint.recipient.slice(-8)}
                            </p>
                          </div>
                          <div className="flex justify-between items-center pt-3 border-t border-gray-800/50">
                            <span className="text-xs text-gray-500">
                              {new Date(mint.timestamp).toLocaleString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit', 
                                minute: '2-digit'
                              })}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                window.open(blockchainService.getExplorerUrl(mint.recipient, "address"), "_blank")
                              }
                              className="h-7 w-7 p-0 hover:bg-blue-500/10 hover:text-blue-400 transition-all group-hover:opacity-100 opacity-70"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
