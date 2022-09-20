
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { useEffect, useState } from "react";
import Link from 'next/link';
import Head from 'next/head';
import Footer from '../components/Footer';
import ProgressBar from '../components/ProgressBar';
import { useStatus } from "../context/statusContext";
import { connectWallet, getCurrentWalletConnected, getNFTPrice, getTotalMinted } from "../utils/interact.js";
const contractABI = require("../pages/contract-abi.json");
const contractAddress = "0x3285BD0ae75236f04efF506c40a2299a3E352B14";
const web3 = createAlchemyWeb3(process.env.NEXT_PUBLIC_ALCHEMY_KEY);



const nftContract = new web3.eth.Contract(
  contractABI,
  contractAddress
);

export default function Home() {

  //State variables
  const { status, setStatus } = useStatus();
  const [walletAddress, setWallet] = useState("");
  const [count, setCount] = useState(1);
  const [totalMinted, setTotalMinted] = useState(0);
  const [price, setPrice] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);


  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();
    setWallet(address)
    setStatus(status);
    addWalletListener();
    setPrice(await getNFTPrice());
    updateTotalSupply();



  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
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

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async (e) => {
    e.preventDefault();
    let total = web3.utils.toWei(price, 'ether') * count;
    await nftContract.methods.mint(count).send({ from: walletAddress, value: total, gas: 500000 })

  };

  const incrementCount = () => {
    if (count < 10) {
      setCount(count + 1);
    }
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const updateTotalSupply = async () => {
    const mintedCount = await getTotalMinted();
    setTotalMinted(mintedCount);
  };





  return (
    <>
      <Head>
        <title>SoccerGoldNFT</title>
        <meta name="description" content="Soccer Gold NFT Dapp" />
        <link rel="icon" href="/favicon.png" />
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
      <section className="flex items-center justify-center bg-pattern py-12 px-5 overflow-hidden relative z-10" id="">
        <div className="">
          {/* margin between header and hero section */}
          <div className="mb-5 flex items-center max-w-md mt-4"></div>

          <div className="flex flex-col items-center justify-center md:flex-row md:items-center md:justify-between text-slate-900 -mx-4">

            {/* Left Hero Section - Mint Info */}
            <div className="w-full px-4">
              <div className="max-w-[570px] mb-12 md:mb-0">
                <p className="text-2xl text-center md:text-5xl font-extrabold text-gray-100 leading-relaxed  bg-clip-text mt-6 mb-3 md:mb-8 md:-mx-4">
                  Mint SoccerGoldNFT
                </p>

                <div className="w-full px-4">
                  <div className="relative rounded-md pb-0 p-4 mb-4">

                    <img src='/images/soccergoldfloater.png' alt='floater' className='floating w-[400px] flex items-center justify-center' />
                  </div>
                </div>
              </div>




              {/* Total supply - Price info */}

              <div className='flex flex-col items-center justify-center text-black pt:0 -mt-6 md:mt-2 md:pb-2'>
                <div className='flex flex-col items-center justify-center text-black'>
                  <p className='text-greenn pt-0 p-2'>{totalMinted}/7592 left till sell out</p>
                  <ProgressBar bgcolor="#3AAA35" progress={(((totalMinted) / 7592) * 100).toFixed(2)} height={30} style="font-family: Montserrat san-serif" />


                </div>
                <div className="flex items-center max-w-md mt-2"></div>
                <div className='mb-4 bg-pattern flex items-center justify-between rounded-md w-11/12 mx-auto p-2 border-2 border-greenn transition ease-in-out duration-500'>
                  <p className='font-bold text-greenn'>Price Per Mint:</p>
                  <p className='font-bold text-greenn'>{price} ETH</p>
                </div>

              </div>

              {/* Increment & Decrement buttons */}
              {walletAddress.length > 0 ? (
                <div className='flex flex-col'>
                  <div className='flex items-center justify-between px-16 sm:px-24 m-4'>
                    <button className='button w-10 h-10 flex items-center justify-center text-greenn hover:shadow-lg bg-background font-bold rounded-md border border-opacity-80 border-cyan-600'
                      onClick={decrementCount}
                    >
                      ــ
                    </button>
                    <p className="flex items-center justify-center flex-1 grow text-center font-bold text-greenn text-2xl md:text-3xl">
                      {count}
                      {/* 1 */}
                    </p>
                    <button className="button w-10 h-10 flex items-center justify-center text-greenn text-2xl hover:shadow-lg bg-background font-bold rounded-md border border-opacity-80 border-cyan-600"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                  <div className='flex items-center justify-center p-2 text-greenn'>
                    Total: {Number.parseFloat(price * count)} ETH +
                    <span className='text-gray-700'> Gas</span>
                  </div>
                  <div className='flex items-center justify-center'>
                    <button
                      className='text-lg font-semibold uppercase font-base text-gray-100 px-12 py-2 tracking-wide bg-gradient-to-tl from-greenn hover:from-cyan-200 hover:to-cyan-500 to-greenn rounded-md hover:shadow-green-500/20'
                      // onClick={mintPass}
                      onClick={onMintPressed}
                    >
                      Mint Now
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className='text-center flex flex-col font-bold text-gray-100 text-base md:text-2xl text-body-color leading-relaxed m-3 md:m-8 break-words ...'>
                    Connect Your Wallet To Mint
                  </p></>
              )}



            </div>


            {/* Total:  {nftPrice} + Gas */}
            {/* Mint Status */}
            {/* {status && (
              <div className="flex items-center justify-center">
                {status}
              </div>
            )} */}

          </div>

          {/* Right Hero Section - Video/Image Bird PASS */}

        </div>
      </section>

      {/* Content + footer Section */}

      <Footer />


    </>
  )
}

