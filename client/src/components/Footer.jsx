import React from 'react'
import { Footer } from 'flowbite-react'
import { Link } from 'react-router-dom';
import { BsFacebook, BsTwitterX } from 'react-icons/bs';

export default function FooterCom() {
  return <Footer container className='border border-t-8 border-teal-500'>
    <div className='w-full maxw-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
            <div className='mt-5'>
            <Link
        to='/'
        className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'
      >
        <span className='px-2 py-1 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-300 rounded-lg text-white'>
          JobBux
        </span>
      </Link>
            </div>
            <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
                <div>
                <Footer.Title title='About' />
                <Footer.LinkGroup col>
                    <Footer.Link href='https://mosaicbytes.com' target='_blank'
                    rel='noopener noreferrer'>
                        About founders behind JobBux
                    </Footer.Link>
                    <Footer.Link href='/about' target='_blank'
                    rel='noopener noreferrer'>
                        About JobBux
                    </Footer.Link>
                </Footer.LinkGroup>
                
                </div>
                <div>
                <Footer.Title title='Follow us' />
                <Footer.LinkGroup col>
                    <Footer.Link href='https://twitter.com/jobbux_za' target='_blank'
                    rel='noopener noreferrer'>
                        Twitter
                    </Footer.Link>
                    <Footer.Link href='https://web.facebook.com/profile.php?id=100069373275024' target='_blank'
                    rel='noopener noreferrer'>
                        Facebook
                    </Footer.Link>
                </Footer.LinkGroup>
                
                </div>
                <div>
                <Footer.Title title='Legal' />
                <Footer.LinkGroup col>
                    <Footer.Link href='#'>
                        Privacy Policy
                    </Footer.Link>
                    <Footer.Link href='#'>
                        Terms &amp; Conditions
                    </Footer.Link>
                </Footer.LinkGroup>
                
                </div>
            </div>
        </div>
        <Footer.Divider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
            <Footer.Copyright href='#' by="Mosaic Bytes PTY LTD" year = {new Date().getFullYear()}/>
            <div className='flex gap-6 sm:mt-0 mt-4 sm:justify-center'>
                <Footer.Icon href='https://web.facebook.com/profile.php?id=100069373275024' target='_blank'
                    rel='noopener noreferrer' icon={BsFacebook}/>
                <Footer.Icon href='https://twitter.com/jobbux_za' target='_blank'
                    rel='noopener noreferrer' icon={BsTwitterX} />
            </div>
        </div>
    </div>
  </Footer>;
  
}
