import { Routes, Route, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux'; // <-- 1. Add this import
import IntervieweePage from './pages/IntervieweePage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import IntervieweeDashboard from './pages/IntervieweeDashboard';
import PrivateRoute from './components/common/PrivateRoute';
import ProfilePage from './pages/ProfilePage';

function App() {
  const location = useLocation();
  const path = location.pathname;
  const { userInfo } = useSelector((state) => state.auth); // <-- 2. Get user info here

  // This logic now works because userInfo is defined
  const showHeader = path === '/' || path === '/login' || userInfo;
  const showFooter = path === '/' || path === '/login' || userInfo;
  
  const needsTopPadding = path === '/login' || (userInfo && path !== '/');

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col font-playfair">
      {showHeader && <Header />}
      
      <main className={`flex-grow flex flex-col ${needsTopPadding ? 'pt-36' : ''}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="" element={<PrivateRoute />}>
            <Route path="/dashboard" element={<IntervieweeDashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/interview" element={<IntervieweePage />} />
          </Route>
        </Routes>
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}

export default App;