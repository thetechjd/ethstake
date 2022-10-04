import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { useEffect, useState } from "react";
import Link from 'next/link';
import Head from 'next/head';
import Footer from '../components/Footer';
import axios from 'axios';

import { useStatus } from "../context/statusContext";
import { connectWallet, getCurrentWalletConnected, getTotalMinted, getBalance } from "../utils/interact.js";



const contractABI = require("./contract-abi.json");
const stakeABI = require("./stake-abi.json");
const contractAddress = "0xaF9dD1051cCC466Be8e5dF8dEB9151ab006F6c43";
const stakeAddress = "0x0285e08bc8e2B14f59e9e05ED05A199caDE4d74C";
const apikey = "8XX3TRP1WSAQDAJD24KCGE56NJJADYD2P3";
const endpoint = "https://api-goerli.etherscan.io/api";

const web3 = createAlchemyWeb3(process.env.NEXT_PUBLIC_ALCHEMY_KEY);


Date.prototype.toUnixTime = function () { return this.getTime() / 1000 | 0 };
Date.time = function () { return new Date().toUnixTime(); }



const tokenContract = new web3.eth.Contract(
  contractABI,
  contractAddress
);

const stakeContract = new web3.eth.Contract(
  stakeABI,
  stakeAddress
);





export default function Home() {

  //State variables
  const { status, setStatus } = useStatus();
  const [walletAddress, setWallet] = useState("");
  const [ethPrice, setEthPrice] = useState(0);
  const [count, setCount] = useState(0);
  const [owned, setOwned] = useState(0);
  const [totalStaked, setTotal] = useState(0);
  const [rate, setRate] = useState(0);
  const [reward, setReward] = useState(0);
  const [balance, setBalance] = useState([]);
  const [maxAmount, setAmount] = useState(0);
  const [lockTime, setTier] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userAddress, setUserAddress] = useState('');
  const [isWhitelisted, setWhitelisted] = useState(false);
  const [isStaked, setStakedBool] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();
    setWallet(address)
    getTokens(address)

    setStatus(status);
    addWalletListener();
    setStartDate(String(new Date().toUTCString()))
    getTotalStaked();






  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          getTokens(address);

          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }




  const getTokens = async (address) => {

    var userAddress = address.toLowerCase();
    const etherscan = await axios.get(endpoint + `?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${userAddress}&tag=latest&apikey=${apikey}`);

    let { result } = etherscan.data;
    setBalance((result / 10 ** 18).toFixed(0));

    let end;
    let totalReward;
    try {



      const stakeDate = await stakeContract.methods.getStartDate(userAddress).call();
      const tier = await stakeContract.methods.getTier(userAddress).call();





      setStartDate(String(new Date(stakeDate * 1000).toUTCString()))

      setRate(tier);
      setStakedBool(true);



      if (tier === 2) {

        end = (stakeDate * 1000) + 5259486 * 1000
        setEndDate(String(new Date(end).toUTCString()));


      } else if (tier === 3) {

        end = (stakeDate * 1000) + 7889229 * 1000
        setEndDate(String(new Date(end).toUTCString()));


      } else if (tier === 4) {

        end = (stakeDate * 1000) + 15778458 * 1000
        setEndDate(String(new Date(end).toUTCString()));


      } else {

        end = (stakeDate * 1000) + 2629743 * 1000
        setEndDate(String(new Date(end).toUTCString()));



      }

    } catch (error) {
      setBalance(0);
      console.log("Nothing is staked");
    }


  }



  const setMaxAmount = async () => {
    setAmount(await tokenContract.methods.balanceOf(walletAddress).call());
  }

  const setFirstLockTime = async () => {
    setTier(1)
    calculateTime(1)


  }

  const setSecondLockTime = async () => {
    setTier(2)
    calculateTime(2)

  }
  const setThirdLockTime = async () => {
    setTier(3)
    calculateTime(3)

  }

  const setFourthLockTime = async () => {
    setTier(4)
    calculateTime(4)

  }



  const calculateTime = async (time) => {
    let start = Date.now();
    let end;


    if (time === 1) {

      setRate(115)
      end = start + 2629743 * 1000
      setEndDate(String(new Date(end).toUTCString()));


    } else if (time === 2) {

      end = start + 5259486 * 1000
      setEndDate(String(new Date(end).toUTCString()));
      setRate(155)
    } else if (time === 3) {

      end = start + 7889229 * 1000
      setEndDate(String(new Date(end).toUTCString()));
      setRate(215)
    } else {

      end = start + 15778458 * 1000
      setEndDate(String(new Date(end).toUTCString()));
      setRate(295)
    }
  }




  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onStakePressed = async (e) => {
    e.preventDefault();
    let tokenAmount = document.getElementById('stakeId').value;

    await tokenContract.methods.approve(stakeAddress, tokenAmount).send({ from: walletAddress }).then(() => {
      stakeContract.methods.stake(lockTime, tokenAmount).send({ from: walletAddress });
    })


  };

  const onUnstakePressed = async (e) => {
    e.preventDefault();
    await stakeContract.methods.unstake().send({ from: walletAddress });

  };



  const updateBalance = async () => {
    getBalance();
    getNumberStaked();
    setReward(0);

  }
  const getBalance = async () => {


    const balance = await tokenContract.methods.balanceOf(walletAddress).call();
    setOwned(balance);
  }


  const getNumberStaked = async () => {

    const numberStaked = await stakeContract.methods.numberStaked(walletAddress).call();
    setCount(numberStaked);
  }

  const getTotalStaked = async () => {

    const fundsLocked = await stakeContract.methods.totalStaked().call();
    setTotal((fundsLocked / 10 ** 18).toFixed(0));
  }

  /**
  
  const getEth = () => {
    const { getEthPriceNow } = require('get-eth-price');
 
    getEthPriceNow()
 
      .then(data => {
        var rawdata = JSON.stringify(data);
        var prices = rawdata.split(',')
        var usd = prices[1].match(/\d+/g);
        var ethusd = parseInt(usd[0]);
 
 
        setEthPrice(ethusd);
      }
 
      )
 
  }*/





  const calculateReward = async (e) => {
    e.preventDefault();

    const stakeDate = await stakeContract.methods.getStartDate(walletAddress).call();
    const stakeAmount = await stakeContract.methods.getAmount(walletAddress).call();

    const checkTime = Date.now()


    const timeElapsed = (checkTime - (stakeDate * 1000)) / 1000;
    console.log(timeElapsed);
    if (lockTime === 2) {
      if (timeElapsed >= 5259486) {
        setReward(stakeAmount * 5259486 * 1.55 / 31536000)
      } else {
        setReward(stakeAmount * timeElapsed * 1.55 / 31536000);
      }
    } else if (lockTime === 3) {
      if (timeElapsed >= 7889229) {
        setReward(stakeAmount * 7889229 * 2.55 / 31536000);
      } else {
        setReward(stakeAmount * timeElapsed * 2.55 / 31536000);
      }
    } else if (timeElapsed === 4) {
      if (timeElapsed >= 15778458) {
        setReward(stakeAmount * 15778458 * 2.95 / 31536000)
      } else {
        setReward(stakeAmount * timeElapsed * 2.95 / 31536000)
      }

    } else {
      if (timeElapsed >= 2629743) {
        setReward(stakeAmount * 2629743 * 1.15 / 31536000)
      } else {
        setReward(stakeAmount * timeElapsed * 1.15 / 31536000)
      }
    }




  }






  return (
    <>
      <Head>
        <title>SoccerGold Stake</title>
        <meta name="description" content="Soccer Gold Stake Dapp" />
        <link rel="icon" href="/images/favicon.png" />
      </Head>

      {/* Header */}
      <header className='w-full top-0 md:px-8 px-5 pt-5 pb-3 z-70 transition-colors duration-500 z-40 border-b border-1 border-gray-400 border-opacity-40 flex-none md:z-50 bg-pattern'>

        {/* Header Container */}
        <div className='flex h-full items-center justify-center max-w-11xl mx-auto border-opacity-0'>

          {/* Logo Section */}

          <div className='flex-grow'>
            <div className='flex'>
              <Link className='w-min-content' href='/' passHref>
                <a className='flex'>
                  <img alt='' src='/images/logo-text.png' className='hidden md:flex h-[40px]' />
                  <img alt='' src='/images/soccergoldlogo.png' className='md:hidden h-[40px]' />

                </a>
              </Link>
            </div>
          </div>



          <nav>



            <ul className="DESKTOP-MENU space-x-2 flex flex-row">

              <li>
                <a href="/" className='flex-none bg-opacity-0 text-gray-100 opacity-80 items-center  relative h-12 tracking-wider pt-0.5 first::pt-0 uppercase font-500 padding-huge bg-blue-300 duration-200 px-3 hover:bg-opacity-90 flex justify-center flex-row cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110'>
                  <p className='rounded uppercase text-lg font-black
          text-white md:flex'>Mint</p>
                </a>
              </li>

              <li>
                <a href="/stake" className='flex-none bg-opacity-0 text-gray-100 opacity-80 items-center  relative h-12 tracking-wider pt-0.5 first::pt-0 uppercase font-500 padding-huge bg-blue-300 duration-200 px-3 hover:bg-opacity-90 flex justify-center flex-row cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110'>
                  <p className='rounded uppercase text-lg font-black
          text-white md:flex'>Stake</p>
                </a>
              </li>

              {/* CONNECT WALLET */}
              <li>
                {walletAddress.length > 0 ? (

                  <div className='px-4 bg-opacity-20 text-white items-center relative h-12 tracking-wider sm:pt-0.5 md:pt-2 lg:pt-0.5 first::pt-0 duration-500 text-6xs md:text-base padding-huge opacity-100 hover:bg-opacity-70 rounded flex justify-center flex-row border border-gray-900 hover:shadow-green-500/20 cursor-pointer'
                  >
                    {String(walletAddress).substring(0, 6)}
                    {"....."}
                    {String(walletAddress).substring(39)}
                  </div>
                ) : (

                  <button className='px-4 bg-greenn bg-opacity-100 text-gray-100 items-center relative h-12 tracking-wider pt-0.5 first::pt-0 duration-500 text-2xs md:text-base padding-huge opacity-100 hover:bg-opacity-100 rounded flex justify-center flex-row bg-gradient-to-tl hover:from-greenn from-peach to-peach hover:to-bluee border-none hover:shadow-green-500/20 cursor-pointer' id="walletButton"

                    onClick={connectWalletPressed}
                  >Connect Wallet
                  </button>
                )}
              </li>

            </ul>
          </nav>
          <style>{`
      .hideMenuNav {
        display: none;
      }
      .showMenuNav {
        display: block;
        position: absolute;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        background: #fff;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }
    `}</style>
        </div>

      </header>





      {/* Hero/Mint Section */}
      <section className="flex items-center justify-center bg-pattern py-12 overflow-hidden relative z-10" id="">

        {/* margin between header and hero section */}
        <div className="mb-10 flex items-center max-w-md mt-4"></div>



        <div className="flex flex-row items-center mx-10 justify-center md:flex-row md:items-center md:justify-between text-slate-900">



          {/* Left Hero Section - Mint Info */}
          <div className="w-full flex flex-col items-center ">






            <div className="w-full mt-12 px-4 items-center justify-center">

              <div className="max-w-[600px] px-6 mt-5 py-5 rounded-lg bg-greenn shadow-inner border-4 border-greenn items-center justify-center">

                <p className="text-center text-2xl text-gray-100 py-6">Pools</p>
                <div className="flex flex-row justify-between">

                  <button className='px-2 rounded-lg flex flex-row justify-center text-xs md:text-lg bg-gray-100 font-semibold uppercase font-base text-black px-2 py-2 mx-2 tracking-wide hover:shadow-green-500/20' onClick={setFirstLockTime}>30 days</button>
                  <button className='px-2 rounded-lg flex flex-row justify-center text-xs md:text-lg bg-gray-100 font-semibold uppercase font-base text-black px-2 py-2 mx-2 tracking-wide hover:shadow-green-500/20' onClick={setSecondLockTime}>60 days</button>
                  <button className='px-2 rounded-lg flex flex-row justify-center text-xs md:text-lg bg-gray-100 font-semibold uppercase font-base text-black px-2 py-2 mx-2 tracking-wide hover:shadow-green-500/20' onClick={setThirdLockTime}>90 days</button>
                  <button className='px-2 rounded-lg flex flex-row justify-center text-xs md:text-lg bg-gray-100 font-semibold uppercase font-base text-black px-2 py-2 mx-2 tracking-wide hover:shadow-green-500/20' onClick={setFourthLockTime}>180 days</button>

                </div>
                <p className="flex flex-row w-full mt-5 justify-start items-center text-gray-100 h-9 text-lg py-4 my-2">Total Balance: <span className='w-3/5 text-gray-100 text-center text-gray-100 text-lg rounded  h-9 px-2 py-2 my-2 '>{balance} SGOLD</span></p>
                <p className="flex flex-row w-full text-gray-100 items-center text-lg py-4 my-2">Stake Amount: <span className='w-3/5 text-center text-gray-100 text-lg rounded h-9 px-2 py-2 my-2'>{totalStaked} SGOLD</span></p>


                {isStaked ? (
                  <>

                    <div className='justify-center p-4 items-center mt-5 text-gray-100 text-sm bg-red-500 rounded-md border-4 border-gray-100'>

                      <p>You have already staked. Your start date was {startDate} and your end date is {endDate}.</p>

                    </div>

                    <p className="flex flex-row w-full text-gray-100 items-center text-lg py-2 my-2">Calculated Reward: <span className='w-3/5 text-gray-100 text-lg text-center rounded h-9 px-2 py-2 my-2'>{parseInt(reward / 10 ** 18).toFixed(0)} SGOLD</span></p>

                  </>

                ) : (
                  <>

                    <p className="flex flex-row w-full text-gray-100 text-lg py-2 my-2">Stake Date: <span className='w-4/5 text-center text-gray-100 text-lg rounded  h-9 px-2 py-2 my-2 '>{startDate}</span></p>
                    <p className="flex flex-row w-full text-gray-100 text-lg py-2 my-2">Unlock Date: <span className='w-4/5 text-center text-gray-100 text-lg rounded  h-9 px-2 py-2 my-2'>{endDate}</span></p>
                    <p className="flex flex-row w-full text-gray-100 text-lg py-2 my-2">Interest Rate: <span className='w-4/5 text-gray-100 text-lg text-center rounded  h-9 px-2 py-2 my-2'>{rate}% APY</span></p>


                  </>


                )}







                {walletAddress.length > 0 ? (
                  <>
                    <div className='flex flex-col w-full'>

                      <div className='flex flex-row items-center justify-center my-4 w-full'>

                        <form className="flex flex-row text-center bg-gray-100 rounded-lg" onSubmit={onStakePressed}>

                          <input className="flex flex-col text-center bg-gray-100 rounded-lg mx-1 text-xs text-lime px-8 w-full" id='stakeId' type="number" name="stakeId" placeholder="id" value={maxAmount} />
                          <button className='flex flex-col justify-center text-xs md:text-lg bg-transparent shadow-2xl rounded-lg font-semibold uppercase font-base text-black px-2 py-2 tracking-wide hover:shadow-green-500/20'
                            onClick={setMaxAmount}>
                            MAX
                          </button>

                          <button
                            className='w-full text-center text-xs md:text-lg bg-darkblue rounded-lg shadow-2xl font-semibold uppercase font-base text-gray-100 px-10 py-2 tracking-wide hover:shadow-green-500/20'
                          // onClick={mintPass}

                          >
                            Stake
                          </button>
                        </form>
                      </div>
                      <div className='flex items-center justify-center w-full'>

                        <button
                          className='w-full text-xs md:text-lg bg-gray-100 rounded font-semibold uppercase shadow-2xl font-base text-black px-12 py-2 mx-2 tracking-wide hover:shadow-green-500/20'
                          onClick={onUnstakePressed}

                        >
                          Unstake
                        </button>

                      </div>
                    </div>



                    <div className='flex flex-row h-12 mt-2 mb-4 '>

                      <button
                        className='text-sm w-full bg-darkblue shadow-2xl rounded font-semibold uppercase font-base text-gray-100 px-1 py-2 mx-2 tracking-wide hover:shadow-green-500/20'
                        onClick={calculateReward}

                      >
                        Calculate Reward
                      </button>


                    </div>

                  </>
                ) : (
                  <>
                    <p className='text-center flex flex-col font-bold text-gray-100 text-base md:text-2xl text-body-color leading-relaxed m-3 md:m-8 break-words ...'>
                      Connect Your Wallet to Stake
                    </p></>
                )}


              </div>


            </div>



















            {/* Total supply - Price info */}


            {/* Increment & Decrement buttons */}


          </div>
        </div>

        {/* Total:  {nftPrice} + Gas */}
        {/* Mint Status */}
        {/* {status && (
      <div className="flex items-center justify-center">
        {status}
      </div>
    )} */}
        <div className='flex flex-row'>
          <img src='/images/soccergoldlogo.png' className='floating hidden md:flex' />

        </div>


        {/* Right Hero Section - Video/Image Bird PASS */}

        {/* <img className="fixed bottom-0 left-0 w-1/5 z-20" src="/images/mainbull.png" />
        <img className="fixed top-5 right-5 w-1/8 z-20" src="/images/spaceship.png" />*/}
      </section>






      {/* <Footer />*/}



      {/* Content + footer Section */}
      <Footer />

    </>
  )
}

