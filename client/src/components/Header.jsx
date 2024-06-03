import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation(); // Added location variable
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user); // Corrected currentuser to currentUser
  const {theme} = useSelector((state)=> state.theme);
  const [searchTerm, setSearchTerm] = useState(''); // Added useState hook and searchTerm variable
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); // Corrected location to location.search
    const searchTermFromUrl = urlParams.get('searchTerm'); // Corrected searchTermFromUrl to searchTermFromUrl
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl); // Corrected setSearchTerm to setSearchTerm
    }

  }, [location.search]); // Added useEffect hook

  const handleSignout = async () => {
    try{
      const res = await fetch('/api/user/signout',{
        method: 'POST',
      });
      const data = await res.json();
      if(!res.ok){
        console.log(data.message);
      }
        else{
          dispatch(signoutSuccess());
        }
      }
    
    catch(error){
      console.log(error.message);
    
    
    }
    }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      window.location.href = `/search?searchTerm=${searchTerm}`; // Added window.location.href
    }
  }
  return (
    <Navbar className='border-b-2'>
      <div className="flex items-center">
        <Link
          to='/'
          className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
        >
          <span className='px-2 py-1 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-300 rounded-lg text-white'>
            JobBux
          </span>
        </Link>
      </div>
      <form onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch />
      </Button>
      <div className='flex gap-2 md:order-2'>
        <Button className='w-12 h-10 hidden sm:inline' color='gray' pill
        onClick={()=>dispatch(toggleTheme())}>
          {theme ===  'light' ? <FaSun/> : <FaMoon/>}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt='user'
                img={currentUser.profilePicture}
                rounded
              />
            }
          >
            {/* Dropdown items here */}
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
            </Dropdown.Header>
            <Link to='/dashboard?tab=profile'>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/sign-in'>
            <Button gradientDuoTone='purpleToBlue' outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as='div'>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as='div'>
          <Link to='/about'>About</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
