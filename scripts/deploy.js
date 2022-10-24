const hre = require("hardhat");

async function main() {
// Otiene el contrato para desplegar y despliega el contrato
const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
const buyMeACoffee = await BuyMeACoffee.deploy();
await buyMeACoffee.deployed();
console.log("BuyMeACoffee desplegado en ", buyMeACoffee.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });