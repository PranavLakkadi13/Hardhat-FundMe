const networkConfig = {
  11155111: {
    name: "sepolia",
    ethUsd: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
  80001: {
    name: "polygon",
    ethUsd: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
  },
};

const developmentChain = ["hardhat", "localhost"]

const decimals = 8;

const initialAnswer = 2000_00000000;

module.exports = {
    networkConfig,developmentChain,decimals,initialAnswer
}