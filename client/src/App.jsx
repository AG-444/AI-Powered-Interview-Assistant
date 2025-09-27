import { Routes, Route, useLocation } from 'react-router-dom';
import IntervieweePage from './pages/IntervieweePage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

function App() {
  const location = useLocation();
  const path = location.pathname;

  // Define rules for showing layout components based on the current page
  const showHeader = path === '/' || path === '/login';
  const showFooter = path === '/' || path === '/login';
  
  // Only the login page needs top padding to avoid the header.
  // The landing page uses the full screen height for vertical centering.
  const needsTopPadding = path === '/login';

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      {showHeader && <Header />}
      
      <main className={`flex-grow flex flex-col ${needsTopPadding ? 'pt-36' : ''}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/interview" element={<IntervieweePage />} />
        </Routes>
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}

export default App;