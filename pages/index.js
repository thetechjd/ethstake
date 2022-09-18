
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { useEffect, useState } from "react";
import Link from 'next/link';
import Head from 'next/head';
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
        <title>Squidsqui</title>
        <meta name="description" content="Squidsqui Dapp" />
        <link rel="icon" href="/favicon.webp" />
      </Head>

      {/* Header */}
      <header className='fixed w-full top-0 md:px-8 px-5 pt-5 pb-3 z-70 backdrop-blur transition-colors duration-500 z-40 flex-none md:z-50 bg-white/35 supports-backdrop-blur:bg-white/60 shadow-[0_2px_5px_rgba(3,0,16,0.2)]'>

        {/* Header Container */}
        <div className='flex h-full items-center justify-center max-w-11xl mx-auto border-opacity-0'>

          {/* Logo Section */}
          <div className='flex-grow'>
            <div className='flex'>
              <Link className='w-min-content' href='/' passHref>
                <a className='flex'>
                  <img alt='' src='/images/squidsqui_logo.webp' className='h-[40px]' />
                  <p className='h-7 px-2 pt-1 pb-1 rounded uppercase text-lg font-gray-100
                  text-gray-100 hidden md:flex'>SquidSqui Official <span className='font-extrabold text-sky-500 uppercase mb-3 md:mb-8'> Mint</span>

                  </p>
                </a>
              </Link>
            </div>
          </div>

          {/* Desktop Navbar Section + Connect Wallet + icons */}
          <div className='items-center md:flex text-sm'>
            <ul className='flex space-x-2'>

              {/* CONNECT WALLET */}
              <li>
                {walletAddress.length > 0 ? (
                  <div className='px-4 bg-opacity-20 text-gray-100 items-center relative h-7 tracking-wider pt-0.5 first::pt-0 duration-500 text-sm md:text-base padding-huge opacity-100 hover:bg-opacity-70 rounded flex justify-center flex-row border border-bluee hover:shadow-green-500/20 cursor-pointer'
                  >
                    Connected:  {String(walletAddress).substring(0, 6)}
                    {"....."}
                    {String(walletAddress).substring(39)}
                  </div>
                ) : (
                  <a className='px-4 bg-opacity-20 text-gray-100 font-semibold items-center relative h-7 tracking-wider pt-0.5 first::pt-0 duration-500 text-sm md:text-base padding-huge bg-bluee opacity-100 hover:bg-opacity-70 rounded flex justify-center flex-row bg-gradient-to-tl hover:from-greenn from-cyan-200 to-cyan-500 hover:to-bluee border-none hover:shadow-green-500/20 cursor-pointer'
                    id="walletButton"
                    onClick={connectWalletPressed}
                  >Connect Wallet
                  </a>
                )}
              </li>

              {/* Twitter Icon */}
              <li className='hidden md:flex'>
                <a className='bg-opacity-20 text-gray-100 opacity-80 items-center relative h-7 tracking-wider pt-0.5 first::pt-0 uppercase text-2xs font-500 padding-huge bg-white duration-200 px-4 hover:bg-opacity-70 rounded flex justify-center flex-row transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110' href='https://twitter.com/SquidSquiNFT' target='_blank' rel='noreferrer'>
                  <svg xmlns="http://www.w3.org/2000/svg" className=" fill-current stroke-current h-4 w-4" viewBox="0 0 40 40"><path d="M38.526 8.625a15.199 15.199 0 01-4.373 1.198 7.625 7.625 0 003.348-4.211 15.25 15.25 0 01-4.835 1.847 7.6 7.6 0 00-5.557-2.404c-4.915 0-8.526 4.586-7.416 9.346-6.325-.317-11.934-3.347-15.69-7.953C2.01 9.869 2.97 14.345 6.358 16.612a7.58 7.58 0 01-3.446-.953c-.084 3.527 2.444 6.826 6.105 7.56a7.63 7.63 0 01-3.438.13 7.618 7.618 0 007.112 5.286A15.306 15.306 0 011.42 31.79a21.55 21.55 0 0011.67 3.42c14.134 0 22.12-11.937 21.637-22.643a15.499 15.499 0 003.799-3.941z"></path></svg>
                </a>
              </li>
              {/* Discord Icon */}
              <li className='hidden md:flex'>
                <a className='bg-opacity-20 text-gray-100 opacity-80 items-center relative h-7 tracking-wider pt-0.5 first::pt-0 uppercase text-2xs font-500 padding-huge bg-white duration-200 px-4 hover:bg-opacity-70 rounded flex justify-center flex-row cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110' href='http://discord.gg/squidsqui'>
                  <span className="text-black text-xs hidden hover:visible absolute top-[-6px]">Closed </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="fill-current stroke-current h-4 w-4" viewBox="0 0 40 40"><path d="M33.567 7.554a32.283 32.283 0 00-7.969-2.472.12.12 0 00-.128.06c-.344.613-.725 1.411-.992 2.039a29.804 29.804 0 00-8.95 0 20.625 20.625 0 00-1.008-2.038.126.126 0 00-.128-.06 32.194 32.194 0 00-7.968 2.47.114.114 0 00-.053.046C1.296 15.18-.095 22.577.588 29.88c.003.036.023.07.05.092 3.349 2.459 6.593 3.952 9.776 4.941a.127.127 0 00.137-.045 23.203 23.203 0 002-3.253.124.124 0 00-.068-.172A21.379 21.379 0 019.43 29.99a.126.126 0 01-.012-.209c.205-.153.41-.313.607-.475a.121.121 0 01.126-.017c6.407 2.925 13.343 2.925 19.675 0a.12.12 0 01.128.015c.196.162.4.324.608.477a.126.126 0 01-.011.209c-.975.57-1.99 1.051-3.055 1.454a.125.125 0 00-.067.173 26.052 26.052 0 001.998 3.252c.031.043.087.062.138.046 3.199-.99 6.442-2.482 9.79-4.941a.126.126 0 00.052-.09c.816-8.445-1.368-15.78-5.789-22.283a.1.1 0 00-.05-.046zm-20.06 17.88c-1.928 0-3.517-1.771-3.517-3.946 0-2.175 1.558-3.946 3.518-3.946 1.975 0 3.549 1.787 3.518 3.946 0 2.175-1.558 3.946-3.518 3.946zm13.01 0c-1.93 0-3.52-1.771-3.52-3.946 0-2.175 1.56-3.946 3.52-3.946 1.974 0 3.548 1.787 3.517 3.946 0 2.175-1.543 3.946-3.518 3.946z"></path></svg>
                </a>
              </li>
            </ul>
          </div>

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
                <p className="text-2xl text-center md:text-4xl font-extrabold text-body-color leading-relaxed text-transparent bg-clip-text bg-gradient-to-tl stand__out__text from-bluee via-sky-500 to-greenn uppercase mb-3 md:mb-8 md:-mx-4">
                  Mint Squidsqui Now
                </p>

                <div className="w-full px-4">
                  <div className="relative rounded-md pb-0 p-2 shadow-md">
                    <video autoPlay loop muted poster='/images/squidsqui100.gif' className='w-[400px] vid hidden md:block'>
                      <source src='/images/squidsqui100.gif' />
                    </video>
                    <img src='/images/squidsqui100.gif' alt='squidsqui gif' className='w-[400px] md:hidden flex items-center justify-center' />
                  </div>
                </div>
              </div>




              {/* Total supply - Price info */}

              <div className='flex flex-col items-center justify-center text-black pt:0 -mt-6 md:mt-2 md:pb-2'>
                <div className='flex flex-col items-center justify-center text-black'>
                  <p className='text-bluee pt-0 p-2'>{totalMinted}/7592 left till sell out</p>
                  <ProgressBar bgcolor="#63c6f7" progress={(((totalMinted) / 7592) * 100).toFixed(2)} height={30} style="font-family: Montserrat san-serif" />


                </div>
                <div className="flex items-center max-w-md mt-2"></div>
                <div className='mb-4 bg-pattern flex items-center justify-between rounded-md w-11/12 mx-auto p-2 border-2 border-bluee transition ease-in-out duration-500'>
                  <p className='font-bold text-bluee'>Price Per Mint:</p>
                  <p className='font-bold text-bluee'>{price} ETH</p>
                </div>

              </div>

              {/* Increment & Decrement buttons */}
              {walletAddress.length > 0 ? (
                <div className='flex flex-col'>
                  <div className='flex items-center justify-between px-16 sm:px-24 m-4'>
                    <button className='button w-10 h-10 flex items-center justify-center text-bluee hover:shadow-lg bg-background font-bold rounded-md border border-opacity-80 border-cyan-600'
                      onClick={decrementCount}
                    >
                      ــ
                    </button>
                    <p className="flex items-center justify-center flex-1 grow text-center font-bold text-bluee text-2xl md:text-3xl">
                      {count}
                      {/* 1 */}
                    </p>
                    <button className="button w-10 h-10 flex items-center justify-center text-bluee text-2xl hover:shadow-lg bg-background font-bold rounded-md border border-opacity-80 border-cyan-600"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                  <div className='flex items-center justify-center p-2 text-bluee'>
                    Total: {Number.parseFloat(price * count)} ETH +
                    <span className='text-gray-700'> Gas</span>
                  </div>
                  <div className='flex items-center justify-center'>
                    <button
                      className='text-lg font-semibold uppercase font-base text-gray-100 px-12 py-2 tracking-wide bg-gradient-to-tl from-greenn hover:from-cyan-200 hover:to-cyan-500 to-bluee rounded-md hover:shadow-green-500/20'
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

    </>
  )
}

