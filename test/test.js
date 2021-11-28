const { expect } = require("chai");

describe("Token contract", function () {

  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;
  beforeEach(async function () {
    Token = await ethers.getContractFactory("RDR");
    [owner, addr1, addr2,addr3, ...addrs] = await ethers.getSigners();

    hardhatToken = await Token.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Owner can transfer to Addr1, Addr1 can transfer to Addr2", async function () {
      // Transfer 50 tokens from owner to addr1
      await hardhatToken.transfer(addr1.address, BigInt(100*(10**18)));
      const initAddr1Balance = await hardhatToken.balanceOf(addr1.address);
      const initAddr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(initAddr1Balance).to.equal(BigInt(100*(10**18)));

      // Transfer 50 tokens from addr1 to addr2
      await hardhatToken.connect(addr1).transfer(addr2.address, BigInt(50*(10**18)));
      const addr2Balance = await hardhatToken.balanceOf(addr2.address);

      //Addr1 balance = initAddr1Balance - 50 tokens
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(BigInt(initAddr1Balance - 50*(10**18)));
      //Addr2 balance = initAddr2Balance + 50 tokens
      expect(await hardhatToken.balanceOf(addr2.address)).to.equal(BigInt(initAddr2Balance + 50*(10**18)));
    });

    it("Owner can not transfer from Addr1 to Addr2", async function(){
      //Transfer 200 token from owner to addr1
      await hardhatToken.transfer(addr1.address,BigInt(200*(10**18)));
      const initBalance = await hardhatToken.balanceOf(addr1.address);

      //Transfer 50 token from addr1 to addr2
      await expect(
        hardhatToken.transferFrom(addr1.address,addr2.address,BigInt(50*(10**18)))
      ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
      //Addr1 balance not change
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(initBalance);
    })

    it("Addr1 can not transfer from Addr2 to Addr3", async function(){
      //Transfer 200 token from owner to addr1
      await hardhatToken.transfer(addr1.address,BigInt(200*(10**18)));
      //Transfer 200 token from owner to addr2
      await hardhatToken.transfer(addr2.address,BigInt(200*(10**18)));
      const initBalance = await hardhatToken.balanceOf(addr2.address);
      //Transfer 100 token from addr2 to addr3 when use addr1
      await expect(
        hardhatToken.connect(addr1).transferFrom(addr2.address,addr3.address,BigInt(100*(10**18)))
      ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
      //Addr2 balance not change
      expect(await hardhatToken.balanceOf(addr2.address)).to.equal(initBalance);
    })

    it("Addr1 can transfer to Owner", async function () {
      //Transfer 50 token from owner to addr1
      await hardhatToken.transfer(addr1.address,BigInt(50*(10**18)));
      const initBalance = await hardhatToken.balanceOf(addr1.address);
      //Transfer 10 token from addr1 to owner when use addr1
      await hardhatToken.connect(addr1).transfer(owner.address, BigInt(10*(10**18)));

      // Addr1 balance sub 10 token.
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(BigInt(initBalance-(10*(10**18))));
    });

    it("Owner can transfer to Addr1, Owner can transfer to Addr2, update balances", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1.
      await hardhatToken.transfer(addr1.address, BigInt(100*(10**18)));

      // Transfer another 50 tokens from owner to addr2.
      await hardhatToken.transfer(addr2.address, BigInt(50*(10**18)));

      // Check balances.
      const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(BigInt(initialOwnerBalance) - BigInt(150*(10**18)));

      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(BigInt(100*(10**18)));

      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(BigInt(50*(10**18)));
    });
  });
});