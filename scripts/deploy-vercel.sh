#!/bin/bash

echo "🚀 Deploying Veritas Protocol to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Set environment variables
echo "📝 Setting environment variables..."

# Contract addresses (replace with actual deployed addresses)
vercel env add NEXT_PUBLIC_SBT_CONTRACT production
vercel env add NEXT_PUBLIC_VERIFIER_CONTRACT production

# Network configuration
vercel env add NEXT_PUBLIC_CELO_ALFAJORES_RPC production
vercel env add NEXT_PUBLIC_CHAIN_ID production
vercel env add NEXT_PUBLIC_EXPLORER_URL production

# Application configuration
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add NEXT_PUBLIC_ENABLE_REAL_ZK production
vercel env add NEXT_PUBLIC_ENABLE_ANALYTICS production

# Deploy to production
echo "🌐 Deploying to production..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Your app is live at: https://veritasprotocol.vercel.app"

# Optional: Set up custom domain
read -p "Do you want to set up a custom domain? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter your domain (e.g., veritasprotocol.xyz): " domain
    vercel domains add $domain
    echo "🌍 Custom domain $domain added!"
fi

echo "🎉 Veritas Protocol is now live!"
