import { Link } from 'react-router-dom';

const Footer = () => {
  const supportLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Terms & Services', path: '/terms' },
    { name: 'Contact', path: '/contact' },
    { name: 'For grievances', path: '/contact' },
  ];

  const shippingLinks = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Delivery & Returns Policy', path: '/returns' },
    { name: 'Shipping Policy', path: '/shipping' },
    { name: 'Track My Order', path: '/track-order' },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-black text-white border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20 sm:pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">
          <div>
            <h3 className="text-sm font-semibold mb-3">Support</h3>
            <ul className="space-y-1.5">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} onClick={scrollToTop} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Orders and Shipping</h3>
            <ul className="space-y-1.5">
              {shippingLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} onClick={scrollToTop} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-semibold mb-3">Subscribe</h3>
            <p className="text-sm text-gray-300 mb-3">
              Enter your email below to be the first to know about new collections and product launches.
            </p>
            <div className="flex items-center bg-white text-black h-10 px-3">
              <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m0 0l3-3m-3 3l3 3M4 6h16M4 18h16" />
              </svg>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 text-sm outline-none"
              />
              <button className="text-lg leading-none px-1" aria-label="Subscribe">
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
