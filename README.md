# Veritas Protocol

Privacy‑preserving professional credential verification using Soulbound Tokens (SBTs) and Zero‑Knowledge (ZK) proofs. This monorepo contains a Next.js dApp, Hardhat smart contracts, basic Noir circuit scaffolding, and multi‑chain testnet support for Avalanche Fuji and Celo Alfajores.

## Highlights

- Soulbound credentials with OpenZeppelin ERC721 + non‑transferability guards
- ZK verifier contract (Noir‑style input shape; simulated proof generation in UI)
- Multi‑chain testnet support (Avalanche Fuji 43113, Celo Alfajores 44787)
- Clean Next.js 14 UI (App Router, Tailwind, shadcn/ui, RainbowKit + wagmi + viem)
- One‑command deploy scripts, optional contract verification, and JSON address registry
- Basic explorer, issuer, recruiter, and developer pages

## Architecture

- Frontend: Next.js 14 (TypeScript), TailwindCSS, shadcn/ui, wagmi, RainbowKit, viem
- Contracts: Hardhat, Solidity 0.8.19, OpenZeppelin, gas‑optimized, test coverage
- ZK: Noir circuit scaffold in `circuits/` and a simulated prover in `lib/zk-proof-service.ts`
- Networks: Testnet‑only mode (Fuji, Alfajores) managed via `lib/networks.ts` and context
- Addresses: Stored in `deployed-contracts.json` per network and consumed by the dApp

## Repo layout

- `app/` – Next.js app (App Router). Pages include `/`, `/explorer`, `/issuer`, `/recruiter`, `/developer`
- `components/` – UI components (shadcn/ui based) and domain widgets
- `contracts/` – `VeritasSBT.sol`, `VeritasZKVerifier.sol`
- `lib/` – config, network and blockchain helpers, simulated ZK proof service
- `circuits/` – Noir circuit scaffold (`Nargo.toml`, `src/main.nr`)
- `scripts/` – deployment, verification, env export, connectivity tests
- `test/` – Hardhat tests for contracts

## Smart contracts

- `VeritasSBT.sol`
  - Non‑transferable (soulbound) credential NFTs
  - Whitelist issuers; owner‑controlled revoke and metadata update
  - Events: `CredentialIssued`, `CredentialRevoked`, `IssuerWhitelisted`, `MetadataUpdated`
- `VeritasZKVerifier.sol`
  - Enhanced ZK verifier interface compatible with Noir‑style proofs
  - Proof requests with credential criteria and Merkle root anchoring
  - Replay protection, expiry, togglable verification

See tests in `test/*.test.js` for usage and invariants.

## Prerequisites

- Node.js 18+ (recommended for Next.js 14)
- pnpm 8+ (preferred) or npm
- A wallet private key with testnet funds for deployment
  - Avalanche Fuji faucet: https://faucet.avax.network
  - Celo Alfajores faucet: https://faucet.celo.org/alfajores

## Installation

```bat
pnpm install
```

## Environment setup

Create a `.env` for Hardhat deployments:

```env
# Deployer key (testnet only!)
PRIVATE_KEY=your_private_key

# RPC endpoints (optional; defaults exist)
AVALANCHE_FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
CELO_ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org

# Explorer API keys (optional, for verification)
SNOWTRACE_API_KEY=your_snowtrace_key
CELOSCAN_API_KEY=your_celoscan_key
```

Frontend `.env.local` is optional. The dApp prefers `deployed-contracts.json` for addresses. You may still provide RPC overrides and feature flags:

```env
# Chain to prefer in UI (43113 Fuji or 44787 Alfajores)
NEXT_PUBLIC_CHAIN_ID=43113

# Optional RPC overrides
NEXT_PUBLIC_AVALANCHE_FUJI_RPC=https://api.avax-test.network/ext/bc/C/rpc
NEXT_PUBLIC_CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org

# Optional contract overrides (normally not needed)
# NEXT_PUBLIC_SBT_CONTRACT=0x...
# NEXT_PUBLIC_VERIFIER_CONTRACT=0x...

# Feature flags
NEXT_PUBLIC_ENABLE_REAL_ZK=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

Tip: After deployment, contract addresses are recorded into `deployed-contracts.json` and consumed by the UI automatically via `lib/blockchain.ts`.

## Commands

Core app and contracts:

```bat
pnpm dev          :: run Next.js in dev mode
pnpm build        :: build Next.js
pnpm start        :: start Next.js (after build)
pnpm lint         :: lint Next.js

pnpm compile      :: hardhat compile
pnpm test         :: hardhat test
```

Network utilities and deploy:

```bat
pnpm test:networks   :: node scripts/test-network-connectivity.js

pnpm deploy:fuji     :: compile + deploy to Avalanche Fuji
pnpm deploy:alfajores:: compile + deploy to Celo Alfajores

pnpm verify:fuji     :: verify contracts on Snowtrace
pnpm verify:alfajores:: verify contracts on CeloScan

pnpm export:env      :: write env from deployed-contracts.json (see notes)
```

Notes:
- `scripts/export-env.js` emits `NEXT_PUBLIC_SBT_ADDRESS`/`NEXT_PUBLIC_VERIFIER_ADDRESS`. The UI primarily reads from `deployed-contracts.json`; use env overrides only if you need to.
- `scripts/status.js` is experimental and may require alignment with the current `deployed-contracts.json` shape.

## Develop and run

- Start the UI:
  ```bat
  pnpm dev
  ```
  Visit http://localhost:3000 and connect a wallet (RainbowKit/MetaMask). The default UI network is Avalanche Fuji; you can adapt via `contexts/network-context.tsx`.

- Compile and test contracts:
  ```bat
  pnpm compile
  pnpm test
  ```

## Deploy

Make sure `.env` is configured and your deployer has testnet funds.

- Avalanche Fuji (43113):
  ```bat
  pnpm deploy:fuji
  ```
  This will:
  - Deploy `VeritasSBT` and `VeritasZKVerifier`
  - Whitelist the deployer as an issuer (SBT)
  - Write/merge entries in `deployed-contracts.json`
  - Optionally verify on Snowtrace if `SNOWTRACE_API_KEY` is provided

- Celo Alfajores (44787):
  ```bat
  pnpm deploy:alfajores
  ```
  Post‑deploy, copy the printed addresses (or use the JSON file) if you want env overrides.

## Multi‑chain support (testnet‑only)

Supported networks are defined in `lib/networks.ts` and consumed via `contexts/network-context.tsx` and `lib/blockchain.ts`:

- Avalanche Fuji (43113) — explorer: https://testnet.snowtrace.io
- Celo Alfajores (44787) — explorer: https://alfajores.celoscan.io

For background and comparison, see:
- `TESTNET_ONLY_CONFIG.md`
- `QUICK_START_MULTICHAIN.md`
- `NETWORK_COMPARISON.md`
- `CELO_INTEGRATION.md`

## ZK circuits and proofs

- Noir circuit scaffold lives under `circuits/`
- `lib/zk-proof-service.ts` currently simulates proof generation and verification to match the contract interface
- In production, integrate compiled Noir WASM and wire `VeritasZKVerifier` with a real verification key

## Frontend features

- Wallet connect with RainbowKit; network detection and switch helpers
- Credential issuance (whitelisted issuers) and events feed
- Explorer view with recent `CredentialIssued` and verification events
- Proof submission demo flow using the simulated ZK service

## Troubleshooting

- Wrong network in wallet: use the UI switcher or add the network manually (see explorers/RPC above)
- Contract not found: ensure `deployed-contracts.json` contains your target network and addresses
- Verification fails: confirm the API key and wait a minute after deployment
- Types/ABI issues: make sure you compile with matching Solidity version (0.8.19) and `viaIR: true`

## Security and disclaimers

- Contracts are unaudited research code; use only on testnets as configured
- The ZK flow is partially simulated in the UI and not production‑grade
- Never commit or share real private keys

## Related docs

- `DEPLOYMENT.md` – Avalanche‑focused deployment notes
- `DEPLOYMENT_GUIDE.md` – Additional deployment guidance
- `QUICK_START_MULTICHAIN.md` – Pick your network and ship
- `CELO_INTEGRATION.md` / `CELO_INTEGRATION_SUMMARY.md` – Celo support details
- `MULTI-CHAIN-SUPPORT.md` – Design notes for multi‑chain UX/infra
- `README_VISUAL_GUIDE.md` – Visual cheat‑sheet

## License

Contracts contain `SPDX-License-Identifier: MIT`. Repository licensing for app code is not explicitly declared; treat as proprietary unless a LICENSE file is added.
