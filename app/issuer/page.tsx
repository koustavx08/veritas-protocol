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
import { Award, Send, Shield, CheckCircle, XCircle, ExternalLink } from "lucide-react"
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
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Award className="w-8 h-8 text-blue-500" />
              Issuer Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
                Mint Soulbound Tokens for verified professional credentials on Celo Alfajores
            </p>
          </div>
          <WalletConnectButton onConnect={handleConnect} onDisconnect={handleDisconnect} showNetwork />
        </div>

        {!isConnected ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
              <p className="text-gray-400 mb-6">
                  Connect your wallet to Celo Alfajores testnet to start issuing credentials.
              </p>
              <WalletConnectButton onConnect={handleConnect} onDisconnect={handleDisconnect} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-green-500" />
                      Mint New Credential
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {checkingWhitelist ? (
                        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400">
                          Checking...
                        </Badge>
                      ) : isWhitelisted ? (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Authorized Issuer
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20">
                          <XCircle className="w-3 h-3 mr-1" />
                          Not Authorized
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="recipient">Recipient Address *</Label>
                      <Input
                        id="recipient"
                        placeholder="0x..."
                        value={formData.recipientAddress}
                        onChange={(e) => handleInputChange("recipientAddress", e.target.value)}
                        className="mt-1 font-mono"
                      />
                    </div>

                    <div>
                      <Label htmlFor="issuer">Issuer Name *</Label>
                      <Input
                        id="issuer"
                        placeholder="Your organization name"
                        value={formData.issuerName}
                        onChange={(e) => handleInputChange("issuerName", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="credentialType">Credential Type *</Label>
                    <Select
                      value={formData.credentialType}
                      onValueChange={(value) => handleInputChange("credentialType", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select credential type" />
                      </SelectTrigger>
                      <SelectContent>
                        {CREDENTIAL_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the credential and achievement..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="additionalData">Additional Metadata (JSON)</Label>
                    <Textarea
                      id="additionalData"
                      placeholder='{"project": "DeFi Protocol", "role": "Lead Developer", "skills": ["Solidity", "React"]}'
                      value={formData.additionalData}
                      onChange={(e) => handleInputChange("additionalData", e.target.value)}
                      className={`mt-1 font-mono text-sm ${
                        (!!formData.additionalData && !validateJSON(formData.additionalData)) ? "border-red-500" : ""
                      }`}
                    />
                    {!!formData.additionalData && !validateJSON(formData.additionalData) && (
                      <p className="text-red-400 text-sm mt-1">Invalid JSON format</p>
                    )}
                  </div>

                  <Button
                    onClick={mintCredential}
                    disabled={
                      isMinting ||
                      !isWhitelisted ||
                      (!!formData.additionalData && !validateJSON(formData.additionalData))
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    {isMinting ? (
                      "Minting Credential..."
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
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Mints</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentMints.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No recent mints</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentMints.map((mint, index) => (
                        <div key={index} className="border border-gray-700 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400">
                              {mint.credentialType}
                            </Badge>
                            <span className="text-xs text-gray-500">#{mint.tokenId}</span>
                          </div>
                          <p className="text-sm text-gray-300 mb-1">{mint.issuerName}</p>
                          <p className="text-xs text-gray-500 font-mono">
                            To: {mint.recipient.slice(0, 8)}...{mint.recipient.slice(-6)}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">
                              {new Date(mint.timestamp).toLocaleTimeString()}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                window.open(blockchainService.getExplorerUrl(mint.recipient, "address"), "_blank")
                              }
                              className="h-6 w-6 p-0"
                            >
                              <ExternalLink className="w-3 h-3" />
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
