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

  // Check if size selection should be shown based on category
  const shouldShowSizeSelection = () => {
    if (!saree?.category) return false;
    const category = saree.category.toLowerCase();
    const categoriesWithSize = ['men', 'women', 'boys', 'girls', 'sishu', 'collection'];
    const categoriesWithoutSize = ['silk', 'cotton', 'regional', 'banarasi', 'designer sarees', 'printed sarees', 'jewellery'];
    
    // Don't show size for special categories
    if (categoriesWithoutSize.some(cat => category.includes(cat))) {
      return false;
    }
    
    // Show size for MEN, WOMEN, BOYS, GIRLS, SISHU, COLLECTION
    return categoriesWithSize.some(cat => category.includes(cat));
  };

  const showSizeSelection = shouldShowSizeSelection();

  // Check if product should use SILK-style UI (SILK, COTTON, REGIONAL, BANARASI, DESIGNER SAREES, PRINTED SAREES, JEWELLERY)
  const shouldUseSilkStyleUI = () => {
    if (!saree?.category) return false;
    const category = saree.category.toLowerCase();
    const specialCategories = ['silk', 'cotton', 'regional', 'banarasi', 'designer sarees', 'printed sarees', 'jewellery'];
    return specialCategories.some(cat => category.includes(cat));
  };

  const isSilk = shouldUseSilkStyleUI();

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:items-start">
            
            {/* Image Section - Single Image */}
            <div className="relative group">
              <div className="relative bg-gray-50 rounded-lg overflow-hidden">
                <img
                  src={productImages[0] || 'https://via.placeholder.com/600x800?text=Image+Not+Available'}
                  alt={saree.title}
                  className="w-full h-auto object-contain cursor-zoom-in"
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
                <div className="flex items-baseline gap-3 mb-4 flex-wrap">
                  <div className="flex items-baseline">
                    <FaRupeeSign className="text-gray-700 text-xl" />
                    <span className="text-3xl font-bold text-gray-900">
                      {sellingPrice.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{saree.mrp.toLocaleString()}
                  </span>
                  {saree.discountPercent > 0 && (
                    <span className="text-base font-medium text-gray-700">
                      ({saree.discountPercent}% off)
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      star <= 4 ? <FaStar key={star} className="w-4 h-4" /> : <FaRegStar key={star} className="w-4 h-4" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">4</span>
                  <span className="text-sm text-gray-500">out of 5</span>
                  <span className="text-sm text-gray-500">(24 Reviews)</span>
                </div>

                {/* Description - For SILK: with heading, for others: without heading */}
                {saree.description && (
                  <div className="mb-6">
                    {isSilk && (
                      <h3 className="text-base font-semibold text-gray-900 mb-2">Description</h3>
                    )}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {saree.description}
                    </p>
                  </div>
                )}

                {/* Size Selection - Only show for MEN, WOMEN, BOYS, GIRLS, SISHU, COLLECTION */}
                {showSizeSelection && (
                  <div className="mb-6">
                    <div className="mb-4">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900">Select Size</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
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
                )}

                {/* Quantity Selector */}
                <div className="mb-6">
                  {isSilk ? (
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-gray-900">Quantity:</label>
                      <button
                        onClick={decrementQuantity}
                        className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors font-semibold text-gray-700"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          setQuantity(val > 0 ? val : 1);
                        }}
                        className="w-20 h-10 border-2 border-gray-300 rounded-lg text-center font-semibold text-gray-900 focus:outline-none focus:border-black"
                        min="1"
                      />
                      <button
                        onClick={incrementQuantity}
                        className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors font-semibold text-gray-700"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Quantity</label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={decrementQuantity}
                          className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors font-semibold text-gray-700"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setQuantity(val > 0 ? val : 1);
                          }}
                          className="w-20 h-10 border-2 border-gray-300 rounded-lg text-center font-semibold text-gray-900 focus:outline-none focus:border-black"
                          min="1"
                        />
                        <button
                          onClick={incrementQuantity}
                          className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors font-semibold text-gray-700"
                        >
                          +
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Shipping Information */}
                <div className="mb-6">
                  {isSilk ? (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Free shipping on orders over ₹1,000</span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">Free shipping on orders over ₹1,000</p>
                  )}
                </div>

                {/* Product Information - For SILK: show above buttons */}
                {isSilk && (
                  <div className="mb-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Product Information</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex">
                        <span className="w-32 font-medium text-gray-600">Brand:</span>
                        <span>{saree.product_info?.brand || 'N/A'}</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 font-medium text-gray-600">Manufacturer:</span>
                        <span>{saree.product_info?.manufacturer || 'N/A'}</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 font-medium text-gray-600">Category:</span>
                        <span>{saree.category || 'N/A'}</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 font-medium text-gray-600">Material:</span>
                        <span>{saree.product_info?.KurtiMaterial || saree.product_info?.SareeMaterial || 'N/A'}</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 font-medium text-gray-600">Color:</span>
                        <span>{saree.product_info?.KurtiColor || saree.product_info?.SareeColor || 'N/A'}</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 font-medium text-gray-600">Length:</span>
                        <span>{saree.product_info?.KurtiLength || saree.product_info?.SareeLength || 'N/A'}</span>
                      </div>
                      {saree.product_info?.IncludedComponents && (
                        <div className="flex">
                          <span className="w-32 font-medium text-gray-600">Included:</span>
                          <span>{saree.product_info.IncludedComponents}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons - For SILK: inline, for others: at bottom */}
                {isSilk ? (
                  <div className="mb-6 hidden sm:block">
                    <div className="flex gap-3">
                      <button 
                        className="flex-1 bg-white text-black border-2 border-black py-3 px-6 rounded-lg text-base font-medium hover:bg-gray-50 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                        onClick={handleAddToCart}
                        disabled={isAdding}
                      >
                        <FaShoppingCart className="w-4 h-4" />
                        {isAdding ? 'Adding...' : 'Add to Cart'}
                      </button>
                      <button 
                        className="flex-1 bg-black text-white py-3 px-6 rounded-lg text-base font-medium hover:bg-gray-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                        onClick={handleBuyNow}
                        disabled={isAdding}
                      >
                        <FaBolt className="w-4 h-4" />
                        Buy Now
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Action Buttons - For non-SILK: at bottom */}
              {!isSilk && (
                <div className="mt-auto pt-6 hidden sm:block">
                  <div className="flex flex-col gap-3">
                    <button 
                      className="w-full bg-black text-white py-3 px-6 rounded-lg text-base font-medium hover:bg-gray-800 transition-colors disabled:opacity-70"
                      onClick={handleBuyNow}
                      disabled={isAdding}
                    >
                      Buy Now
                    </button>
                    <button 
                      className="w-full bg-white text-black border-2 border-black py-3 px-6 rounded-lg text-base font-medium hover:bg-gray-50 transition-colors disabled:opacity-70"
                      onClick={handleAddToCart}
                      disabled={isAdding}
                    >
                      {isAdding ? 'Adding...' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Description - Only show for non-SILK categories */}
        {!isSilk && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6">
                {saree.description}
              </p>
              
              {/* Product Information */}
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex">
                  <span className="w-40 font-medium text-gray-600">Brand:</span>
                  <span>{saree.product_info?.brand || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="w-40 font-medium text-gray-600">Manufacturer:</span>
                  <span>{saree.product_info?.manufacturer || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="w-40 font-medium text-gray-600">Category:</span>
                  <span>{saree.category || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="w-40 font-medium text-gray-600">Material:</span>
                  <span>{saree.product_info?.KurtiMaterial || saree.product_info?.SareeMaterial || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="w-40 font-medium text-gray-600">Color:</span>
                  <span>{saree.product_info?.KurtiColor || saree.product_info?.SareeColor || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="w-40 font-medium text-gray-600">Length:</span>
                  <span>{saree.product_info?.KurtiLength || saree.product_info?.SareeLength || 'N/A'}</span>
                </div>
                {saree.product_info?.IncludedComponents && (
                  <div className="flex">
                    <span className="w-40 font-medium text-gray-600">Included:</span>
                    <span>{saree.product_info.IncludedComponents}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


        {/* Sticky Buttons for Mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-3 z-50 sm:hidden">
          {isSilk ? (
            <div className="flex gap-2 max-w-md mx-auto">
              <button 
                className="flex-1 bg-white text-black border-2 border-black py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-70 text-sm flex items-center justify-center gap-2"
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                <FaShoppingCart className="w-4 h-4" />
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </button>
              <button 
                className="flex-1 bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm flex items-center justify-center gap-2"
                onClick={handleBuyNow}
              >
                <FaBolt className="w-4 h-4" />
                Buy Now
              </button>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
