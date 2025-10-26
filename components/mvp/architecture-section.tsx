'use client'

export function ArchitectureSection() {
  const steps = [
    {
      number: "01",
        title: "Credential Submission",
        description: "Professionals submit their credentials to whitelisted issuers for verification (universities, bootcamps, employers)"
    },
    {
      number: "02",
        title: "SBT Minting",
        description: "Verified issuers mint non-transferable Soulbound Tokens (SBTs) permanently linked to the credential holder's wallet"
    },
    {
      number: "03",
      title: "ZK Proof Generation",
        description: "Credential holders generate zero-knowledge proofs to selectively reveal qualifications without exposing all details"
    },
    {
      number: "04",
        title: "Proof Verification",
        description: "Recruiters and verifiers check proofs on-chain through smart contracts without accessing private credential data"
    }
  ]

  return (
    <section
      className="py-24 bg-gradient-to-b from-veritas-dark to-veritas-card relative"
      role="region"
      aria-label="Protocol architecture"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-veritas-accent uppercase tracking-wider">
            How It Works
          </span>
          <h2 id="architecture-heading" className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Protocol Architecture
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A clear path from issuer approval to private, on-chain verification—no oversharing, no chasing PDFs.
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-veritas-accent/0 via-veritas-accent/50 to-veritas-accent/0 transform -translate-y-1/2"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Card */}
                <div className="bg-veritas-card border border-veritas-border rounded-xl p-6 hover:border-veritas-accent/50 transition-all duration-300 hover:-translate-y-2 h-full">
                  {/* Step Number */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-5xl font-bold text-veritas-accent/20 group-hover:text-veritas-accent/40 transition-colors">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-full bg-veritas-accent/10 flex items-center justify-center group-hover:bg-veritas-accent/20 transition-colors">
                      <div className="w-3 h-3 rounded-full bg-veritas-accent"></div>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector Arrow (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 rounded-full bg-veritas-card border border-veritas-accent/30 flex items-center justify-center">
                      <svg className="w-4 h-4 text-veritas-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
