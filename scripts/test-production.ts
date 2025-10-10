#!/usr/bin/env tsx

import { createPublicClient, http } from "viem"
import { avalancheFuji } from "viem/chains"
import config from "../lib/config"

interface TestResult {
  name: string
  status: "pass" | "fail" | "warning"
  message: string
  duration?: number
}

class ProductionTester {
  private results: TestResult[] = []
  private publicClient: any

  constructor() {
    this.publicClient = createPublicClient({
      chain: avalancheFuji,
      transport: http(config.AVALANCHE_FUJI.rpcUrl),
    })
  }

  private addResult(name: string, status: "pass" | "fail" | "warning", message: string, duration?: number) {
    this.results.push({ name, status, message, duration })
    const emoji = status === "pass" ? "✅" : status === "fail" ? "❌" : "⚠️"
    const durationStr = duration ? ` (${duration}ms)` : ""
    console.log(`${emoji} ${name}: ${message}${durationStr}`)
  }

  async testNetworkConnectivity() {
    const start = Date.now()
    try {
      const blockNumber = await this.publicClient.getBlockNumber()
      const duration = Date.now() - start
      this.addResult(
        "Network Connectivity",
        "pass",
        `Connected to Avalanche Fuji, latest block: ${blockNumber}`,
        duration,
      )
    } catch (error) {
      const duration = Date.now() - start
      this.addResult("Network Connectivity", "fail", `Failed to connect to Avalanche Fuji: ${error}`, duration)
    }
  }

  async testContractDeployment() {
    const start = Date.now()
    try {
      if (!config.CONTRACTS.SBT || !config.CONTRACTS.VERIFIER) {
        this.addResult("Contract Configuration", "fail", "Contract addresses not configured in environment variables")
        return
      }

      // Test SBT contract
      const sbtCode = await this.publicClient.getBytecode({
        address: config.CONTRACTS.SBT,
      })

      if (!sbtCode || sbtCode === "0x") {
        this.addResult("SBT Contract", "fail", `No bytecode found at SBT address: ${config.CONTRACTS.SBT}`)
      } else {
        this.addResult("SBT Contract", "pass", `SBT contract deployed at: ${config.CONTRACTS.SBT}`)
      }

      // Test Verifier contract
      const verifierCode = await this.publicClient.getBytecode({
        address: config.CONTRACTS.VERIFIER,
      })

      if (!verifierCode || verifierCode === "0x") {
        this.addResult(
          "Verifier Contract",
          "fail",
          `No bytecode found at Verifier address: ${config.CONTRACTS.VERIFIER}`,
        )
      } else {
        this.addResult("Verifier Contract", "pass", `Verifier contract deployed at: ${config.CONTRACTS.VERIFIER}`)
      }

      const duration = Date.now() - start
      this.addResult("Contract Deployment", "pass", "All contracts verified on blockchain", duration)
    } catch (error) {
      const duration = Date.now() - start
      this.addResult("Contract Deployment", "fail", `Failed to verify contracts: ${error}`, duration)
    }
  }

  async testApplicationEndpoints() {
    const start = Date.now()
    try {
      const baseUrl = config.APP.url

      // Test main page
      const mainResponse = await fetch(baseUrl)
      if (!mainResponse.ok) {
        this.addResult("Main Page", "fail", `Main page returned ${mainResponse.status}`)
      } else {
        this.addResult("Main Page", "pass", "Main page accessible")
      }

      // Test API status endpoint
      const statusResponse = await fetch(`${baseUrl}/api/status`)
      if (!statusResponse.ok) {
        this.addResult("API Status", "fail", `Status API returned ${statusResponse.status}`)
      } else {
        const statusData = await statusResponse.json()
        this.addResult("API Status", "pass", `API healthy: ${statusData.health}`)
      }

      const duration = Date.now() - start
      this.addResult("Application Endpoints", "pass", "All endpoints accessible", duration)
    } catch (error) {
      const duration = Date.now() - start
      this.addResult("Application Endpoints", "fail", `Failed to test endpoints: ${error}`, duration)
    }
  }

  async testEnvironmentConfiguration() {
    const requiredEnvVars = [
      "NEXT_PUBLIC_SBT_CONTRACT",
      "NEXT_PUBLIC_VERIFIER_CONTRACT",
      "NEXT_PUBLIC_AVALANCHE_FUJI_RPC",
      "NEXT_PUBLIC_CHAIN_ID",
      "NEXT_PUBLIC_EXPLORER_URL",
    ]

    let missingVars = 0
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        missingVars++
        this.addResult(`Environment Variable: ${envVar}`, "fail", "Not configured")
      } else {
        this.addResult(`Environment Variable: ${envVar}`, "pass", "Configured")
      }
    }

    if (missingVars === 0) {
      this.addResult("Environment Configuration", "pass", "All required environment variables configured")
    } else {
      this.addResult("Environment Configuration", "fail", `${missingVars} required environment variables missing`)
    }
  }

  async testZKProofSystem() {
    try {
      // Test ZK proof service initialization
      const { zkProofService } = await import("../lib/zk-proof-service")
      await zkProofService.initialize()

      this.addResult("ZK Proof Service", "pass", "ZK proof service initialized successfully")

      // Test mock proof generation
      const mockInputs = {
        credentials: [
          {
            tokenId: "1",
            credentialType: "Hackathon Winner",
            metadataHash: "0x1234567890abcdef",
            isValid: true,
          },
        ],
        requiredTypes: ["Hackathon Winner"],
        minCredentials: 1,
        criteriaHash: "0xabcdef1234567890",
        userAddress: "0x1234567890123456789012345678901234567890",
      }

      const start = Date.now()
      const proof = await zkProofService.generateZKProof(mockInputs)
      const duration = Date.now() - start

      if (proof && proof.proof && proof.publicInputs) {
        this.addResult("ZK Proof Generation", "pass", "Mock ZK proof generated successfully", duration)
      } else {
        this.addResult("ZK Proof Generation", "fail", "Failed to generate mock ZK proof")
      }
    } catch (error) {
      this.addResult("ZK Proof System", "fail", `ZK proof system test failed: ${error}`)
    }
  }

  async runAllTests() {
    console.log("🧪 Running Veritas Protocol Production Tests...\n")

    await this.testEnvironmentConfiguration()
    await this.testNetworkConnectivity()
    await this.testContractDeployment()
    await this.testApplicationEndpoints()
    await this.testZKProofSystem()

    // Summary
    const passed = this.results.filter((r) => r.status === "pass").length
    const failed = this.results.filter((r) => r.status === "fail").length
    const warnings = this.results.filter((r) => r.status === "warning").length

    console.log("\n📊 Test Summary:")
    console.log(`✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`⚠️  Warnings: ${warnings}`)
    console.log(`📈 Total: ${this.results.length}`)

    if (failed === 0) {
      console.log("\n🎉 All tests passed! Veritas Protocol is ready for production.")
      process.exit(0)
    } else {
      console.log("\n💥 Some tests failed. Please fix the issues before deploying to production.")
      process.exit(1)
    }
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const tester = new ProductionTester()
  tester.runAllTests().catch(console.error)
}

export default ProductionTester
