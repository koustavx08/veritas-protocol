// Test script for multi-chain functionality (trimmed to Celo Alfajores)
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Load deployed contracts
const deployedContracts = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../deployed-contracts.json'), 'utf8')
);

// Network configurations (only Celo Alfajores is maintained for this repo)
const networks = {
  'alfajores': {
    name: 'Celo Alfajores Testnet',
    chainId: 44787,
    rpcUrl: 'https://alfajores-forno.celo-testnet.org',
    explorer: 'https://alfajores.celoscan.io',
    nativeCurrency: {
      name: 'Celo',
      symbol: 'CELO',
      decimals: 18
    },
    testnet: true
  }
};

// Load ABIs
const sbtAbi = require('../artifacts/contracts/VeritasSBT.sol/VeritasSBT.json').abi;
const verifierAbi = require('../artifacts/contracts/VeritasZKVerifier.sol/VeritasZKVerifier.json').abi;

// Test function to check contract availability across networks
async function testNetworkContracts() {
  console.log('Testing contract availability across networks...');
  
  for (const [networkKey, networkConfig] of Object.entries(networks)) {
    console.log(`\nTesting ${networkConfig.name}...`);
    
    try {
      // Create provider
      const provider = new ethers.providers.JsonRpcProvider(networkConfig.rpcUrl);
      
      // Get network contracts
      const networkContracts = deployedContracts.networks[networkKey];
      
      if (!networkContracts) {
        console.log(`  No contracts found for ${networkConfig.name}`);
        continue;
      }
      
      // Check SBT contract
      if (networkContracts.VeritasSBT) {
        try {
          const sbtContract = new ethers.Contract(
            networkContracts.VeritasSBT.address,
            sbtAbi,
            provider
          );
          
          const sbtName = await sbtContract.name();
          console.log(`  SBT Contract: ${sbtName} at ${networkContracts.VeritasSBT.address}`);
        } catch (error) {
          console.log(`  Error accessing SBT contract: ${error.message}`);
        }
      } else {
        console.log(`  No SBT contract found for ${networkConfig.name}`);
      }
      
      // Check Verifier contract
      if (networkContracts.VeritasZKVerifier) {
        try {
          const verifierContract = new ethers.Contract(
            networkContracts.VeritasZKVerifier.address,
            verifierAbi,
            provider
          );
          
          const verifierOwner = await verifierContract.owner();
          console.log(`  Verifier Contract: Owner ${verifierOwner} at ${networkContracts.VeritasZKVerifier.address}`);
        } catch (error) {
          console.log(`  Error accessing Verifier contract: ${error.message}`);
        }
      } else {
        console.log(`  No Verifier contract found for ${networkConfig.name}`);
      }
      
    } catch (error) {
      console.log(`  Failed to connect to ${networkConfig.name}: ${error.message}`);
    }
  }
}

// Test function to check explorer URLs
function testExplorerUrls() {
  console.log('\nTesting explorer URLs...');
  
  for (const [networkKey, networkConfig] of Object.entries(networks)) {
    const explorerUrl = networkConfig.explorer;
    console.log(`${networkConfig.name}: ${explorerUrl}`);
    
    // Example address to check
    const exampleAddress = '0x0000000000000000000000000000000000000000';
    console.log(`  Address URL: ${explorerUrl}/address/${exampleAddress}`);
    
    // Example transaction to check
    const exampleTx = '0x0000000000000000000000000000000000000000000000000000000000000000';
    console.log(`  Transaction URL: ${explorerUrl}/tx/${exampleTx}`);
  }
}

// Main test function
async function runTests() {
  console.log('=== VERITAS PROTOCOL MULTI-CHAIN TEST ===');
  
  // Test contract availability
  await testNetworkContracts();
  
  // Test explorer URLs
  testExplorerUrls();
}

// Run tests
runTests()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });