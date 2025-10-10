# Veritas Protocol Multi-Chain Support

## Overview

This document outlines the multi-chain support implemented in the Veritas Protocol dApp. The application now supports transactions across multiple blockchain networks, including:

- Avalanche Fuji Testnet
- Avalanche Mainnet
- Ethereum Goerli Testnet
- Polygon Mumbai Testnet
- Polygon Mainnet

## Features Implemented

### 1. Network Configuration

A comprehensive network configuration system has been implemented in `lib/networks.ts` that defines:

- Network identifiers
- Chain IDs
- RPC URLs
- Explorer URLs
- Native currency details
- Testnet/Mainnet classification

### 2. Network Mode Switcher

A UI component has been added that allows users to:

- Toggle between Testnet and Mainnet modes
- Select specific networks within each mode
- View the currently selected network

The network switcher is implemented in `components/network-switcher.tsx` and can be placed in the application header or settings panel.

### 3. Network Context Provider

A React context provider (`contexts/network-context.tsx`) manages the global network state, providing:

- Current network information
- Network switching functionality
- Network mode (testnet/mainnet) management
- Network validation

### 4. Multi-Chain Explorer

The explorer page (`app/explorer/page.tsx`) has been enhanced to:

- Display credentials and verifications across all supported networks
- Filter events by network
- Show network badges on each event
- Adapt to the currently selected network

### 5. Updated Blockchain Service

The blockchain service (`lib/blockchain.ts`) has been refactored to:

- Support dynamic network switching
- Initialize contracts based on the selected network
- Retrieve contract addresses from network-specific configurations
- Provide network-aware explorer URLs

### 6. Enhanced Wallet Connection

The wallet connection component (`components/wallet-connect-button.tsx`) now:

- Displays the current network
- Shows network status (correct/incorrect)
- Provides network switching functionality
- Adapts to the selected network's native currency

## Contract Deployment

The `deployed-contracts.json` file has been restructured to support multiple networks, with each network having its own set of contract addresses:

```json
{
  "networks": {
    "avalanche-fuji": {
      "chainId": 43113,
      "VeritasSBT": { "address": "0x..." },
      "VeritasZKVerifier": { "address": "0x..." }
    },
    "avalanche-mainnet": {
      "chainId": 43114,
      "VeritasSBT": { "address": "0x..." },
      "VeritasZKVerifier": { "address": "0x..." }
    },
    // Additional networks...
  }
}
```

## Testing

A test script (`scripts/test-multi-chain.js`) has been created to verify:

- Contract availability across networks
- Explorer URL formatting
- Network configuration accuracy

Run the test script with:

```bash
node scripts/test-multi-chain.js
```

## Future Enhancements

### Wagmi + RainbowKit Integration

Future work includes integrating `wagmi` and `@rainbow-me/rainbowkit` for improved wallet connections across chains. This will provide:

- Better wallet connection UX
- Simplified chain switching
- Support for more wallet providers
- Improved error handling

### Cross-Chain Messaging

Implementing cross-chain messaging to enable:

- Credential verification across different networks
- Unified identity across chains
- Cross-chain credential issuance

### Indexing Service

Developing an indexing service to:

- Cache events from multiple chains
- Provide faster explorer queries
- Enable advanced filtering and search
- Support historical data analysis

## Usage Guidelines

### For Users

1. Use the network switcher to select your preferred network
2. Connect your wallet to the selected network
3. If on the wrong network, use the "Switch" button to change networks
4. Use the explorer to view credentials and verifications across all networks

### For Developers

1. Access the current network through the NetworkContext
2. Use blockchainService methods which are now network-aware
3. Deploy contracts to new networks and update deployed-contracts.json
4. Test functionality across different networks