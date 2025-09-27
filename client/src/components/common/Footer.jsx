const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8">
      <div className="container mx-auto px-4">
        {/* Centered Q&A Link */}
        <div className="text-center">
          <a href="#" className="hover:text-white transition">Q&A</a>
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