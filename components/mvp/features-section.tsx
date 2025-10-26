'use client'

import { Network, FileText, User, Users, Lock, CheckCircle } from "lucide-react"
import Link from "next/link"

export function FeaturesSection() {
  const features = [
    {
      icon: Network,
        title: "Multi-Chain Support",
        description: "Deployed on Avalanche Fuji and Celo Alfajores testnets with support for multiple blockchain networks.",
      color: "veritas-accent",
      href: "/explorer"
    },
    {
      icon: FileText,
        title: "Soulbound Tokens",
        description: "Non-transferable ERC-721 tokens that permanently link verified credentials to wallet addresses.",
      color: "blue-500",
      href: "/issuer"
    },
    {
      icon: User,
        title: "Credential Privacy",
        description: "Zero-knowledge proofs allow selective disclosure of credential attributes without revealing everything.",
      color: "purple-500",
      href: "/developer"
    },
    {
      icon: Users,
        title: "Whitelisted Issuers",
        description: "Only verified and trusted issuers can mint credentials, ensuring authenticity and preventing fraud.",
      color: "emerald-500",
      href: "/recruiter"
    },
    {
      icon: Lock,
      title: "Zero-Knowledge Proofs",
        description: "Prove you have a credential (e.g., degree, certification) without revealing specific details or metadata.",
      color: "veritas-accent-alt",
      href: "/developer"
    },
    {
      icon: CheckCircle,
        title: "Immutable Verification",
        description: "Once issued, credentials cannot be transferred or faked, creating a permanent on-chain record.",
      color: "orange-500",
      href: "/explorer"
    }
  ]

  return (
    <section className="py-24 bg-veritas-card relative" role="region" aria-label="Core features">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-veritas-accent uppercase tracking-wider">
            Core Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Built for Trust & Transparency
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Practical infrastructure for issuers, developers, and recruiters—focused on real hiring and credentialing needs.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Link 
                key={index} 
                href={feature.href}
                className="group"
                aria-label={`${feature.title} — learn more`}
              >
                <div className="h-full bg-veritas-dark border border-veritas-border rounded-xl p-8 hover:border-veritas-accent/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-lg bg-veritas-accent/10 flex items-center justify-center mb-6 group-hover:bg-veritas-accent/20 transition-colors">
                    <Icon className="w-7 h-7 text-veritas-accent" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-veritas-accent transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Arrow */}
                  <div className="mt-4 flex items-center text-veritas-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-semibold">Learn more</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
