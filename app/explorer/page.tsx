"use client"

import { useState, useEffect, useContext } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Globe, Search, TrendingUp, Activity, RefreshCw, Filter } from "lucide-react"
import { blockchainService, type CredentialEvent, type VerificationEvent } from "@/lib/blockchain"
import { useNetwork } from "@/contexts/network-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { NetworkConfig } from "@/lib/networks"

export default function CredentialExplorer() {
  const { currentNetwork } = useNetwork()
  const [searchQuery, setSearchQuery] = useState("")
  const [credentialEvents, setCredentialEvents] = useState<CredentialEvent[]>([])
  const [verificationEvents, setVerificationEvents] = useState<VerificationEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCredentials: 0,
    thisWeek: 0,
    activeIssuers: 0,
    verifications: 0,
  })

  useEffect(() => {
    loadEvents()

    // Poll every 30 seconds
    const interval = setInterval(loadEvents, 30000)
    return () => clearInterval(interval)
  }, [currentNetwork])

  const loadEvents = async () => {
    try {
      setIsLoading(true)
      const [credentials, verifications] = await Promise.all([
        blockchainService.getRecentCredentialEvents(50),
        blockchainService.getRecentVerificationEvents(50),
      ])

      setCredentialEvents(credentials)
      setVerificationEvents(verifications)

      // Stats
      const now = Date.now()
      const weekAgo = now - 7 * 24 * 60 * 60 * 1000

      const thisWeekCredentials = credentials.filter(
        (event) => event.timestamp * 1000 > weekAgo
      ).length

      const uniqueIssuers = new Set(credentials.map((event) => event.issuer)).size

      setStats({
        totalCredentials: credentials.length,
        thisWeek: thisWeekCredentials,
        activeIssuers: uniqueIssuers,
        verifications: verifications.length,
      })
    } catch (error) {
      console.error("Failed to load events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    const filtered = credentialEvents.filter(
      (event) =>
        event.credentialType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.issuerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.metadataHash.includes(searchQuery) ||
        event.recipient.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (filtered.length > 0) {
      console.log(`Found ${filtered.length} matching events`)
    } else {
      console.log("No matching events found")
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`
  }

  const getNetworkDisplayName = (networkKey?: string): string => {
    return currentNetwork.name;
  }

  const getNetworkBadgeColor = (networkKey?: string): string => {
    return "bg-purple-500/10 text-purple-400 border-purple-500/20";
  }

  const filteredCredentialEvents = credentialEvents;

  const filteredVerificationEvents = verificationEvents;

  return (
    <div className="min-h-screen bg-gray-900 text-white bg-grid-pattern relative">
      {/* Animated background elements */}
      <div className="absolute top-20 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-1/3 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-float delay-300"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-down">
          <h1 className="text-4xl md:text-5xl font-bold flex items-center justify-center gap-3 mb-4">
            <Globe className="w-10 h-10 text-blue-500 animate-float" />
            <span className="gradient-text">Credential Explorer</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto animate-fade-in delay-100">
          Explore the public registry of professional credentials on Celo Alfajores Testnet
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8 glass-card border-blue-500/20 hover:border-blue-500/30 transition-smooth animate-fade-in-up delay-200">
          <CardContent className="p-6">
            <div className="flex gap-4 flex-wrap">
              <Input
                placeholder="Search by credential type, issuer, address, or hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-[200px] transition-smooth focus:border-blue-400"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <div className="px-3 py-2 glass-card border border-gray-700 rounded-md text-sm hover:border-blue-500/30 transition-smooth">
                  {currentNetwork.name}
                </div>
              </div>
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 transition-smooth hover:scale-105 hover:shadow-glow-blue btn-glow">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" onClick={loadEvents} disabled={isLoading} className="transition-smooth hover:scale-105">
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card border-blue-500/20 hover:border-blue-500/40 transition-smooth card-hover animate-fade-in-up delay-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-lg transition-smooth hover:bg-blue-500/20">
                  <Activity className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalCredentials}</p>
                  <p className="text-gray-400 text-sm">Total Credentials</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-green-500/20 hover:border-green-500/40 transition-smooth card-hover animate-fade-in-up delay-400">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/10 rounded-lg transition-smooth hover:bg-green-500/20">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.thisWeek}</p>
                  <p className="text-gray-400 text-sm">This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-indigo-500/20 hover:border-indigo-500/40 transition-smooth card-hover animate-fade-in-up delay-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/10 rounded-lg transition-smooth hover:bg-indigo-500/20">
                  <Globe className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeIssuers}</p>
                  <p className="text-gray-400 text-sm">Active Issuers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-yellow-500/20 hover:border-yellow-500/40 transition-smooth card-hover animate-fade-in-up delay-600">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-500/10 rounded-lg transition-smooth hover:bg-yellow-500/20">
                  <Search className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.verifications}</p>
                  <p className="text-gray-400 text-sm">Verifications</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card border-purple-500/20 hover:border-purple-500/30 transition-smooth animate-fade-in-up delay-700">
            <CardContent>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Recent Credentials
              </h2>
              <div className="space-y-4">
                {filteredCredentialEvents.length === 0 && !isLoading && (
                  <div className="text-center py-8">
                    <Globe className="w-12 h-12 mx-auto mb-2 opacity-50 text-gray-500 animate-float" />
                    <p className="text-gray-400">No credentials found.</p>
                  </div>
                )}

                {filteredCredentialEvents.map((ev, index) => (
                  <div 
                    key={`${ev.metadataHash}-${ev.recipient}-${ev.network || ''}`} 
                    className="p-4 glass-card border border-gray-700/50 rounded-lg hover:border-blue-500/30 transition-smooth animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-medium">
                            {ev.credentialType}{" "}
                            <span className="text-sm text-gray-400">by {ev.issuerName}</span>
                          </p>
                          {ev.network && (
                            <Badge className={`${getNetworkBadgeColor(ev.network)} transition-smooth hover:scale-105`}>
                              {getNetworkDisplayName(ev.network)}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">
                          Recipient: {formatAddress(ev.recipient)}
                        </p>
                        <p className="text-xs text-gray-500">Hash: {formatHash(ev.metadataHash)}</p>
                      </div>
                      <div className="text-right text-sm text-gray-400">
                        <div>{new Date(ev.timestamp * 1000).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-green-500/20 hover:border-green-500/30 transition-smooth animate-fade-in-up delay-800">
            <CardContent>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-green-400" />
                Recent Verifications
              </h2>
              <div className="space-y-4">
                {filteredVerificationEvents.length === 0 && !isLoading && (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 mx-auto mb-2 opacity-50 text-gray-500 animate-float" />
                    <p className="text-gray-400">No verifications found.</p>
                  </div>
                )}

                {filteredVerificationEvents.map((v, index) => (
                  <div 
                    key={`${v.proofId}-${v.timestamp}-${v.network || ''}`} 
                    className="p-4 glass-card border border-gray-700/50 rounded-lg hover:border-green-500/30 transition-smooth animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-medium">Verified: Credential</p>
                          {v.network && (
                            <Badge className={`${getNetworkBadgeColor(v.network)} transition-smooth hover:scale-105`}>
                              {getNetworkDisplayName(v.network)}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">By: {formatAddress(v.prover)}</p>
                        <p className="text-xs text-gray-500">Proof ID: {formatHash(v.proofId)}</p>
                      </div>
                      <div className="text-right text-sm text-gray-400">
                        <div>{new Date(v.timestamp * 1000).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}