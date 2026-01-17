// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DecisionNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    struct DecisionRecord {
        bytes32 snapshotId;
        bytes32 actionSetHash;
        string note;
    }

    // tokenId => 决策记录
    mapping(uint256 => DecisionRecord) public records;

    event DecisionMinted(
        uint256 tokenId,
        bytes32 snapshotId,
        bytes32 actionSetHash
    );

    constructor() ERC721("Firelinad Decision Record", "FLDR") Ownable(msg.sender) {}

    function mintDecisionRecord(
        address to,
        bytes32 snapshotId,
        bytes32 actionSetHash,
        string calldata note,
        string calldata tokenUri
    ) external onlyOwner returns (uint256) {
        // 铸造决策 NFT 并保存审计数据
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenUri);
        records[tokenId] = DecisionRecord(snapshotId, actionSetHash, note);
        emit DecisionMinted(tokenId, snapshotId, actionSetHash);
        return tokenId;
    }
}
