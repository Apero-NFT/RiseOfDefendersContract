const abi = require("./erc20-abi")
const Web3 = require("web3")
const dotenv = require('dotenv');
dotenv.config();
const CONTRACT_ADDRESS = "0xFBaAF472F9F61D68f9F1B192e7AF0f6d81BE60e5";
const SENDER_ADDRESS = "0x80534A1d48A99539Ca4A772EeA36F49DDeB49674";
const RECEIVER_ADDRESS = "0xbB2e2193348a2532d91Faf9aD800500C174D14A0";
async function main() {
    
    const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545")
    
    web3.eth.accounts.wallet.add({
        privateKey: process.env.PRIVATE_KEY,
        address: process.env.WALLET_ADDRESS
    });
    
    const token = new web3.eth.Contract(abi.ERC20TransferABI, CONTRACT_ADDRESS)
    await token.methods.totalSupply().call(function(err,res){
        console.log(res/(10**18));
    })
    await token.methods.balanceOf(SENDER_ADDRESS).call(function (err, res) {
        if (err) {
            console.log("An error occured", err)
            return
        }
        console.log("The "+SENDER_ADDRESS+" balance is: ", res/(10**18))
    })
    
    await token.methods.balanceOf(RECEIVER_ADDRESS).call(function (err, res) {
        if (err) {
            console.log("An error occured", err)
            return
        }
        console.log("The "+RECEIVER_ADDRESS+" balance is: ", res/(10**18))
    })
    // await token.methods.transfer(RECEIVER_ADDRESS, "500000000000000000000000000")
    //     .send({ from: SENDER_ADDRESS, gas: 5000000, gasPrice: 18e9, }, function (err, res) {
    //     if (err) {
    //         console.log("An error occured", err)
    //         return
    //     }
    //     console.log("Hash of the transaction: " + res)
    // })
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
