const { getNamedAccounts } = require("hardhat");


async function main() {
    const { deployer } = await getNamedAccounts();
    const fundme = await ethers.getContract("FundMe", deployer);
    const transactionResponse = await fundme.withdraw();
    await transactionResponse.wait(1);
    console.log("got the funds back ");
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
