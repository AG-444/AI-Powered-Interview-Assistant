import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8">
      <div className="container mx-auto px-4">
        {/* The main flex container for the top section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          
          {/* Column 1: Logo (Left) */}
          <div className="mb-6 md:mb-0">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
          
          </div>
          
          
          {/* Column 2: Right-aligned Links */}
          <div className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-white transition">Terms and Conditions</a>
          </div>

        </div>
        <hr className="my-6 border-gray-700" />
        <div className="text-center text-sm">
          Copyright © 2025 PrepWise. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;