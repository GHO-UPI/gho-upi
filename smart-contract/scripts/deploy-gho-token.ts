import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(
    `Deploying contract with the account: ${deployer.address}`
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const GhoToken = await ethers.getContractFactory("GhoToken");
  const ghoToken = await GhoToken.deploy(deployer.address);
  await ghoToken.deployed();
  console.log("GhoToken deployed to:", ghoToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
