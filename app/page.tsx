import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Award, Search, Globe, ArrowRight, Zap, Lock, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="w-12 h-12 text-blue-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Veritas Protocol
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Privacy-preserving professional credential verification using Soulbound Tokens and Zero-Knowledge Proofs
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/developer">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Users className="w-5 h-5 mr-2" />
                Developer Portal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/explorer">
              <Button size="lg" variant="outline">
                <Globe className="w-5 h-5 mr-2" />
                Explore Credentials
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Link href="/issuer">
            <Card className="hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                  Issuer Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  Mint Soulbound Tokens for verified professional credentials as a whitelisted issuer.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/developer">
            <Card className="hover:shadow-lg hover:shadow-green-500/10 transition-all duration-200 cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
                  Developer Portal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  View your credentials and generate zero-knowledge proofs for privacy-preserving verification.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/recruiter">
            <Card className="hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200 cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Search className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform" />
                  Recruiter Portal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  Create verification requests and validate zero-knowledge proofs from candidates.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/explorer">
            <Card className="hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-200 cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform" />
                  Credential Explorer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  Explore the public registry of professional credentials and recent activity.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Key Features */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-8">Why Veritas Protocol?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-4 bg-blue-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Lock className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Privacy-First</h3>
              <p className="text-gray-400">
                Zero-knowledge proofs ensure your credentials are verified without revealing sensitive information.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-green-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Soulbound Tokens</h3>
              <p className="text-gray-400">
                Non-transferable credentials that are permanently linked to your identity on-chain.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-purple-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Verification</h3>
              <p className="text-gray-400">
                Smart contracts enable instant, trustless verification of professional credentials.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-500/20">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-6">
            Join the future of professional credential verification with privacy-preserving technology.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/developer">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Connect Wallet & Start
              </Button>
            </Link>
            <Link href="/explorer">
              <Button size="lg" variant="outline">
                Explore Public Registry
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
