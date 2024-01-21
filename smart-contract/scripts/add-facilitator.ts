import { ethers } from "hardhat";

async function main() {
  const ghoTokenAddress = "0x7c6D6B74733C0b2cBa4993d80ab1574cca20fEd9";
  const bucketCapacity = ethers.utils.parseUnits("1000000", 18);

  const [deployer] = await ethers.getSigners();

  const GhoToken = await ethers.getContractFactory("GhoToken");
  const ghoToken = GhoToken.attach(ghoTokenAddress).connect(deployer);

  const tx = await ghoToken.addFacilitator(deployer.address, "NFT Facilitator", bucketCapacity);
  await tx.wait();

  console.log(`Facilitator added successfully. Transaction Hash: ${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
