'use client'

import { CheckCircle, Circle } from "lucide-react"

export function RoadmapSection() {
  const phases = [
    {
      phase: "Phase 1",
      title: "MVP Launch",
      status: "in-progress",
      quarter: "Q1 2025",
      items: [
        "Soulbound Token (SBT) implementation",
        "Basic ZK proof generation",
        "Multi-chain deployment (Avalanche Fuji, Celo Alfajores)",
        "Issuer, Developer, and Recruiter portals",
          "Whitelisted issuer system with access control"
      ]
    },
    {
      phase: "Phase 2",
        title: "Enhanced Verification",
      status: "planned",
      quarter: "Q2 2025",
      items: [
          "Advanced credential types (degrees, certifications, work history)",
          "Revocable credentials with reason tracking",
        "Advanced ZK proof circuits (Noir integration)",
          "Selective attribute disclosure",
          "Credential metadata encryption"
      ]
    },
    {
      phase: "Phase 3",
      title: "Cross-Chain Interoperability",
      status: "planned",
      quarter: "Q3 2025",
      items: [
        "Cross-chain credential verification",
        "Multi-network SBT synchronization",
          "Universal credential format standards",
        "Bridge integrations for major L1/L2 networks",
          "Unified credential explorer across all chains"
      ]
    },
    {
      phase: "Phase 4",
        title: "Enterprise Integration",
      status: "future",
      quarter: "Q4 2025",
      items: [
          "Enterprise issuer dashboard for universities/companies",
          "API for HR systems and recruitment platforms",
          "Batch credential issuance",
          "Credential analytics and verification statistics",
        "Mobile application launch"
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'text-veritas-accent'
      case 'planned':
        return 'text-blue-400'
      case 'future':
        return 'text-gray-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'bg-veritas-accent/10 border-veritas-accent/30'
      case 'planned':
        return 'bg-blue-500/10 border-blue-500/30'
      case 'future':
        return 'bg-gray-500/10 border-gray-500/30'
      default:
        return 'bg-gray-500/10 border-gray-500/30'
    }
  }

  return (
    <section className="py-24 bg-gradient-to-b from-veritas-card to-veritas-dark relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-veritas-accent/5 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-veritas-accent uppercase tracking-wider">
            Roadmap
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Building the Future
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Our journey towards creating the most trusted credential verification protocol in Web3
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="space-y-8">
            {phases.map((phase, index) => (
              <div key={index} className="relative">
                {/* Timeline Connector */}
                {index < phases.length - 1 && (
                  <div className="hidden md:block absolute left-8 top-24 bottom-0 w-0.5 bg-gradient-to-b from-veritas-accent/50 to-transparent transform translate-y-8"></div>
                )}

                <div className="grid md:grid-cols-12 gap-6 items-start">
                  {/* Quarter & Phase Label */}
                  <div className="md:col-span-3">
                    <div className="flex items-center gap-4 md:flex-col md:items-start">
                      {/* Timeline Dot */}
                      <div className={`flex-shrink-0 w-16 h-16 rounded-full border-2 ${getStatusBg(phase.status)} flex items-center justify-center backdrop-blur-sm`}>
                        {phase.status === 'in-progress' ? (
                          <div className="w-3 h-3 rounded-full bg-veritas-accent animate-pulse"></div>
                        ) : (
                          <Circle className={`w-6 h-6 ${getStatusColor(phase.status)}`} />
                        )}
                      </div>
                      
                      <div>
                        <span className={`text-sm font-semibold uppercase tracking-wider ${getStatusColor(phase.status)}`}>
                          {phase.quarter}
                        </span>
                        <p className="text-xs text-gray-500 uppercase mt-1">{phase.phase}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="md:col-span-9">
                    <div className="bg-veritas-card border border-veritas-border rounded-xl p-6 hover:border-veritas-accent/30 transition-all duration-300">
                      {/* Status Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-white">
                          {phase.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusBg(phase.status)} ${getStatusColor(phase.status)}`}>
                          {phase.status === 'in-progress' ? 'In Progress' : phase.status === 'planned' ? 'Planned' : 'Future'}
                        </span>
                      </div>

                      {/* Deliverables */}
                      <ul className="space-y-3">
                        {phase.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3 text-gray-400">
                            <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${phase.status === 'in-progress' ? 'text-veritas-accent' : 'text-gray-600'}`} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
