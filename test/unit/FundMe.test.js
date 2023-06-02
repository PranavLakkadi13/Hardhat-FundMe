const { assert, expect } = require("chai");
const { deployments, getNamedAccounts, ethers, network } = require("hardhat");
const { developmentChain } = require("../../helper-hardhat-config");

// describe function wont be an async function
!developmentChain.includes(network.name) ? describe.skip
: describe("FundMe", () => {
    let fundme;
    let deployer;
    let mockV3Aggregator;
    let sendvalue = ethers.utils.parseUnits("1", "ether");
    beforeEach(async () => {
        // fixture is used to get all the recent deployment with all tag 
        await deployments.fixture("all");
        /*
        --> gives a list of the accounts in the network in hardhatconfig ||gives the default 10 accounts of hardhat node if in local testing
         accounts = await ethers.getSigners()
         */

        // gets the deployer from named accounts and assigns it to deployer var
        deployer = (await getNamedAccounts()).deployer;

        // ethers.getContract == deploy.get => get the most recent deployment
        // since multiple contract deployed using fixture, we want to test fundMe first
        fundme = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
    })

    describe("constructor", () => {
        it("sets the aggregator address correctly", async function () {
            const response = await fundme.getPricefeed();
            assert.equal(response, mockV3Aggregator.address);
        })
        it("check owner", async () => {
            const addr_owner = await fundme.getOwner();
            assert.equal(addr_owner, deployer);
        })
    })

    describe("fund", () => {
        it("Fails if you dont send enough eth", async () => {
            await expect(fundme.fund()).to.be.reverted;
        })
        it("sets the mapping", async () => {
            await fundme.fund({value: sendvalue});
            const response = await fundme.getaddressToAmountFunded(deployer);
            assert.equal(response.toString(),sendvalue.toString());
        })
        it("updates the getfunders array", async () => {
            await fundme.fund({ value: sendvalue });
            const funder = await fundme.getfunders(0);
            assert.equal(funder, deployer);
        })
    })
    
    // here to test withdraw i am creacting before-each that by default before
    // the test deposits ether everytime i test it 
    describe("withdraw", () => {
        beforeEach("fund", async () => {
            await fundme.fund({ value: sendvalue });
        })
        // Arrange --> thr test
        it("Withdraw Eth from the founder", async () => {
          // could have even used --> ethers.provider.getBalance(fundme.address)
          // the starting balances
          const startingFundMeBalance = await fundme.provider.getBalance(
            fundme.address
          );
          const startingDeployerBalance = await fundme.provider.getBalance(
            deployer
          );

          // Act
          const transactionResponse = await fundme.withdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          
          // using a breakpoint to debug the code
          // gas cost ==>
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          // using .add since they are big number
          const gasCost = gasUsed.mul(effectiveGasPrice); 

          const endingFundMeBalance = await fundme.provider.getBalance(
            fundme.address
          );
          const endingDeployerBalance = await fundme.provider.getBalance(
            deployer
          );

          // Assert
          assert.equal(endingFundMeBalance, 0);
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          );
        })
    })
    it("Allow to withdraw when multiple getfunders", async () => {
        const accounts = await ethers.getSigners();
        for (let i = 1; i < 6; i++) {
          /**
           * Here the attacker after being connected can be used to call the function,
            since by default when u call fundme.function() it is by default called by deployer
            So when u call the fundme.coonect(account) it connects it to the contract and changes
            the calling address 
           */
            const fundMeConnectedContract = await fundme.connect(accounts[i]);
            await fundMeConnectedContract.fund({ value: sendvalue });
        }
        const startingFundMeBalance = await fundme.provider.getBalance(fundme.address);
        const startingDeployerBalance = await fundme.provider.getBalance(deployer);

        //Act
        const transactionResponse = await fundme.withdraw();
        const transactionReceipt = await transactionResponse.wait(1);
        const { gasUsed, effectiveGasPrice } = await transactionReceipt;
        const gasCost = gasUsed.mul(effectiveGasPrice);

        const endingFundMeBalance = await fundme.provider.getBalance(fundme.address);
        const endingDeployerBalance = await fundme.provider.getBalance(deployer);

        // Assert
        assert.equal(endingFundMeBalance, 0);
        assert.equal(
          startingFundMeBalance.add(startingDeployerBalance).toString(),
          endingDeployerBalance.add(gasCost).toString()
        );

        // make sure the getfunders array is reset 
        await expect(fundme.getfunders(0)).to.be.reverted;

        for (let i = 1; i < 6; i++) {
        assert.equal(await fundme.getaddressToAmountFunded(accounts[i].address), 0);
        }
    })
    it("Only allows the owner to withdraw", async () => {
        const accounts = await ethers.getSigners();
        const attacker = accounts[1];

        const attackerConnectedContract = fundme.connect(attacker);

        await expect(attackerConnectedContract.withdraw()).to.be.reverted;
    })
    
  it("CheaperWithdraw testing!!!!!!!!!!", async () => {
      const accounts = await ethers.getSigners();
      for (let i = 1; i < 6; i++) {
        /**
           * Here the attacker after being connected can be used to call the function,
            since by default when u call fundme.function() it is by default called by deployer
            So when u call the fundme.coonect(account) it connects it to the contract and changes
            the calling address 
           */
        const fundMeConnectedContract = await fundme.connect(accounts[i]);
        await fundMeConnectedContract.fund({ value: sendvalue });
      }
      const startingFundMeBalance = await fundme.provider.getBalance(
        fundme.address
      );
      const startingDeployerBalance = await fundme.provider.getBalance(
        deployer
      );

      //Act
      const transactionResponse = await fundme.cheaperWithdraw();
      const transactionReceipt = await transactionResponse.wait(1);
      const { gasUsed, effectiveGasPrice } = await transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      const endingFundMeBalance = await fundme.provider.getBalance(
        fundme.address
      );
      const endingDeployerBalance = await fundme.provider.getBalance(deployer);

      // Assert
      assert.equal(endingFundMeBalance, 0);
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(gasCost).toString()
      );

      // make sure the getfunders array is reset
      await expect(fundme.getfunders(0)).to.be.reverted;

      for (let i = 1; i < 6; i++) {
        assert.equal(
          await fundme.getaddressToAmountFunded(accounts[i].address),
          0
        );
      }
    });
  
})