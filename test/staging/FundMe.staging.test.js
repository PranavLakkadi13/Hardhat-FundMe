const { assert, expect } = require("chai");;
const { getNamedAccounts, ethers, network } = require("hardhat");
const { developmentChain } = require("../../helper-hardhat-config");


(developmentChain.includes(network.name)) ? describe.skip 
 : describe("FundMe", () => {
    let fundme;
    let deployer;
    const sendvalue = ethers.utils.parseUnits("1000000000", "gwei");
    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        fundme = await ethers.getContract("FundMe", deployer);
    })
     
     it("Allows people to fund and withdraw", async () => {
         await fundme.fund({ value: sendvalue });
         await fundme.withdraw();
         const endingBalance = await ethers.provider.getBalance(fundme.address);
         await assert(endingBalance.toString(), "0");
    })
})