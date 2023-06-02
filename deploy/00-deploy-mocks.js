const { networkConfig } = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { developmentChain,initialAnswer,decimals } = require("../helper-hardhat-config");


module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    const chainId = network.config.chainId;

    if (developmentChain.includes(network.name)) {
        log("Local network detected!!!!")
        log("Deploying mocks ---> ")
        await deploy("MockV3Aggregator", {
            from: deployer,
            // in this contract we can choose our inital price since it is a mock
            args: [decimals,initialAnswer], // --> constructor args 
            log: true,
        })
        log("----------------------------------------------");
        log("Mocks Deployed!!!!!!!");
        log("-----------------------------------------------");
    }

}

module.exports.tags = ["all", "mocks"];