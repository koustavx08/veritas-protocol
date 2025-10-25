import { createPublicClient, createWalletClient, custom, http, parseAbi, getContract } from 'viem'
import { toast } from 'sonner'
import { NetworkConfig, toViemChain } from './networks'
import deployedContracts from '../deployed-contracts.json'

export {};
// Contract ABIs
// NOTE: Corrected tuple return syntax (remove the literal 'tuple' keyword) and updated event name to match contract (CredentialIssued)
export const SBT_ABI = parseAbi([
  "function mintCredential(address recipient, string credentialType, string issuerName, bytes32 metadataHash, string metadataURI) returns (uint256)",
  "function getUserCredentials(address user) view returns (uint256[])",
  "function getCredential(uint256 tokenId) view returns ((string credentialType, string issuerName, uint256 timestamp, bytes32 metadataHash, string metadataURI, bool isValid))",
  "function whitelistedIssuers(address issuer) view returns (bool)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function totalSupply() view returns (uint256)",
  "event CredentialIssued(uint256 indexed tokenId, address indexed recipient, address indexed issuer, string credentialType, string issuerName, uint256 timestamp, bytes32 metadataHash, string metadataURI)",
])

export const VERIFIER_ABI = parseAbi([
  "function submitProof(bytes32 requestId, bytes32 proofHash, bytes proof) returns (bytes32)",
  "function createVerificationRequest(string[] requiredCredentials, bytes32 criteriaHash, uint256 expiryTime) returns (bytes32)",
  // NOTE: viem/abitype expects tuple outputs WITHOUT the leading 'tuple' keyword
  "function getVerificationRequest(bytes32 requestId) view returns ((bytes32 requestId, address requester, string[] requiredCredentials, bytes32 criteriaHash, uint256 timestamp, uint256 expiryTime, bool isActive))",
  "function getRequesterRequests(address requester) view returns (bytes32[])",
  "function getProofSubmission(bytes32 proofId) view returns ((bytes32 proofId, bytes32 requestId, address prover, bytes32 proofHash, uint256 timestamp, bool isVerified, string result))",
  "event VerificationRequested(bytes32 indexed requestId, address indexed requester, string[] requiredCredentials, bytes32 criteriaHash, uint256 timestamp, uint256 expiryTime)",
  "event CredentialVerified(bytes32 indexed proofId, bytes32 indexed requestId, address indexed prover, bytes32 proofHash, uint256 timestamp, bool success, string result)",
])

export interface Credential {
  tokenId: string
  credentialType: string
  issuerName: string
  timestamp: number
  metadataHash: string
  metadataURI: string
  isValid: boolean



  owner?: string
}

export interface ProofRequest {
  requestId: string
  requester: string
  requiredCredentials: string[]
  criteriaHash: string
  timestamp: number
  expiryTime: number
  isActive: boolean
}

export interface ProofSubmission {
  proofId: string
  requestId: string
  prover: string
  proofHash: string
  timestamp: number
  isVerified: boolean
  result: string
}

export interface CredentialEvent {
  tokenId: string
  recipient: string
  issuer: string
  credentialType: string
  issuerName: string
  timestamp: number
  metadataHash: string
  metadataURI: string
  blockNumber: number
  transactionHash: string
  network?: string
  chainId?: number
}

export interface VerificationEvent {
  proofId: string
  requestId: string
  prover: string
  proofHash: string
  timestamp: number
  success: boolean
  result: string
  blockNumber: number
  transactionHash: string
  network?: string
  chainId?: number
}

export class BlockchainService {
  private publicClient: any = null
  private walletClient: any = null
  private account: `0x${string}` | null = null
  private sbtContract: any = null
  private verifierContract: any = null
  private currentNetwork: NetworkConfig | null = null

  constructor() {
    // Initialize with default network
    // The actual network will be set by the NetworkProvider
  }

  /**
   * Backward-compat helper for UI: create a simple proof request with defaults
   * - criteriaHash: zeros (placeholder)
   * - expiryTime: now + 7 days (in seconds)
   */
  async createProofRequest(requiredCredentials: string[]): Promise<string | null> {
    try {
      const criteriaHash = `0x${'0'.repeat(64)}` as `0x${string}`
      const expiry = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
      return await this.createVerificationRequest(requiredCredentials, criteriaHash, expiry)
    } catch (e) {
      console.error('Failed to create proof request:', e)
      return null
    }
  }

  /**
   * Backward-compat helper for UI: fetch a proof submission by id
   */
  async verifyProofById(proofId: string): Promise<ProofSubmission | null> {
    return this.getProofSubmission(proofId)
  }

  setNetwork(network: NetworkConfig) {
    this.currentNetwork = network
    this.initializePublicClient()
    return this
  }

  private initializePublicClient() {
    if (!this.currentNetwork) return

    this.publicClient = createPublicClient({
      chain: toViemChain(this.currentNetwork),
      transport: http(),
    })
  }

  async connectWallet(): Promise<string | null> {
    try {
      if (typeof window.ethereum === "undefined") {
        toast.error("Please install MetaMask or another Web3 wallet")
        return null
      }

      if (!this.currentNetwork) {
        toast.error("Network not configured")
        return null
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (!accounts || accounts.length === 0) {
        toast.error("No accounts found")
        return null
      }

      // Switch to the current network if needed
      await this.switchToNetwork()

      // Create wallet client
      this.walletClient = createWalletClient({
        chain: toViemChain(this.currentNetwork),
        transport: custom(window.ethereum),
      })

      this.account = accounts[0] as `0x${string}`

      // Initialize contract instances
      this.initializeContracts()

      toast.success(`Wallet connected to ${this.currentNetwork.name}!`)
      return this.account
    } catch (error: any) {
      console.error("Failed to connect wallet:", error)
      toast.error(`Failed to connect wallet: ${error.message}`)
      return null
    }
  }

  private async switchToNetwork() {
    if (!this.currentNetwork) return

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${this.currentNetwork.id.toString(16)}` }],
      })
    } catch (switchError: any) {
      // Chain not added to wallet
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${this.currentNetwork.id.toString(16)}`,
                chainName: this.currentNetwork.name,
                nativeCurrency: this.currentNetwork.nativeCurrency,
                rpcUrls: this.currentNetwork.rpcUrls.default.http,
                blockExplorerUrls: [this.currentNetwork.blockExplorers.default.url],
              },
            ],
          })
        } catch (addError) {
          throw new Error(`Failed to add ${this.currentNetwork.name} network`)
        }
      } else {
        throw switchError
      }
    }
  }

  private initializeContracts() {
    if (!this.publicClient || !this.walletClient || !this.currentNetwork) return

    const networkKey = this.currentNetwork.network
    const contracts = (deployedContracts as any)[networkKey]?.contracts

    if (!contracts) {
      console.error(`No contracts found for network: ${networkKey}`)
      return
    }

    this.sbtContract = getContract({
      address: contracts.VeritasSBT.address as `0x${string}`,
      abi: SBT_ABI,
      client: {
        public: this.publicClient,
        wallet: this.walletClient,
      },
    })

    this.verifierContract = getContract({
      address: contracts.VeritasZKVerifier.address as `0x${string}`,
      abi: VERIFIER_ABI,
      client: {
        public: this.publicClient,
        wallet: this.walletClient,
      },
    })
  }

  async checkConnection(): Promise<string | null> {
    try {
      if (typeof window.ethereum === "undefined") return null

      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      if (accounts && accounts.length > 0) {
        this.account = accounts[0] as `0x${string}`

        if (this.currentNetwork) {
          // Check if we're on the right network
          const chainId = await window.ethereum.request({ method: "eth_chainId" })
          if (parseInt(chainId, 16) !== this.currentNetwork.id) {
            await this.switchToNetwork()
          }

          this.walletClient = createWalletClient({
            chain: toViemChain(this.currentNetwork),
            transport: custom(window.ethereum),
          })

          this.initializeContracts()
        }
        
        return this.account
      }
      return null
    } catch (error) {
      console.error("Failed to check connection:", error)
      return null
    }
  }

  async isWhitelistedIssuer(address: string): Promise<boolean> {
    try {
      if (!this.sbtContract) throw new Error("Contract not initialized")
      return await this.sbtContract.read.whitelistedIssuers([address as `0x${string}`])
    } catch (error) {
      console.error("Failed to check issuer whitelist:", error)
      return false
    }
  }

  async mintCredential(
    recipient: string,
    credentialType: string,
    issuerName: string,
    metadataHash: string,
    metadataURI: string
  ): Promise<string | null> {
    try {
      if (!this.sbtContract || !this.account) {
        throw new Error("Contract not initialized or wallet not connected")
      }

      toast.loading("Minting credential...", { id: "mint-tx" })

      const tx = await this.sbtContract.write.mintCredential([
        recipient as `0x${string}`,
        credentialType,
        issuerName,
        metadataHash as `0x${string}`,
        metadataURI,
      ])

      toast.loading("Waiting for transaction confirmation...", { id: "mint-tx" })

      const receipt = await this.publicClient.waitForTransactionReceipt({ hash: tx })

      // Get the token ID from the event
      const logs = receipt.logs
      let tokenId = null

      for (const log of logs) {
        try {
          // viem provides log decoding helper; fall back to manual match
          const abiEvent = SBT_ABI.find((x: any) => x.type === 'event' && x.name === 'CredentialIssued') as any
          if (!abiEvent) continue
          const decoded = this.publicClient?.decodeEventLog ? this.publicClient.decodeEventLog({ abi: [abiEvent], data: log.data, topics: log.topics }) : null
          if (decoded && decoded.eventName === 'CredentialIssued') {
            tokenId = (decoded.args as any).tokenId.toString()
            break
          }
        } catch (e) {
          // Not our event, continue
        }
      }

      toast.success("Credential minted successfully!", { id: "mint-tx" })
      return tokenId
    } catch (error: any) {
      console.error("Failed to mint credential:", error)
      toast.error(`Failed to mint credential: ${error.shortMessage || error.message}`, { id: "mint-tx" })
      return null
    }
  }

  async getUserCredentials(address: string): Promise<Credential[]> {
    try {
      if (!this.sbtContract) throw new Error("Contract not initialized")

      const tokenIds = await this.sbtContract.read.getUserCredentials([address as `0x${string}`])
      const credentials: Credential[] = []

      for (const tokenId of tokenIds) {
        try {
          const credential = await this.sbtContract.read.getCredential([tokenId])
          credentials.push({
            tokenId: tokenId.toString(),
            credentialType: credential.credentialType,
            issuerName: credential.issuerName,
            timestamp: Number(credential.timestamp),
            metadataHash: credential.metadataHash,
            metadataURI: credential.metadataURI,
            isValid: credential.isValid,
            owner: address,
          })
        } catch (error) {
          console.error(`Failed to get credential ${tokenId}:`, error)
        }
      }

      return credentials
    } catch (error) {
      console.error("Failed to get user credentials:", error)
      return []
    }
  }

  async createVerificationRequest(
    requiredCredentials: string[],
    criteriaHash: string,
    expiryTime: number
  ): Promise<string | null> {
    try {
      if (!this.verifierContract || !this.account) {
        throw new Error("Contract not initialized or wallet not connected")
      }

      toast.loading("Creating verification request...", { id: "request-tx" })

      const tx = await this.verifierContract.write.createVerificationRequest([
        requiredCredentials,
        criteriaHash as `0x${string}`,
        BigInt(expiryTime),
      ])

      toast.loading("Waiting for transaction confirmation...", { id: "request-tx" })

      const receipt = await this.publicClient.waitForTransactionReceipt({ hash: tx })

      // Get the request ID from the event
      const logs = receipt.logs
      let requestId = null

      const verificationRequestedAbi = VERIFIER_ABI.find((x: any) => x.type === 'event' && x.name === 'VerificationRequested') as any
      for (const log of logs) {
        try {
          const decoded = this.publicClient.decodeEventLog({ abi: [verificationRequestedAbi], data: log.data, topics: log.topics })
            .catch ? null : null // placeholder to satisfy type narrowing
          const decodedEvent = this.publicClient.decodeEventLog({ abi: [verificationRequestedAbi], data: log.data, topics: log.topics })
          if (decodedEvent && decodedEvent.eventName === 'VerificationRequested') {
            const args: any = decodedEvent.args
            requestId = args.requestId
            break
          }
        } catch (_) {
          // ignore non-matching logs
        }
      }

      toast.success("Verification request created!", { id: "request-tx" })
      return requestId
    } catch (error: any) {
      console.error("Failed to create verification request:", error)
      toast.error(`Failed to create request: ${error.shortMessage || error.message}`, { id: "request-tx" })
      return null
    }
  }

  async getRequesterRequests(address: string): Promise<string[]> {
    try {
      if (!this.verifierContract) throw new Error("Contract not initialized")

      return await this.verifierContract.read.getRequesterRequests([address as `0x${string}`])
    } catch (error) {
      console.error("Failed to get requester requests:", error)
      return []
    }
  }

  async getVerificationRequest(requestId: string): Promise<ProofRequest | null> {
    try {
      if (!this.verifierContract) throw new Error("Contract not initialized")

      const request = await this.verifierContract.read.getVerificationRequest([requestId as `0x${string}`])

      // viem/abitype v1 returns tuple outputs as named object properties, not an array
      return {
        requestId: request.requestId,
        requester: request.requester,
        requiredCredentials: request.requiredCredentials,
        criteriaHash: request.criteriaHash,
        timestamp: Number(request.timestamp),
        expiryTime: Number(request.expiryTime),
        isActive: request.isActive,
      }
    } catch (error) {
      console.error("Failed to get verification request:", error)
      return null
    }
  }

  async submitProof(requestId: string, proofHash: string, proof: string): Promise<string | null> {
    try {
      if (!this.verifierContract || !this.account) {
        throw new Error("Contract not initialized or wallet not connected")
      }

      toast.loading("Submitting proof...", { id: "proof-tx" })

      const tx = await this.verifierContract.write.submitProof([
        requestId as `0x${string}`,
        proofHash as `0x${string}`,
        proof,
      ])

      toast.loading("Waiting for transaction confirmation...", { id: "proof-tx" })

      const receipt = await this.publicClient.waitForTransactionReceipt({ hash: tx })

      // Get the proof ID from the event
      const logs = receipt.logs
      let proofId = null

      const credentialVerifiedAbi = VERIFIER_ABI.find((x: any) => x.type === 'event' && x.name === 'CredentialVerified') as any
      for (const log of logs) {
        try {
          const decodedEvent = this.publicClient.decodeEventLog({ abi: [credentialVerifiedAbi], data: log.data, topics: log.topics })
          if (decodedEvent && decodedEvent.eventName === 'CredentialVerified') {
            const args: any = decodedEvent.args
            proofId = args.proofId
            break
          }
        } catch (_) {
          // ignore
        }
      }

      toast.success("Proof submitted successfully!", { id: "proof-tx" })
      return proofId
    } catch (error: any) {
      console.error("Failed to submit proof:", error)
      toast.error(`Failed to submit proof: ${error.shortMessage || error.message}`, { id: "proof-tx" })
      return null
    }
  }

  async getProofSubmission(proofId: string): Promise<ProofSubmission | null> {
    try {
      if (!this.verifierContract) throw new Error("Contract not initialized")

      const submission = await this.verifierContract.read.getProofSubmission([proofId as `0x${string}`])

      // viem/abitype v1 returns tuple outputs as named object properties
      return {
        proofId: submission.proofId,
        requestId: submission.requestId,
        prover: submission.prover,
        proofHash: submission.proofHash,
        timestamp: Number(submission.timestamp),
        isVerified: submission.isVerified,
        result: submission.result,
      }
    } catch (error) {
      console.error("Failed to get proof submission:", error)
      return null
    }
  }

  async getRecentCredentialEvents(limit: number = 10): Promise<CredentialEvent[]> {
    try {
      if (!this.publicClient || !this.sbtContract) throw new Error("Client not initialized")

      const events: CredentialEvent[] = []
      const networkKey = this.currentNetwork?.network || ''
      const chainId = this.currentNetwork?.id || 0

      const eventAbi = SBT_ABI.find((x: any) => x.type === 'event' && x.name === 'CredentialIssued') as any
      const logs = await this.publicClient.getLogs({
        address: this.sbtContract.address,
        event: eventAbi,
        fromBlock: BigInt(0),
        toBlock: 'latest',
      })

      for (const log of logs.slice(-limit)) {
        try {
          const decoded = this.publicClient.decodeEventLog({ abi: [eventAbi], data: log.data, topics: log.topics })
          if (decoded && decoded.eventName === 'CredentialIssued') {
            const args: any = decoded.args
            events.push({
              tokenId: args.tokenId.toString(),
              recipient: args.recipient,
              issuer: args.issuer,
              credentialType: args.credentialType,
              issuerName: args.issuerName,
              timestamp: Number(args.timestamp),
              metadataHash: args.metadataHash,
              metadataURI: args.metadataURI,
              blockNumber: Number(log.blockNumber),
              transactionHash: log.transactionHash,
              network: networkKey,
              chainId: chainId
            })
          }
        } catch (error) {
          console.error('Failed to decode log:', error)
        }
      }

      return events.reverse() // Most recent first
    } catch (error) {
      console.error("Failed to get recent credential events:", error)
      return []
    }
  }

  async getRecentVerificationEvents(limit: number = 10): Promise<VerificationEvent[]> {
    try {
      if (!this.publicClient || !this.verifierContract) throw new Error("Client not initialized")

      const events: VerificationEvent[] = []
      const networkKey = this.currentNetwork?.network || ''
      const chainId = this.currentNetwork?.id || 0

      const credentialVerifiedAbi = VERIFIER_ABI.find((x: any) => x.type === 'event' && x.name === 'CredentialVerified') as any
      const logs = await this.publicClient.getLogs({
        address: this.verifierContract.address,
        event: credentialVerifiedAbi,
        fromBlock: BigInt(0),
        toBlock: 'latest'
      })

      for (const log of logs.slice(-limit)) {
        try {
          const decoded = this.publicClient.decodeEventLog({ abi: [credentialVerifiedAbi], data: log.data, topics: log.topics })
          if (decoded && decoded.eventName === 'CredentialVerified') {
            const args: any = decoded.args
            events.push({
              proofId: args.proofId,
              requestId: args.requestId,
              prover: args.prover,
              proofHash: args.proofHash,
              timestamp: Number(args.timestamp),
              success: args.success,
              result: args.result,
              blockNumber: Number(log.blockNumber),
              transactionHash: log.transactionHash,
              network: networkKey,
              chainId: chainId
            })
          }
        } catch (error) {
          console.error('Failed to decode log:', error)
        }
      }

      return events.reverse() // Most recent first
    } catch (error) {
      console.error("Failed to get recent verification events:", error)
      return []
    }
  }

  getExplorerUrl(hash: string, type: "tx" | "address" | "token" = "tx"): string {
    if (!this.currentNetwork) return ""
    
    const baseUrl = this.currentNetwork.blockExplorers.default.url
    
    switch (type) {
      case "tx":
        return `${baseUrl}/tx/${hash}`
      case "address":
        return `${baseUrl}/address/${hash}`
      case "token":
        return `${baseUrl}/token/${hash}`
      default:
        return baseUrl
    }
  }

  getAccount(): string | null {
    return this.account
  }

  getCurrentNetwork(): NetworkConfig | null {
    return this.currentNetwork
  }
}

// Create a singleton instance
export const blockchainService = new BlockchainService()

// Fix for TypeScript: declare ethereum on window
declare global {
  interface Window {
    ethereum?: any;
  }
}
