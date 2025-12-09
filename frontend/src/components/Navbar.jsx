import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { searchProducts } from '../services/api';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchWrapRefMobile = useRef(null);
  const searchWrapRefDesktop = useRef(null);
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const readWishlistCount = () => {
      try {
        const raw = localStorage.getItem('wishlist');
        const list = raw ? JSON.parse(raw) : [];
        setWishlistCount(Array.isArray(list) ? list.length : 0);
      } catch {
        setWishlistCount(0);
      }
    };
    readWishlistCount();
    const onStorage = (e) => {
      if (!e || e.key === 'wishlist') readWishlistCount();
    };
    const onCustom = () => readWishlistCount();
    window.addEventListener('storage', onStorage);
    window.addEventListener('wishlist:updated', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('wishlist:updated', onCustom);
    };
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('auth_token');
        setIsAuthenticated(Boolean(token));
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    const onStorage = (e) => {
      if (!e || e.key === 'auth_token') {
        checkAuth();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('auth_token');
    } catch {}
    setIsAuthenticated(false);
    navigate('/signin');
  };

  const handleLogin = () => {
    navigate('/signin');
  };

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
    if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  };

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchOpen(false);
      return;
    }
    setSearchLoading(true);
    setSearchOpen(true);
    const t = setTimeout(async () => {
      try {
        const data = await searchProducts(q);
        const items = data?.results || [];
        setSearchResults(items);
      } catch (err) {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    const onClick = (e) => {
      const inMobile = searchWrapRefMobile.current && searchWrapRefMobile.current.contains(e.target);
      const inDesktop = searchWrapRefDesktop.current && searchWrapRefDesktop.current.contains(e.target);
      if (!inMobile && !inDesktop) setSearchOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Navigation links matching suuupply style
  const navLinks = [
    { name: 'all products', path: '/shop' },
    { name: 'tshirts', path: '/category/tshirts' },
    { name: 'shirts', path: '/category/shirts' },
    { name: 'pants', path: '/category/pants' },
    { name: 'shoes', path: '/category/shoes' },
    { name: 'PERFUMES', path: '/category/accessories' },
    { name: 'about us', path: '/about' },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <nav className="relative z-[70] bg-white border-b border-gray-200">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo/Brand */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src="https://res.cloudinary.com/duc9svg7w/image/upload/v1765123531/30193-removebg-preview_ybapoz.png" 
              alt="STYLEIT Logo" 
              className="h-50 md:h-50 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={scrollToTop}
                className="text-gray-700 hover:text-black transition-colors duration-200 text-sm uppercase tracking-wide whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 md:space-x-3 ml-8 md:ml-12 lg:ml-16">
            {/* Search Icon */}
            <div className="hidden md:block relative" ref={searchWrapRefDesktop}>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-700 hover:text-black transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-[80] p-4">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => { const v = e.target.value; setSearchQuery(v); setSearchOpen(v.trim().length >= 2); }}
                    onKeyPress={handleSearchKeyPress}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {searchLoading && (
                    <div className="px-4 py-3 text-sm text-gray-500">Searching…</div>
                  )}
                  {!searchLoading && searchQuery.trim() && searchResults.length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500">No products found</div>
                  )}
                  {!searchLoading && searchResults.length > 0 && (
                    <ul className="max-h-80 overflow-auto divide-y divide-gray-100 mt-2">
                      {searchResults.slice(0, 8).map((p) => (
                        <li key={p._id || p.id || p.slug}>
                          <button
                            type="button"
                            onClick={() => {
                              setSearchOpen(false);
                              navigate(`/product/${p._id || p.id || ''}`);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                          >
                            <img
                              src={p.images?.image1 || p.image || 'https://via.placeholder.com/60x80?text=No+Image'}
                              alt={p.title || p.name || 'Product'}
                              className="w-12 h-16 object-cover rounded-md border border-gray-100"
                              onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/60x80?text=No+Image'; }}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">{p.title || p.name || 'Product'}</p>
                              {p.price && (
                                <p className="text-xs text-gray-600">₹{Number(p.price).toLocaleString()}</p>
                              )}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Search */}
            <div className="md:hidden relative" ref={searchWrapRefMobile}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => { const v = e.target.value; setSearchQuery(v); setSearchOpen(v.trim().length >= 2); }}
                onKeyPress={handleSearchKeyPress}
                onFocus={() => { if (searchQuery.trim().length >= 2) setSearchOpen(true); }}
                className="w-32 px-3 py-1.5 pl-9 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                onClick={handleSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                type="button"
                aria-label="Search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              {searchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-[80] overflow-hidden">
                  {searchLoading && (
                    <div className="px-4 py-3 text-sm text-gray-500">Searching…</div>
                  )}
                  {!searchLoading && searchQuery.trim() && searchResults.length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500">No products found</div>
                  )}
                  {!searchLoading && searchResults.length > 0 && (
                    <ul className="max-h-80 overflow-auto divide-y divide-gray-100">
                      {searchResults.slice(0, 8).map((p) => (
                        <li key={p._id || p.id || p.slug}>
                          <button
                            type="button"
                            onClick={() => {
                              setSearchOpen(false);
                              navigate(`/product/${p._id || p.id || ''}`);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                          >
                            <img
                              src={p.images?.image1 || p.image || 'https://via.placeholder.com/60x80?text=No+Image'}
                              alt={p.title || p.name || 'Product'}
                              className="w-12 h-16 object-cover rounded-md border border-gray-100"
                              onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/60x80?text=No+Image'; }}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">{p.title || p.name || 'Product'}</p>
                              {p.price && (
                                <p className="text-xs text-gray-600">₹{Number(p.price).toLocaleString()}</p>
                              )}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* User Icon */}
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="p-2 text-gray-700 hover:text-black transition-colors"
                title="Profile"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            ) : (
              <button
                onClick={handleLogin}
                className="p-2 text-gray-700 hover:text-black transition-colors"
                title="Sign In"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            )}

            {/* Cart Icon */}
            <Link to="/cart" className="p-2 text-gray-700 hover:text-black relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-black focus:outline-none"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden py-6 border-t border-gray-200 bg-white">
            <nav className="grid grid-cols-2 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-black py-2 px-4 rounded transition-colors text-sm uppercase"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            {isAuthenticated ? (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
