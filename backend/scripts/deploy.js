const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Creator Rewards Contract with Vibe Coin integration...");

  // Get the ContractFactory and Signers
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Configuration
  const VIBE_COIN_ADDRESS = process.env.VIBE_COIN_ADDRESS || "0x..."; // Replace with actual Vibe Coin address
  const PLATFORM_WALLET = process.env.PLATFORM_WALLET || deployer.address;

  if (VIBE_COIN_ADDRESS === "0x...") {
    throw new Error("Please set VIBE_COIN_ADDRESS environment variable");
  }

  // Deploy the contract
  const CreatorRewardsContract = await ethers.getContractFactory("CreatorRewardsContract");
  const contract = await CreatorRewardsContract.deploy(VIBE_COIN_ADDRESS, PLATFORM_WALLET);

  await contract.deployed();

  console.log("✅ CreatorRewardsContract deployed to:", contract.address);
  console.log("📍 Vibe Coin Address:", VIBE_COIN_ADDRESS);
  console.log("🏦 Platform Wallet:", PLATFORM_WALLET);

  // Verify the deployment
  console.log("\n📋 Contract Configuration:");
  const vibeCoinAddress = await contract.getVibeCoinAddress();
  console.log("- Vibe Coin Address:", vibeCoinAddress);
  console.log("- Platform Wallet:", await contract.platformWallet());

  // Save deployment info
  const deploymentInfo = {
    contractAddress: contract.address,
    vibeCoinAddress: VIBE_COIN_ADDRESS,
    platformWallet: PLATFORM_WALLET,
    deploymentBlock: await ethers.provider.getBlockNumber(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    network: (await ethers.provider.getNetwork()).name,
  };

  console.log("\n💾 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Instructions
  console.log("\n📝 Next Steps:");
  console.log("1. Update your .env file with the contract address:");
  console.log(`   SMART_CONTRACT_ADDRESS=${contract.address}`);
  console.log("\n2. Add the contract ABI to your backend configuration");
  console.log("\n3. Fund the contract with Vibe Coin tokens for rewards:");
  console.log(`   - Transfer Vibe Coin to: ${contract.address}`);
  console.log(`   - Or use the addRewardTokens() function`);
  console.log("\n4. Verify the contract on Etherscan for transparency");

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });