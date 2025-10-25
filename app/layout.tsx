import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { NetworkProvider } from "@/contexts/network-context"
import Link from "next/link"
import { Shield, Github, Twitter } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Veritas Protocol - Privacy-Preserving Credential Verification",
  description:
    "Decentralized application for privacy-preserving professional credential verification using Soulbound Tokens and Zero-Knowledge Proofs",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        {/* Navigation */}
        <nav className="border-b border-gray-800/50 glass sticky top-0 z-50 animate-fade-in-down">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl group transition-smooth">
                <Shield className="w-6 h-6 text-blue-500 group-hover:animate-pulse transition-smooth" />
                <span className="group-hover:text-blue-400 transition-smooth">Veritas Protocol</span>
              </Link>

              <div className="hidden md:flex items-center gap-6">
                <Link href="/issuer" className="text-gray-300 hover:text-blue-400 transition-smooth relative group">
                  <span>Issuer</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/developer" className="text-gray-300 hover:text-green-400 transition-smooth relative group">
                  <span>Developer</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/recruiter" className="text-gray-300 hover:text-purple-400 transition-smooth relative group">
                  <span>Recruiter</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/explorer" className="text-gray-300 hover:text-orange-400 transition-smooth relative group">
                  <span>Explorer</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/veritas-protocol/veritas-protocol-dapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-smooth hover:scale-110"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com/veritasprotocol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-smooth hover:scale-110"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </nav>

        <NetworkProvider>
          {children}
        </NetworkProvider>

        {/* Footer */}
        <footer className="border-t border-gray-800/50 glass mt-16 animate-fade-in">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-2 mb-4 md:mb-0 group">
                <Shield className="w-5 h-5 text-blue-500 group-hover:animate-pulse transition-smooth" />
                <span className="font-semibold">Veritas Protocol</span>
                <span className="text-gray-400">© 2025</span>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span className="hover:text-gray-300 transition-smooth cursor-default">Privacy-Preserving Credential Verification</span>
                <span className="hidden md:inline">•</span>
                <span className="hover:text-gray-300 transition-smooth cursor-default">Built with Zero-Knowledge Proofs</span>
                <span className="hidden md:inline">•</span>
                <span className="hover:text-gray-300 transition-smooth cursor-default">Powered by Soulbound Tokens</span>
              </div>
            </div>
          </div>
        </footer>

        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  )
}
