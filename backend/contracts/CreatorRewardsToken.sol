// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title CreatorRewardsContract
 * @dev Smart contract for Creator Rewards Platform using Vibe Coin as payment token
 * Empowers African creators by linking social media activity with direct on-chain payouts
 */
contract CreatorRewardsContract is Ownable, ReentrancyGuard {
    
    // Vibe Coin token interface
    IERC20 public immutable vibeCoin;
    
    // Events
    event RewardDistributed(address indexed creator, uint256 amount, string rewardId);
    event CreatorVerified(address indexed creator, uint256 stakeAmount);
    event CreatorStakeSlashed(address indexed creator, uint256 amount, string reason);
    event VibeCoinDeposited(address indexed depositor, uint256 amount);
    
    // Creator information
    struct Creator {
        bool isVerified;
        uint256 stakeAmount;
        uint256 totalEarned;
        uint256 lastRewardTime;
        string tier; // bronze, silver, gold, platinum
    }
    
    // Platform statistics
    uint256 public totalRewardsDistributed;
    uint256 public totalCreators;
    uint256 public totalStaked;
    uint256 public minimumStakeAmount;
    
    // Mappings
    mapping(address => Creator) public creators;
    mapping(string => bool) public processedRewards;
    
    // Platform wallet for collecting fees
    address public platformWallet;
    uint256 public platformFeePercentage; // in basis points (100 = 1%)
    
    constructor(
        address _vibeCoinAddress,
        address _platformWallet
    ) {
        require(_vibeCoinAddress != address(0), "Invalid Vibe Coin address");
        require(_platformWallet != address(0), "Invalid platform wallet");
        
        vibeCoin = IERC20(_vibeCoinAddress);
        platformWallet = _platformWallet;
        platformFeePercentage = 500; // 5% default fee
        minimumStakeAmount = 1000 * 10**18; // 1000 Vibe Coins minimum stake
    }
    
    /**
     * @dev Stake tokens to become a verified creator
     */
    function stakeForVerification(uint256 amount) external nonReentrant {
        require(amount >= minimumStakeAmount, "Insufficient stake amount");
        require(!creators[msg.sender].isVerified, "Creator already verified");
        require(vibeCoin.balanceOf(msg.sender) >= amount, "Insufficient Vibe Coin balance");
        
        // Transfer Vibe Coins to contract
        require(vibeCoin.transferFrom(msg.sender, address(this), amount), "Vibe Coin transfer failed");
        
        // Update creator info
        creators[msg.sender] = Creator({
            isVerified: true,
            stakeAmount: amount,
            totalEarned: 0,
            lastRewardTime: block.timestamp,
            tier: "bronze"
        });
        
        totalCreators++;
        totalStaked += amount;
        
        emit CreatorVerified(msg.sender, amount);
    }
    
    /**
     * @dev Distribute rewards to a creator (only owner/platform)
     */
    function distributeReward(
        address creator,
        uint256 amount,
        string memory rewardId
    ) external onlyOwner nonReentrant {
        require(creators[creator].isVerified, "Creator not verified");
        require(!processedRewards[rewardId], "Reward already processed");
        require(vibeCoin.balanceOf(address(this)) >= amount, "Insufficient contract Vibe Coin balance");
        
        // Calculate platform fee
        uint256 platformFee = (amount * platformFeePercentage) / 10000;
        uint256 creatorReward = amount - platformFee;
        
        // Transfer Vibe Coin reward to creator
        require(vibeCoin.transfer(creator, creatorReward), "Creator Vibe Coin transfer failed");
        
        // Transfer fee to platform
        if (platformFee > 0) {
            require(vibeCoin.transfer(platformWallet, platformFee), "Platform fee transfer failed");
        }
        
        // Update creator stats
        creators[creator].totalEarned += creatorReward;
        creators[creator].lastRewardTime = block.timestamp;
        
        // Update platform stats
        totalRewardsDistributed += creatorReward;
        processedRewards[rewardId] = true;
        
        emit RewardDistributed(creator, creatorReward, rewardId);
    }
    
    /**
     * @dev Update creator tier (only owner)
     */
    function updateCreatorTier(address creator, string memory newTier) external onlyOwner {
        require(creators[creator].isVerified, "Creator not verified");
        creators[creator].tier = newTier;
    }
    
    /**
     * @dev Slash creator stake for violations (only owner)
     */
    function slashCreatorStake(
        address creator,
        uint256 amount,
        string memory reason
    ) external onlyOwner {
        require(creators[creator].isVerified, "Creator not verified");
        require(creators[creator].stakeAmount >= amount, "Insufficient stake");
        
        creators[creator].stakeAmount -= amount;
        totalStaked -= amount;
        
        // Transfer slashed Vibe Coins to platform
        require(vibeCoin.transfer(platformWallet, amount), "Slash transfer failed");
        
        emit CreatorStakeSlashed(creator, amount, reason);
        
        // If stake falls below minimum, remove verification
        if (creators[creator].stakeAmount < minimumStakeAmount) {
            creators[creator].isVerified = false;
            totalCreators--;
        }
    }
    
    /**
     * @dev Withdraw stake (creator must not be verified)
     */
    function withdrawStake() external nonReentrant {
        require(!creators[msg.sender].isVerified, "Cannot withdraw while verified");
        uint256 stakeAmount = creators[msg.sender].stakeAmount;
        require(stakeAmount > 0, "No stake to withdraw");
        
        creators[msg.sender].stakeAmount = 0;
        totalStaked -= stakeAmount;
        
        require(vibeCoin.transfer(msg.sender, stakeAmount), "Stake withdrawal failed");
    }
    
    /**
     * @dev Get creator information
     */
    function getCreatorInfo(address creator) external view returns (
        bool isVerified,
        uint256 stakeAmount,
        uint256 totalEarned,
        uint256 lastRewardTime,
        string memory tier
    ) {
        Creator memory c = creators[creator];
        return (c.isVerified, c.stakeAmount, c.totalEarned, c.lastRewardTime, c.tier);
    }
    
    /**
     * @dev Get creator earnings
     */
    function getCreatorEarnings(address creator) external view returns (uint256) {
        return creators[creator].totalEarned;
    }
    
    /**
     * @dev Get platform statistics
     */
    function getPlatformStats() external view returns (
        uint256 _totalRewardsDistributed,
        uint256 _totalCreators,
        uint256 _totalStaked
    ) {
        return (totalRewardsDistributed, totalCreators, totalStaked);
    }
    
    /**
     * @dev Update platform settings (only owner)
     */
    function updatePlatformSettings(
        address newPlatformWallet,
        uint256 newFeePercentage,
        uint256 newMinimumStake
    ) external onlyOwner {
        platformWallet = newPlatformWallet;
        platformFeePercentage = newFeePercentage;
        minimumStakeAmount = newMinimumStake;
    }
    
    /**
     * @dev Add Vibe Coins to contract for rewards (only owner)
     */
    function addRewardTokens(uint256 amount) external onlyOwner {
        require(vibeCoin.balanceOf(msg.sender) >= amount, "Insufficient Vibe Coin balance");
        require(vibeCoin.transferFrom(msg.sender, address(this), amount), "Vibe Coin deposit failed");
        emit VibeCoinDeposited(msg.sender, amount);
    }
    
    /**
     * @dev Emergency withdraw Vibe Coins (only owner)
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(vibeCoin.balanceOf(address(this)) >= amount, "Insufficient contract Vibe Coin balance");
        require(vibeCoin.transfer(owner(), amount), "Emergency withdrawal failed");
    }
    
    /**
     * @dev Get contract's Vibe Coin balance
     */
    function getContractVibeCoinBalance() external view returns (uint256) {
        return vibeCoin.balanceOf(address(this));
    }
    
    /**
     * @dev Get Vibe Coin address
     */
    function getVibeCoinAddress() external view returns (address) {
        return address(vibeCoin);
    }
}