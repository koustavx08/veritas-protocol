const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("VeritasZKVerifier", () => {
  let VeritasZKVerifier
  let verifier
  let owner
  let requester
  let prover

  beforeEach(async () => {
    ;[owner, requester, prover] = await ethers.getSigners()

    VeritasZKVerifier = await ethers.getContractFactory("VeritasZKVerifier")
    verifier = await VeritasZKVerifier.deploy()
  await verifier.waitForDeployment()
  })

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      expect(await verifier.owner()).to.equal(owner.address)
    })

    it("Should have verification enabled by default", async () => {
      expect(await verifier.verificationEnabled()).to.be.true
    })

    it("Should have default expiry time set", async () => {
      expect(await verifier.defaultExpiryTime()).to.equal(7 * 24 * 60 * 60) // 7 days
    })
  })

  describe("Proof Request Management", () => {
    it("Should allow creating proof requests", async () => {
      const requiredCredentials = ["Hackathon Winner", "DeFi Contributor"]
      const criteriaHash = ethers.keccak256(ethers.toUtf8Bytes("criteria"))
      const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("root"))
      const minCredentials = 1
      await expect(
        verifier
          .connect(requester)
          .createProofRequest(requiredCredentials, criteriaHash, merkleRoot, minCredentials, 0),
      ).to.emit(verifier, "ProofRequestCreated")
    })

    it("Should not allow empty credential requirements", async () => {
      const criteriaHash = ethers.keccak256(ethers.toUtf8Bytes("criteria"))
      const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("root"))
      await expect(
        verifier.connect(requester).createProofRequest([], criteriaHash, merkleRoot, 1, 0),
      ).to.be.revertedWith("VeritasZKVerifier: No credentials specified")
    })

    it("Should store proof request data correctly", async () => {
      const requiredCredentials = ["Test Credential"]
      const criteriaHash = ethers.keccak256(ethers.toUtf8Bytes("test"))
      const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("root"))
      const minCredentials = 1
      const tx = await verifier
        .connect(requester)
        .createProofRequest(requiredCredentials, criteriaHash, merkleRoot, minCredentials, 0)
      const rc = await tx.wait()
      const ev = rc.logs.find((l) => l.fragment && l.fragment.name === "ProofRequestCreated")
      const requestId = ev.args.requestId
      const request = await verifier.getProofRequest(requestId)
      expect(request.requester).to.equal(requester.address)
      expect(request.criteriaHash).to.equal(criteriaHash)
      expect(request.merkleRoot).to.equal(merkleRoot)
      expect(request.minCredentials).to.equal(minCredentials)
      expect(request.isActive).to.be.true
    })
  })

  describe("Proof Submission", () => {
    let requestId
    let merkleRoot
    const minCredentials = 1
    const verificationKey = {
      alpha: [1, 2],
      beta: [
        [1, 2],
        [3, 4],
      ],
      gamma: [
        [5, 6],
        [7, 8],
      ],
      delta: [
        [9, 10],
        [11, 12],
      ],
      ic: [[13, 14]],
    }

    beforeEach(async () => {
      // Set a dummy verification key
      await verifier.setVerificationKey(verificationKey)
      const requiredCredentials = ["Test Credential"]
      const criteriaHash = ethers.keccak256(ethers.toUtf8Bytes("test"))
      merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("root"))
      const tx = await verifier
        .connect(requester)
        .createProofRequest(requiredCredentials, criteriaHash, merkleRoot, minCredentials, 0)
      const rc = await tx.wait()
      const ev = rc.logs.find((l) => l.fragment && l.fragment.name === "ProofRequestCreated")
      requestId = ev.args.requestId
    })

    it("Should allow submitting ZK proofs", async () => {
      const proofHash = ethers.keccak256(ethers.toUtf8Bytes("proof1"))
      const publicInputsHash = ethers.keccak256(ethers.toUtf8Bytes("inputs1"))
      const noirProof = {
        a: [1, 2],
        b: [
          [1, 2],
          [3, 4],
        ],
        c: [5, 6],
      }
      const criteriaHash = (await verifier.getProofRequest(requestId)).criteriaHash
      const publicInputs = [
        BigInt(merkleRoot),
        BigInt(minCredentials),
        BigInt(criteriaHash),
        42n,
      ]
      await expect(
        verifier.connect(prover).submitNoirZKProof(requestId, proofHash, publicInputsHash, noirProof, publicInputs),
      ).to.emit(verifier, "ZKProofSubmitted")
    })

    it("Should not allow zero proof hash", async () => {
      const publicInputsHash = ethers.keccak256(ethers.toUtf8Bytes("inputs2"))
      const noirProof = {
        a: [1, 2],
        b: [
          [1, 2],
          [3, 4],
        ],
        c: [5, 6],
      }
      const criteriaHash = (await verifier.getProofRequest(requestId)).criteriaHash
      const publicInputs = [
        BigInt(merkleRoot),
        BigInt(minCredentials),
        BigInt(criteriaHash),
        42n,
      ]
      await expect(
        verifier.connect(prover).submitNoirZKProof(requestId, ethers.ZeroHash, publicInputsHash, noirProof, publicInputs),
      ).to.be.revertedWith("VeritasZKVerifier: Invalid proof hash")
    })

    it("Should prevent proof replay attacks", async () => {
      const proofHash = ethers.keccak256(ethers.toUtf8Bytes("proof3"))
      const publicInputsHash = ethers.keccak256(ethers.toUtf8Bytes("inputs3"))
      const noirProof = {
        a: [1, 2],
        b: [
          [1, 2],
          [3, 4],
        ],
        c: [5, 6],
      }
      const criteriaHash = (await verifier.getProofRequest(requestId)).criteriaHash
      const publicInputs = [
        BigInt(merkleRoot),
        BigInt(minCredentials),
        BigInt(criteriaHash),
        42n,
      ]
      await verifier
        .connect(prover)
        .submitNoirZKProof(requestId, proofHash, publicInputsHash, noirProof, publicInputs)
      await expect(
        verifier
          .connect(prover)
          .submitNoirZKProof(requestId, proofHash, publicInputsHash, noirProof, publicInputs),
      ).to.be.revertedWith("VeritasZKVerifier: Proof already used")
    })
  })

  describe("Configuration Management", () => {
    it("Should allow owner to disable verification", async () => {
      await verifier.setVerificationEnabled(false)
      expect(await verifier.verificationEnabled()).to.be.false
    })

    it("Should allow owner to change default expiry time", async () => {
      const newExpiryTime = 14 * 24 * 60 * 60 // 14 days
      await verifier.setDefaultExpiryTime(newExpiryTime)
      expect(await verifier.defaultExpiryTime()).to.equal(newExpiryTime)
    })

    it("Should not allow non-owner to change configuration", async () => {
      await expect(verifier.connect(requester).setVerificationEnabled(false)).to.be.revertedWith(
        "Ownable: caller is not the owner",
      )
    })
  })
})
