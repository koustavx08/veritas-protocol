// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title VeritasSBT
 * @dev Soulbound Token (SBT) contract for professional credential verification
 * @notice This contract implements non-transferable tokens for verified credentials
 */
contract VeritasSBT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIdCounter;
    
    // Credential metadata structure
    struct Credential {
        string credentialType;      // e.g., "Hackathon Winner", "DeFi Contributor"
        string issuerName;          // Organization name
        uint256 timestamp;          // Issuance timestamp
        bytes32 metadataHash;       // Hash of additional metadata
        string metadataURI;         // IPFS or other URI for metadata
        bool isValid;               // Revocation status
    }
    
    // Mappings
    mapping(uint256 => Credential) public credentials;
    mapping(address => bool) public whitelistedIssuers;
    mapping(address => uint256[]) public userCredentials;
    mapping(string => uint256) public credentialTypeCount;
    
    // Events
    event CredentialIssued(
        uint256 indexed tokenId,
        address indexed recipient,
        address indexed issuer,
        string credentialType,
        string issuerName,
        uint256 timestamp,
        bytes32 metadataHash,
        string metadataURI
    );
    
    event IssuerWhitelisted(address indexed issuer, bool status);
    event CredentialRevoked(uint256 indexed tokenId, string reason);
    event MetadataUpdated(uint256 indexed tokenId, string newMetadataURI);
    
    // Modifiers
    modifier onlyWhitelistedIssuer() {
        require(whitelistedIssuers[msg.sender], "VeritasSBT: Not a whitelisted issuer");
        _;
    }
    
    modifier tokenExists(uint256 tokenId) {
        require(_ownerOf(tokenId) != address(0), "VeritasSBT: Token does not exist");
        _;
    }
    
    constructor() ERC721("Veritas Soulbound Token", "VSBT") {}
    
    /**
     * @dev Whitelist or remove an issuer
     * @param issuer Address of the issuer
     * @param status True to whitelist, false to remove
     */
    function setIssuerWhitelist(address issuer, bool status) external onlyOwner {
        require(issuer != address(0), "VeritasSBT: Invalid issuer address");
        whitelistedIssuers[issuer] = status;
        emit IssuerWhitelisted(issuer, status);
    }
    
    /**
     * @dev Mint a new credential SBT
     * @param recipient Address to receive the SBT
     * @param credentialType Type of credential
     * @param issuerName Name of the issuing organization
     * @param metadataHash Hash of the credential metadata
     * @param metadataURI URI pointing to credential metadata
     */
    function mintCredential(
        address recipient,
        string memory credentialType,
        string memory issuerName,
        bytes32 metadataHash,
        string memory metadataURI
    ) external onlyWhitelistedIssuer nonReentrant returns (uint256) {
        require(recipient != address(0), "VeritasSBT: Invalid recipient address");
        require(bytes(credentialType).length > 0, "VeritasSBT: Credential type cannot be empty");
        require(bytes(issuerName).length > 0, "VeritasSBT: Issuer name cannot be empty");
        require(metadataHash != bytes32(0), "VeritasSBT: Invalid metadata hash");
        
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        
        // Mint the token
        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, metadataURI);
        
        // Store credential data
        credentials[newTokenId] = Credential({
            credentialType: credentialType,
            issuerName: issuerName,
            timestamp: block.timestamp,
            metadataHash: metadataHash,
            metadataURI: metadataURI,
            isValid: true
        });
        
        // Update mappings
        userCredentials[recipient].push(newTokenId);
        credentialTypeCount[credentialType]++;
        
        emit CredentialIssued(
            newTokenId,
            recipient,
            msg.sender,
            credentialType,
            issuerName,
            block.timestamp,
            metadataHash,
            metadataURI
        );
        
        return newTokenId;
    }
    
    /**
     * @dev Revoke a credential (mark as invalid)
     * @param tokenId Token ID to revoke
     * @param reason Reason for revocation
     */
    function revokeCredential(uint256 tokenId, string memory reason) 
        external 
        onlyOwner 
        tokenExists(tokenId) 
    {
        require(credentials[tokenId].isValid, "VeritasSBT: Credential already revoked");
        credentials[tokenId].isValid = false;
        emit CredentialRevoked(tokenId, reason);
    }
    
    /**
     * @dev Update metadata URI for a credential
     * @param tokenId Token ID to update
     * @param newMetadataURI New metadata URI
     */
    function updateMetadataURI(uint256 tokenId, string memory newMetadataURI) 
        external 
        onlyOwner 
        tokenExists(tokenId) 
    {
        _setTokenURI(tokenId, newMetadataURI);
        credentials[tokenId].metadataURI = newMetadataURI;
        emit MetadataUpdated(tokenId, newMetadataURI);
    }
    
    /**
     * @dev Get all credentials owned by a user
     * @param user Address of the user
     * @return Array of token IDs
     */
    function getUserCredentials(address user) external view returns (uint256[] memory) {
        return userCredentials[user];
    }
    
    /**
     * @dev Get credential details by token ID
     * @param tokenId Token ID to query
     * @return Credential struct
     */
    function getCredential(uint256 tokenId) external view tokenExists(tokenId) returns (Credential memory) {
        return credentials[tokenId];
    }
    
    /**
     * @dev Get total number of credentials of a specific type
     * @param credentialType Type of credential to count
     * @return Number of credentials of that type
     */
    function getCredentialTypeCount(string memory credentialType) external view returns (uint256) {
        return credentialTypeCount[credentialType];
    }
    
    /**
     * @dev Get total number of minted tokens
     * @return Current token ID counter
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }
    
    // Override functions to make tokens soulbound (non-transferable)
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(from == address(0), "VeritasSBT: Soulbound tokens cannot be transferred");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    function approve(address, uint256) public pure override(ERC721, IERC721) {
        revert("VeritasSBT: Soulbound tokens cannot be approved");
    }
    
    function setApprovalForAll(address, bool) public pure override(ERC721, IERC721) {
        revert("VeritasSBT: Soulbound tokens cannot be approved");
    }
    
    function transferFrom(address, address, uint256) public pure override(ERC721, IERC721) {
        revert("VeritasSBT: Soulbound tokens cannot be transferred");
    }
    
    function safeTransferFrom(address, address, uint256) public pure override(ERC721, IERC721) {
        revert("VeritasSBT: Soulbound tokens cannot be transferred");
    }
    
    function safeTransferFrom(address, address, uint256, bytes memory) public pure override(ERC721, IERC721) {
        revert("VeritasSBT: Soulbound tokens cannot be transferred");
    }
    
    // Required overrides for multiple inheritance
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
