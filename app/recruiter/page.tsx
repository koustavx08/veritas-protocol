"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { RecruiterFilterForm } from "@/components/recruiter-filter-form"
import { Search, CheckCircle, XCircle, Clock, Shield, FileText, ExternalLink, Copy } from "lucide-react"
import { blockchainService } from "@/lib/blockchain"
import { toast } from "sonner"

interface VerificationResult {
  proofId: string
  requestId: string
  isValid: boolean
  timestamp: number
  result: string
  transactionHash?: string
}

export default function RecruiterVerifierPortal() {
  const [isConnected, setIsConnected] = useState(false)
  const [recruiterAddress, setRecruiterAddress] = useState("")
  const [currentRequestId, setCurrentRequestId] = useState("")
  const [proofIdInput, setProofIdInput] = useState("")
  const [verificationResults, setVerificationResults] = useState<VerificationResult[]>([])
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
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
    setRecruiterAddress(address)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setRecruiterAddress("")
    setCurrentRequestId("")
    setVerificationResults([])
  }

  const handleRequestCreated = (requestId: string) => {
    setCurrentRequestId(requestId)
    toast.success(`Verification request created!`)
  }

  const verifyProofById = async () => {
    if (!proofIdInput.trim()) {
      toast.error("Please enter a proof ID to verify")
      return
    }

    setIsVerifying(true)
    try {
      const result = await blockchainService.verifyProofById(proofIdInput.trim())

      if (result) {
        const verificationResult: VerificationResult = {
          proofId: proofIdInput.trim(),
          requestId: currentRequestId || "N/A",
          isValid: result.isVerified,
          timestamp: Date.now(),
          result: result.result,
        }

        setVerificationResults((prev) => [verificationResult, ...prev])
        setProofIdInput("")

        if (result.isVerified) {
          toast.success("✅ Proof verified successfully!")
        } else {
          toast.error("❌ Proof verification failed!")
        }
      } else {
        toast.error("Proof not found or verification failed")
      }
    } catch (error) {
      toast.error("Failed to verify proof")
    } finally {
      setIsVerifying(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  const formatRequestId = (id: string) => {
    if (!id || id === "N/A") return id
    return `${id.slice(0, 8)}...${id.slice(-6)}`
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white bg-dots-pattern relative">
      {/* Animated background elements */}
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-float delay-300"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-down">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <Search className="w-8 h-8 text-purple-500 animate-float" />
              <span className="gradient-text-blue-purple">Recruiter Verifier Portal</span>
            </h1>
            <p className="text-gray-400 mt-2 animate-fade-in delay-100">
                Create verification requests and validate zero-knowledge proofs on Celo Alfajores
            </p>
          </div>
          <div className="animate-fade-in delay-200">
            <WalletConnectButton onConnect={handleConnect} onDisconnect={handleDisconnect} showNetwork />
          </div>
        </div>

        {!isConnected ? (
          <Card className="max-w-md mx-auto glass-card border-purple-500/20 animate-scale-in">
            <CardContent className="text-center py-12">
              <Shield className="w-16 h-16 text-purple-500 mx-auto mb-4 animate-float" />
              <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
              <p className="text-gray-400 mb-6">
                  Connect your wallet to Celo Alfajores to create verification requests and validate proofs.
              </p>
              <WalletConnectButton onConnect={handleConnect} onDisconnect={handleDisconnect} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Request Creation & Verification */}
            <div className="space-y-6">
              <div className="animate-fade-in-up delay-300">
                <RecruiterFilterForm onRequestCreated={handleRequestCreated} />
              </div>

              {/* Active Request Display */}
              {currentRequestId && (
                <Card className="glass-card border-blue-500/20 hover:border-blue-500/40 transition-smooth animate-fade-in-up delay-400">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      Active Request
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Request ID</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="font-mono text-sm bg-gray-800/50 p-2 rounded flex-1 transition-smooth hover:bg-gray-800">
                            {formatRequestId(currentRequestId)}
                          </div>
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(currentRequestId)} className="transition-smooth hover:scale-105">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg animate-fade-in">
                        <p className="text-blue-400 text-sm">
                          Share this request ID with developers so they can submit proofs against your requirements.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Proof Verification */}
              <Card className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-smooth animate-fade-in-up delay-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-500" />
                    Verify Proof by ID
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="proofId" className="text-sm font-medium">
                        Proof ID
                      </Label>
                      <Input
                        id="proofId"
                        placeholder="Enter proof ID to verify..."
                        value={proofIdInput}
                        onChange={(e) => setProofIdInput(e.target.value)}
                        className="mt-1 font-mono transition-smooth focus:border-purple-400"
                      />
                    </div>

                    <Button
                      onClick={verifyProofById}
                      disabled={isVerifying || !proofIdInput.trim()}
                      className="w-full bg-purple-600 hover:bg-purple-700 transition-smooth hover:scale-105 hover:shadow-glow-purple btn-glow disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {isVerifying ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                            Verifying on Alfajores...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Verify Proof
                        </>
                      )}
                    </Button>

                    <div className="p-3 glass-card border-gray-700/50 rounded-lg">
                      <p className="text-gray-400 text-sm">
                        <strong>How it works:</strong> Enter a proof ID that was generated by a developer. The system
                        will check the blockchain to verify if the proof is valid and matches your requirements.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Verification Results */}
            <div className="animate-fade-in-up delay-600">
              <Card className="glass-card border-green-500/20 hover:border-green-500/30 transition-smooth">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Verification Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {verificationResults.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Search className="w-12 h-12 mx-auto mb-2 opacity-50 animate-float" />
                      <p>No verification results yet</p>
                      <p className="text-sm">Create a request and verify proofs to see results here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {verificationResults.map((result, index) => (
                        <div
                          key={`${result.proofId}-${result.timestamp}`}
                          className={`border rounded-lg p-4 transition-smooth hover:scale-[1.02] animate-fade-in ${
                            result.isValid ? "border-green-500/30 bg-green-500/5 hover:border-green-500/50" : "border-red-500/30 bg-red-500/5 hover:border-red-500/50"
                          }`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {result.isValid ? (
                                <CheckCircle className="w-5 h-5 text-green-500 animate-pulse" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                              <Badge
                                variant="secondary"
                                className={`transition-smooth hover:scale-105 ${
                                  result.isValid
                                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                                    : "bg-red-500/10 text-red-400 border-red-500/20"
                                }`}
                              >
                                {result.isValid ? "✅ VALID" : "❌ INVALID"}
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-500">{formatTimestamp(result.timestamp)}</span>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-400">Proof ID: </span>
                              <span className="font-mono">{formatRequestId(result.proofId)}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(result.proofId)}
                                className="ml-2 h-6 w-6 p-0 transition-smooth hover:scale-110"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>

                            {result.requestId !== "N/A" && (
                              <div>
                                <span className="text-gray-400">Request ID: </span>
                                <span className="font-mono">{formatRequestId(result.requestId)}</span>
                              </div>
                            )}

                            <div>
                              <span className="text-gray-400">Result: </span>
                              <span className={result.isValid ? "text-green-400" : "text-red-400"}>
                                {result.result}
                              </span>
                            </div>

                            {result.transactionHash && (
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    window.open(blockchainService.getExplorerUrl(result.transactionHash!), "_blank")
                                  }
                                  className="transition-smooth hover:scale-105"
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                    View on CeloScan
                                </Button>
                              </div>
                            )}
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
