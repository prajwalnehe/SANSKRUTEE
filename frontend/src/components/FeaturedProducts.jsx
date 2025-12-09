import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// FaHeart is used for the favorite icon seen in the top right of the cards
import { FaHeart, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 
import { fetchSarees } from '../services/api';

const FeaturedProducts = ({ category = 'shirts', layout = 'scroll' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchSarees(category);
        // Show all products for horizontal scroll
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [category]);

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

  // Limit products to 8 for 2 rows when using grid layout
  const displayProducts = layout === 'grid' ? products.slice(0, 8) : products;

  // Product Card Component
  const ProductCard = ({ product }) => (
    <div 
      className="product-card group bg-white overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-300"
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
      
      {/* Text Details */}
      <div className="pt-2 pb-4 flex-1 flex flex-col text-left">
        <h3 className="text-sm font-semibold text-gray-800 leading-tight mb-1 truncate">
          {product.title || product.name}
        </h3>
        <div className="text-sm font-bold text-gray-900">
          ₹ {((product.price || product.mrp || 0) * (1 - (product.discountPercent || 0) / 100)).toLocaleString()}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {layout === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse h-96 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[280px] bg-gray-200 animate-pulse h-96 rounded"></div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  // Grid Layout - 2 rows
  if (layout === 'grid') {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Scroll Layout (original)
  return (
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
          {displayProducts.map((product) => (
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
              
              {/* Text Details */}
              <div className="pt-2 pb-4 flex-1 flex flex-col text-left">
                <h3 className="text-sm font-semibold text-gray-800 leading-tight mb-1 truncate">
                  {product.title || product.name}
                </h3>
                <div className="text-sm font-bold text-gray-900">
                  ₹ {((product.price || product.mrp || 0) * (1 - (product.discountPercent || 0) / 100)).toLocaleString()}
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