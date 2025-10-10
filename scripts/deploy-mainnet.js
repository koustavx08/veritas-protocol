const hre = require("hardhat")
const { ethers } = hre
const fs = require("fs")
const path = require("path")

async function main() {
  const expectedNetwork = "mainnet"
  if (hre.network.name !== expectedNetwork) {
    console.error(`❌ Wrong network. Use --network ${expectedNetwork}`)
    process.exit(1)
  }
  const net = await ethers.provider.getNetwork()
  console.log(`🚀 Deploying Veritas Protocol to Avalanche Mainnet (chainId=${net.chainId})...\n`)

  const [deployer] = await ethers.getSigners()
  const balance = await ethers.provider.getBalance(deployer.address)
  console.log(`Deployer: ${deployer.address}`)
  console.log(`Balance: ${ethers.formatEther(balance)} AVAX`)
  if (balance < ethers.parseEther("1")) console.warn("⚠️  Recommended to have >1 AVAX for safe deployment.")

  const skipVerify = process.argv.includes("--no-verify") || process.env.SKIP_VERIFY === "true"
  const doVerify = !skipVerify && !!process.env.SNOWTRACE_API_KEY

  async function deployOne(name, confirmations = 5) {
    console.log(`\n📄 Deploying ${name}...`)
    const Factory = await ethers.getContractFactory(name)
    const contract = await Factory.deploy()
    await contract.waitForDeployment()
    const address = await contract.getAddress()
    const tx = contract.deploymentTransaction()
    console.log(`✅ ${name} deployed at ${address}`)
    console.log(`🔗 Tx: ${tx.hash}`)
    console.log(`⏳ Waiting for ${confirmations} confirmations...`)
    await tx.wait(confirmations)
    return { contract, address, tx }
  }

  try {
    const veritasSBT = await deployOne("VeritasSBT")
    const verifier = await deployOne("VeritasZKVerifier")

    console.log("\n🔐 Whitelisting deployer as issuer in VeritasSBT...")
    await (await veritasSBT.contract.setIssuerWhitelist(deployer.address, true)).wait()
    console.log("✅ Whitelisted")

    const file = path.join(__dirname, "..", "deployed-contracts.json")
    let existing = {}
    if (fs.existsSync(file)) {
      try { existing = JSON.parse(fs.readFileSync(file, 'utf8')) } catch { existing = {} }
    }
    existing[hre.network.name] = {
      chainId: Number(net.chainId),
      timestamp: new Date().toISOString(),
      deployer: deployer.address,
      contracts: {
        VeritasSBT: { address: veritasSBT.address, transactionHash: veritasSBT.tx.hash },
        VeritasZKVerifier: { address: verifier.address, transactionHash: verifier.tx.hash }
      }
    }
    fs.writeFileSync(file, JSON.stringify(existing, null, 2))
    console.log(`\n📝 Wrote deployment info to ${file}`)

    if (doVerify) {
      console.log("\n🔍 Verifying on Snowtrace...")
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

    console.log("\n📋 Summary")
    console.log("=".repeat(42))
    console.log(`VeritasSBT:        ${veritasSBT.address}`)
    console.log(`VeritasZKVerifier: ${verifier.address}`)
    console.log("=".repeat(42))
    console.log("🌐 Snowtrace:")
    console.log(`  https://snowtrace.io/address/${veritasSBT.address}`)
    console.log(`  https://snowtrace.io/address/${verifier.address}`)
  } catch (err) {
    console.error("\n❌ Deployment failed:", err)
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
