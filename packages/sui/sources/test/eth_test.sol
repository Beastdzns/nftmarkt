// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract EthereumSuiBridge {
    address public owner;
    mapping(address => bool) public supportedTokens;

    event DepositETH(address indexed sender, uint256 amount, string suiRecipient);
    event DepositToken(address indexed sender, address token, uint256 amount, string suiRecipient);
    event TokenSupportUpdated(address token, bool isSupported);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Add or remove supported ERC-20 tokens
    function updateTokenSupport(address token, bool isSupported) external onlyOwner {
        supportedTokens[token] = isSupported;
        emit TokenSupportUpdated(token, isSupported);
    }

    // Deposit ETH and specify the recipient on the Sui network
    function depositETH(string memory suiRecipient) external payable {
        require(msg.value > 0, "Must send ETH");
        emit DepositETH(msg.sender, msg.value, suiRecipient);
    }

    // Deposit ERC-20 tokens and specify the recipient on the Sui network
    function depositToken(address token, uint256 amount, string memory suiRecipient) external {
        require(supportedTokens[token], "Token not supported");
        require(amount > 0, "Must send tokens");

        // Transfer tokens from sender to this contract
        bool success = IERC20(token).transferFrom(msg.sender, address(this), amount);
        require(success, "Token transfer failed");

        emit DepositToken(msg.sender, token, amount, suiRecipient);
    }

    // Withdraw ETH (for administrative purposes)
    function withdrawETH(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        payable(owner).transfer(amount);
    }

    // Withdraw ERC-20 tokens (for administrative purposes)
    function withdrawToken(address token, uint256 amount) external onlyOwner {
        require(amount > 0, "Invalid amount");

        bool success = IERC20(token).transfer(owner, amount);
        require(success, "Token transfer failed");
    }
}

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function transfer(address recipient, uint256 amount) external returns (bool);
}
