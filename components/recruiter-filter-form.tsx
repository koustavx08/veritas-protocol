"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, Search, Filter } from "lucide-react"
import { blockchainService } from "@/lib/blockchain"
import { toast } from "sonner"

interface RecruiterFilterFormProps {
  onRequestCreated?: (requestId: string) => void
}

const COMMON_CREDENTIALS = [
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

export function RecruiterFilterForm({ onRequestCreated }: RecruiterFilterFormProps) {
  const [requiredCredentials, setRequiredCredentials] = useState<string[]>([])
  const [customCredential, setCustomCredential] = useState("")
  const [description, setDescription] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const addCredential = (credential: string) => {
    if (credential && !requiredCredentials.includes(credential)) {
      setRequiredCredentials([...requiredCredentials, credential])
      setCustomCredential("")
    }
  }

  const removeCredential = (credential: string) => {
    setRequiredCredentials(requiredCredentials.filter((c) => c !== credential))
  }

  const createRequest = async () => {
    if (requiredCredentials.length === 0) {
      toast.error("Please add at least one required credential")
      return
    }

    setIsCreating(true)
    try {
      const requestId = await blockchainService.createProofRequest(requiredCredentials)
      if (requestId) {
        onRequestCreated?.(requestId)
        // Reset form
        setRequiredCredentials([])
        setDescription("")
        toast.success("Verification request created successfully!")
      }
    } catch (error) {
      toast.error("Failed to create verification request")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-500" />
          Create Verification Request
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium">Job Description (Optional)</Label>
          <Textarea
            placeholder="Describe the role and requirements..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Required Credentials</Label>

          {/* Common credentials */}
          <div className="mt-2">
            <p className="text-xs text-gray-400 mb-2">Quick Add:</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_CREDENTIALS.map((credential) => (
                <Button
                  key={credential}
                  variant="outline"
                  size="sm"
                  onClick={() => addCredential(credential)}
                  disabled={requiredCredentials.includes(credential)}
                  className="text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {credential}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom credential input */}
          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Add custom credential..."
              value={customCredential}
              onChange={(e) => setCustomCredential(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCredential(customCredential)}
            />
            <Button variant="outline" onClick={() => addCredential(customCredential)} disabled={!customCredential}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Selected credentials */}
          {requiredCredentials.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">Required Credentials:</p>
              <div className="flex flex-wrap gap-2">
                {requiredCredentials.map((credential) => (
                  <Badge
                    key={credential}
                    variant="secondary"
                    className="bg-blue-500/10 text-blue-400 border-blue-500/20 pr-1"
                  >
                    {credential}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCredential(credential)}
                      className="ml-1 h-auto p-0 hover:bg-transparent"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={createRequest}
          disabled={isCreating || requiredCredentials.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isCreating ? (
            "Creating Request..."
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Create Verification Request
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
