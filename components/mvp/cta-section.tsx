'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, Mail } from "lucide-react"
import Link from "next/link"
import { SUPPORTED_NETWORKS } from "@/lib/networks"

export function CTASection() {
  const supportedChains = SUPPORTED_NETWORKS.length
  return (
    <section
      className="py-24 bg-gradient-to-br from-veritas-dark via-veritas-card to-veritas-dark relative overflow-hidden"
      role="region"
      aria-label="Call to action"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-veritas-accent/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA Card */}
          <div className="bg-gradient-to-r from-veritas-accent/10 to-veritas-accent-alt/10 border border-veritas-accent/30 rounded-2xl p-12 text-center backdrop-blur-sm">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Build with Veritas?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Verify credentials without oversharing. Connect your wallet to issue, hold, or verify professional credentials in minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/developer">
                <Button 
                  size="lg" 
                  className="bg-veritas-accent hover:bg-veritas-accent/90 text-veritas-dark font-semibold px-8 py-6 text-base group transition-all duration-300 hover:scale-105"
                >
                  Connect Wallet
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="mailto:contact@veritasprotocol.xyz">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-veritas-border hover:border-veritas-accent bg-transparent text-white px-8 py-6 text-base backdrop-blur-sm transition-all duration-300"
                >
                  <Mail className="mr-2 w-5 h-5" />
                  Email the team
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-veritas-border/30">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-veritas-accent mb-2">{supportedChains}</div>
                <div className="text-sm text-gray-400">Supported testnets</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-veritas-accent mb-2">Zero‑knowledge</div>
                <div className="text-sm text-gray-400">Proof-based verification</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-veritas-accent mb-2">Private by design</div>
                <div className="text-sm text-gray-400">Selective disclosure via ZK</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
