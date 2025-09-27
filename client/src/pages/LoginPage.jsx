import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCredentials } from '../store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('interviewee');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'interviewee') {
        navigate('/interview');
      } else {
        // Later, you can redirect interviewers to their dashboard
        // navigate('/dashboard'); 
      }
    }
  }, [navigate, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Determine the correct API endpoint based on the view
    const url = isLoginView ? 'http://localhost:5001/api/auth/login' : 'http://localhost:5001/api/auth/register';
    const payload = isLoginView ? { email, password } : { email, password, role };

    try {
      // Make the API call to the backend
      const res = await axios.post(url, payload);
      // On success, dispatch the user data to the Redux store
      dispatch(setCredentials(res.data));
      // The useEffect hook will then handle redirecting the user
    } catch (err) {
      // If the API returns an error, display it
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20, transition: { duration: 0.2 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <div className="flex w-full flex-grow items-center justify-center p-4">
      {/* This motion.div with the 'layout' prop provides the smooth resizing animation */}
      <motion.div
        layout
        transition={{ layout: { duration: 0.3, type: 'spring', stiffness: 400, damping: 30 } }}
        className="w-full max-w-md rounded-xl bg-gray-800/50 p-8 shadow-2xl backdrop-blur-lg"
      >
        <div className="my-4 flex justify-center rounded-lg border border-gray-700 p-1 space-x-1">
          <button onClick={() => setIsLoginView(true)} className={`w-1/2 rounded-md py-2 text-sm font-medium transition ${isLoginView ? 'bg-violet-600 text-white shadow-md' : 'text-gray-300 hover:bg-white/10'}`}>Login</button>
          <button onClick={() => setIsLoginView(false)} className={`w-1/2 rounded-md py-2 text-sm font-medium transition ${!isLoginView ? 'bg-violet-600 text-white shadow-md' : 'text-gray-300 hover:bg-white/10'}`}>Sign Up</button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLoginView ? 'login' : 'signup'}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <p className="text-center text-sm text-red-400">{error}</p>}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full appearance-none rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-violet-500" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full appearance-none rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-violet-500" />
              </div>

              {!isLoginView && (
                <div>
                  <label className="block text-sm font-medium text-gray-300">I am an</label>
                  <div className="mt-2 flex justify-center space-x-6">
                    <label className="flex items-center cursor-pointer"><input type="radio" name="role" value="interviewee" checked={role === 'interviewee'} onChange={(e) => setRole(e.target.value)} className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-500 bg-gray-700" /><span className="ml-2 text-sm text-white">Interviewee</span></label>
                    <label className="flex items-center cursor-pointer"><input type="radio" name="role" value="interviewer" checked={role === 'interviewer'} onChange={(e) => setRole(e.target.value)} className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-500 bg-gray-700" /><span className="ml-2 text-sm text-white">Interviewer</span></label>
                  </div>
                </div>
              )}

              <div>
                <button type="submit" className="flex w-full justify-center rounded-md border border-transparent bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                  {isLoginView ? 'Login' : 'Create Account'}
                </button>
              </div>
            </form>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LoginPage;
