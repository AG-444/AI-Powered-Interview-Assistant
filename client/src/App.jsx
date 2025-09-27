import { Routes, Route, useLocation } from 'react-router-dom';
import IntervieweePage from './pages/IntervieweePage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import IntervieweeDashboard from './pages/IntervieweeDashboard';
import PrivateRoute from './components/common/PrivateRoute';

function App() {
  const location = useLocation();
  const path = location.pathname;

  const showHeader = path === '/' || path === '/login' || path.startsWith('/dashboard');
  const showFooter = path === '/' || path === '/login' || path.startsWith('/dashboard');
  
  const needsTopPadding = path === '/login' || path.startsWith('/dashboard');

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col font-playfair">
      {showHeader && <Header />}
      
      <main className={`flex-grow flex flex-col ${needsTopPadding ? 'pt-36' : ''}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="" element={<PrivateRoute />}>
            <Route path="/dashboard" element={<IntervieweeDashboard />} />
            <Route path="/interview" element={<IntervieweePage />} />
          </Route>
        </Routes>
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}

export default App;
