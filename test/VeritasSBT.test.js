const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("VeritasSBT", () => {
  let VeritasSBT
  let veritasSBT
  let owner
  let issuer
  let recipient
  let unauthorized

  beforeEach(async () => {
    ;[owner, issuer, recipient, unauthorized] = await ethers.getSigners()

    VeritasSBT = await ethers.getContractFactory("VeritasSBT")
    veritasSBT = await VeritasSBT.deploy()
  // ethers v6: use waitForDeployment instead of deprecated deployed()
  await veritasSBT.waitForDeployment()
  })

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      expect(await veritasSBT.owner()).to.equal(owner.address)
    })

    it("Should have correct name and symbol", async () => {
      expect(await veritasSBT.name()).to.equal("Veritas Soulbound Token")
      expect(await veritasSBT.symbol()).to.equal("VSBT")
    })
  })

  describe("Issuer Management", () => {
    it("Should allow owner to whitelist issuers", async () => {
      await veritasSBT.setIssuerWhitelist(issuer.address, true)
      expect(await veritasSBT.whitelistedIssuers(issuer.address)).to.be.true
    })

    it("Should emit IssuerWhitelisted event", async () => {
      await expect(veritasSBT.setIssuerWhitelist(issuer.address, true))
        .to.emit(veritasSBT, "IssuerWhitelisted")
        .withArgs(issuer.address, true)
    })

    it("Should not allow non-owner to whitelist issuers", async () => {
      await expect(veritasSBT.connect(unauthorized).setIssuerWhitelist(issuer.address, true)).to.be.revertedWith(
        "Ownable: caller is not the owner",
      )
    })
  })

  describe("Credential Minting", () => {
    beforeEach(async () => {
      await veritasSBT.setIssuerWhitelist(issuer.address, true)
    })

    it("Should allow whitelisted issuer to mint credentials", async () => {
      const credentialType = "Hackathon Winner"
      const issuerName = "ETH Global"
  const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("metadata"))
      const metadataURI = "ipfs://QmTest123"

      await expect(
        veritasSBT
          .connect(issuer)
          .mintCredential(recipient.address, credentialType, issuerName, metadataHash, metadataURI),
      ).to.emit(veritasSBT, "CredentialIssued")

      expect(await veritasSBT.balanceOf(recipient.address)).to.equal(1)
    })

    it("Should not allow non-whitelisted issuer to mint", async () => {
      await expect(
        veritasSBT
          .connect(unauthorized)
          .mintCredential(
            recipient.address,
            "Test Credential",
            "Test Issuer",
            ethers.keccak256(ethers.toUtf8Bytes("test")),
            "ipfs://test",
          ),
      ).to.be.revertedWith("VeritasSBT: Not a whitelisted issuer")
    })

    it("Should store credential data correctly", async () => {
      const credentialType = "DeFi Contributor"
      const issuerName = "Uniswap"
  const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("metadata"))
      const metadataURI = "ipfs://QmTest456"

      await veritasSBT
        .connect(issuer)
        .mintCredential(recipient.address, credentialType, issuerName, metadataHash, metadataURI)

      const credential = await veritasSBT.getCredential(1)
      expect(credential.credentialType).to.equal(credentialType)
      expect(credential.issuerName).to.equal(issuerName)
      expect(credential.metadataHash).to.equal(metadataHash)
      expect(credential.isValid).to.be.true
    })
  })

  describe("Soulbound Properties", () => {
    beforeEach(async () => {
      await veritasSBT.setIssuerWhitelist(issuer.address, true)
      await veritasSBT
        .connect(issuer)
        .mintCredential(
          recipient.address,
          "Test Credential",
          "Test Issuer",
          ethers.keccak256(ethers.toUtf8Bytes("test")),
          "ipfs://test",
        )
    })

    it("Should prevent transfers", async () => {
      await expect(
        veritasSBT.connect(recipient).transferFrom(recipient.address, unauthorized.address, 1),
      ).to.be.revertedWith("VeritasSBT: Soulbound tokens cannot be transferred")
    })

    it("Should prevent approvals", async () => {
      await expect(veritasSBT.connect(recipient).approve(unauthorized.address, 1)).to.be.revertedWith(
        "VeritasSBT: Soulbound tokens cannot be approved",
      )
    })

    it("Should prevent setApprovalForAll", async () => {
      await expect(veritasSBT.connect(recipient).setApprovalForAll(unauthorized.address, true)).to.be.revertedWith(
        "VeritasSBT: Soulbound tokens cannot be approved",
      )
    })
  })

  describe("Credential Management", () => {
    beforeEach(async () => {
      await veritasSBT.setIssuerWhitelist(issuer.address, true)
      await veritasSBT
        .connect(issuer)
        .mintCredential(
          recipient.address,
          "Test Credential",
          "Test Issuer",
          ethers.keccak256(ethers.toUtf8Bytes("test")),
          "ipfs://test",
        )
    })

    it("Should allow owner to revoke credentials", async () => {
      await expect(veritasSBT.revokeCredential(1, "Test revocation"))
        .to.emit(veritasSBT, "CredentialRevoked")
        .withArgs(1, "Test revocation")

      const credential = await veritasSBT.getCredential(1)
      expect(credential.isValid).to.be.false
    })

    it("Should return user credentials", async () => {
      const userCredentials = await veritasSBT.getUserCredentials(recipient.address)
      expect(userCredentials.length).to.equal(1)
      expect(userCredentials[0]).to.equal(1)
    })

    it("Should track credential type counts", async () => {
      const count = await veritasSBT.getCredentialTypeCount("Test Credential")
      expect(count).to.equal(1)
    })
  })
})
