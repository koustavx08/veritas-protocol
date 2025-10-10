"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Calendar, User, Hash } from "lucide-react"
import type { Credential } from "@/lib/blockchain"

interface CredentialCardProps {
  credential: Credential
  onSelect?: (credential: Credential) => void
  isSelected?: boolean
  showSelectButton?: boolean
}

export function CredentialCard({
  credential,
  onSelect,
  isSelected = false,
  showSelectButton = false,
}: CredentialCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`
  }

  return (
    <Card
      className={`transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500 bg-blue-500/5" : "hover:shadow-lg hover:shadow-blue-500/10"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-white">{credential.credentialType}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">{credential.issuerName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {credential.isValid ? (
              <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                <CheckCircle className="w-3 h-3 mr-1" />
                Valid
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20">
                <XCircle className="w-3 h-3 mr-1" />
                Revoked
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>Issued: {formatDate(credential.timestamp)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Hash className="w-4 h-4" />
          <span className="font-mono">ID: {credential.tokenId}</span>
        </div>

        <div className="text-xs text-gray-500 font-mono">Hash: {formatHash(credential.metadataHash)}</div>

        {showSelectButton && (
          <Button
            variant={isSelected ? "secondary" : "outline"}
            size="sm"
            onClick={() => onSelect?.(credential)}
            className="w-full mt-3"
          >
            {isSelected ? "Selected" : "Select for Proof"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
