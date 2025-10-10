"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Calendar, User, Hash, Activity } from "lucide-react"
import { blockchainService } from "@/lib/blockchain"

interface CredentialEvent {
  tokenId: string
  recipient: string
  credentialType: string
  issuerName: string
  timestamp: number
  metadataHash: string
  blockNumber: number
}

export function EventFeed() {
  const [events, setEvents] = useState<CredentialEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const recentEvents = await blockchainService.getRecentCredentials(20)
      setEvents(recentEvents)
    } catch (error) {
      console.error("Failed to load events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshEvents = async () => {
    setIsRefreshing(true)
    await loadEvents()
    setIsRefreshing(false)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            Recent Credential Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            Recent Credential Activity
          </CardTitle>
          <Button variant="outline" size="sm" onClick={refreshEvents} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No recent credential activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event, index) => (
              <div
                key={`${event.tokenId}-${event.blockNumber}`}
                className="border border-gray-700 rounded-lg p-4 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                      {event.credentialType}
                    </Badge>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                      <User className="w-3 h-3" />
                      <span>by {event.issuerName}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Block #{event.blockNumber}</div>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <User className="w-3 h-3" />
                    <span className="font-mono">To: {formatAddress(event.recipient)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(event.timestamp)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500">
                    <Hash className="w-3 h-3" />
                    <span className="font-mono text-xs">{formatHash(event.metadataHash)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
