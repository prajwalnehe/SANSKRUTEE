import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'HOME', path: '/' },
    { name: 'COLLECTIONS', path: '/collections' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CONTACT', path: '/contact' },
  ];

  const categories = [
    { name: "MEN'S KURTAS", path: '/category/mens-kurtas' },
    { name: "WOMEN'S KURTIS", path: '/category/womens-kurtis' },
    { name: 'FESTIVE EDIT', path: '/category/festive' },
    { name: 'COTTON ESSENTIALS', path: '/category/cotton-essentials' },
    { name: 'NEW ARRIVALS', path: '/category/new-arrivals' },
  ];

  const customerService = [
    { name: 'SHIPPING POLICY', path: '/shipping' },
    { name: 'RETURNS & EXCHANGE', path: '/returns' },
    { name: 'SIZE GUIDE', path: '/size-guide' },
    { name: 'CARE INSTRUCTIONS', path: '/care-instructions' },
    { name: 'FAQ', path: '/faq' },
    { name: 'TRACK YOUR ORDER', path: '/track-order' },
  ];


  const socialLinks = [
    {
      name: 'Facebook',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      url: 'https://facebook.com/paridhaan',
    },
    {
      name: 'Instagram',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      url: 'https://instagram.com/paridhaan',
    },
    {
      name: 'Pinterest',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      ),
      url: 'https://pinterest.com/paridhaan',
    },
    {
      name: 'YouTube',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      url: 'https://youtube.com/@paridhaan',
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-[#273142] text-white border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            {/* Logo/Brand */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src="https://res.cloudinary.com/duc9svg7w/image/upload/v1763530737/a0c8f605-a031-4da5-a3e9-dfcab88fcaec-removebg-preview_s9m928.png" 
              alt="PARIDHAAN Logo" 
              className="h-25 md:h-70 w-auto hover:scale-105 transition-transform duration-300 mb-6"
            />
          </Link>
            

            {/* Social Media */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Follow Us</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={scrollToTop}
                    className="text-gray-300 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
              Categories
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>
            </h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    to={category.path}
                    onClick={scrollToTop}
                    className="text-gray-300 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
              Customer Service
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>
            </h3>
            <ul className="space-y-2">
              {customerService.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.path}
                    onClick={scrollToTop}
                    className="text-gray-300 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transform text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>



        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-300 text-sm mb-2">
            © {currentYear} <span className="font-semibold text-white">PARIDHAAN</span>. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mb-4">
            GSTIN: 27ABCDE1234F1Z5 | CIN: U74999MH2020PTC123456
          </p>
          <div className="flex justify-center space-x-4 text-xs text-gray-400">
            <Link to="/privacy" onClick={scrollToTop} className="hover:text-rose-500 transition-colors duration-200">
              Privacy Policy
            </Link>
            <span className="text-gray-600">•</span>
            <Link to="/terms" onClick={scrollToTop} className="hover:text-white transition-colors duration-200">
              Terms of Service
            </Link>
            <span className="text-gray-600">•</span>
            <Link to="/shipping" onClick={scrollToTop} className="hover:text-white transition-colors duration-200">
              Shipping Policy
            </Link>
            <span className="text-gray-600">•</span>
            <Link to="/returns" onClick={scrollToTop} className="hover:text-white transition-colors duration-200">
              Return Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
