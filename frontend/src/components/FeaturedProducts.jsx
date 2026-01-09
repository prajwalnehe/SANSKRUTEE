import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// FaHeart is used for the favorite icon seen in the top right of the cards
import { FaHeart, FaStar, FaChevronLeft, FaChevronRight, FaSpinner, FaDatabase } from 'react-icons/fa'; 
import { fetchSarees } from '../services/api';
import { getCachedProducts, setCachedProducts } from '../utils/cache';

const FeaturedProducts = ({ category = 'shirts', layout = 'scroll', maxProducts = 8 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedFromCache, setLoadedFromCache] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const isGridLayout = layout === 'grid';

  // Get cache key for this category
  const getCacheKey = () => {
    const cat = category || 'all';
    return `featured_products_cache_${cat}`;
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        // Check cache first
        const cacheKey = getCacheKey();
        const cachedProducts = await getCachedProducts(cacheKey);
        
        if (cachedProducts && cachedProducts.length > 0) {
          // Use cached data
          const productList = isGridLayout ? (cachedProducts || []).slice(0, maxProducts) : (cachedProducts || []);
          setProducts(productList);
          setLoadedFromCache(true);
          setLoading(false);
          
          // Hide cache message after 3 seconds
          setTimeout(() => setLoadedFromCache(false), 3000);
          return;
        }

        // No cache, fetch from API
        const response = await fetchSarees(category || '');
        
        // Handle both old format (array) and new format (object with products and pagination)
        let data = [];
        if (Array.isArray(response)) {
          data = response;
        } else if (response.products) {
          data = response.products;
        } else {
          data = response;
        }
        
        // Cache the products
        await setCachedProducts(cacheKey, data);
        
        // Limit products for grid layout, show all for scroll layout
        const productList = isGridLayout ? (data || []).slice(0, maxProducts) : (data || []);
        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Try cache as fallback
        const cacheKey = getCacheKey();
        const cachedProducts = await getCachedProducts(cacheKey);
        if (cachedProducts && cachedProducts.length > 0) {
          const productList = isGridLayout ? (cachedProducts || []).slice(0, maxProducts) : (cachedProducts || []);
          setProducts(productList);
          setLoadedFromCache(true);
          setTimeout(() => setLoadedFromCache(false), 3000);
        } else {
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [category, isGridLayout, maxProducts]);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.querySelector('.product-card')?.offsetWidth || 280;
      const gap = 16; // gap-4 = 16px
      const scrollAmount = cardWidth + gap;
      const currentScroll = container.scrollLeft;
      
      let newScroll;
      if (direction === 'left') {
        newScroll = Math.max(0, currentScroll - scrollAmount);
      } else {
        const maxScroll = container.scrollWidth - container.clientWidth;
        newScroll = Math.min(maxScroll, currentScroll + scrollAmount);
      }
      
      container.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
      return () => {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [products]);

  // Inject CSS to hide scrollbar for webkit browsers
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .featured-products-scroll::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleProductClick = (productId) => {
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  if (loading) {
    return (
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20 text-gray-600">
            <FaSpinner className="w-6 h-6 animate-spin mr-3 text-amber-700" />
            <span className="text-lg">Loading products...</span>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  // Grid Layout (2 rows)
  if (isGridLayout) {
    return (
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cache loaded message */}
          {loadedFromCache && (
            <div className="mb-4 flex justify-center">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium animate-fade-in">
                <FaDatabase className="text-green-600" />
                <span>Loaded from cache</span>
              </div>
            </div>
          )}
          {/* Grid Container - 2 rows, responsive columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <div 
                key={product._id || product.id} 
                className="group bg-white overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => {
                  const productId = product._id || product.id;
                  if (productId) {
                    handleProductClick(productId);
                  }
                }}
              >
                {/* Image Container */}
                <div className="relative pt-[130%]">
                  <img 
                    src={product.images?.image1 || product.image || 'https://via.placeholder.com/400x500?text=No+Image'} 
                    alt={product.title || product.name} 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                  
                  {/* Heart Icon (Top Right) */}
                  <button 
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1 sm:p-1.5 md:p-2 bg-white/70 rounded-full hover:bg-white text-gray-700 transition-colors duration-200 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle wishlist logic here
                    }}
                  >
                    <FaHeart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </button>
                </div>
                
                {/* Text Details */}
                <div className="pt-2 pb-4 flex-1 flex flex-col text-left">
                  <h3 className="text-sm font-semibold text-gray-800 leading-tight mb-1 truncate">
                    {product.title || product.name}
                  </h3>
                  <div className="text-sm font-bold text-gray-900">
                    ₹ {Math.round((product.price || product.mrp || 0) * (1 - (product.discountPercent || 0) / 100)).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* EXPLORE ALL LOOKS Button - Hidden for perfumes and shoes categories */}
          {category !== 'perfumes' && category !== 'Shoes' && category !== 'shoes' && (
          <div className="flex justify-center mt-8 mb-4">
            <Link
              to="/shop"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-black-100 transition-all duration-300 transform hover:scale-105 shadow-lg border border-gray-300"
            >
              EXPLORE ALL LOOKS
            </Link>
          </div>
          )}
        </div>
      </section>
    );
  }

  // Horizontal Scroll Layout (default)
  return (
    // Section matches the main background of the image (usually white)
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Left Navigation Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
            aria-label="Scroll left"
          >
            <FaChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}

        {/* Horizontal Scrollable Container */}
        <div 
          ref={scrollContainerRef}
          className="featured-products-scroll flex gap-4 overflow-x-auto scroll-smooth pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory'
          }}
          onScroll={checkScrollability}
        >
          {products.map((product) => (
            // Card: No shadow, white background, overflow hidden
            <div 
              key={product._id || product.id} 
              className="product-card group bg-white overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-300 flex-shrink-0 w-[280px] md:w-[300px]"
              style={{ scrollSnapAlign: 'start' }}
              onClick={() => {
                const productId = product._id || product.id;
                if (productId) {
                  handleProductClick(productId);
                }
              }}
            >
              
              {/* Image Container */}
              <div className="relative pt-[130%]">
                <img 
                  src={product.images?.image1 || product.image || 'https://via.placeholder.com/400x500?text=No+Image'} 
                  alt={product.title || product.name} 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
                
                {/* Heart Icon (Top Right) */}
                <button 
                  className="absolute top-2 right-2 p-2 bg-white/70 rounded-full hover:bg-white text-gray-700 transition-colors duration-200 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle wishlist logic here
                  }}
                >
                  <FaHeart className="w-4 h-4" />
                </button>
              </div>
              
              {/* Text Details (matches simple layout below image) */}
              <div className="pt-2 pb-4 flex-1 flex flex-col text-left">
                {/* Product Name - bold, slightly smaller */}
                <h3 className="text-sm font-semibold text-gray-800 leading-tight mb-1 truncate">
                  {product.title || product.name}
                </h3>
                
                {/* Price - dark, bold, slightly smaller than name */}
                <div className="text-sm font-bold text-gray-900">
                  ₹ {Math.round((product.price || product.mrp || 0) * (1 - (product.discountPercent || 0) / 100)).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Navigation Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
            aria-label="Scroll right"
          >
            <FaChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;