import { NextResponse } from "next/server"
import config from "@/lib/config"

export async function GET() {
  try {
    const status = {
      app: {
        name: config.APP.name,
        version: config.APP.version,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      },
      network: {
        chainId: config.CELO_ALFAJORES.chainId,
        name: config.CELO_ALFAJORES.name,
        rpcUrl: config.CELO_ALFAJORES.rpcUrl,
        explorerUrl: config.CELO_ALFAJORES.explorerUrl,
      },
      contracts: {
        sbt: config.CONTRACTS.SBT,
        verifier: config.CONTRACTS.VERIFIER,
        configured: !!(config.CONTRACTS.SBT && config.CONTRACTS.VERIFIER),
      },
      features: {
        realZKProofs: config.FEATURES.realZKProofs,
        analytics: config.FEATURES.analytics,
        debugging: config.FEATURES.debugging,
      },
      health: "ok",
    }

    return NextResponse.json(status, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        health: "error",
        error: "Failed to get status",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
