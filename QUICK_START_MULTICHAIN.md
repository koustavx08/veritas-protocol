# 🚀 Quick Start: Multi-Chain Deployment Guide

## Overview

Veritas Protocol supports deployment on multiple blockchain networks:

- ✅ **Avalanche Fuji Testnet** (Deployed)
- ✨ **Celo Alfajores Testnet** (NEW)
- 🌐 **Avalanche Mainnet** (Ready)
- 🌐 **Celo Mainnet** (Ready)

## 🎯 Choose Your Network

### For Testing & Development

**Option 1: Avalanche Fuji** (Already deployed)
- ✅ Contracts already deployed
- Fast transactions
- Good for high-throughput testing

**Option 2: Celo Alfajores** (NEW - Recommended for mobile)
- 🆕 Fresh deployment needed
- Lower gas fees
- Mobile-first architecture
- Perfect for emerging markets

### For Production

**Option 1: Avalanche Mainnet**
- High throughput
- Established DeFi ecosystem
- Higher gas fees

**Option 2: Celo Mainnet**
- Lower gas fees
- Mobile-optimized
- Stable token support (cUSD, cEUR)
- Real-world use cases

## 🚀 Quick Deploy to Celo

### Step 1: Get Testnet CELO

Visit: https://faucet.celo.org/alfajores

Enter your wallet address and get free testnet CELO.

### Step 2: Configure Environment

Create `.env` file:

```bash
PRIVATE_KEY=your_wallet_private_key
CELO_ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org
CELOSCAN_API_KEY=your_celoscan_api_key  # Optional for verification
```

### Step 3: Deploy

```bash
# Install dependencies (if not already done)
npm install

# Compile contracts
npx hardhat compile

# Deploy to Celo Alfajores
npx hardhat run scripts/deploy-alfajores.js --network alfajores
```

### Step 4: Update Frontend

Copy the contract addresses from deployment output to `.env.local`:

```bash
NEXT_PUBLIC_SBT_CONTRACT=0x...
NEXT_PUBLIC_VERIFIER_CONTRACT=0x...
NEXT_PUBLIC_CHAIN_ID=44787
```

### Step 5: Start Frontend

```bash
npm run dev
```

Open http://localhost:3000 and connect your wallet!

## 📊 Network Comparison

| Feature | Avalanche Fuji | Celo Alfajores |
|---------|----------------|----------------|
| Chain ID | 43113 | 44787 |
| Gas Token | AVAX | CELO |
| Avg Gas Price | ~25 gwei | ~5 gwei 💰 |
| Block Time | ~2 seconds | ~5 seconds |
| Faucet | [Avalanche Faucet](https://faucet.avax.network) | [Celo Faucet](https://faucet.celo.org/alfajores) |
| Explorer | [SnowTrace](https://testnet.snowtrace.io) | [CeloScan](https://alfajores.celoscan.io) |
| Best For | High throughput | Mobile, low fees |

## 🔗 Useful Links

### Celo Resources
- 📚 [Celo Integration Guide](./CELO_INTEGRATION.md) - Complete Celo setup guide
- 🌐 [Celo Docs](https://docs.celo.org)
- 💧 [Alfajores Faucet](https://faucet.celo.org/alfajores)
- 🔍 [CeloScan Explorer](https://alfajores.celoscan.io)

### Avalanche Resources
- 📚 [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- 🌐 [Avalanche Docs](https://docs.avax.network)
- 💧 [Fuji Faucet](https://faucet.avax.network)
- 🔍 [SnowTrace Explorer](https://testnet.snowtrace.io)

### General Resources
- 📚 [Multi-Chain Support](./MULTI-CHAIN-SUPPORT.md)
- 🔧 [Hardhat Config](./hardhat.config.js)

## 🆘 Troubleshooting

### "Insufficient funds" error
- Get testnet tokens from the faucet
- Wait a few minutes for tokens to arrive
- Check balance on the explorer

### "Network not supported" in MetaMask
- Manually add the network to MetaMask
- Use the network details from the comparison table above

### Deployment fails
- Check your `PRIVATE_KEY` is correct
- Ensure you have testnet tokens
- Verify RPC URL is accessible

## 💡 Next Steps

After deployment:

1. ✅ Verify contracts on the explorer
2. 🧪 Test credential issuance
3. 🔍 Verify ZK proofs
4. 📱 Test on mobile (especially for Celo)
5. 🚀 Deploy to mainnet when ready

## 🌟 Why Multi-Chain?

- **Flexibility**: Choose the network that fits your use case
- **Cost Optimization**: Use Celo for lower fees
- **Reach**: Access different ecosystems and user bases
- **Redundancy**: Not dependent on a single network
- **Future-Proof**: Easy to add more networks

---

**Need detailed instructions?** See [CELO_INTEGRATION.md](./CELO_INTEGRATION.md) for complete Celo setup guide.
