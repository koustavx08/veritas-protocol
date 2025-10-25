const fs = require('fs');
const path = require('path');

// Usage: node scripts/export-env.js <network> [.env]
(async () => {
  const network = process.argv[2] || 'fuji'
  const outFile = process.argv[3] || '.env'
  const file = path.join(__dirname, '..', 'deployed-contracts.json')
  if (!fs.existsSync(file)) {
    console.error('deployed-contracts.json not found')
    process.exit(1)
  }
  let raw
  try {
    raw = fs.readFileSync(file, 'utf8')
  } catch (e) {
    console.error('Failed to read deployed-contracts.json:', e.message)
    process.exit(1)
  }
  let data
  try {
    data = JSON.parse(raw)
  } catch (e) {
    console.error('Invalid JSON in deployed-contracts.json')
    process.exit(1)
  }

  // Migration: legacy single-network shape { network, chainId, contracts, ... }
  if (data.network && data.contracts && !data[data.network]) {
    const legacyNet = data.network
    const migrated = {
      [legacyNet]: {
        chainId: data.chainId,
        timestamp: data.timestamp,
        deployer: data.deployer,
        contracts: data.contracts
      }
    }
    data = migrated
    try {
      fs.writeFileSync(file, JSON.stringify(data, null, 2))
      console.log(`Migrated legacy format to multi-network schema (network='${legacyNet}').`)
    } catch (e) {
      console.warn('Could not write migrated format:', e.message)
    }
  }

  if (!data[network]) {
    console.error(`Network '${network}' not found in deployed-contracts.json`)
    console.error('Available networks:', Object.keys(data).join(', ') || '(none)')
    process.exit(1)
  }

  const { contracts } = data[network]
  if (!contracts || !contracts.VeritasSBT || !contracts.VeritasZKVerifier) {
    console.error(`Contracts for network '${network}' are incomplete.`)
    process.exit(1)
  }

  const lines = [
    `NEXT_PUBLIC_VERITAS_NETWORK=${network}`,
    // Preferred names used by lib/config.ts
    `NEXT_PUBLIC_SBT_CONTRACT=${contracts.VeritasSBT.address}`,
    `NEXT_PUBLIC_VERIFIER_CONTRACT=${contracts.VeritasZKVerifier.address}`,
    // Back-compat names some parts of the app may read
    `NEXT_PUBLIC_SBT_ADDRESS=${contracts.VeritasSBT.address}`,
    `NEXT_PUBLIC_VERIFIER_ADDRESS=${contracts.VeritasZKVerifier.address}`
  ]
  try {
    fs.writeFileSync(path.join(__dirname, '..', outFile), lines.join('\n') + '\n')
    console.log(`Written ${lines.length} vars to ${outFile}`)
  } catch (e) {
    console.error('Failed to write env file:', e.message)
    process.exit(1)
  }
})()
