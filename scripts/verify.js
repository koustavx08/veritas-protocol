const hre = require("hardhat")

async function main() {
  // Load deployed contract addresses (per-network schema)
  const data = require("../deployed-contracts.json")
  const net = hre.network.name
  const entry = data[net]
  if (!entry || !entry.contracts) {
    console.error(`❌ No deployed contracts found for network '${net}'. Run deployment first.`)
    return
  }

  const sbtAddress = entry.contracts.VeritasSBT.address
  const verifierAddress = entry.contracts.VeritasZKVerifier.address

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

  const explorer = net === 'alfajores' ? 'https://alfajores.celoscan.io' : 'https://testnet.snowtrace.io'
  console.log("\n🎉 All contracts verified!")
  console.log(`🌐 VeritasSBT: ${explorer}/address/${sbtAddress}`)
  console.log(`🌐 VeritasZKVerifier: ${explorer}/address/${verifierAddress}`)
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
