const { ethers } = require("hardhat")
const hre = require("hardhat") // Declare the hre variable

async function main() {
  // Load deployed contract addresses
  const deployedContracts = require("../deployed-contracts.json")

  if (!deployedContracts.contracts) {
    console.error("❌ No deployed contracts found. Run deployment first.")
    return
  }

  const sbtAddress = deployedContracts.contracts.VeritasSBT.address
  const verifierAddress = deployedContracts.contracts.VeritasZKVerifier.address

  console.log("🔍 Verifying deployed contracts...\n")

  try {
    // Verify VeritasSBT
    console.log("📄 Verifying VeritasSBT at:", sbtAddress)
    await hre.run("verify:verify", {
      address: sbtAddress,
      constructorArguments: [],
    })
    console.log("✅ VeritasSBT verified successfully")

    // Verify VeritasZKVerifier
    console.log("\n📄 Verifying VeritasZKVerifier at:", verifierAddress)
    await hre.run("verify:verify", {
      address: verifierAddress,
      constructorArguments: [],
    })
    console.log("✅ VeritasZKVerifier verified successfully")

    console.log("\n🎉 All contracts verified on Snowtrace!")
    console.log(`🌐 VeritasSBT: https://testnet.snowtrace.io/address/${sbtAddress}`)
    console.log(`🌐 VeritasZKVerifier: https://testnet.snowtrace.io/address/${verifierAddress}`)
  } catch (error) {
    console.error("❌ Verification failed:", error.message)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
