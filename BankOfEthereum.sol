// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BankOfEthereumTEST is ERC20, Ownable {
    mapping (address => uint) public balances;
    mapping (address => uint256) public lastClaimTime;
    uint256 constant REWARD_INTERVAL = 1 days;

    event DepositMade(address indexed _from, uint _value);
    event WithdrawalMade(address indexed _to, uint _value);

    constructor() ERC20("Bank of Ethereum", "BOE") {
        transferOwnership(address(this));
    }

    function deposit() public payable {
        require(msg.value > 0, "Amount must be greater than 0");
        balances[msg.sender] += msg.value;
        emit DepositMade(msg.sender, msg.value);
    }

    function withdraw(uint amount) public {
        require(amount > 0 && amount <= balances[msg.sender], "Amount must be greater than 0 and less than or equal to the balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit WithdrawalMade(msg.sender, amount);
    }

    function claimRewards() public {
        //require(block.timestamp >= lastClaimTime[msg.sender] + REWARD_INTERVAL, "Rewards can only be claimed once per day.");

        // Calculate the rewards before updating the balance
        uint256 rewardsToClaim = calculateRewards(msg.sender);

        // Update the last claim time and transfer the rewards
        lastClaimTime[msg.sender] = block.timestamp;
        if (rewardsToClaim > 0) {
            _mint(msg.sender, rewardsToClaim); // Mint the rewards to the user
        }
    }

function calculateRewards(address user) public view returns (uint256) {
    uint256 elapsedTime = block.timestamp - lastClaimTime[user];
    uint256 rewardsToClaim = balances[user] * elapsedTime * getRewardRate() / 100 / (86400); // Rate per day

    return rewardsToClaim;
}

function getRewardRate() public view returns (uint256) {
    uint256 totalEth = address(this).balance;
    uint256 rate = 777; // 7.77% per day
    if (totalEth > 0) {
        rate = rate * 1e18 / totalEth; // Convert rate to wei
        if (rate > 100) {
            rate = 100; // Cap rate at 100%
        }
    }
    return rate;
}


    function mint(address to, uint256 amount) internal onlyOwner {
        _mint(to, amount);
    }
}
