# 🧪 Testnet-Only Configuration

## Overview

Veritas Protocol is configured to support **TESTNET NETWORKS ONLY**:

- ✅ **Avalanche Fuji Testnet** (Chain ID: 43113)
- ✅ **Celo Alfajores Testnet** (Chain ID: 44787)

Mainnet support has been removed to ensure safe testing and development.

## 🌐 Supported Networks

```
┌─────────────────────────────────────────┐
│         TESTNET NETWORKS ONLY           │
└─────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐
│ Avalanche Fuji   │      │ Celo Alfajores   │
│   Chain: 43113   │      │   Chain: 44787   │
│   Status: ✅     │      │   Status: ✅     │
└──────────────────┘      └──────────────────┘
```

## 📊 Network Details

| Feature | Avalanche Fuji | Celo Alfajores |
|---------|----------------|----------------|
| **Chain ID** | 43113 | 44787 |
| **Network Type** | Testnet | Testnet |
| **Gas Token** | AVAX | CELO |
| **Gas Price** | ~25 gwei | ~5 gwei |
| **Faucet** | [Get AVAX](https://faucet.avax.network) | [Get CELO](https://faucet.celo.org/alfajores) |
| **Explorer** | [SnowTrace](https://testnet.snowtrace.io) | [CeloScan](https://alfajores.celoscan.io) |
| **RPC** | https://api.avax-test.network/ext/bc/C/rpc | https://alfajores-forno.celo-testnet.org |

## 🚀 Deployment Commands

### Avalanche Fuji
```bash
# Deploy to Avalanche Fuji
npm run deploy:fuji

# Verify contracts
npm run verify:fuji
```

### Celo Alfajores
```bash
# Deploy to Celo Alfajores
npm run deploy:alfajores

# Verify contracts
npm run verify:alfajores
```

### Test Networks
```bash
# Test connectivity to all testnets
npm run test:networks
```

## 📝 Configuration Files

### Backend (.env)
```bash
# Avalanche Fuji
AVALANCHE_FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
SNOWTRACE_API_KEY=your_api_key

# Celo Alfajores
CELO_ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org
CELOSCAN_API_KEY=your_api_key

# Deployment
PRIVATE_KEY=your_private_key
```

### Frontend (.env.local)
```bash
# Choose testnet (43113 for Fuji or 44787 for Alfajores)
NEXT_PUBLIC_CHAIN_ID=44787

# Contract addresses (after deployment)
NEXT_PUBLIC_SBT_CONTRACT=0x...
NEXT_PUBLIC_VERIFIER_CONTRACT=0x...

# RPC endpoints
NEXT_PUBLIC_AVALANCHE_FUJI_RPC=https://api.avax-test.network/ext/bc/C/rpc
NEXT_PUBLIC_CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org
```

## 🔧 Network Configuration

### Hardhat Networks
Only testnet networks are configured:
- `fuji` - Avalanche Fuji Testnet
- `alfajores` - Celo Alfajores Testnet
- `localhost` - Local development
- `hardhat` - Hardhat network

### Available NPM Scripts
```json
{
  "deploy:fuji": "Deploy to Avalanche Fuji",
  "deploy:alfajores": "Deploy to Celo Alfajores",
  "verify:fuji": "Verify on SnowTrace",
  "verify:alfajores": "Verify on CeloScan",
  "test:networks": "Test network connectivity"
}
```

## 💰 Getting Testnet Tokens

### Avalanche Fuji
1. Visit: https://faucet.avax.network
2. Select "Fuji Testnet"
3. Enter your wallet address
4. Receive free AVAX tokens

### Celo Alfajores
1. Visit: https://faucet.celo.org/alfajores
2. Enter your wallet address
3. Complete CAPTCHA
4. Receive free CELO tokens

## 🔍 Block Explorers

### Avalanche Fuji
- **URL**: https://testnet.snowtrace.io
- **API**: Compatible with Etherscan API
- **Verification**: Use SnowTrace API key

### Celo Alfajores
- **URL**: https://alfajores.celoscan.io
- **API**: Compatible with Etherscan API
- **Verification**: Use CeloScan API key

## ⚠️ Important Notes

### What's NOT Included
- ❌ Avalanche Mainnet (Chain ID: 43114)
- ❌ Celo Mainnet (Chain ID: 42220)
- ❌ Any production/mainnet networks
- ❌ Mainnet deployment scripts

### Why Testnet Only?
1. **Safe Testing**: No risk of losing real funds
2. **Free Tokens**: Get free testnet tokens from faucets
3. **Development Focus**: Perfect for development and testing
4. **Cost-Effective**: No real gas fees
5. **Easy Experimentation**: Test features without financial risk

## 🎯 Workflow

```
1. Choose Network
   ├─ Avalanche Fuji (for higher throughput)
   └─ Celo Alfajores (for lower fees)
   
2. Get Testnet Tokens
   ├─ Fuji: faucet.avax.network
   └─ Alfajores: faucet.celo.org/alfajores
   
3. Configure .env
   └─ Add PRIVATE_KEY
   
4. Deploy Contracts
   ├─ npm run deploy:fuji
   └─ npm run deploy:alfajores
   
5. Update Frontend
   └─ Copy addresses to .env.local
   
6. Test Application
   ├─ Issue credentials
   ├─ Verify proofs
   └─ Compare networks
```

## 📚 Quick Links

| Resource | Avalanche Fuji | Celo Alfajores |
|----------|----------------|----------------|
| **Faucet** | [faucet.avax.network](https://faucet.avax.network) | [faucet.celo.org](https://faucet.celo.org/alfajores) |
| **Explorer** | [testnet.snowtrace.io](https://testnet.snowtrace.io) | [alfajores.celoscan.io](https://alfajores.celoscan.io) |
| **RPC** | api.avax-test.network | alfajores-forno.celo-testnet.org |
| **Docs** | [docs.avax.network](https://docs.avax.network) | [docs.celo.org](https://docs.celo.org) |

## ✅ Pre-Deployment Checklist

- [ ] Get testnet tokens from faucet
- [ ] Create `.env` file with PRIVATE_KEY
- [ ] Test network connectivity (`npm run test:networks`)
- [ ] Choose target network (Fuji or Alfajores)
- [ ] Deploy contracts to testnet
- [ ] Verify contracts on explorer
- [ ] Update `.env.local` with contract addresses
- [ ] Test frontend connection
- [ ] Issue test credentials
- [ ] Verify test proofs

## 🔒 Security Notes

### Safe Practices
- ✅ Only testnet tokens are at risk
- ✅ Use separate wallet for testing
- ✅ Never commit private keys
- ✅ Test thoroughly before any future mainnet deployment

### Risk Level
- **Testnet**: ⚠️ LOW RISK - Free tokens, safe to experiment
- **Mainnet**: ❌ NOT AVAILABLE - Configuration removed

## 🆘 Troubleshooting

### "Insufficient funds"
- Get testnet tokens from the faucet
- Wait a few minutes for tokens to arrive
- Check balance on explorer

### "Wrong network"
- Check NEXT_PUBLIC_CHAIN_ID in .env.local
- Ensure MetaMask is on correct network
- Manually add network if needed

### Deployment fails
- Verify PRIVATE_KEY is correct
- Ensure you have testnet tokens
- Check RPC endpoint is accessible
- Try increasing gas price

## 🎓 Learning Path

1. **Start with Celo Alfajores**
   - Lower gas fees
   - Perfect for learning
   - Mobile-optimized

2. **Test on Avalanche Fuji**
   - Higher throughput
   - Compare performance
   - Different ecosystem

3. **Compare Networks**
   - Analyze gas costs
   - Test user experience
   - Choose preferred network

## 📊 Cost Comparison (Testnet)

| Transaction | Avalanche Fuji | Celo Alfajores |
|-------------|----------------|----------------|
| Mint Credential | FREE (testnet) | FREE (testnet) |
| Submit Proof | FREE (testnet) | FREE (testnet) |
| Gas Token | FREE from faucet | FREE from faucet |
| Total Cost | $0.00 | $0.00 |

**All testnet transactions are FREE!** 🎉

---

**Configuration Date**: October 25, 2025  
**Status**: ✅ Testnet-Only Mode Active  
**Next Step**: Deploy to your preferred testnet!
