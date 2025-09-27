import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="absolute top-0 left-0 w-full p-4 sm:p-6 text-white z-10 bg-gradient-to-r from-purple-900 via-purple-800 to-violet-600 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo link is now dynamic */}
        <Link to={userInfo ? "/dashboard" : "/"} className="font-playfair text-2xl sm:text-3xl font-bold">
          PrepWise
        </Link>

        {/* Conditionally render links based on login state */}
        <div>
          {userInfo ? (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-sm font-medium hover:text-violet-300 transition">Dashboard</Link>
              <button
                onClick={handleLogout}
                className="hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
            >
              sign in
            </Link>
          )
          }
        </div>
      </div>
    </header>
  );
};

export default Header;