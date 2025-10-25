/**
 * Deploy Veritas Protocol to Celo Alfajores Testnet
 * 
 * Prerequisites:
 * 1. Set PRIVATE_KEY in .env file
 * 2. Get testnet CELO from: https://faucet.celo.org/alfajores
 * 3. Optional: Set CELO_ALFAJORES_RPC_URL for custom RPC (defaults to public endpoint)
 * 
 * Run: npx hardhat run scripts/deploy-alfajores.js --network alfajores
 */

const hre = require("hardhat")
const fs = require("fs")
const path = require("path")

async function main() {
  console.log("🚀 Deploying Veritas Protocol to Celo Alfajores Testnet...")
  console.log("━".repeat(60))

  const [deployer] = await hre.ethers.getSigners()
  const network = await hre.ethers.provider.getNetwork()

  console.log("📋 Deployment Details:")
  console.log(`   Network: ${network.name} (Chain ID: ${network.chainId})`)
  console.log(`   Deployer: ${deployer.address}`)
  
  const balance = await hre.ethers.provider.getBalance(deployer.address)
  console.log(`   Balance: ${hre.ethers.formatEther(balance)} CELO`)
  console.log("━".repeat(60))

  if (balance === 0n) {
    console.error("❌ Deployer has no CELO! Get testnet CELO from: https://faucet.celo.org/alfajores")
    process.exit(1)
  }

  // Deploy VeritasSBT
  console.log("\n📝 Deploying VeritasSBT...")
  const VeritasSBT = await hre.ethers.getContractFactory("VeritasSBT")
  const sbt = await VeritasSBT.deploy()
  await sbt.waitForDeployment()
  const sbtAddress = await sbt.getAddress()
  console.log(`✅ VeritasSBT deployed to: ${sbtAddress}`)

  // Deploy VeritasZKVerifier
  console.log("\n📝 Deploying VeritasZKVerifier...")
  const VeritasZKVerifier = await hre.ethers.getContractFactory("VeritasZKVerifier")
  const verifier = await VeritasZKVerifier.deploy(sbtAddress)
  await verifier.waitForDeployment()
  const verifierAddress = await verifier.getAddress()
  console.log(`✅ VeritasZKVerifier deployed to: ${verifierAddress}`)

  console.log("\n━".repeat(60))
  console.log("📄 Deployment Summary:")
  console.log("━".repeat(60))
  console.log(`Network: Celo Alfajores Testnet (${network.chainId})`)
  console.log(`VeritasSBT: ${sbtAddress}`)
  console.log(`VeritasZKVerifier: ${verifierAddress}`)
  console.log(`Deployer: ${deployer.address}`)
  console.log(`Explorer: https://alfajores.celoscan.io`)
  console.log("━".repeat(60))

  // Save deployment info
  const deploymentInfo = {
    alfajores: {
      chainId: Number(network.chainId),
      timestamp: new Date().toISOString(),
      deployer: deployer.address,
      contracts: {
        VeritasSBT: {
          address: sbtAddress,
          transactionHash: sbt.deploymentTransaction()?.hash || null,
        },
        VeritasZKVerifier: {
          address: verifierAddress,
          transactionHash: verifier.deploymentTransaction()?.hash || null,
        },
      },
    },
  }

  const deployedContractsPath = path.join(__dirname, "..", "deployed-contracts.json")
  let existingData = {}
  
  if (fs.existsSync(deployedContractsPath)) {
    existingData = JSON.parse(fs.readFileSync(deployedContractsPath, "utf8"))
  }

  const updatedData = { ...existingData, ...deploymentInfo }
  fs.writeFileSync(deployedContractsPath, JSON.stringify(updatedData, null, 2))

  console.log("\n💾 Deployment info saved to deployed-contracts.json")

  // Save environment variables template
  console.log("\n📝 Add these to your .env.local file:")
  console.log("━".repeat(60))
  console.log(`NEXT_PUBLIC_SBT_CONTRACT=${sbtAddress}`)
  console.log(`NEXT_PUBLIC_VERIFIER_CONTRACT=${verifierAddress}`)
  console.log(`NEXT_PUBLIC_CHAIN_ID=44787`)
  console.log(`NEXT_PUBLIC_CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org`)
  console.log("━".repeat(60))

  // Verification instructions
  console.log("\n🔍 To verify contracts on CeloScan:")
  console.log("━".repeat(60))
  console.log(`npx hardhat verify --network alfajores ${sbtAddress}`)
  console.log(`npx hardhat verify --network alfajores ${verifierAddress} ${sbtAddress}`)
  console.log("━".repeat(60))

  console.log("\n✨ Deployment complete!")
  console.log(`\n🔗 View on CeloScan:`)
  console.log(`   VeritasSBT: https://alfajores.celoscan.io/address/${sbtAddress}`)
  console.log(`   VeritasZKVerifier: https://alfajores.celoscan.io/address/${verifierAddress}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
