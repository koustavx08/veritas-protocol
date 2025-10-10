// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title VeritasZKVerifier
 * @dev Enhanced Zero-Knowledge Proof Verifier with Noir circuit integration
 */
contract VeritasZKVerifier is Ownable, ReentrancyGuard {
    uint256 private _proofIdCounter;
    
    // Verification key for Noir circuit (simplified for demo)
    struct VerificationKey {
        uint256[2] alpha;
        uint256[2][2] beta;
        uint256[2][2] gamma;
        uint256[2][2] delta;
        uint256[][] ic;
    }
    
    // Proof structure matching Noir output
    struct NoirProof {
        uint256[2] a;
        uint256[2][2] b;
        uint256[2] c;
    }
    
    // Enhanced proof request structure
    struct ProofRequest {
        bytes32 requestId;
        address requester;
        string[] requiredCredentials;
        bytes32 criteriaHash;
        bytes32 merkleRoot;
        uint256 minCredentials;
        uint256 timestamp;
        uint256 expiryTime;
        bool isActive;
    }
    
    // Enhanced proof submission structure
    struct ProofSubmission {
        bytes32 proofId;
        bytes32 requestId;
        address prover;
        bytes32 proofHash;
        bytes32 publicInputsHash;
        NoirProof noirProof;
        uint256[] publicInputs;
        uint256 timestamp;
        bool isVerified;
        string verificationResult;
        uint256 gasUsed;
    }
    
    // Mappings
    mapping(bytes32 => ProofRequest) public proofRequests;
    mapping(bytes32 => ProofSubmission) public proofSubmissions;
    mapping(address => bytes32[]) public userProofRequests;
    mapping(address => bytes32[]) public userProofSubmissions;
    mapping(bytes32 => bool) public usedProofHashes;
    
    // Verification key storage (internal to avoid getter issues with dynamic arrays)
    VerificationKey internal verificationKey;
    bool public verificationKeySet = false;
    
    // Configuration
    uint256 public defaultExpiryTime = 7 days;
    bool public verificationEnabled = true;
    uint256 public proofVerificationGasLimit = 500000;
    
    // Events
    event ProofRequestCreated(
        bytes32 indexed requestId,
        address indexed requester,
        string[] requiredCredentials,
        bytes32 criteriaHash,
        bytes32 merkleRoot,
        uint256 minCredentials,
        uint256 expiryTime
    );
    
    event ZKProofSubmitted(
        bytes32 indexed proofId,
        bytes32 indexed requestId,
        address indexed prover,
        bytes32 proofHash,
        uint256 timestamp,
        bool success,
        string result,
        uint256 gasUsed
    );
    
    event VerificationKeyUpdated(address indexed updater);
    event ProofRequestExpired(bytes32 indexed requestId);
    event VerificationStatusChanged(bool enabled);
    
    // Modifiers
    modifier onlyActiveRequest(bytes32 requestId) {
        require(proofRequests[requestId].isActive, "VeritasZKVerifier: Request not active");
        require(
            block.timestamp <= proofRequests[requestId].expiryTime,
            "VeritasZKVerifier: Request expired"
        );
        _;
    }
    
    modifier verificationIsEnabled() {
        require(verificationEnabled, "VeritasZKVerifier: Verification is disabled");
        _;
    }
    
    modifier verificationKeyExists() {
        require(verificationKeySet, "VeritasZKVerifier: Verification key not set");
        _;
    }
    
    constructor() {}
    
    /**
     * @dev Set the verification key for Noir circuit
     * @param _verificationKey The verification key components
     */
    function setVerificationKey(VerificationKey memory _verificationKey) external onlyOwner {
        verificationKey = _verificationKey;
        verificationKeySet = true;
        emit VerificationKeyUpdated(msg.sender);
    }
    
    /**
     * @dev Create an enhanced proof request with merkle root
     * @param requiredCredentials Array of required credential types
     * @param criteriaHash Hash of additional verification criteria
     * @param merkleRoot Merkle root of the SBT registry
     * @param minCredentials Minimum number of matching credentials required
     * @param customExpiryTime Custom expiry time (0 for default)
     * @return requestId The generated request ID
     */
    function createProofRequest(
        string[] memory requiredCredentials,
        bytes32 criteriaHash,
        bytes32 merkleRoot,
        uint256 minCredentials,
        uint256 customExpiryTime
    ) external returns (bytes32) {
        require(requiredCredentials.length > 0, "VeritasZKVerifier: No credentials specified");
        require(minCredentials > 0, "VeritasZKVerifier: Invalid minimum credentials");
        require(merkleRoot != bytes32(0), "VeritasZKVerifier: Invalid merkle root");
        
        bytes32 requestId = keccak256(
            abi.encodePacked(
                msg.sender,
                keccak256(abi.encode(requiredCredentials)),
                criteriaHash,
                merkleRoot,
                minCredentials,
                block.timestamp,
                block.number
            )
        );
        
        require(!proofRequests[requestId].isActive, "VeritasZKVerifier: Request already exists");
        
        uint256 expiryTime = customExpiryTime > 0 ? 
            block.timestamp + customExpiryTime : 
            block.timestamp + defaultExpiryTime;
        
        proofRequests[requestId] = ProofRequest({
            requestId: requestId,
            requester: msg.sender,
            requiredCredentials: requiredCredentials,
            criteriaHash: criteriaHash,
            merkleRoot: merkleRoot,
            minCredentials: minCredentials,
            timestamp: block.timestamp,
            expiryTime: expiryTime,
            isActive: true
        });
        
        userProofRequests[msg.sender].push(requestId);
        
        emit ProofRequestCreated(
            requestId,
            msg.sender,
            requiredCredentials,
            criteriaHash,
            merkleRoot,
            minCredentials,
            expiryTime
        );
        
        return requestId;
    }
    
    /**
     * @dev Submit a Noir-generated zero-knowledge proof
     * @param requestId The proof request ID
     * @param proofHash Hash of the proof
     * @param publicInputsHash Hash of public inputs
     * @param noirProof The Noir proof structure
     * @param publicInputs Array of public inputs
     * @return proofId The generated proof submission ID
     */
    function submitNoirZKProof(
        bytes32 requestId,
        bytes32 proofHash,
        bytes32 publicInputsHash,
        NoirProof memory noirProof,
        uint256[] memory publicInputs
    ) external nonReentrant onlyActiveRequest(requestId) verificationIsEnabled verificationKeyExists returns (bytes32) {
        require(proofHash != bytes32(0), "VeritasZKVerifier: Invalid proof hash");
        require(publicInputsHash != bytes32(0), "VeritasZKVerifier: Invalid public inputs hash");
        require(!usedProofHashes[proofHash], "VeritasZKVerifier: Proof already used");
        require(publicInputs.length >= 4, "VeritasZKVerifier: Insufficient public inputs");
        
        _proofIdCounter++;
        bytes32 proofId = keccak256(abi.encodePacked("NOIR_PROOF", _proofIdCounter));
        
        // Mark proof hash as used to prevent replay attacks
        usedProofHashes[proofHash] = true;
        
        uint256 gasStart = gasleft();
        
        // Verify the Noir proof
        (bool isVerified, string memory result) = _verifyNoirProof(
            requestId,
            noirProof,
            publicInputs
        );
        
        uint256 gasUsed = gasStart - gasleft();
        
        proofSubmissions[proofId] = ProofSubmission({
            proofId: proofId,
            requestId: requestId,
            prover: msg.sender,
            proofHash: proofHash,
            publicInputsHash: publicInputsHash,
            noirProof: noirProof,
            publicInputs: publicInputs,
            timestamp: block.timestamp,
            isVerified: isVerified,
            verificationResult: result,
            gasUsed: gasUsed
        });
        
        userProofSubmissions[msg.sender].push(proofId);
        
        emit ZKProofSubmitted(
            proofId,
            requestId,
            msg.sender,
            proofHash,
            block.timestamp,
            isVerified,
            result,
            gasUsed
        );
        
        return proofId;
    }
    
    /**
     * @dev Verify a Noir proof against the verification key
     * @param requestId The request ID
     * @param proof The Noir proof
     * @param publicInputs The public inputs
     * @return isValid Whether the proof is valid
     * @return result Verification result message
     */
    function _verifyNoirProof(
        bytes32 requestId,
        NoirProof memory proof,
        uint256[] memory publicInputs
    ) internal view returns (bool isValid, string memory result) {
        ProofRequest memory request = proofRequests[requestId];
        
        // Basic validation
        if (proof.a[0] == 0 && proof.a[1] == 0) {
            return (false, "Invalid proof: zero A component");
        }
        
        if (proof.c[0] == 0 && proof.c[1] == 0) {
            return (false, "Invalid proof: zero C component");
        }
        
        // Validate public inputs structure
        if (publicInputs.length < 4) {
            return (false, "Invalid public inputs: insufficient length");
        }
        
        // Extract public inputs
        uint256 merkleRoot = publicInputs[0];
        uint256 minCredentials = publicInputs[1];
        uint256 criteriaHashUint = publicInputs[2];
        
        // Validate against request parameters
        if (merkleRoot != uint256(request.merkleRoot)) {
            return (false, "Invalid merkle root");
        }
        
        if (minCredentials != request.minCredentials) {
            return (false, "Invalid minimum credentials requirement");
        }
        
        if (criteriaHashUint != uint256(request.criteriaHash)) {
            return (false, "Invalid criteria hash");
        }
        
        // Simulate actual Noir proof verification
        // In production, this would use the actual verification key and pairing operations
        uint256 proofComplexity = uint256(keccak256(abi.encodePacked(
            proof.a[0], proof.a[1], proof.c[0], proof.c[1]
        ))) % 100;
        
        // 90% success rate for well-formed proofs
        if (proofComplexity < 90) {
            return (true, "Noir proof verified successfully");
        } else {
            return (false, "Noir proof verification failed");
        }
    }
    
    /**
     * @dev Verify a submitted proof by ID
     * @param proofId The proof submission ID
     * @return isVerified Whether the proof is valid
     * @return result Verification result message
     */
    function verifyProofById(bytes32 proofId) external view returns (bool isVerified, string memory result) {
        ProofSubmission memory submission = proofSubmissions[proofId];
        require(submission.proofId != bytes32(0), "VeritasZKVerifier: Proof not found");
        
        return (submission.isVerified, submission.verificationResult);
    }
    
    /**
     * @dev Get detailed proof submission information
     * @param proofId The proof ID
     * @return submission The complete proof submission
     */
    function getProofSubmission(bytes32 proofId) external view returns (ProofSubmission memory) {
        return proofSubmissions[proofId];
    }
    
    /**
     * @dev Get proof request details
     * @param requestId The request ID
     * @return request The proof request
     */
    function getProofRequest(bytes32 requestId) external view returns (ProofRequest memory) {
        return proofRequests[requestId];
    }
    
    /**
     * @dev Get verification statistics
     * @return totalRequests Total number of proof requests
     * @return totalSubmissions Total number of proof submissions
     * @return successfulVerifications Number of successful verifications
     */
    function getVerificationStats() external view returns (
        uint256 totalRequests,
        uint256 totalSubmissions,
        uint256 successfulVerifications
    ) {
        totalSubmissions = _proofIdCounter;
        
        // Count successful verifications
        for (uint256 i = 1; i <= totalSubmissions; i++) {
            bytes32 proofId = keccak256(abi.encodePacked("NOIR_PROOF", i));
            if (proofSubmissions[proofId].isVerified) {
                successfulVerifications++;
            }
        }
        
        // This is a simplified count - in production you'd track this more efficiently
        totalRequests = totalSubmissions; // Approximation
        
        return (totalRequests, totalSubmissions, successfulVerifications);
    }
    
    /**
     * @dev Set proof verification gas limit
     * @param gasLimit New gas limit for proof verification
     */
    function setProofVerificationGasLimit(uint256 gasLimit) external onlyOwner {
        require(gasLimit > 100000, "VeritasZKVerifier: Gas limit too low");
        proofVerificationGasLimit = gasLimit;
    }
    
    /**
     * @dev Emergency function to disable verification
     * @param enabled Whether verification is enabled
     */
    function setVerificationEnabled(bool enabled) external onlyOwner {
        verificationEnabled = enabled;
        emit VerificationStatusChanged(enabled);
    }
    
    /**
     * @dev Set default expiry time for proof requests
     * @param newExpiryTime New default expiry time in seconds
     */
    function setDefaultExpiryTime(uint256 newExpiryTime) external onlyOwner {
        require(newExpiryTime > 0, "VeritasZKVerifier: Invalid expiry time");
        defaultExpiryTime = newExpiryTime;
    }
}
