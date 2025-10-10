# Veritas Protocol - Production Deployment Guide

This guide covers deploying the Veritas Protocol dApp to Vercel with full Avalanche Fuji integration and real ZK proof capabilities.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Vercel CLI** (`npm install -g vercel`)
3. **Deployed Smart Contracts** on Avalanche Fuji
4. **AVAX tokens** for gas fees
5. **Vercel Account** with deployment permissions

## Smart Contract Deployment

First, ensure your smart contracts are deployed to Avalanche Fuji:

\`\`\`bash
# Deploy contracts
npm run deploy:fuji

# Verify contracts
npm run verify

# Note the deployed addresses from deployed-contracts.json
\`\`\`

## Environment Configuration

Create a `.env.local` file with your configuration:

\`\`\`bash
# Contract Addresses (from deployment)
NEXT_PUBLIC_SBT_CONTRACT=0x...
NEXT_PUBLIC_VERIFIER_CONTRACT=0x...

# Network Configuration
NEXT_PUBLIC_AVALANCHE_FUJI_RPC=https://api.avax-test.network/ext/bc/C/rpc
NEXT_PUBLIC_CHAIN_ID=43113
NEXT_PUBLIC_EXPLORER_URL=https://testnet.snowtrace.io

# Application Configuration
NEXT_PUBLIC_APP_URL=https://veritasprotocol.vercel.app
NEXT_PUBLIC_ENABLE_REAL_ZK=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Optional: WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
\`\`\`

## Vercel Deployment

### Method 1: Automated Script

\`\`\`bash
chmod +x scripts/deploy-vercel.sh
./scripts/deploy-vercel.sh
\`\`\`

### Method 2: Manual Deployment

1. **Install Vercel CLI:**
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. **Login to Vercel:**
   \`\`\`bash
   vercel login
   \`\`\`

3. **Set Environment Variables:**
   \`\`\`bash
   # Contract addresses
   vercel env add NEXT_PUBLIC_SBT_CONTRACT production
   vercel env add NEXT_PUBLIC_VERIFIER_CONTRACT production
   
   # Network config
   vercel env add NEXT_PUBLIC_AVALANCHE_FUJI_RPC production
   vercel env add NEXT_PUBLIC_CHAIN_ID production
   vercel env add NEXT_PUBLIC_EXPLORER_URL production
   
   # App config
   vercel env add NEXT_PUBLIC_APP_URL production
   vercel env add NEXT_PUBLIC_ENABLE_REAL_ZK production
   \`\`\`

4. **Deploy:**
   \`\`\`bash
   vercel --prod
   \`\`\`

## Custom Domain Setup

1. **Add Domain to Vercel:**
   \`\`\`bash
   vercel domains add veritasprotocol.xyz
   \`\`\`

2. **Configure DNS:**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or add A record pointing to Vercel's IP

3. **SSL Certificate:**
   - Vercel automatically provisions SSL certificates
   - HTTPS is enforced by default

## Post-Deployment Verification

### 1. Contract Integration Test

Visit your deployed app and test:

- ✅ Wallet connection to Avalanche Fuji
- ✅ Contract address resolution
- ✅ Network switching functionality
- ✅ Transaction signing and submission

### 2. ZK Proof System Test

Test the zero-knowledge proof flow:

- ✅ Credential selection
- ✅ ZK proof generation (simulated)
- ✅ Proof submission to blockchain
- ✅ On-chain verification

### 3. Real-time Features Test

Verify live blockchain integration:

- ✅ Real-time credential events
- ✅ Live verification results
- ✅ Explorer integration
- ✅ Transaction status updates

## Production Optimizations

### Performance

1. **Enable Edge Functions:**
   \`\`\`json
   // vercel.json
   {
     "functions": {
       "app/api/zk-proof/route.ts": {
         "runtime": "edge"
       }
     }
   }
   \`\`\`

2. **Image Optimization:**
   \`\`\`javascript
   // next.config.js
   module.exports = {
     images: {
       domains: ['testnet.snowtrace.io'],
       formats: ['image/webp', 'image/avif'],
     },
   }
   \`\`\`

### Security

1. **Content Security Policy:**
   \`\`\`javascript
   // next.config.js
   const securityHeaders = [
     {
       key: 'Content-Security-Policy',
       value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
     }
   ]
   \`\`\`

2. **Environment Variable Security:**
   - Never expose private keys in client-side env vars
   - Use Vercel's encrypted environment variables
   - Rotate API keys regularly

### Monitoring

1. **Vercel Analytics:**
   \`\`\`bash
   vercel env add NEXT_PUBLIC_ENABLE_ANALYTICS true production
   \`\`\`

2. **Error Tracking:**
   \`\`\`javascript
   // Add Sentry or similar error tracking
   import * as Sentry from "@sentry/nextjs"
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
   })
   \`\`\`

## Troubleshooting

### Common Issues

1. **Contract Not Found:**
   - Verify contract addresses in environment variables
   - Check if contracts are deployed on correct network
   - Ensure ABI is up to date

2. **Network Connection Issues:**
   - Verify RPC URL is accessible
   - Check if Avalanche Fuji is operational
   - Test with alternative RPC endpoints

3. **ZK Proof Generation Fails:**
   - Check browser console for WASM loading errors
   - Verify circuit compilation
   - Test with smaller credential sets

4. **Transaction Failures:**
   - Ensure sufficient AVAX balance
   - Check gas limit settings
   - Verify contract function signatures

### Debug Mode

Enable debug mode for detailed logging:

\`\`\`bash
vercel env add NODE_ENV development production
vercel env add NEXT_PUBLIC_DEBUG true production
\`\`\`

## Maintenance

### Regular Tasks

1. **Monitor Contract Events:**
   - Set up alerts for failed transactions
   - Monitor gas usage patterns
   - Track proof verification success rates

2. **Update Dependencies:**
   \`\`\`bash
   npm audit
   npm update
   vercel --prod
   \`\`\`

3. **Backup Configuration:**
   - Export environment variables
   - Document contract addresses
   - Maintain deployment scripts

### Scaling Considerations

1. **Edge Functions:** Move heavy computations to edge
2. **CDN Optimization:** Cache static assets globally
3. **Database Integration:** Add persistent storage for analytics
4. **Load Balancing:** Distribute RPC calls across multiple endpoints

## Support

For deployment issues:

1. **Vercel Support:** https://vercel.com/help
2. **Avalanche Discord:** https://chat.avalabs.org/
3. **GitHub Issues:** Create issues in the project repository

## Security Checklist

- [ ] Contract addresses verified on Snowtrace
- [ ] Environment variables properly configured
- [ ] HTTPS enforced
- [ ] CSP headers configured
- [ ] No private keys in client code
- [ ] Error handling implemented
- [ ] Rate limiting configured
- [ ] Monitoring and alerts set up

## Go Live Checklist

- [ ] Smart contracts deployed and verified
- [ ] Frontend deployed to Vercel
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] All features tested on production
- [ ] Analytics and monitoring enabled
- [ ] Documentation updated
- [ ] Team access configured
- [ ] Backup procedures documented

🎉 **Congratulations!** Your Veritas Protocol dApp is now live on Vercel with full Avalanche Fuji integration!

Visit: https://veritasprotocol.vercel.app
\`\`\`

Create a production-ready package.json with deployment scripts:
