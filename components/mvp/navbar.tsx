'use client'

import Link from "next/link"
import { Shield, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { name: "Explorer", href: "/explorer" },
    { name: "Issuer", href: "/issuer" },
    { name: "Developer", href: "/developer" },
    { name: "Recruiter", href: "/recruiter" }
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-veritas-dark/80 backdrop-blur-xl border-b border-veritas-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* <div className="w-10 h-10 rounded-lg bg-veritas-accent/10 flex items-center justify-center group-hover:bg-veritas-accent/20 transition-all duration-300">
              <Shield className="w-6 h-6 text-veritas-accent" />
            </div> */}
            <span className="text-xl font-bold text-white group-hover:text-veritas-accent transition-colors hidden sm:block">
              Veritas Protocol
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-400 hover:text-veritas-accent transition-colors text-sm font-medium relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-veritas-accent group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/developer">
              <Button 
                className="bg-veritas-accent hover:bg-veritas-accent/90 text-veritas-dark font-semibold transition-all duration-300 hover:scale-105"
              >
                Connect Wallet
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-veritas-card rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-veritas-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-400 hover:text-veritas-accent transition-colors py-2 px-4 rounded-lg hover:bg-veritas-card"
                >
                  {link.name}
                </Link>
              ))}
              <Link href="/developer" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-veritas-accent hover:bg-veritas-accent/90 text-veritas-dark font-semibold">
                  Connect Wallet
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
