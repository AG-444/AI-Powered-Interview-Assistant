import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const renderNavLinks = () => {
    // 1. Landing Page ('/')
    if (path === '/') {
      return (
        <Link
          to="/login"
          className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
        >
          Sign In
        </Link>
      );
    }
    
    // 2. Login Page ('/login')
    if (path === '/login') {
      return null; // Show nothing
    }

    // 3. Authenticated user pages
    if (userInfo) {
      return (
        <>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {path !== '/dashboard' && <Link to="/dashboard" className="text-sm font-medium hover:text-violet-300 transition">Dashboard</Link>}
            {path !== '/profile' && <Link to="/profile" className="text-sm font-medium hover:text-violet-300 transition">Profile</Link>}
            <button
              onClick={handleLogout}
              className="hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
          </div>
        </>
      );
    }

    return null; // Default case
  };

  return (
    <>
      <header className="absolute top-0 left-0 w-full p-4 sm:p-6 text-white z-20 bg-gradient-to-r from-purple-900 via-purple-800 to-violet-600 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link to={userInfo ? "/dashboard" : "/"} className="font-playfair text-2xl sm:text-3xl font-bold">
            PrepWise
          </Link>

          {renderNavLinks()}
        </div>
      </header>
      
      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && userInfo && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-20 left-0 w-full bg-gray-800/90 backdrop-blur-sm z-10 p-4"
          >
            <nav className="flex flex-col items-center space-y-4">
              {path !== '/dashboard' && <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-violet-300">Dashboard</Link>}
              {path !== '/profile' && <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-violet-300">Profile</Link>}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition text-sm"
              >
                Logout
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;