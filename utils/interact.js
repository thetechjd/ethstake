require('dotenv').config();
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import Web3 from 'web3';
const contractABI = require("../pages/contract-abi.json");
const contractAddress = "0xe25cCA93ee7534F3b2e4B6776A06deB21493600E";

const web3 = new Web3("https://bsc-dataseed1.binance.org");
//const web3 = createAlchemyWeb3(process.env.NEXT_PUBLIC_ALCHEMY_KEY);

const nftContract = new web3.eth.Contract(
    contractABI,
    contractAddress
);
/*
export const connectWallet = async () => {

    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const obj = {
                status: "👆🏽 Write a message in the text-field above.",
                address: addressArray[0],
            };
            return obj;
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your
                            browser.
                        </a>
                    </p>
                </span>
            ),
        };
    }
};

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            });
            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: "👆🏽 Write a message in the text-field above.",
                };
            } else {
                return {
                    address: "",
                    status: "🦊 Connect to Metamask using the top right button.",
                };
            }
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your
                            browser.
                        </a>
                    </p>
                </span>
            ),
        };
    }




};*/

export const getNFTPrice = async () => {
    const mintPrice = await nftContract.methods.price().call()
    const priceEther = web3.utils.fromWei(mintPrice, "ether");
    return priceEther
}

export const getTotalMinted = async () => {
    const totalMinted = await nftContract.methods.totalSupply().call()
    return totalMinted
}






