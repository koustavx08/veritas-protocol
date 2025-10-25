"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Shield, Zap, CheckCircle, ExternalLink, AlertCircle, Cpu } from "lucide-react"
import { type Credential, blockchainService } from "@/lib/blockchain"
import { zkProofService, type ZKProofInputs } from "@/lib/zk-proof-service"
import { toast } from "sonner"

interface ProofSubmissionModalProps {
  selectedCredentials: Credential[]
  requestId?: string
  onProofSubmitted?: (success: boolean, proofId?: string) => void
}

export function ProofSubmissionModal({ selectedCredentials, requestId, onProofSubmitted }: ProofSubmissionModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [zkProof, setZkProof] = useState<any>(null)
  const [proofJson, setProofJson] = useState("")
  const [submittedProofId, setSubmittedProofId] = useState<string>("")
  const [generationStage, setGenerationStage] = useState("")

  const generateZKProof = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    setGenerationStage("Initializing ZK circuit...")

    try {
      // Stage 1: Initialize ZK service
      await zkProofService.initialize()
      setGenerationProgress(20)
      setGenerationStage("Preparing credential inputs...")

      // Stage 2: Prepare inputs
      await new Promise((resolve) => setTimeout(resolve, 500))
      const userAddress = blockchainService.getAccount()
      if (!userAddress) {
        throw new Error("Wallet not connected")
      }

      const requiredTypes = [...new Set(selectedCredentials.map((c) => c.credentialType))]
      const criteriaHash =
        "0x" +
        Array.from(JSON.stringify(requiredTypes))
          .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join("")
          .slice(0, 64)

      const zkInputs: ZKProofInputs = {
        credentials: selectedCredentials.map((cred) => ({
          tokenId: cred.tokenId,
          credentialType: cred.credentialType,
          metadataHash: cred.metadataHash,
          isValid: cred.isValid,
        })),
        requiredTypes,
        minCredentials: Math.min(requiredTypes.length, selectedCredentials.length),
        criteriaHash,
        userAddress,
      }

      setGenerationProgress(40)
      setGenerationStage("Computing merkle proofs...")

      // Stage 3: Generate merkle proofs
      await new Promise((resolve) => setTimeout(resolve, 800))
      setGenerationProgress(60)
      setGenerationStage("Generating zero-knowledge proof...")

      // Stage 4: Generate ZK proof using Noir circuit
      const proof = await zkProofService.generateZKProof(zkInputs)
      setGenerationProgress(80)
      setGenerationStage("Validating proof structure...")

      // Stage 5: Validate proof
      await new Promise((resolve) => setTimeout(resolve, 500))
      const isValid = await zkProofService.verifyZKProof(proof)
      if (!isValid) {
        throw new Error("Generated proof failed validation")
      }

      setGenerationProgress(100)
      setGenerationStage("Proof generated successfully!")

      setZkProof(proof)
      setProofJson(JSON.stringify(proof, null, 2))

      toast.success("🎉 Zero-Knowledge Proof generated successfully!")
    } catch (error: any) {
      console.error("ZK Proof generation failed:", error)
      toast.error(`Failed to generate ZK proof: ${error.message}`)
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
      setGenerationStage("")
    }
  }

  const submitProof = async () => {
    if (!zkProof) {
      toast.error("No proof to submit")
      return
    }

    if (!requestId) {
      toast.error("No proof request ID provided")
      return
    }

    setIsSubmitting(true)
    try {
      toast.loading("Submitting proof to Avalanche Fuji...", { id: "submit-proof" })

      // Submit the actual ZK proof to the blockchain
  const proofId = await blockchainService.submitProof(requestId, zkProof?.publicInputs?.proofHash, proofJson)

      if (proofId) {
        setSubmittedProofId(proofId)
        onProofSubmitted?.(true, proofId)

        toast.success("✅ Proof submitted to blockchain!", { id: "submit-proof" })

        // Wait for confirmation and check verification result
        setTimeout(async () => {
          const result = await blockchainService.verifyProofById(proofId)
          if (result) {
            const message = result.isVerified
              ? "🎉 Proof verified successfully on-chain!"
              : "❌ Proof verification failed on-chain"

            toast.success(message, { duration: 5000 })
          }
        }, 3000)
      } else {
        onProofSubmitted?.(false)
        toast.error("Failed to submit proof", { id: "submit-proof" })
      }
    } catch (error: any) {
      console.error("Failed to submit proof:", error)
      toast.error(`Failed to submit proof: ${error.message}`, { id: "submit-proof" })
      onProofSubmitted?.(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetModal = () => {
    setZkProof(null)
    setProofJson("")
    setSubmittedProofId("")
    setGenerationProgress(0)
    setGenerationStage("")
  }

  const openInExplorer = () => {
    if (submittedProofId) {
      window.open(blockchainService.getExplorerUrl(submittedProofId), "_blank")
    }
  }

  const copyProofToClipboard = () => {
    navigator.clipboard.writeText(proofJson)
    toast.success("Proof copied to clipboard!")
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          resetModal()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700" disabled={selectedCredentials.length === 0}>
          <Shield className="w-4 h-4 mr-2" />
          Generate ZK Proof
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-500" />
            Zero-Knowledge Proof Generation (Noir Circuit)
          </DialogTitle>
            <DialogDescription>
              Generate a zero-knowledge proof using your selected credentials to verify your qualifications without revealing specific details.
            </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Info */}
          {requestId && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Label className="text-sm font-medium text-blue-400">Proof Request ID</Label>
              <p className="font-mono text-sm mt-1 break-all">{requestId}</p>
            </div>
          )}

          {/* Selected Credentials */}
          <div>
            <Label className="text-sm font-medium">Selected Credentials ({selectedCredentials.length})</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCredentials.map((cred) => (
                <Badge key={cred.tokenId} variant="secondary" className="bg-blue-500/10 text-blue-400">
                  {cred.credentialType} #{cred.tokenId}
                </Badge>
              ))}
            </div>
          </div>

          {/* ZK Circuit Info */}
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <Label className="text-sm font-medium text-purple-400">Noir ZK Circuit</Label>
            </div>
            <p className="text-sm text-gray-300">
              Using <code className="bg-gray-800 px-1 rounded">veritas_credential_proof_v1</code> circuit to generate a
              zero-knowledge proof that you own the required credentials without revealing your identity or specific
              tokens.
            </p>
          </div>

          {/* Proof Generation/Display */}
          {!zkProof ? (
            <div className="text-center py-8">
              {!isGenerating ? (
                <div className="mb-4">
                  <Zap className="w-12 h-12 text-purple-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold">Ready to Generate Proof</h3>
                  <p className="text-gray-400 text-sm max-w-md mx-auto">
                    This will compile your credentials into a zero-knowledge proof using Noir circuits. The process may
                    take 10-30 seconds.
                  </p>
                </div>
              ) : (
                <div className="mb-4">
                  <Loader2 className="w-12 h-12 text-purple-500 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-semibold">Generating ZK Proof...</h3>
                  <p className="text-gray-400 text-sm mb-4">{generationStage}</p>
                  <div className="max-w-md mx-auto">
                    <Progress value={generationProgress} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">{generationProgress}% complete</p>
                  </div>
                </div>
              )}

              <Button onClick={generateZKProof} disabled={isGenerating} className="bg-purple-600 hover:bg-purple-700">
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Proof...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate ZK Proof
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Success Message */}
              <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-400 font-medium">Zero-Knowledge Proof Generated!</span>
              </div>

              {/* Proof Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <Label className="text-xs text-gray-400">Circuit</Label>
                  <p className="font-mono text-xs">{zkProof.metadata.circuit}</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <Label className="text-xs text-gray-400">Version</Label>
                  <p>{zkProof.metadata.version}</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <Label className="text-xs text-gray-400">Credentials</Label>
                  <p>{zkProof.metadata.credentialCount}</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <Label className="text-xs text-gray-400">Timestamp</Label>
                  <p className="text-xs">{new Date(zkProof.metadata.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>

              {/* Proof Display */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Generated Proof (Noir Format)</Label>
                  <Button variant="outline" size="sm" onClick={copyProofToClipboard}>
                    Copy Proof
                  </Button>
                </div>
                <Textarea value={proofJson} readOnly className="font-mono text-xs h-48 bg-gray-900 border-gray-700" />
              </div>

              {/* Public Inputs Display */}
              <div>
                <Label className="text-sm font-medium">Public Inputs</Label>
                <div className="mt-2 p-3 bg-gray-800/50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">Merkle Root:</span>
                      <p className="font-mono break-all">{zkProof.publicInputs.merkleRoot}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Min Credentials:</span>
                      <p>{zkProof.publicInputs.minCredentials}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Criteria Hash:</span>
                      <p className="font-mono break-all">{zkProof.publicInputs.criteriaHash}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Proof Hash:</span>
                      <p className="font-mono break-all">{zkProof.publicInputs.proofHash}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {!submittedProofId ? (
                  <>
                    <Button
                      onClick={submitProof}
                      disabled={isSubmitting || !requestId}
                      className="bg-green-600 hover:bg-green-700 flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting to Fuji...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Submit to Blockchain
                        </>
                      )}
                    </Button>

                    <Button variant="outline" onClick={resetModal} disabled={isSubmitting}>
                      Regenerate
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Proof submitted to Avalanche Fuji!</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={openInExplorer}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Explorer
                    </Button>
                  </div>
                )}
              </div>

              {/* Technical Note */}
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-yellow-400 font-medium mb-1">Production Implementation</p>
                    <p className="text-gray-300">
                      This demo uses simulated Noir circuits. In production, the actual compiled Noir WASM would be
                      loaded and executed in the browser, generating cryptographically secure zero-knowledge proofs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
