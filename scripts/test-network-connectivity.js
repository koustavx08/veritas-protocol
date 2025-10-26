/**
 * Test Multi-Chain Network Connectivity
 * 
 * This script tests connectivity to the supported network:
 * - Celo Alfajores Testnet
 * 
 * Run: node scripts/test-network-connectivity.js
 */

const hre = require("hardhat")

const NETWORKS = {
  alfajores: {
    name: "Celo Alfajores Testnet",
    chainId: 44787,
    rpc: "https://alfajores-forno.celo-testnet.org",
    explorer: "https://alfajores.celoscan.io",
    token: "CELO",
  },
}

async function testNetwork(networkKey, networkInfo) {
  console.log(`\n${"━".repeat(60)}`)
  console.log(`Testing: ${networkInfo.name}`)
  console.log("━".repeat(60))

  try {
    // Create provider for this network
    const provider = new hre.ethers.JsonRpcProvider(networkInfo.rpc)

    // Test 1: Get network info
    console.log("📡 Connecting to network...")
    const network = await provider.getNetwork()
    console.log(`   Chain ID: ${network.chainId}`)

    if (Number(network.chainId) !== networkInfo.chainId) {
      console.log(`   ⚠️  Warning: Expected chain ID ${networkInfo.chainId}, got ${network.chainId}`)
    } else {
      console.log(`   ✅ Chain ID matches!`)
    }

    // Test 2: Get latest block
    console.log("\n📦 Fetching latest block...")
    const blockNumber = await provider.getBlockNumber()
    console.log(`   Latest block: ${blockNumber}`)
    console.log(`   ✅ Network is producing blocks!`)

    // Test 3: Get gas price
    console.log("\n⛽ Checking gas price...")
    const feeData = await provider.getFeeData()
    const gasPrice = feeData.gasPrice
    const gasPriceGwei = Number(gasPrice) / 1e9
    console.log(`   Gas price: ${gasPriceGwei.toFixed(2)} gwei`)
    console.log(`   ✅ Gas price retrieved!`)

    // Test 4: Check deployed contracts (if any)
    const deployedContracts = require("../deployed-contracts.json")
    if (deployedContracts[networkKey]) {
      console.log("\n📝 Checking deployed contracts...")
      const contracts = deployedContracts[networkKey].contracts

      if (contracts.VeritasSBT && contracts.VeritasSBT.address) {
        const sbtAddress = contracts.VeritasSBT.address
        console.log(`   VeritasSBT: ${sbtAddress}`)

        const code = await provider.getCode(sbtAddress)
        if (code !== "0x") {
          console.log(`   ✅ VeritasSBT contract verified!`)
        } else {
          console.log(`   ❌ VeritasSBT contract not found at address`)
        }
      } else {
        console.log(`   ℹ️  VeritasSBT not yet deployed`)
      }

      if (contracts.VeritasZKVerifier && contracts.VeritasZKVerifier.address) {
        const verifierAddress = contracts.VeritasZKVerifier.address
        console.log(`   VeritasZKVerifier: ${verifierAddress}`)

        const code = await provider.getCode(verifierAddress)
        if (code !== "0x") {
          console.log(`   ✅ VeritasZKVerifier contract verified!`)
        } else {
          console.log(`   ❌ VeritasZKVerifier contract not found at address`)
        }
      } else {
        console.log(`   ℹ️  VeritasZKVerifier not yet deployed`)
      }
    } else {
      console.log("\n📝 No contracts deployed on this network yet")
      console.log(`   💡 Deploy with: npm run deploy:${networkKey}`)
    }

    // Summary
    console.log("\n📊 Network Summary:")
    console.log(`   Name: ${networkInfo.name}`)
    console.log(`   Chain ID: ${network.chainId}`)
    console.log(`   RPC: ${networkInfo.rpc}`)
    console.log(`   Explorer: ${networkInfo.explorer}`)
    console.log(`   Latest Block: ${blockNumber}`)
    console.log(`   Gas Price: ${gasPriceGwei.toFixed(2)} gwei`)
    console.log(`   Status: ✅ ONLINE`)

    return {
      network: networkKey,
      success: true,
      blockNumber,
      gasPrice: gasPriceGwei,
    }
  } catch (error) {
    console.log(`\n❌ Error testing ${networkInfo.name}:`)
    console.log(`   ${error.message}`)
    console.log(`   Status: ❌ OFFLINE or UNREACHABLE`)

    return {
      network: networkKey,
      success: false,
      error: error.message,
    }
  }
}

async function main() {
  console.log("🌐 Veritas Protocol - Testnet Network Test")
  console.log("━".repeat(60))
  console.log("Testing connectivity to supported testnets...")
  console.log("━".repeat(60))

  const results = []

  // Test all networks
  for (const [key, info] of Object.entries(NETWORKS)) {
    const result = await testNetwork(key, info)
    results.push(result)
  }

  // Final summary
  console.log(`\n\n${"━".repeat(60)}`)
  console.log("📊 FINAL SUMMARY")
  console.log("━".repeat(60))

  const successful = results.filter((r) => r.success)
  const failed = results.filter((r) => !r.success)

  console.log(`\n✅ Online Networks: ${successful.length}/${results.length}`)
  successful.forEach((r) => {
    const networkInfo = NETWORKS[r.network]
    console.log(`   • ${networkInfo.name}`)
    console.log(`     Block: ${r.blockNumber}, Gas: ${r.gasPrice.toFixed(2)} gwei`)
  })

  if (failed.length > 0) {
    console.log(`\n❌ Offline Networks: ${failed.length}/${results.length}`)
    failed.forEach((r) => {
      const networkInfo = NETWORKS[r.network]
      console.log(`   • ${networkInfo.name}`)
      console.log(`     Error: ${r.error}`)
    })
  }

  // Gas price comparison
  if (successful.length > 1) {
    console.log(`\n⛽ Gas Price Comparison:`)
    const sorted = successful.sort((a, b) => a.gasPrice - b.gasPrice)
    sorted.forEach((r, index) => {
      const networkInfo = NETWORKS[r.network]
      const icon = index === 0 ? "💰" : "  "
      console.log(`   ${icon} ${networkInfo.name}: ${r.gasPrice.toFixed(2)} gwei`)
    })
    
    if (sorted.length > 1) {
      const cheapest = sorted[0]
      const mostExpensive = sorted[sorted.length - 1]
      const savings = ((mostExpensive.gasPrice - cheapest.gasPrice) / mostExpensive.gasPrice * 100)
      console.log(`\n   💡 ${NETWORKS[cheapest.network].name} is ${savings.toFixed(0)}% cheaper!`)
    }
  }

  console.log(`\n${"━".repeat(60)}`)
  console.log("✨ Network test complete!")
  console.log("━".repeat(60))

  // Recommendations
  console.log(`\n💡 Recommendations:`)
  console.log(`   • Use Celo Alfajores for lower gas fees`)
  console.log(`   • Compare gas costs before choosing primary network`)

  console.log(`\n📚 Next Steps:`)
  console.log(`   1. Deploy to Celo: npm run deploy:alfajores`)
  console.log(`   3. Verify contracts on explorers`)
  console.log(`   4. Test credential issuance on both`)
  console.log(`   5. Compare gas costs and performance`)

  console.log("")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
