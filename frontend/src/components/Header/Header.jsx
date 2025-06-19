import { useState, useRef, useEffect, useContext } from 'react';
import Logo from '/logo3.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { BiMenu } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';
import BASE_URL from '../../utils/config';
import { clearToken } from '../../utils/firebase-auth';
import {
  FaHome,
  FaMapMarkedAlt,
  FaImages,
  FaEnvelope,
  FaListAlt,
  FaPlaneDeparture,
  FaPlusSquare,
  FaUserCircle,
} from 'react-icons/fa'; // Added icons

const Header = () => {
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, dispatch, role } = useContext(AuthContext);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [nonScrolledHeaderHeight, setNonScrolledHeaderHeight] = useState(0); // For spacer
  const [isScrolled, setIsScrolled] = useState(false);
  const isScrolledRef = useRef(isScrolled); // Ref to hold current isScrolled state for ResizeObserver

  // Update ref whenever isScrolled state changes
  useEffect(() => {
    isScrolledRef.current = isScrolled;
  }, [isScrolled]);
  const handleLogout = async () => {
    try {
      // 1. Clear Firebase authentication
      await clearToken();
      
      // 2. Call our backend logout endpoint to clear cookies
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Important for cookies
      });
      
      // 3. Update our local state
      dispatch({ type: 'LOGOUT' });
      
      if (isMenuOpen) {
        setMenuOpen(false);
      }
      
      navigate('/home');
      toast.info('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout. Please try again.');
      
      // Forcefully clear local state anyway
      dispatch({ type: 'LOGOUT' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) return;

    const measureAndSetHeight = () => {
      // Only update nonScrolledHeaderHeight if the header is NOT in its scrolled (fixed pill) state
      // This captures the height of the header when it's part of the document flow
      if (!isScrolledRef.current) {
        setNonScrolledHeaderHeight(headerElement.offsetHeight);
      }
    };

    // Initial measurement
    measureAndSetHeight();

    const observer = new ResizeObserver(measureAndSetHeight);
    observer.observe(headerElement);

    return () => {
      observer.unobserve(headerElement);
    };
  }, []); // Empty dependency array: runs once on mount for initial setup and ResizeObserver

  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (isMenuOpen) {
      setMenuOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const iconSize = isScrolled ? 'w-4 h-4' : 'w-5 h-5';
  const mobileIconSize = 'w-5 h-5'; // Consistent icon size for mobile menu

  // Determine header classes based on scroll state
  let headerDynamicClasses = 'z-50 ';
  let navDynamicClasses =
    'w-full flex justify-between items-center  ';

  if (isScrolled) {
    headerDynamicClasses +=
      ' fixed top-3 left-1/2 -translate-x-1/2 w-[96%] sm:w-[92%] md:w-[88%] lg:w-[85%] max-w-screen-xl bg-white/80 shadow-2xl rounded-full';
    navDynamicClasses += ' px-4 sm:px-6 py-2.5';
  } else {
    // Initially, header is part of the flow (relative or static)
    headerDynamicClasses += ' relative bg-white '; // Using relative for z-index consistency if ever needed
    navDynamicClasses += ' container mx-auto px-5 py-3 md:py-1';
  }

  return (
    <>
      <header
        ref={headerRef}
        className={headerDynamicClasses}
        style={{
          backdropFilter: isScrolled ? 'saturate(180%) blur(10px)' : 'none',
        }}
      >
        <nav className={navDynamicClasses}>
          {/* Logo Section */}
          <div
            className={`
            flex-shrink-0 transition-all duration-300 ease-in-out flex items-center
            ${isScrolled ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}
          `}
          >
            {role === 'admin' ? (
              <div
                className={`flex items-center ${!isScrolled ? 'md:hidden' : ''} font-bold text-blue-600`}
              >
                <img
                  src={Logo}
                  alt="VoyageIQ Logo"
                  className={`mr-2 ${isScrolled ? 'h-7 w-7' : 'h-8 w-8'}`}
                />
                Voyage<span className="text-orange-500">IQ</span>
              </div>
            ) : (
              <Link
                to={'/'}
                className="flex items-center font-bold text-blue-600 hover:opacity-80 transition-opacity"
              >
                <img
                  src={Logo}
                  alt="VoyageIQ Logo"
                  className={`mr-2 ${isScrolled ? 'h-7 w-7' : 'h-8 w-8'}`}
                />
                Voyage<span className="text-orange-500">IQ</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex gap-3 md:hidden items-center">
            {user && (
              <Link
                className={`font-semibold text-blue-600 rounded hover:text-blue-800 cursor-pointer truncate flex items-center gap-1.5
                  ${isScrolled ? 'text-sm max-w-[90px]' : 'text-base max-w-[120px]'}`} // Adjusted text size for mobile username
                to={role === 'user' ? '/my-account' : '#'}
                title={user.username}
              >
                <FaUserCircle className={isScrolled ? 'w-4 h-4' : 'w-5 h-5'} />
                <span className="truncate">{user.username}</span>
              </Link>
            )}
            <BiMenu
              className={`cursor-pointer text-blue-600 hover:text-blue-800 transition-colors ${isScrolled ? 'w-6 h-6' : 'w-8 h-8'}`}
              onClick={handleMenuToggle}
              aria-label="Open menu"
            />
          </div>

          {/* Desktop Menu Links */}
          <ul
            className={`hidden md:flex items-center font-semibold
            ${isScrolled ? 'space-x-5 lg:space-x-6 text-sm lg:text-base' : 'space-x-8 text-lg'}
          `}
          >
            {role === 'admin' ? (
              <>
                <Link
                  to="/all-booking"
                  className="flex items-center gap-2 hover:text-blue-800 transition-colors"
                >
                  <FaListAlt className={iconSize} /> Bookings
                </Link>
                <Link
                  to="/all-tours"
                  className="flex items-center gap-2 hover:text-blue-800 transition-colors"
                >
                  <FaPlaneDeparture className={iconSize} /> Tours
                </Link>
                <Link
                  to="/create"
                  className="flex items-center gap-2 hover:text-blue-800 transition-colors"
                >
                  <FaPlusSquare className={iconSize} /> Create
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/home"
                  className="flex items-center gap-2 hover:text-blue-800 transition-colors"
                >
                  <FaHome className={iconSize} /> Home
                </Link>
                <Link
                  to="/tours"
                  className="flex items-center gap-2 hover:text-blue-800 transition-colors"
                >
                  <FaMapMarkedAlt className={iconSize} /> Tours
                </Link>
                <Link
                  to="/about"
                  className="flex items-center gap-2 hover:text-blue-800 transition-colors"
                >
                  <FaImages className={iconSize} /> Gallery
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center gap-2 hover:text-blue-800 transition-colors"
                >
                  <FaEnvelope className={iconSize} /> Contact
                </Link>
              </>
            )}
          </ul>

          {/* Desktop Auth Area */}
          <div
            className={`hidden md:flex items-center ${isScrolled ? 'space-x-3' : 'space-x-6'}`}
          >
            {user ? (
              <div
                className={`flex items-center ${isScrolled ? 'gap-2' : 'gap-3'}`} // Adjusted gap
              >
                <Link
                  className={`font-semibold text-blue-600 rounded hover:text-blue-800 cursor-pointer truncate flex items-center gap-1.5
                    ${isScrolled ? 'text-sm max-w-[100px]' : 'text-lg max-w-[150px]'}`}
                  to={role === 'user' ? '/my-account' : '#'}
                  title={user.username}
                >
                  <FaUserCircle
                    className={isScrolled ? 'w-4 h-4' : 'w-5 h-5'}
                  />
                  <span className="truncate">{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className={`text-white rounded transition-colors
                    ${isScrolled ? 'px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600' : 'px-5 py-2 bg-blue-600 hover:bg-blue-700'}`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <button
                    className={`rounded border transition-colors
                    ${isScrolled ? 'px-3 py-1.5 text-xs text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white' : 'px-5 py-2 text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white'}`}
                  >
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button
                    className={`text-white rounded transition duration-300 ease-in-out transform hover:scale-105
                    ${isScrolled ? 'px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600' : 'px-5 py-2 bg-blue-600 hover:bg-blue-700'}`}
                  >
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Overlay for Mobile Menu */}
      <div
        className={`
          md:hidden fixed inset-0 bg-black z-40
          transition-opacity duration-300 ease-in-out
          ${isMenuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}
        `}
        onClick={handleMenuToggle}
        aria-hidden={!isMenuOpen}
      />

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden fixed top-0 right-0 w-64 h-full bg-white shadow-xl p-6 z-[51] flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMenuOpen}
      >
        <div className="flex justify-end mb-6">
          <IoClose
            className="w-8 h-8 cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
            onClick={handleMenuToggle}
            aria-label="Close menu"
          />
        </div>
        <ul className="flex flex-col gap-6 text-lg font-medium">
          {role !== 'admin' && (
            <>
              <Link
                to="/home"
                onClick={handleMenuToggle}
                className="flex items-center gap-3 hover:text-blue-800 transition-colors"
              >
                <FaHome className={mobileIconSize} /> Home
              </Link>
              <Link
                to="/tours"
                onClick={handleMenuToggle}
                className="flex items-center gap-3 hover:text-blue-800 transition-colors"
              >
                <FaMapMarkedAlt className={mobileIconSize} /> Tours
              </Link>
              <Link
                to="/about"
                onClick={handleMenuToggle}
                className="flex items-center gap-3 hover:text-blue-800 transition-colors"
              >
                <FaImages className={mobileIconSize} /> Gallery
              </Link>
              <Link
                to="/contact"
                onClick={handleMenuToggle}
                className="flex items-center gap-3 hover:text-blue-800 transition-colors"
              >
                <FaEnvelope className={mobileIconSize} /> Contact
              </Link>
            </>
          )}
          {role === 'admin' && (
            <>
              <Link
                to="/all-booking"
                onClick={handleMenuToggle}
                className="flex items-center gap-3 hover:text-blue-800 transition-colors"
              >
                <FaListAlt className={mobileIconSize} /> Bookings
              </Link>
              <Link
                to="/all-tours"
                onClick={handleMenuToggle}
                className="flex items-center gap-3 hover:text-blue-800 transition-colors"
              >
                <FaPlaneDeparture className={mobileIconSize} /> Tours
              </Link>
              <Link
                to="/create"
                onClick={handleMenuToggle}
                className="flex items-center gap-3 hover:text-blue-800 transition-colors"
              >
                <FaPlusSquare className={mobileIconSize} /> Create
              </Link>
            </>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="mt-auto px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-3"
            >
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-4 mt-auto">
              <Link to="/login" onClick={handleMenuToggle}>
                <button className="w-full text-blue-600 rounded border border-blue-600 py-2 hover:bg-blue-600 hover:text-white transition-colors">
                  Login
                </button>
              </Link>
              <Link to="/register" onClick={handleMenuToggle}>
                <button className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
                  Register
                </button>
              </Link>
            </div>
          )}
        </ul>
      </div>

      {/* Spacer div: Takes up space only when header is fixed to prevent content jump */}
      <div
        style={{ height: isScrolled ? `${nonScrolledHeaderHeight}px` : '0px' }}
      />
    </>
  );
};

export default Header;
