// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

// Retorna el balance de Ether de una determinada address.
async function getBalance(address){
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Loguea los balances de Ether de una lista de addresses. 
async function printBalances(addresses){
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

// Loguea los memos almacenados onchain desde la compra de cafecitos. 
async function printMemos(memos) {
  for (const memo of memos){
    const timestamp = memo.timestamp;
    const tipper = memo.console;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  }
}

async function main() {
  // Obtiene cuentas de ejemplo
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  // Otiene el contrato para desplegar y despliega el contrato
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee desplegado en ", buyMeACoffee.address);

  // Chequea balances antes de la compra del cafecito 
  const addresses = [owner.address, tipper.address , buyMeACoffee.address];
  console.log(" == start ==");
  await printBalances(addresses);


  // Compra al owner algunos cafecitos 
  const tip = {value: hre.ethers.utils.parseEther("1")};
  await buyMeACoffee.connect(tipper).buyCoffee("Carolina", "Sos el mejor",tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Vitto", "Increible profesor",tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("Kay", "Amo mi PoK NFT",tip);

  // Chequea balances despues de comprar 
  console.log("== Compra de cafecitos ==");
  await printBalances(addresses);

  // Extrae fondos 
  await buyMeACoffee.connect(owner).withdrawTips();

  // Chequea fondos despues de extraerlos 
  console.log("== WithdrawTips al owner ==");
  await printBalances(addresses);

  // Lee todos los memos que quedan para el owner
  console.log("== memos == ");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
