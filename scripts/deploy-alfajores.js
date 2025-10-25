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
const { ethers } = hre
const fs = require("fs")
const path = require("path")

async function main() {
  console.log("🚀 Deploying Veritas Protocol to Celo Alfajores Testnet...")
  console.log("━".repeat(60))

  const [deployer] = await ethers.getSigners()
  const network = await ethers.provider.getNetwork()

  console.log("📋 Deployment Details:")
  console.log(`   Network: ${network.name} (Chain ID: ${network.chainId})`)
  console.log(`   Deployer: ${deployer.address}`)
  
  const balance = await ethers.provider.getBalance(deployer.address)
  console.log(`   Balance: ${ethers.formatEther(balance)} CELO`)
  console.log("━".repeat(60))

  if (balance === 0n) {
    console.error("❌ Deployer has no CELO! Get testnet CELO from: https://faucet.celo.org/alfajores")
    process.exit(1)
  }

  const confirmations = 3
  const skipVerify = process.argv.includes("--no-verify") || process.env.SKIP_VERIFY === "true"
  const doVerify = !skipVerify && !!process.env.CELOSCAN_API_KEY

  async function deployOne(name) {
    console.log(`\n📝 Deploying ${name}...`)
    const Factory = await ethers.getContractFactory(name)
    const contract = await Factory.deploy()
    await contract.waitForDeployment()
    const address = await contract.getAddress()
    const tx = contract.deploymentTransaction()
    console.log(`✅ ${name} deployed to: ${address}`)
    console.log(`⏳ Waiting for ${confirmations} confirmations...`)
    await tx.wait(confirmations)
    return { contract, address, tx }
  }

  // Deploy contracts
  const veritasSBT = await deployOne("VeritasSBT")
  const verifier = await deployOne("VeritasZKVerifier")

  // Post deploy config - whitelist deployer as issuer
  console.log("\n🔐 Whitelisting deployer as issuer in VeritasSBT...")
  await (await veritasSBT.contract.setIssuerWhitelist(deployer.address, true)).wait()
  console.log("✅ Whitelisted")

  console.log("\n━".repeat(60))
  console.log("📄 Deployment Summary:")
  console.log("━".repeat(60))
  console.log(`Network: Celo Alfajores Testnet (${network.chainId})`)
  console.log(`VeritasSBT: ${veritasSBT.address}`)
  console.log(`VeritasZKVerifier: ${verifier.address}`)
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
          address: veritasSBT.address,
          transactionHash: veritasSBT.tx?.hash || null,
        },
        VeritasZKVerifier: {
          address: verifier.address,
          transactionHash: verifier.tx?.hash || null,
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
  console.log(`NEXT_PUBLIC_SBT_CONTRACT=${veritasSBT.address}`)
  console.log(`NEXT_PUBLIC_VERIFIER_CONTRACT=${verifier.address}`)
  console.log(`NEXT_PUBLIC_VERITAS_NETWORK=alfajores`)
  console.log(`NEXT_PUBLIC_CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org`)
  console.log("━".repeat(60))

  // Verification instructions
  console.log("\n🔍 To verify contracts on CeloScan:")
  console.log("━".repeat(60))
  console.log(`npx hardhat verify --network alfajores ${veritasSBT.address}`)
  console.log(`npx hardhat verify --network alfajores ${verifier.address}`)
  console.log("━".repeat(60))

  // Optional verify
  if (doVerify) {
    console.log("\n🔍 Verifying on CeloScan...")
    for (const c of [veritasSBT, verifier]) {
      try {
        await hre.run("verify:verify", { address: c.address, constructorArguments: [] })
        console.log(`✅ Verified ${c.address}`)
      } catch (e) {
        console.log(`❌ Verification skipped/failed for ${c.address}: ${e.message}`)
      }
    }
  } else {
    console.log("\n⏭️  Skipping verification (no key or --no-verify)")
  }

  console.log("\n✨ Deployment complete!")
  console.log(`\n🔗 View on CeloScan:`)
  console.log(`   VeritasSBT: https://alfajores.celoscan.io/address/${veritasSBT.address}`)
  console.log(`   VeritasZKVerifier: https://alfajores.celoscan.io/address/${verifier.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
