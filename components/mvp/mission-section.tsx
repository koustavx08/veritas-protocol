'use client'

import { Shield, Eye, Scale, BadgeCheck, Stamp, Fingerprint } from "lucide-react"

export function MissionSection() {
  return (
    <section className="py-24 bg-veritas-dark relative overflow-hidden" role="region" aria-label="Mission">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-veritas-accent/5 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="inline-block">
              <span className="text-sm font-semibold text-veritas-accent uppercase tracking-wider">
                Our Mission
              </span>
              <div className="h-1 w-12 bg-veritas-accent mt-2"></div>
            </div>

            <h2 id="mission-heading" className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Privacy-Preserving Professional Verification
            </h2>

            <p className="text-lg text-gray-400 leading-relaxed">
                Veritas Protocol revolutionizes how professional credentials are verified on-chain. Using Soulbound Tokens (SBTs) 
                and Zero-Knowledge Proofs, we enable credential holders to prove their qualifications without exposing sensitive personal data.
            </p>

            <div className="space-y-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-veritas-accent/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-veritas-accent" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Privacy Protection</h3>
                  <p className="text-gray-400">
                      Zero-knowledge proofs let you verify credentials without revealing personal information or specific details.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-veritas-accent/10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-veritas-accent" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Immutable Records</h3>
                  <p className="text-gray-400">
                      Soulbound Tokens create permanent, non-transferable credentials stored on the blockchain with complete audit trails.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-veritas-accent/10 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-veritas-accent" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Decentralized Trust</h3>
                  <p className="text-gray-400">
                      Whitelisted issuers and smart contract validation ensure only verified credentials are issued and trusted.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-veritas-accent/20 to-veritas-accent-alt/20 p-1">
              <div className="w-full h-full rounded-2xl bg-veritas-card p-8 flex items-center justify-center">
                {/* Human-crafted visual: a simple, readable verification flow */}
                <div
                  role="group"
                  aria-label="Credential verification flow"
                  className="w-full max-w-md mx-auto"
                >
                  <div className="grid grid-cols-[24px_1fr] gap-x-4">
                    {/* Step 1 */}
                    <div className="relative pt-2">
                      <div className="w-3 h-3 rounded-full bg-veritas-accent"></div>
                      <div className="absolute left-1.5 top-5 bottom-0 w-px bg-veritas-accent/30"></div>
                    </div>
                    <div className="pb-6">
                      <div className="rounded-lg border border-veritas-border bg-veritas-dark/60 backdrop-blur-sm p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-md bg-veritas-accent/10 text-veritas-accent flex items-center justify-center">
                            <BadgeCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold leading-snug">Issuer verifies</h4>
                            <p className="text-sm text-gray-400">A trusted university or employer validates the claim.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative pt-2">
                      <div className="w-3 h-3 rounded-full bg-veritas-accent"></div>
                      <div className="absolute left-1.5 top-5 bottom-0 w-px bg-veritas-accent/30"></div>
                    </div>
                    <div className="pb-6">
                      <div className="rounded-lg border border-veritas-border bg-veritas-dark/60 backdrop-blur-sm p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-md bg-veritas-accent/10 text-veritas-accent flex items-center justify-center">
                            <Stamp className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold leading-snug">SBT minted</h4>
                            <p className="text-sm text-gray-400">A non‑transferable credential is linked to the holder’s wallet.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative pt-2">
                      <div className="w-3 h-3 rounded-full bg-veritas-accent"></div>
                    </div>
                    <div>
                      <div className="rounded-lg border border-veritas-border bg-veritas-dark/60 backdrop-blur-sm p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-md bg-veritas-accent/10 text-veritas-accent flex items-center justify-center">
                            <Fingerprint className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold leading-snug">Private proof</h4>
                            <p className="text-sm text-gray-400">Share a zero‑knowledge proof instead of raw documents.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
