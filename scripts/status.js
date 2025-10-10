const { ethers } = require("hardhat")
const fs = require("fs")

async function main() {
  try {
    // Load deployment data
    const deploymentData = JSON.parse(fs.readFileSync("deployed-contracts.json", "utf8"))

    console.log("📊 Veritas Protocol Deployment Status\n")
    console.log("=".repeat(50))
    console.log(`Network: ${deploymentData.network}`)
    console.log(`Chain ID: ${deploymentData.chainId}`)
    console.log(`Deployed: ${deploymentData.timestamp}`)
    console.log(`Deployer: ${deploymentData.deployer}`)
    console.log("=".repeat(50))

    // Get contract instances
    const sbtAddress = deploymentData.contracts.VeritasSBT.address
    const verifierAddress = deploymentData.contracts.VeritasZKVerifier.address

    const VeritasSBT = await ethers.getContractFactory("VeritasSBT")
    const VeritasZKVerifier = await ethers.getContractFactory("VeritasZKVerifier")

    const sbt = VeritasSBT.attach(sbtAddress)
    const verifier = VeritasZKVerifier.attach(verifierAddress)

    // Check contract status
    console.log("\n📄 Contract Status:")
    console.log(`VeritasSBT (${sbtAddress}):`)
    console.log(`  - Total Supply: ${await sbt.totalSupply()}`)
    console.log(`  - Name: ${await sbt.name()}`)
    console.log(`  - Symbol: ${await sbt.symbol()}`)

    console.log(`\nVeritasZKVerifier (${verifierAddress}):`)
    console.log(`  - Verification Enabled: ${await verifier.verificationEnabled()}`)
    console.log(`  - Default Expiry: ${await verifier.defaultExpiryTime()} seconds`)
    console.log(`  - Total Proof Requests: ${await verifier.getTotalProofRequests()}`)

    console.log("\n🌐 Explorer Links:")
    console.log(`VeritasSBT: https://testnet.snowtrace.io/address/${sbtAddress}`)
    console.log(`VeritasZKVerifier: https://testnet.snowtrace.io/address/${verifierAddress}`)
  } catch (error) {
    console.error("❌ Error checking status:", error.message)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
