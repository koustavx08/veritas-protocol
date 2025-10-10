# Veritas Protocol Smart Contract Deployment

This guide covers deploying the Veritas Protocol smart contracts to Avalanche Fuji Testnet.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **AVAX tokens** on Fuji testnet for gas fees
3. **Snowtrace API key** (optional, for verification)

## Setup

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure environment:**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your private key and RPC URL
   \`\`\`

3. **Get testnet AVAX:**
   - Visit [Avalanche Faucet](https://faucet.avax.network/)
   - Request AVAX for your deployer address

## Deployment

### Deploy to Fuji Testnet

\`\`\`bash
npm run deploy:fuji
\`\`\`

This will:
- Deploy `VeritasSBT` contract
- Deploy `VeritasZKVerifier` contract  
- Whitelist deployer as initial issuer
- Save addresses to `deployed-contracts.json`
- Verify contracts on Snowtrace (if API key provided)

### Deploy to Local Network

\`\`\`bash
# Start local Hardhat network
npm run node

# In another terminal, deploy
npm run deploy:local
\`\`\`

## Testing

Run the test suite:

\`\`\`bash
npm test
\`\`\`

Run with coverage:

\`\`\`bash
npm run coverage
\`\`\`

## Contract Verification

If verification failed during deployment, run manually:

\`\`\`bash
npm run verify
\`\`\`

## Contract Addresses

After deployment, contract addresses are saved in `deployed-contracts.json`:

\`\`\`json
{
  "network": "avalanche-fuji",
  "chainId": 43113,
  "contracts": {
    "VeritasSBT": {
      "address": "0x...",
      "transactionHash": "0x..."
    },
    "VeritasZKVerifier": {
      "address": "0x...",
      "transactionHash": "0x..."
    }
  }
}
\`\`\`

## Integration

Copy the contract addresses to your frontend `.env`:

\`\`\`bash
NEXT_PUBLIC_SBT_CONTRACT=0x...
NEXT_PUBLIC_VERIFIER_CONTRACT=0x...
\`\`\`

## Useful Links

- [Avalanche Fuji Explorer](https://testnet.snowtrace.io/)
- [Avalanche Faucet](https://faucet.avax.network/)
- [Avalanche Documentation](https://docs.avax.network/)

## Troubleshooting

### Common Issues

1. **Insufficient funds:** Get more AVAX from the faucet
2. **Network issues:** Check RPC URL in `.env`
3. **Verification failed:** Ensure Snowtrace API key is correct

### Gas Optimization

The contracts are optimized for gas efficiency:
- Optimizer enabled with 200 runs
- Efficient storage patterns
- Minimal external calls

### Security Features

- **Reentrancy protection** on critical functions
- **Access control** for administrative functions
- **Input validation** on all public functions
- **Event logging** for transparency
\`\`\`

Create a simple deployment status script:
