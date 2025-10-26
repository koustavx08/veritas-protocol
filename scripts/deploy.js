const hre = require("hardhat")
const { ethers } = hre
const fs = require("fs")
const path = require("path")

async function main() {
  // Detect network
  const netName = hre.network.name
  const networkInfo = await ethers.provider.getNetwork()
  console.log(`🚀 Starting Veritas Protocol deployment on '${netName}' (chainId=${networkInfo.chainId})...\n`)

  // Get the deployer account
  const [deployer] = await ethers.getSigners()
  console.log("📝 Deploying contracts with account:", deployer.address)

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address)
  const nativeSymbol = Number(networkInfo.chainId) === 44787 ? "CELO" : "ETH"
  console.log("💰 Account balance:", ethers.formatEther(balance), nativeSymbol + "\n")

  if (balance < ethers.parseEther("0.1")) {
    console.warn("⚠️  Warning: Low balance. You may need more CELO for deployment.\n")
  }

  try {
    // Deploy VeritasSBT contract
  console.log("📄 Deploying VeritasSBT contract...")
    const VeritasSBT = await ethers.getContractFactory("VeritasSBT")
    const veritasSBT = await VeritasSBT.deploy()
    await veritasSBT.waitForDeployment()

    console.log("✅ VeritasSBT deployed to:", await veritasSBT.getAddress())
    console.log("🔗 Transaction hash:", veritasSBT.deploymentTransaction().hash)

    // Wait for a few confirmations
    if (netName !== "hardhat" && netName !== "localhost") {
      console.log("⏳ Waiting for 3 confirmations...")
      await veritasSBT.deploymentTransaction().wait(3)
    } else {
      await veritasSBT.deploymentTransaction().wait(1)
    }

    // Deploy VeritasZKVerifier contract
    console.log("\n📄 Deploying VeritasZKVerifier contract...")
    const VeritasZKVerifier = await ethers.getContractFactory("VeritasZKVerifier")
    const veritasZKVerifier = await VeritasZKVerifier.deploy()
    await veritasZKVerifier.waitForDeployment()

    console.log("✅ VeritasZKVerifier deployed to:", await veritasZKVerifier.getAddress())
    console.log("🔗 Transaction hash:", veritasZKVerifier.deploymentTransaction().hash)

    // Wait for confirmations
    if (netName !== "hardhat" && netName !== "localhost") {
      console.log("⏳ Waiting for 3 confirmations...")
      await veritasZKVerifier.deploymentTransaction().wait(3)
    } else {
      await veritasZKVerifier.deploymentTransaction().wait(1)
    }

    // Prepare deployment data
    const sbtAddress = await veritasSBT.getAddress()
    const verifierAddress = await veritasZKVerifier.getAddress()
    const sbtTxHash = veritasSBT.deploymentTransaction().hash
    const verifierTxHash = veritasZKVerifier.deploymentTransaction().hash
    
    const deploymentPath = path.join(__dirname, "..", "deployed-contracts.json")
    let existing = {}
    if (fs.existsSync(deploymentPath)) {
      try { existing = JSON.parse(fs.readFileSync(deploymentPath, 'utf8')) } catch { existing = {} }
    }
    existing[netName] = {
      chainId: Number(networkInfo.chainId),
      timestamp: new Date().toISOString(),
      deployer: deployer.address,
      contracts: {
        VeritasSBT: {
          address: sbtAddress,
          transactionHash: sbtTxHash
        },
        VeritasZKVerifier: {
          address: verifierAddress,
          transactionHash: verifierTxHash
        }
      },
      gasUsed: {
        VeritasSBT: (await veritasSBT.deploymentTransaction().wait()).gasUsed.toString(),
        VeritasZKVerifier: (await veritasZKVerifier.deploymentTransaction().wait()).gasUsed.toString()
      }
    }
    fs.writeFileSync(deploymentPath, JSON.stringify(existing, null, 2))

    console.log("\n🎉 Deployment completed successfully!")
  console.log("📁 Contract addresses saved to:", deploymentPath)

    // Display summary
    console.log("\n📋 DEPLOYMENT SUMMARY")
    console.log("=".repeat(50))
  console.log(`Network: ${netName} (Chain ID: ${networkInfo.chainId})`)
    console.log(`Deployer: ${deployer.address}`)
    console.log(`VeritasSBT: ${sbtAddress}`)
    console.log(`VeritasZKVerifier: ${verifierAddress}`)
    console.log("=".repeat(50))

    // Setup initial configuration
    console.log("\n⚙️  Setting up initial configuration...")

    // Whitelist the deployer as an initial issuer
    console.log("🔐 Whitelisting deployer as initial issuer...")
    const whitelistTx = await veritasSBT.setIssuerWhitelist(deployer.address, true)
    await whitelistTx.wait()
    console.log("✅ Deployer whitelisted as issuer")

    // Verify contracts on CeloScan (optional - only if API key is provided)
    if (process.env.CELOSCAN_API_KEY && process.env.CELOSCAN_API_KEY !== "your_celoscan_key") {
      console.log("\n🔍 Verifying contracts on CeloScan...")
      try {
        await hre.run("verify:verify", {
          address: sbtAddress,
          constructorArguments: [],
        })
        console.log("✅ VeritasSBT verified on CeloScan")
      } catch (error) {
        console.log("❌ VeritasSBT verification failed:", error.message)
      }

      try {
        await hre.run("verify:verify", {
          address: verifierAddress,
          constructorArguments: [],
        })
        console.log("✅ VeritasZKVerifier verified on CeloScan")
      } catch (error) {
        console.log("❌ VeritasZKVerifier verification failed:", error.message)
      }
    } else {
      console.log("\n⏭️  Skipping contract verification (no CeloScan API key provided)")
      console.log("💡 Note: Contracts are deployed and functional without verification")
      console.log("💡 Verification is only needed for public source code viewing on CeloScan")
    }

    if (netName === 'alfajores') {
      console.log("\n🌐 Useful Links:")
      console.log(`CeloScan (VeritasSBT): https://alfajores.celoscan.io/address/${sbtAddress}`)
      console.log(`CeloScan (VeritasZKVerifier): https://alfajores.celoscan.io/address/${verifierAddress}`)
      console.log(`Celo Alfajores Faucet: https://faucet.celo.org/alfajores`)
    }

    console.log("\n✨ Deployment complete! Ready to integrate with frontend.")
  } catch (error) {
    if (error.message && error.message.includes("Cannot connect to the network")) {
      console.error(
        "\n❌ Deployment failed: Cannot connect. If you intended to use a local node run 'pnpm hardhat node' in another terminal, or omit --network localhost to use the in-process ephemeral Hardhat network.",
      )
    } else {
      console.error("\n❌ Deployment failed:", error)
    }
    process.exit(1)
  }
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment script failed:", error)
    process.exit(1)
  })
