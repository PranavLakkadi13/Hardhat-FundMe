// other way of doing it ==> 
/*
async function deployfunc(hre) {
    // const {getNamedAccounts, deployments} = hre;
    hre.getNamedAccounts();
    hre.deployments;
    console.log("hi");
}

module.exports.default = deployfunc ;
*/

const { network } = require("hardhat");
/* the below type of exporting is used to just specifically get the variable/object
    from a particular file 
    
    also before importing make sure that the variable is in module.exports   
*/
const { networkConfig, developmentChain } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre;
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    const chainId = network.config.chainId;

    let ethUsdPriceFeedAddress;
    let ethUsdAggregator;
    if (developmentChain.includes(network.name)) {
        // deployments.get == const {get} = deployments 
        ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    }
    else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsd"];
    }
    const args = [ethUsdPriceFeedAddress]
    //here we r deployig the contract using the deploy keyword
    // in the deploy func (=> {} -> are a list of over-rides)
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,// put price feed --> constructor args 
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })

    if (
      !developmentChain.includes(network.name) &&
      process.env.PolygonScan_API_KEY
    ) {
      await verify(fundMe.address, args);
    }
      log("deploying the contract on the test network!!!!!");
    log("---------------------------------------------------");
}

module.exports.tags = ["all", "fundme"];