require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");

RPC_URL_Alchemy_SEPOLIA = process.env.RPC_URL_Alchemy_SEPOLIA;
Coinmarketcap_API_KEY = process.env.Coinmarketcap_API_KEY;
Private_Key = process.env.Private_Key;
RPC_URL_POLYGON = process.env.RPC_URL_POLYGON;
PolygonScan_API_KEY = process.env.PolygonScan_API_KEY;
Etherscan_API_KEY = process.env.Etherscan_API_KEY;


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{ version: "0.8.8" }, { version: "0.6.6" }]
  },
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: RPC_URL_Alchemy_SEPOLIA,
      accounts: [Private_Key],
      chainId: 11155111,
      blockConfirmations: 6,
    },
    polygon: {
      url: RPC_URL_POLYGON,
      accounts: [Private_Key],
      chainId: 80001,
      blockConfirmations: 6,
    },
  },
  etherscan: {
    apiKey: Etherscan_API_KEY,
  },
  polygonscan: {
    apiKey: PolygonScan_API_KEY,
  },
  gasReporter: {
    enabled: true,
    // outputFile: "gas-reporter.txt",
    noColors: true,
    currency: "USD",
    // coinmarketcap: Coinmarketcap_API_KEY,
    token: "ETH",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};
