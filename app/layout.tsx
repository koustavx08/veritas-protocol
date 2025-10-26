import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { NetworkProvider } from "@/contexts/network-context"
import { Navbar } from "@/components/mvp/navbar"
import { Footer } from "@/components/mvp/footer"

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
      <body className={`${inter.className} bg-veritas-dark text-white antialiased`}>
        <NetworkProvider>
          <Navbar />
          <div className="pt-20">
            {children}
          </div>
          <Footer />
        </NetworkProvider>
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  )
}
