import React from 'react'

export default function Footer() {
  return (
    <footer className='py-6 h-36 md:px-8 px-5 pt-0 pb-3 bg-pattern border-t border-2 border-gray-700 flex flex-col justify-center items-center'>
      <div className="flex flex-col items-center justify-center my-4">
        <ul className='flex flex-row my-4'>
          {/* Twitter Icon */}
          <li className=''>
            <a className='bg-opacity-20 items-center relative h-7 tracking-wider pt-0.5 first::pt-0 uppercase text-2xs font-500 padding-huge  duration-200 px-1 flex justify-center flex-row transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110' href='https://twitter.com/' target='_blank' rel='noreferrer'>
              <img src="/images/telegram.png" className='h-8 w-8' />
            </a>
          </li>
          <li className=''>
            <a className='bg-opacity-20 items-center relative h-7 tracking-wider pt-0.5 first::pt-0 uppercase text-2xs font-500 padding-huge  duration-200 px-1 flex justify-center flex-row transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110' href='https://twitter.com/' target='_blank' rel='noreferrer'>
              <img src="/images/twitter.png" className='h-8 w-8' />
            </a>
          </li>
          <li className=''>
            <a className='bg-opacity-20 items-center relative h-7 tracking-wider pt-0.5 first::pt-0 uppercase text-2xs font-500 padding-huge  duration-200 px-1 flex justify-center flex-row transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110' href='https://twitter.com/' target='_blank' rel='noreferrer'>
              <img src="/images/github.png" className='h-8 w-8' />
            </a>
          </li>

          {/* Discord Icon */}

        </ul>
        <p className='text-center'>© 2022 SoccerGold. All Rights. Reserved.</p>
      </div>
    </footer>
  )
}
