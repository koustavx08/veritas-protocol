import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Award, Search, Globe, ArrowRight, Zap, Lock, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white bg-grid-pattern relative overflow-hidden">
      {/* Animated background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float delay-300"></div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16 animate-fade-in-down">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="w-12 h-12 text-blue-500 animate-float" />
            <h1 className="text-5xl md:text-6xl font-bold gradient-text">
              Veritas Protocol
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 animate-fade-in delay-100">
            Privacy-preserving professional credential verification using Soulbound Tokens and Zero-Knowledge Proofs
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in delay-200">
            <Link href="/developer">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 transition-smooth hover:scale-105 hover:shadow-glow-blue btn-glow group">
                <Users className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Developer Portal
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-smooth" />
              </Button>
            </Link>
            <Link href="/explorer">
              <Button size="lg" variant="outline" className="transition-smooth hover:scale-105 hover:bg-gray-800 group">
                <Globe className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Explore Credentials
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Link href="/issuer" className="animate-fade-in-up delay-100">
            <Card className="glass-card card-hover cursor-pointer group h-full border-blue-500/20 hover:border-blue-500/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-smooth">
                    <Award className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-smooth" />
                  </div>
                  <span className="group-hover:text-blue-400 transition-smooth">Issuer Dashboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  Mint Soulbound Tokens for verified professional credentials as a whitelisted issuer.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/developer" className="animate-fade-in-up delay-200">
            <Card className="glass-card card-hover cursor-pointer group h-full border-green-500/20 hover:border-green-500/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-smooth">
                    <Users className="w-6 h-6 text-green-500 group-hover:scale-110 transition-smooth" />
                  </div>
                  <span className="group-hover:text-green-400 transition-smooth">Developer Portal</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  View your credentials and generate zero-knowledge proofs for privacy-preserving verification.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/recruiter" className="animate-fade-in-up delay-300">
            <Card className="glass-card card-hover cursor-pointer group h-full border-purple-500/20 hover:border-purple-500/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-smooth">
                    <Search className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-smooth" />
                  </div>
                  <span className="group-hover:text-purple-400 transition-smooth">Recruiter Portal</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  Create verification requests and validate zero-knowledge proofs from candidates.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/explorer" className="animate-fade-in-up delay-400">
            <Card className="glass-card card-hover cursor-pointer group h-full border-orange-500/20 hover:border-orange-500/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-smooth">
                    <Globe className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-smooth" />
                  </div>
                  <span className="group-hover:text-orange-400 transition-smooth">Credential Explorer</span>
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
        <div className="text-center mb-12 animate-fade-in-up delay-500">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 gradient-text-blue-purple">Why Veritas Protocol?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group animate-scale-in delay-100">
              <div className="p-4 bg-blue-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-500/20 transition-smooth group-hover:scale-110">
                <Lock className="w-8 h-8 text-blue-500 group-hover:animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-smooth">Privacy-First</h3>
              <p className="text-gray-400">
                Zero-knowledge proofs ensure your credentials are verified without revealing sensitive information.
              </p>
            </div>

            <div className="text-center group animate-scale-in delay-200">
              <div className="p-4 bg-green-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-green-500/20 transition-smooth group-hover:scale-110">
                <Shield className="w-8 h-8 text-green-500 group-hover:animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-green-400 transition-smooth">Soulbound Tokens</h3>
              <p className="text-gray-400">
                Non-transferable credentials that are permanently linked to your identity on-chain.
              </p>
            </div>

            <div className="text-center group animate-scale-in delay-300">
              <div className="p-4 bg-purple-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-purple-500/20 transition-smooth group-hover:scale-110">
                <Zap className="w-8 h-8 text-purple-500 group-hover:animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-smooth">Instant Verification</h3>
              <p className="text-gray-400">
                Smart contracts enable instant, trustless verification of professional credentials.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center glass-card rounded-2xl p-8 md:p-12 border border-blue-500/20 animate-fade-in-up delay-600 hover:border-blue-500/40 transition-smooth">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 gradient-text">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join the future of professional credential verification with privacy-preserving technology.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/developer">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 transition-smooth hover:scale-105 hover:shadow-glow-blue btn-glow">
                Connect Wallet & Start
              </Button>
            </Link>
            <Link href="/explorer">
              <Button size="lg" variant="outline" className="transition-smooth hover:scale-105 hover:bg-gray-800">
                Explore Public Registry
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
