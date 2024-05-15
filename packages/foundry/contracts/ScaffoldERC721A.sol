//SPDX-License-Identifier: MIT
pragma solidity >=0.8.19;

import "forge-std/console.sol";
import "./Constraints.sol";
import "../lib/ERC721A/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ScaffoldERC721A is ERC721A, Ownable {
    error ScaffoldERC721A__DidNotProvideEnoughCapital();
    error ScaffoldERC721A__IsNotWithinMintWindow();
    error ScaffoldERC721A__YouGottaHitUpTheWeedman();
    error ScaffoldERC721A__NoTokensLeftToMint();
    error ScaffoldERC721A__NotEnoughMintableTokensToFulfillRequest();
    error ScaffoldERC721A__CannotMintThatMany();
    error ScaffoldERC721A__AddressNotZero();

    event Minted(address user, uint256 startIndex, uint256 endIndex);

    string s_baseURI;
    uint256 immutable s_mintStartTimestamp;
    uint256 immutable s_mintEndTimestamp;
    uint256 immutable s_mintPrice;
    address immutable s_mintRoyaltyRecipient;

    uint256 s_startTokenId;
    uint256 s_maxTokenCount;
    uint256 s_maxMintCountPerUser;

    mapping(address user => uint256) s_mintAmount;

    struct ScaffoldERC721AParameters {
        address owner;
        string name;
        string symbol;
        string baseURI;
        uint256 mintStartTimestamp;
        uint256 mintEndTimestamp;
        uint256 mintPrice;
        uint256 maxTokenCount;
        uint256 maxMintCountPerUser;
        address mintRoyaltyRecipient;
    }

    constructor(ScaffoldERC721AParameters memory params)
        ERC721A(params.name, params.symbol)
        Ownable(params.owner)
    {
        s_baseURI = params.baseURI;
        s_mintStartTimestamp = params.mintStartTimestamp;
        s_mintEndTimestamp = params.mintEndTimestamp;
        s_mintPrice = params.mintPrice;
        s_maxTokenCount = params.maxTokenCount;
        s_maxMintCountPerUser = params.maxMintCountPerUser;

        if (params.mintRoyaltyRecipient == address(0)) {
            revert ScaffoldERC721A__AddressNotZero();
        }

        s_mintRoyaltyRecipient = params.mintRoyaltyRecipient;
    }

    function mint(address recipient, uint256 amount) public payable {
        if (!isWithinConstraints()) {
            revert ScaffoldERC721A__IsNotWithinMintWindow();
        }

        if (msg.value < getMintPrice() * amount) {
            revert ScaffoldERC721A__DidNotProvideEnoughCapital();
        }

        if (_totalMinted() >= s_maxTokenCount) {
            revert ScaffoldERC721A__NoTokensLeftToMint();
        }

        if (_totalMinted() + amount > s_maxTokenCount) {
            revert ScaffoldERC721A__NotEnoughMintableTokensToFulfillRequest();
        }

        if (s_mintAmount[recipient] + amount > s_maxMintCountPerUser) {
            revert ScaffoldERC721A__CannotMintThatMany();
        }

        _mint(recipient, amount);
    }

    function _mint(address recipient, uint256 amount) internal override {
        s_mintAmount[recipient] += amount;
        emit Minted(recipient, _nextTokenId(), _nextTokenId() + amount);
        super._mint(recipient, amount);
    }

    function withdraw() external returns (bool) {
        (bool sent,) =
            s_mintRoyaltyRecipient.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");

        return sent;
    }

    function _baseURI() internal view override returns (string memory) {
        return s_baseURI;
    }

    function isWithinConstraints() public view returns (bool isWithin) {
        isWithin = Constraints.isWithin(
            block.timestamp, getMintStartTimestamp(), getMintEndTimestamp()
        );
    }

    function _startTokenId() internal pure override returns (uint256) {
        return 1;
    }

    function getMintStartTimestamp() public view returns (uint256) {
        return s_mintStartTimestamp;
    }

    function getMintEndTimestamp() public view returns (uint256) {
        return s_mintEndTimestamp;
    }

    function getMaxTokenCount() external view returns (uint256) {
        return s_maxTokenCount;
    }

    function getCurrentTokenCount() external view returns (uint256 mintCount) {
        mintCount = _totalMinted();
    }

    function getMintPrice() public view returns (uint256 mintPrice) {
        mintPrice = s_mintPrice;
    }

    function getMintRoyaltyRecipient() external view returns (address) {
        return s_mintRoyaltyRecipient;
    }
}
