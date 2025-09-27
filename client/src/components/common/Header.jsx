import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <header className="absolute top-0 left-0 w-full p-4 sm:p-6 text-white z-10 bg-gradient-to-r from-purple-900 via-purple-800 to-violet-600 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-playfair text-2xl sm:text-3xl font-bold">
          PrepWise
        </Link>

        {/* Conditionally render nav links and button */}
        {isLandingPage && (
          <>
            
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Sign In
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;