
import React from "react";
import { useState } from "react";
import './App.css';
import abi from "./abi.json"
const { ethers } = require("ethers");

function App() {

  const [connected, isConnected] = useState(false);
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("0.0");
  const [value, setValue] = useState("0");
  const [tokenBalance, setTokenBalance] = useState("0")

  const opContract = "0xbe57eA6B6ba0B01d58b09C3a8042A166917dCF12";
  const testContract = "0x732574425f714cE7Bc605638604E3Fe58beE32Fd";

  const handleWalletConnect = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const chainX = await provider.getNetwork();
    const chain = chainX.chainId;
      console.log(chain)
      if (chain !== 11155111) {
        isConnected(false);
        alert('wrong network')
      } else {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const tokenAddress = testContract;
        const tokenContract = new ethers.Contract(tokenAddress, abi, signer);
          console.log(address)
        await signer.signMessage("Welcome to the Bank of Ethereum.");
        const balance = await tokenContract.balances(address);
        const tokens = await tokenContract.balanceOf(address);
        const parsedBalance = ethers.utils.formatEther(balance);
        const parseTokens = ethers.utils.formatEther(tokens);
        setBalance(parsedBalance)
        setTokenBalance(parseTokens)
        console.log(parsedBalance)
        isConnected(true)
      }

    const { ethereum } = window;
    if(ethereum) {
      const ensProvider = new ethers.providers.InfuraProvider('mainnet');
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const displayAddress = address?.substr(0, 6) + "...";
      const ens = await ensProvider.lookupAddress(address);
      if (ens !== null) {
        setName(ens)

      } else {
        setName(displayAddress)

      }
    } else {
      alert('no wallet detected!')
    }
  }

  const deposit = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const tokenAddress = testContract;
    const tokenContract = new ethers.Contract(tokenAddress, abi, signer);
    const parseValue = Number(value) * 10**18;
    const valueString = JSON.stringify(parseValue);
    console.log(parseValue)
      try {
        tokenContract.deposit({ value: valueString })
      } catch {
        console.log('deposit error')
      }
  }

  const withdraw = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const tokenAddress = testContract;
    const tokenContract = new ethers.Contract(tokenAddress, abi, signer);
      try {
        tokenContract.withdraw(JSON.stringify(value * 10**18))
      } catch {
        console.log('withdraw error')
      }
  }

  const checkBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const tokenAddress = testContract;
    const tokenContract = new ethers.Contract(tokenAddress, abi, signer);
    const balance = await tokenContract.balances(address);
    const tokens = await tokenContract.balanceOf(address);
    const parsedBalance = ethers.utils.formatEther(balance);
    const parseTokens = ethers.utils.formatEther(tokens);
    setBalance(parsedBalance);
    setTokenBalance(parseTokens)
      console.log('balance check: ' + parsedBalance)
  }

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const getReward = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const tokenAddress = testContract;
    const tokenContract = new ethers.Contract(tokenAddress, abi, signer);
    await tokenContract.claimRewards();
  };

  return (
    <div className="rpgui-content main">
      <div className="inner rpgui-container framed mainFrame">
        <div className="content">
        <h1 style={{fontSize: "250%"}}>Bank of Ethereum</h1>
        <hr class="golden"></hr>
        <br></br>
        {connected && (
        <>
        <h1 style={{fontSize: "1.5em"}}>Account: {name}</h1>
     
        <h1 style={{fontSize: "1em", position: "fixed", top: "24px", left: "24px"}}>Balance: {balance} eth</h1>
        <h1 style={{fontSize: "1em", position: "fixed", bottom: "10px", left: "24px"}}>Rewards: {tokenBalance.substr(0, 6)} BOE</h1>
        </>
        )}
        </div>

        <div className="rpgui-center">
        {!connected && (
        <button style={{marginTop: "70px"}} onClick={() => handleWalletConnect()} className="rpgui-button">Sign In</button>
        )}
        {connected && (
        <>
        <button style={{fontSize: "12px"}} onClick={() => deposit()} className="rpgui-button">Deposit</button>
        <button style={{fontSize: "12px"}} onClick={() => withdraw()} className="rpgui-button">Withdraw</button>
        <button style={{fontSize: "12px"}} onClick={() => checkBalance()} className="rpgui-button">Balance</button>
        <br></br>
        <button style={{fontSize: "12px"}} onClick={() => getReward()} className="rpgui-button">Claim Rewards</button>
        <br></br><br></br><br></br>
        <input style={{textAlign: "center", width: "85%", fontSize: "110%"}}  onChange={handleChange} placeholder="enter amount"></input>
        </>
        )}

        </div>
      </div>
    </div>
  );
}

export default App;
