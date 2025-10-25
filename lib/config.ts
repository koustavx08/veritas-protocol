export const config = {
  // Network Configuration - Testnet Only Support
  NETWORKS: {
    AVALANCHE_FUJI: {
      chainId: 43113,
      name: "Avalanche Fuji Testnet",
      rpcUrl: process.env.NEXT_PUBLIC_AVALANCHE_FUJI_RPC || "https://api.avax-test.network/ext/bc/C/rpc",
      explorerUrl: "https://testnet.snowtrace.io",
      nativeCurrency: {
        name: "AVAX",
        symbol: "AVAX",
        decimals: 18,
      },
      testnet: true,
    },
    CELO_ALFAJORES: {
      chainId: 44787,
      name: "Celo Alfajores Testnet",
      rpcUrl: process.env.NEXT_PUBLIC_CELO_ALFAJORES_RPC || "https://alfajores-forno.celo-testnet.org",
      explorerUrl: "https://alfajores.celoscan.io",
      nativeCurrency: {
        name: "CELO",
        symbol: "CELO",
        decimals: 18,
      },
      testnet: true,
    },
  },

  // Legacy - kept for backward compatibility
  AVALANCHE_FUJI: {
    chainId: 43113,
    name: "Avalanche Fuji Testnet",
    rpcUrl: process.env.NEXT_PUBLIC_AVALANCHE_FUJI_RPC || "https://api.avax-test.network/ext/bc/C/rpc",
    explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL || "https://testnet.snowtrace.io",
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
  },

  // Contract Addresses (from deployment)
  CONTRACTS: {
    SBT: process.env.NEXT_PUBLIC_SBT_CONTRACT as `0x${string}`,
    VERIFIER: process.env.NEXT_PUBLIC_VERIFIER_CONTRACT as `0x${string}`,
  },

  // Application Configuration
  APP: {
    name: "Veritas Protocol",
    description:
      "Privacy-preserving professional credential verification using Soulbound Tokens and Zero-Knowledge Proofs",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://veritasprotocol.vercel.app",
    version: "1.0.0",
  },

  // Feature Flags
  FEATURES: {
    realZKProofs: process.env.NEXT_PUBLIC_ENABLE_REAL_ZK === "true",
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
    debugging: process.env.NODE_ENV === "development",
  },

  // API Configuration
  API: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
    timeout: 30000,
  },

  // ZK Configuration
  ZK: {
    circuitName: "veritas_credential_proof_v1",
    maxCredentials: 10,
    maxRequiredTypes: 5,
    proofTimeout: 60000, // 60 seconds
  },
} as const

// Validation
if (typeof window !== "undefined") {
  // Client-side validation
  if (!config.CONTRACTS.SBT || !config.CONTRACTS.VERIFIER) {
    console.warn("⚠️ Contract addresses not configured. Some features may not work.")
  }
}

export default config
