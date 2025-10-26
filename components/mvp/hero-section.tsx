'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield } from "lucide-react"
import Link from "next/link"
import { SUPPORTED_NETWORKS } from "@/lib/networks"

export function HeroSection() {
  const networkNames = SUPPORTED_NETWORKS.map((n) => n.name)
  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      role="region"
      aria-label="Hero"
    >
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-veritas-dark via-veritas-card to-veritas-dark"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        {/* Logo Badge */}
        {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-veritas-card/60 border border-veritas-border backdrop-blur-sm">
          <Shield className="w-4 h-4 text-veritas-accent" aria-hidden="true" />
          <span className="text-sm text-veritas-soft font-medium">Veritas Protocol</span>
        </div> */}

        {/* Main Heading */}
        <h1 id="hero-heading" className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
          <span className="block text-white leading-tight">Redefining Trust</span>
          <span className="block bg-gradient-to-r from-veritas-accent to-veritas-accent-alt bg-clip-text text-transparent leading-tight">
              in Professional Credentials
          </span>
          <span className="block text-white text-4xl md:text-5xl lg:text-6xl mt-2 leading-tight">
            — Onchain.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Verify credentials without oversharing. Soulbound Tokens and zero‑knowledge proofs keep what’s private, private—while recruiters still get the confidence they need.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/developer">
            <Button 
              size="lg" 
              className="bg-veritas-accent hover:bg-veritas-accent/90 text-veritas-dark font-semibold px-8 py-6 text-base group transition-all duration-300 hover:scale-105 hover:shadow-glow-green"
            >
              Connect Wallet
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <Link href="/explorer">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-veritas-border hover:border-veritas-accent bg-transparent text-white px-8 py-6 text-base backdrop-blur-sm transition-all duration-300 hover:bg-veritas-accent/5"
            >
              Explore Protocol
            </Button>
          </Link>
        </div>

        {/* Trust and context chips */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-veritas-card/60 border border-veritas-border text-gray-300">Zero‑knowledge proofs</span>
          <span className="px-3 py-1 rounded-full bg-veritas-card/60 border border-veritas-border text-gray-300">Soulbound tokens</span>
          <span className="px-3 py-1 rounded-full bg-veritas-card/60 border border-veritas-border text-gray-300">
            Testnets: {networkNames.join(' • ')}
          </span>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-veritas-dark to-transparent"></div>
    </section>
  )
}
