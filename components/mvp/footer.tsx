'use client'

import Link from "next/link"
import { Shield, Github, Twitter, Mail, FileText } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: "Issuer Portal", href: "/issuer" },
      { name: "Developer Portal", href: "/developer" },
      { name: "Recruiter Portal", href: "/recruiter" },
      { name: "Explorer", href: "/explorer" }
    ],
    resources: [
      { name: "Documentation", href: "#" },
      { name: "GitHub", href: "https://github.com/veritas-protocol" },
      { name: "Whitepaper", href: "#" },
      { name: "Blog", href: "#" }
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" }
    ]
  }

  return (
    <footer className="bg-veritas-card border-t border-veritas-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-lg bg-veritas-accent/10 flex items-center justify-center group-hover:bg-veritas-accent/20 transition-colors">
                <Shield className="w-6 h-6 text-veritas-accent" />
              </div>
              <span className="text-xl font-bold text-white">Veritas Protocol</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Privacy-preserving professional credential verification using Soulbound Tokens and Zero-Knowledge Proofs.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/veritas-protocol" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-veritas-dark border border-veritas-border flex items-center justify-center hover:border-veritas-accent hover:bg-veritas-accent/10 transition-all"
              >
                <Github className="w-5 h-5 text-gray-400 hover:text-veritas-accent transition-colors" />
              </a>
              <a 
                href="https://twitter.com/veritasprotocol" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-veritas-dark border border-veritas-border flex items-center justify-center hover:border-veritas-accent hover:bg-veritas-accent/10 transition-all"
              >
                <Twitter className="w-5 h-5 text-gray-400 hover:text-veritas-accent transition-colors" />
              </a>
              <a 
                href="mailto:contact@veritasprotocol.xyz"
                className="w-10 h-10 rounded-lg bg-veritas-dark border border-veritas-border flex items-center justify-center hover:border-veritas-accent hover:bg-veritas-accent/10 transition-all"
              >
                <Mail className="w-5 h-5 text-gray-400 hover:text-veritas-accent transition-colors" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-veritas-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-veritas-accent transition-colors text-sm"
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-veritas-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-veritas-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} Veritas Protocol. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-veritas-accent animate-pulse"></div>
                Built on Web3
              </span>
              <span>•</span>
              <span>Powered by Zero-Knowledge Proofs</span>
              <span>•</span>
              <span>Privacy First</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
