import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaRupeeSign, FaArrowLeft, FaStar, FaRegStar, FaBolt, FaSpinner, FaTimes, FaExpand, FaHeart, FaRegHeart, FaShareAlt, FaComment } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { fetchSareeById } from "../services/api";

const readWishlist = () => {
  try {
    const raw = localStorage.getItem('wishlist');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeWishlist = (items) => {
  try {
    localStorage.setItem('wishlist', JSON.stringify(items));
  } catch {}
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [saree, setSaree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const location = useLocation();
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const loadSaree = async () => {
      try {
        setLoading(true);
        const data = await fetchSareeById(id);
        setSaree(data);
      } catch (err) {
        console.error('Failed to load saree details:', err);
        setError('Failed to load saree details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadSaree();
  }, [id]);

  // Initialize wishlist state when product loads
  useEffect(() => {
    if (!saree) return;
    const list = readWishlist();
    const pid = saree._id || id;
    setWishlisted(list.some(p => (p._id || p.id) === pid));
  }, [saree, id]);

  const handleAddToCart = async () => {
    if (!saree) return;
    setIsAdding(true);
    try {
      await addToCart(id, quantity);
      alert(`${saree.title} ${quantity > 1 ? `(${quantity} items) ` : ''}added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: saree?.title || 'Saree',
        text: saree?.description?.slice(0, 120) || 'Check out this saree!',
        url: window.location.href,
      };
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard');
      }
    } catch (e) {
      console.error('Share failed', e);
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!saree) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Product not found</p>
        <button
          onClick={() => navigate('/shop')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Browse Sarees
        </button>
      </div>
    );
  }

  const sellingPrice = Math.round(saree.mrp - (saree.mrp * (saree.discountPercent || 0) / 100));
  
  // Get all available images
  const productImages = [
    saree.images?.image1,
    saree.images?.image2,
    saree.images?.image3,
    saree.images?.image4,
    saree.images?.image5
  ].filter(Boolean);

  // Default sizes (you can customize based on your data)
  const sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

  const handleWishlistToggle = () => {
    if (!saree) return;
    const pid = saree._id || id;
    const list = readWishlist();
    const exists = list.some(p => (p._id || p.id) === pid);
    if (exists) {
      const next = list.filter(p => (p._id || p.id) !== pid);
      writeWishlist(next);
      setWishlisted(false);
      try { window.dispatchEvent(new Event('wishlist:updated')); } catch {}
    } else {
      const item = {
        _id: pid,
        title: saree.title,
        images: saree.images,
        price: sellingPrice,
        mrp: saree.mrp,
        discountPercent: saree.discountPercent || 0,
      };
      const next = [item, ...list.filter((p) => (p._id || p.id) !== pid)];
      writeWishlist(next);
      setWishlisted(true);
      try { window.dispatchEvent(new Event('wishlist:updated')); } catch {}
      alert(`${saree.title} added to wishlist`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-4 relative">
      {/* Image Modal */}
      {isImageModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                setIsImageModalOpen(false);
              }}
            >
              <FaTimes className="w-8 h-8" />
            </button>
            <img
              src={productImages[0] || 'https://via.placeholder.com/600x800?text=Image+Not+Available'}
              alt={saree.title}
              className="max-w-full max-h-[80vh] object-contain"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/600x800?text=Image+Not+Available';
              }}
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto py-6">
        {/* Main Product Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 lg:items-start">
            
            {/* Image Section - Single Image */}
            <div className="relative group">
              <div className="relative pt-[100%] bg-gray-50 rounded-lg overflow-hidden">
                <img
                  src={productImages[0] || 'https://via.placeholder.com/600x800?text=Image+Not+Available'}
                alt={saree.title}
                className="absolute top-0 left-0 w-full h-full object-contain cursor-zoom-in"
                onClick={() => setIsImageModalOpen(true)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600x800?text=Image+Not+Available';
                }}
              />
                <div 
                  className="absolute bottom-4 right-4 bg-white bg-opacity-80 p-2 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsImageModalOpen(true);
                  }}
                  title="Click to enlarge"
              >
                <FaExpand className="text-gray-700" />
              </div>
            </div>
          </div>

          {/* Product Details */}
            <div className="py-2 flex flex-col h-full">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{saree.title}</h1>
                
                {/* Price */}
                <div className="flex items-baseline gap-2 sm:gap-3 mb-6 flex-wrap">
                  <div className="flex items-baseline">
                    <FaRupeeSign className="text-gray-700 text-lg sm:text-xl" />
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {sellingPrice.toLocaleString()}
                </span>
              </div>
                  <span className="text-base sm:text-lg text-gray-400 line-through">
                ₹{saree.mrp.toLocaleString()}
              </span>
              {saree.discountPercent > 0 && (
                    <span className="bg-pink-100 text-pink-700 text-xs sm:text-sm font-medium px-2 sm:px-2.5 py-1 rounded">
                      {saree.discountPercent}% off
                </span>
              )}
            </div>

                {/* Sales and Reviews */}
                <div className="flex items-center gap-2 sm:gap-4 mb-5">
                  <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">10K+ Sold</span>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                        star <= 4 ? <FaStar key={star} className="w-3 h-3 sm:w-4 sm:h-4" /> : <FaRegStar key={star} className="w-3 h-3 sm:w-4 sm:h-4" />
                ))}
              </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">4.8</span>
                    <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">(188 Reviews)</span>
                  </div>
            </div>

                {/* Description */}
                {saree.description && (
            <div className="mb-6">
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {saree.description}
              </p>
                  </div>
                )}

                {/* Size Selection */}
                <div className="mb-6">
                  <div className="mb-4">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Select Size</h3>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        className={`min-w-[45px] sm:min-w-[50px] px-4 sm:px-5 py-2 sm:py-2.5 border-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                          selectedSize === size
                            ? 'border-black bg-black text-white shadow-sm'
                            : 'border-gray-300 hover:border-gray-500 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons - Pushed to bottom */}
              <div className="mt-auto pt-6 hidden sm:block">
                <div className="flex flex-col items-center gap-3 mb-5">
                  <button 
                    className="w-full max-w-md bg-black text-white py-3 sm:py-3.5 px-6 sm:px-8 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-800 transition-colors disabled:opacity-70"
                    onClick={handleBuyNow}
                    disabled={isAdding}
                  >
                    Buy Now
                  </button>
                  <button 
                    className="w-full max-w-md bg-white text-black border-2 border-black py-3 sm:py-3.5 px-6 sm:px-8 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-50 transition-colors disabled:opacity-70"
                    onClick={handleAddToCart}
                    disabled={isAdding}
                  >
                    {isAdding ? 'Adding...' : 'Add to Cart'}
                  </button>
              </div>

                {/* Action Icons */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 text-gray-600 pt-2 border-t border-gray-200">
                  <button 
                    className="flex items-center gap-1.5 sm:gap-2 hover:text-gray-900 transition-colors"
                    title="Chat"
                  >
                    <FaComment className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    <span className="text-xs sm:text-sm">Chat</span>
                  </button>
                  <button 
                    className="flex items-center gap-1.5 sm:gap-2 hover:text-gray-900 transition-colors"
                    onClick={handleWishlistToggle}
                    title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    {wishlisted ? <FaHeart className="fill-current text-red-500 w-4 h-4 sm:w-[18px] sm:h-[18px]" /> : <FaRegHeart className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />}
                    <span className="text-xs sm:text-sm">Wishlist</span>
                  </button>
                  <button 
                    className="flex items-center gap-1.5 sm:gap-2 hover:text-gray-900 transition-colors"
                    onClick={handleShare}
                    title="Share"
                  >
                    <FaShareAlt className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    <span className="text-xs sm:text-sm">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6">
              {saree.description}
            </p>
            
            {/* Specifications */}
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700">
              <div className="flex">
                <span className="w-32 sm:w-48 font-medium text-gray-600">Package Dimensions:</span>
                <span>27.3 x 24.8 x 4.9 cm; 180 g</span>
              </div>
              <div className="flex">
                <span className="w-32 sm:w-48 font-medium text-gray-600">Specification:</span>
                <span>{saree.product_info?.KurtiMaterial || saree.product_info?.SareeMaterial || 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="w-32 sm:w-48 font-medium text-gray-600">Date First Available:</span>
                <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex">
                <span className="w-32 sm:w-48 font-medium text-gray-600">Department:</span>
                <span>{saree.category || 'Mens'}</span>
              </div>
                  <div className="flex">
                <span className="w-32 sm:w-48 font-medium text-gray-600">Brand:</span>
                    <span>{saree.product_info?.brand || 'N/A'}</span>
                  </div>
                  <div className="flex">
                <span className="w-32 sm:w-48 font-medium text-gray-600">Manufacturer:</span>
                    <span>{saree.product_info?.manufacturer || 'N/A'}</span>
                  </div>
                  <div className="flex">
                <span className="w-32 sm:w-48 font-medium text-gray-600">Material:</span>
                    <span>{saree.product_info?.KurtiMaterial || saree.product_info?.SareeMaterial || 'N/A'}</span>
                  </div>
                  <div className="flex">
                <span className="w-32 sm:w-48 font-medium text-gray-600">Color:</span>
                    <span>{saree.product_info?.KurtiColor || saree.product_info?.SareeColor || 'N/A'}</span>
                  </div>
                  <div className="flex">
                <span className="w-32 sm:w-48 font-medium text-gray-600">Length:</span>
                    <span>{saree.product_info?.KurtiLength || saree.product_info?.SareeLength || 'N/A'}</span>
                  </div>
                  {saree.product_info?.SleeveLength && (
                    <div className="flex">
                  <span className="w-32 sm:w-48 font-medium text-gray-600">Sleeve Length:</span>
                      <span>{saree.product_info.SleeveLength}</span>
                    </div>
                  )}
                  {saree.product_info?.IncludedComponents && (
                    <div className="flex">
                  <span className="w-32 sm:w-48 font-medium text-gray-600">Included:</span>
                      <span>{saree.product_info.IncludedComponents}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

        {/* Sticky Buttons for Mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-3 z-50 sm:hidden">
          <div className="flex gap-2 max-w-md mx-auto">
            <button 
              className="flex-1 bg-white text-black border-2 border-black py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-70 text-sm"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
            <button 
              className="flex-1 bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
