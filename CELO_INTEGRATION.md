# Celo Integration Guide for Veritas Protocol

## Overview

Veritas Protocol now supports **multi-chain deployment** across both **Avalanche** and **Celo** networks. This guide covers everything you need to know about deploying and using the platform on Celo's blockchain.

## 🌐 Supported Networks

### Testnets
- **Avalanche Fuji** (Chain ID: 43113)
- **Celo Alfajores** (Chain ID: 44787) ✨ NEW

### Mainnets
- **Avalanche C-Chain** (Chain ID: 43114)
- **Celo Mainnet** (Chain ID: 42220) ✨ NEW

## 🎯 Why Celo?

Celo is an Ethereum Layer 2 optimized for real-world use cases:

- **Low Transaction Costs**: Gas fees paid in CELO or stable tokens (cUSD, cEUR)
- **Mobile-First**: Built for mobile-first experiences
- **Fast Finality**: Quick transaction confirmations (~5 seconds)
- **EVM Compatible**: Full Ethereum compatibility
- **Real-World Focus**: Perfect for credential verification in emerging markets

## 📋 Prerequisites

### 1. Get Testnet CELO

For Alfajores testnet:
```
https://faucet.celo.org/alfajores
```

Enter your wallet address and receive free testnet CELO.

### 2. Configure Wallet

Add Celo networks to MetaMask:

**Celo Alfajores Testnet**
- Network Name: `Celo Alfajores Testnet`
- RPC URL: `https://alfajores-forno.celo-testnet.org`
- Chain ID: `44787`
- Currency Symbol: `CELO`
- Block Explorer: `https://alfajores.celoscan.io`

**Celo Mainnet**
- Network Name: `Celo Mainnet`
- RPC URL: `https://forno.celo.org`
- Chain ID: `42220`
- Currency Symbol: `CELO`
- Block Explorer: `https://celoscan.io`

### 3. Environment Setup

Create/update your `.env` file:

```bash
# Deployment Key
PRIVATE_KEY=your_private_key_here

# Celo RPC URLs (optional - defaults to public endpoints)
CELO_ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org
CELO_MAINNET_RPC_URL=https://forno.celo.org

# CeloScan API Key (for contract verification)
CELOSCAN_API_KEY=your_celoscan_api_key
```

Get CeloScan API key from: https://celoscan.io/myapikey

### 4. Frontend Environment

Create/update `.env.local`:

```bash
# For Celo Alfajores Testnet
NEXT_PUBLIC_CHAIN_ID=44787
NEXT_PUBLIC_CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org

# Contract addresses (after deployment)
NEXT_PUBLIC_SBT_CONTRACT=0x...
NEXT_PUBLIC_VERIFIER_CONTRACT=0x...
```

## 🚀 Deployment

### Deploy to Celo Alfajores Testnet

```bash
npx hardhat run scripts/deploy-alfajores.js --network alfajores
```

Expected output:
```
🚀 Deploying Veritas Protocol to Celo Alfajores Testnet...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Deployment Details:
   Network: alfajores (Chain ID: 44787)
   Deployer: 0x...
   Balance: 10.0 CELO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Deploying VeritasSBT...
✅ VeritasSBT deployed to: 0x...

📝 Deploying VeritasZKVerifier...
✅ VeritasZKVerifier deployed to: 0x...
```

### Deploy to Celo Mainnet

⚠️ **WARNING**: This deploys to MAINNET with real CELO tokens!

```bash
npx hardhat run scripts/deploy-celo.js --network celo
```

### Verify Contracts

After deployment, verify your contracts on CeloScan:

```bash
# Verify VeritasSBT
npx hardhat verify --network alfajores <SBT_ADDRESS>

# Verify VeritasZKVerifier
npx hardhat verify --network alfajores <VERIFIER_ADDRESS> <SBT_ADDRESS>
```

For mainnet, replace `alfajores` with `celo`.

## 🔧 Development

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
# Run all tests
npx hardhat test

# Run with gas reporting
REPORT_GAS=true npx hardhat test
```

### Local Development

```bash
# Start local Hardhat node
npx hardhat node

# Deploy to local network (in another terminal)
npx hardhat run scripts/deploy.js --network localhost
```

## 📱 Frontend Integration

The frontend automatically supports multi-chain:

### Network Switcher

Users can switch between networks using the network switcher component:

```typescript
import { NetworkSwitcher } from '@/components/network-switcher'

// In your component
<NetworkSwitcher />
```

### Network Context

Access current network information:

```typescript
import { useNetwork } from '@/contexts/network-context'

function MyComponent() {
  const { currentNetwork, switchNetwork } = useNetwork()
  
  return (
    <div>
      <p>Current: {currentNetwork.name}</p>
      <button onClick={() => switchNetwork(CELO_ALFAJORES)}>
        Switch to Celo
      </button>
    </div>
  )
}
```

### Blockchain Service

The blockchain service automatically adapts to the selected network:

```typescript
import { blockchainService } from '@/lib/blockchain'

// Automatically uses the current network
const credentials = await blockchainService.getUserCredentials(address)
```

## 🌍 Multi-Chain Features

### Cross-Chain Credential Viewing

The explorer page displays credentials from all supported networks:

1. Navigate to `/explorer`
2. Use the network filter to view credentials from specific chains
3. Each credential card shows its origin network

### Network-Specific Gas Optimization

- **Avalanche**: Optimized for 25 gwei gas price
- **Celo**: Optimized for 5 gwei gas price (lower fees!)

### Smart Contract Addresses

Contract addresses are network-specific and stored in `deployed-contracts.json`:

```json
{
  "fuji": { ... },
  "alfajores": {
    "chainId": 44787,
    "contracts": {
      "VeritasSBT": { "address": "0x..." },
      "VeritasZKVerifier": { "address": "0x..." }
    }
  }
}
```

## 🔍 Monitoring & Debugging

### View Transactions

**Alfajores Testnet**
- Explorer: https://alfajores.celoscan.io
- View your transactions: `https://alfajores.celoscan.io/address/<YOUR_ADDRESS>`

**Celo Mainnet**
- Explorer: https://celoscan.io
- View your transactions: `https://celoscan.io/address/<YOUR_ADDRESS>`

### Check Network Status

```bash
# Test network connectivity
node scripts/test-multi-chain.js
```

### Debug Mode

Enable debug mode in `.env.local`:

```bash
NODE_ENV=development
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## 💡 Best Practices

### 1. Gas Optimization

Celo has lower gas fees than Avalanche, but still optimize:
- Batch credential issuance when possible
- Use efficient data structures
- Test gas costs before mainnet deployment

### 2. Network Selection

Choose the right network for your use case:
- **Alfajores**: Development and testing
- **Fuji**: Development and testing (Avalanche)
- **Celo Mainnet**: Production (mobile-first, low fees)
- **Avalanche Mainnet**: Production (high throughput)

### 3. Security

- Never commit private keys
- Use hardware wallets for mainnet deployments
- Verify contracts on explorers
- Audit smart contracts before mainnet launch

### 4. User Experience

- Detect user's current network
- Prompt network switching when needed
- Show clear network indicators
- Handle network errors gracefully

## 🆘 Troubleshooting

### Issue: Contract deployment fails

**Solution**: 
- Check your CELO balance
- Verify RPC endpoint is accessible
- Ensure private key is correct

```bash
# Check balance
npx hardhat run scripts/check-balance.js --network alfajores
```

### Issue: Transaction stuck/pending

**Solution**:
- Celo has ~5 second block times, wait a bit longer
- Check transaction on CeloScan
- Increase gas price if needed

### Issue: Cannot switch networks in MetaMask

**Solution**:
- Manually add Celo network to MetaMask
- Check chain ID matches (44787 for Alfajores)
- Clear MetaMask cache if needed

### Issue: Contract verification fails

**Solution**:
- Ensure CELOSCAN_API_KEY is set
- Wait 1-2 minutes after deployment
- Check compiler version matches (0.8.19)

## 📚 Additional Resources

### Official Documentation
- Celo Docs: https://docs.celo.org
- Celo Developer Portal: https://docs.celo.org/build-on-celo
- CeloScan: https://celoscan.io

### Network Information
- Celo Network Stats: https://stats.celo.org
- Alfajores Faucet: https://faucet.celo.org/alfajores
- Celo Forum: https://forum.celo.org

### Development Tools
- Celo CLI: https://docs.celo.org/cli
- Celo Composer: https://github.com/celo-org/celo-composer
- Hardhat Celo Plugin: https://github.com/celo-org/hardhat-celo

### Community
- Discord: https://discord.com/invite/celo
- Twitter: https://x.com/CeloDevs
- GitHub: https://github.com/celo-org

## 🎉 Next Steps

1. **Deploy to Alfajores**: Test your deployment on testnet
2. **Verify Contracts**: Ensure contracts are verified on CeloScan
3. **Test Frontend**: Verify multi-chain switching works
4. **Issue Test Credentials**: Create and verify credentials on Celo
5. **Monitor Performance**: Compare gas costs between networks
6. **Plan Mainnet**: Prepare for production deployment

## 📝 Notes

- Celo supports stable tokens (cUSD, cEUR) for gas payments
- Consider implementing multi-currency support for gas fees
- Celo has strong mobile wallet support (Valora, MetaMask Mobile)
- Lower gas fees make Celo ideal for high-frequency credential issuance

---

**Need Help?** Open an issue on GitHub or reach out to the Celo community on Discord.
