'use client'

import { Github, Linkedin, Twitter } from "lucide-react"

export function TeamSection() {
  const team = [
    {
      name: "Core Development Team",
      role: "Engineering & Research",
      avatar: "CT",
        description: "Full-stack developers and cryptography researchers building privacy-preserving verification infrastructure",
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Smart Contract Specialists",
      role: "Blockchain Architecture",
      avatar: "SC",
        description: "Solidity experts focused on gas-optimized, secure SBT contracts and ZK verifier implementations",
      social: {
        github: "#",
        linkedin: "#"
      }
    },
    {
      name: "ZK Research Team",
      role: "Cryptography & Privacy",
      avatar: "ZK",
        description: "Cryptographers developing Noir circuits for selective credential disclosure and proof generation",
      social: {
        github: "#",
        twitter: "#"
      }
    },
    {
      name: "Product & Design",
      role: "User Experience",
      avatar: "PD",
        description: "Designing seamless experiences for issuers, developers, and recruiters interacting with the protocol",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    }
  ]

  return (
    <section className="py-24 bg-veritas-dark relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-veritas-accent uppercase tracking-wider">
            Our Team
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Built by Experts
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A dedicated team of blockchain developers, cryptographers, and designers
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {team.map((member, index) => (
            <div key={index} className="group">
              <div className="bg-veritas-card border border-veritas-border rounded-xl p-6 hover:border-veritas-accent/50 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-veritas-accent to-veritas-accent-alt flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-veritas-dark">
                    {member.avatar}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-veritas-accent transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-veritas-accent text-sm font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-veritas-border">
                  {member.social.github && (
                    <a href={member.social.github} className="text-gray-400 hover:text-veritas-accent transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} className="text-gray-400 hover:text-veritas-accent transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a href={member.social.twitter} className="text-gray-400 hover:text-veritas-accent transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
