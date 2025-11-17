import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();

  const categories = [
    { 
      name: 'SILK', 
      path: '/category/silk',
      subcategories: [
        { name: 'SOFT SILK SAREES', path: '/category/silk/soft-silk-sarees' },
        { name: 'KANJIVARAM SILK SAREES', path: '/category/silk/kanjivaram-silk-sarees' },
        { name: 'BANARASI SILK SAREES', path: '/category/silk/banarasi-silk-sarees' },
        { name: 'MAHESHWARI SILK SAREES', path: '/category/silk/maheshwari-silk-sarees' },
        { name: 'RAW SILK SAREES', path: '/category/silk/raw-silk-sarees' },
        { name: 'MYSORE SILK SAREES', path: '/category/silk/mysore-silk-sarees' },
        { name: 'SAMBALPURI SILK SAREES', path: '/category/silk/sambalpuri-silk-sarees' },
        { name: 'KALAMKARI PRINT SILK SAREES', path: '/category/silk/kalamkari-print-silk-sarees' }

      ]
    },
    { 
      name: 'COTTON', 
      path: '/category/cotton',
      subcategories: [
  { name: 'BENGALI COTTON SAREES', path: '/category/cotton/bengali-cotton-sarees' },
  { name: 'MAHESHWARI COTTON SAREES', path: '/category/cotton/maheshwari-cotton-sarees' },
  { name: 'JAIPUR COTTON SAREES', path: '/category/cotton/jaipur-cotton-sarees' },
  { name: 'SOUTH COTTON SAREES', path: '/category/cotton/south-cotton-sarees' },
  { name: 'OFFICE WEAR COTTON SAREES', path: '/category/cotton/office-wear-cotton-sarees' },
  { name: 'DR.KHADI COTTON SAREES', path: '/category/cotton/dr-khadi-cotton-sarees' },
  { name: 'BLOCK PRINTED COTTON SAREES', path: '/category/cotton/block-printed-cotton-sarees' },
  { name: 'BAGRU PRINT COTTON SAREES', path: '/category/cotton/bagru-print-cotton-sarees' },
  { name: 'AJRAKH PRINT COTTON SAREES', path: '/category/cotton/ajrakh-print-cotton-sarees' },
  { name: 'IKKAT COTTON SAREES', path: '/category/cotton/ikkat-cotton-sarees' },
  { name: 'CHANDERI COTTON SILKS', path: '/category/cotton/chanderi-cotton-silks' },
  { name: 'KALAMKARI COTTON SAREES', path: '/category/cotton/kalamkari-cotton-sarees' },]

    },
    {
      name: 'REGIONAL',
      path: '/category/regional',
      subcategories: [
        { name: 'SAMBALPURI REGIONAL SAREES', path: '/category/regional/sambalpuri-regional-sarees' },
        { name: 'KANJIVARAM REGIONAL SAREES', path: '/category/regional/kanjivaram-regional-sarees' },
        { name: 'BENGALI REGIONAL SAREES', path: '/category/regional/bengali-regional-sarees' },
        { name: 'MYSORE REGIONAL SAREES', path: '/category/regional/mysore-regional-sarees' },
        { name: 'MAHESHWARI REGIONAL SAREES', path: '/category/regional/maheshwari-regional-sarees' },
        { name: 'KARNATAKA REGIONAL SAREES', path: '/category/regional/karnataka-regional-sarees' },
        { name: 'TAMILNADU REGIONAL SAREES', path: '/category/regional/tamilnadu-regional-sarees' },
        { name: 'BANARASI REGIONAL SAREES', path: '/category/regional/banarasi-regional-sarees' },
        { name: 'BANARASI REGIONAL DUPATTA', path: '/category/regional/banarasi-regional-dupatta' }
      ]
    },
    { 
      name: 'BANARASI', 
      path: '/category/banarasi',
      subcategories: [
        { name: 'BANARASI SAREES', path: '/category/banarasi/banarasi-sarees' },
        { name: 'BANARASI DUPATTA', path: '/category/banarasi/banarasi-dupatta' },
        { name: 'BANARASI DRESS MATERIAL', path: '/category/banarasi/banarasi-dress-material' }
      ]
    },
    { 
      name: 'DESIGNER SAREES', 
      path: '/category/designer-sarees',
      subcategories: [
        { name: 'PARTY WEAR SAREE', path: '/category/designer-sarees/party-wear-saree' },
        { name: 'WEDDING SAREES', path: '/category/designer-sarees/wedding-sarees' },
        { name: 'FESTIVE SAREES', path: '/category/designer-sarees/festive-sarees' },
        { name: 'BOLLYWOOD STYLE SAREES', path: '/category/designer-sarees/bollywood-style-sarees' },
        { name: 'HEAVY EMBROIDERED SAREES', path: '/category/designer-sarees/heavy-embroidered-sarees' }
      ]
    },
    { 
      name: 'PRINTED SAREES', 
      path: '/category/printed-sarees',
      subcategories: [
        { name: 'FLORAL PRINTED SAREES', path: '/category/printed-sarees/floral-printed-sarees' },
        { name: 'DIGITAL PRINTED SAREES', path: '/category/printed-sarees/digital-printed-sarees' },
        { name: 'BLOCK PRINTED SAREES', path: '/category/printed-sarees/block-printed-sarees' },
        { name: 'ABSTRACT PRINTED SAREES', path: '/category/printed-sarees/abstract-printed-sarees' },
        { name: 'GEOMETRIC PRINTED SAREES', path: '/category/printed-sarees/geometric-printed-sarees' }
      ]
    },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = (categoryName, e) => {
    // Only toggle category if it's not a link click
    if (e && e.target.tagName === 'A') {
      if (window.innerWidth < 768) {
        setActiveCategory(null);
      }
      return;
    }
    setActiveCategory(prev => (prev === categoryName ? null : categoryName));
  };

  return (
    <header className="sticky top-16 md:top-20 z-40 bg-white border-t border-gray-200 shadow-sm">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center space-x-8 py-3" ref={headerRef}>
          {categories.map((category) => (
            <div key={category.name} className="relative group">
              <div 
                className={`flex items-center text-gray-700 hover:text-rose-500 font-medium text-sm whitespace-nowrap transition-colors duration-200 relative cursor-pointer ${
                  activeCategory === category.name ? 'text-rose-500' : ''
                }`}
                onClick={() => handleClick(category.name)}
              >
                {category.name}
                <svg
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                    activeCategory === category.name ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-amber-400 group-hover:w-full transition-all duration-300"></span>
              </div>

              {/* Dropdown */}
              {category.subcategories && activeCategory === category.name && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 z-50">
                  <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden w-56">
                    <Link
                      to={category.path}
                      className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-rose-500 border-b border-gray-100"
                      onClick={() => setActiveCategory(null)}
                    >
                      All {category.name}
                    </Link>
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.name}
                          to={subcategory.path}
                          className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-rose-50 hover:text-rose-500 transition-colors duration-150"
                          onClick={() => setActiveCategory(null)}
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Navigation - Horizontal Scroll */}
        <div className="md:hidden -mx-4 relative z-50">
          {/* Main Categories */}
          <div className="flex space-x-1 overflow-x-auto px-4 pt-3 pb-2 hide-scrollbar sticky top-16 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-200">
            {categories.map((category) => (
              <div key={category.name} className="shrink-0">
                <button
                  onClick={(e) => {
                    // First tap opens subcategories, second tap navigates to the category page
                    if (activeCategory === category.name) {
                      setActiveCategory(null);
                      navigate(category.path);
                    } else {
                      handleClick(category.name, e);
                    }
                  }}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap relative flex items-center ${
                    activeCategory === category.name 
                      ? 'text-rose-500 border-b-2 border-rose-500' 
                      : 'text-gray-700 hover:text-rose-500 border-b-2 border-transparent'
                  }`}
                >
                  {category.name}
                  <svg
                    className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                      activeCategory === category.name ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          {/* Subcategories */}
          {activeCategory && (
            <div className="fixed inset-0 z-50 bg-white overflow-y-auto pt-20">
              {/* Close button at top */}
              <div className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-50">
                <h3 className="text-base font-medium text-gray-800">
                  {categories.find(cat => cat.name === activeCategory)?.name}
                </h3>
                <div className="flex items-center gap-2">
                  <Link
                    to={categories.find(cat => cat.name === activeCategory)?.path || '#'}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const cat = categories.find(c => c.name === activeCategory);
                      setActiveCategory(null);
                      if (cat?.path) navigate(cat.path);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const cat = categories.find(c => c.name === activeCategory);
                      setActiveCategory(null);
                      if (cat?.path) navigate(cat.path);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-3 py-1.5 text-sm border rounded text-gray-700 hover:text-rose-600 hover:border-rose-300"
                  >
                    All {categories.find(cat => cat.name === activeCategory)?.name}
                  </Link>
                  <button 
                    onClick={() => setActiveCategory(null)}
                    className="p-2 -mr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Close menu"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="relative max-h-[calc(100vh-180px)] overflow-y-auto">
                <div className="divide-y divide-gray-100">
                  {/* All link */}
                  <Link
                    to={categories.find(cat => cat.name === activeCategory)?.path || '#'}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const path = categories.find(cat => cat.name === activeCategory)?.path;
                      setActiveCategory(null);
                      if (path) navigate(path);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const path = categories.find(cat => cat.name === activeCategory)?.path;
                      setActiveCategory(null);
                      if (path) navigate(path);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="block px-6 py-3 text-sm font-medium text-gray-800 hover:text-rose-500 hover:bg-rose-50 transition-colors duration-200"
                  >
                    All {categories.find(cat => cat.name === activeCategory)?.name}
                  </Link>

                  {categories
                    .find(cat => cat.name === activeCategory)
                    ?.subcategories?.map((subcategory) => (
                    <Link
                      key={subcategory.name}
                      to={subcategory.path}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveCategory(null);
                        navigate(subcategory.path);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveCategory(null);
                        navigate(subcategory.path);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="block px-6 py-3 text-sm text-gray-700 hover:text-rose-500 hover:bg-rose-50 transition-colors duration-200"
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
                <div className="sticky bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
              </div>
            </div>
          )}
          
          <style jsx>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
              height: 0;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
              scrollbar-height: none;
            }
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #e5e7eb #f9fafb;
            }
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f9fafb;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: #e5e7eb;
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: #d1d5db;
            }
          `}</style>
        </div>
      </div>
    </header>
  );
};

export default Header;
