import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaRupeeSign, FaSpinner, FaFilter, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { fetchSarees } from '../services/api';

const Shop = () => {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filter states
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [customPriceFrom, setCustomPriceFrom] = useState('');
  const [customPriceTo, setCustomPriceTo] = useState('');
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  
  // Accordion states for desktop filters
  const [openSections, setOpenSections] = useState({
    price: true,
    material: true
  });

  const priceRanges = [
    { id: 0, label: '₹99 - ₹200', min: 99, max: 200 },
    { id: 1, label: '₹201 - ₹400', min: 201, max: 400 },
    { id: 2, label: '₹401 - ₹600', min: 401, max: 600 },
    { id: 3, label: '₹601 - ₹800', min: 601, max: 800 },
    { id: 4, label: '₹801 - ₹1,000', min: 801, max: 1000 },
    { id: 5, label: '₹1,001 - ₹1,200', min: 1001, max: 1200 },
    { id: 6, label: '₹1,201 - ₹1,500', min: 1201, max: 1500 },
    { id: 7, label: 'Above ₹1,500', min: 1501, max: Infinity },
  ];

  // Fetch all products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch all products by passing empty string
        const data = await fetchSarees('');
        setProducts(data || []);
        setFilteredProducts(data || []);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...products];
    
    // Filter by price range
    if (selectedPriceRange) {
      const range = priceRanges.find(r => r.id === selectedPriceRange);
      if (range) {
        result = result.filter(p => {
          const price = p.price || (p.mrp - p.mrp * ((p.discountPercent || 0) / 100));
          return price >= range.min && price <= range.max;
        });
      }
    }
    
    // Filter by custom price range
    if (customPriceFrom || customPriceTo) {
      result = result.filter(p => {
        const price = p.price || (p.mrp - p.mrp * ((p.discountPercent || 0) / 100));
        const from = customPriceFrom ? parseFloat(customPriceFrom) : 0;
        const to = customPriceTo ? parseFloat(customPriceTo) : Infinity;
        return price >= from && price <= to;
      });
    }
    
    // Filter by fabric/material
    if (selectedFabrics.length > 0) {
      result = result.filter(p => {
        const materialFields = [
          p.product_info?.tshirtMaterial,
          p.product_info?.shoeMaterial,
          p.product_info?.pantMaterial,
          p.product_info?.material,
          p.material,
          p.description,
          p.title
        ].filter(Boolean).join(' ').toLowerCase();
        
        return selectedFabrics.some(fabric => 
          materialFields.includes(fabric.toLowerCase())
        );
      });
    }
    
    setFilteredProducts(result);
  }, [products, selectedPriceRange, customPriceFrom, customPriceTo, selectedFabrics]);

  const resetFilters = () => {
    setSelectedPriceRange(null);
    setCustomPriceFrom('');
    setCustomPriceTo('');
    setSelectedFabrics([]);
  };

  const handleCardClick = (product) => {
    navigate(`/product/${product._id || product.id || ''}`);
  };

  // Extract unique materials from products
  const availableMaterials = React.useMemo(() => {
    const materialSet = new Set();
    products.forEach(product => {
      const materials = [
        product.product_info?.tshirtMaterial,
        product.product_info?.shoeMaterial,
        product.product_info?.pantMaterial,
        product.product_info?.material,
        product.material
      ].filter(Boolean);
      
      materials.forEach(m => materialSet.add(m));
    });
    
    return Array.from(materialSet).sort();
  }, [products]);

  const calculatePrice = (product) => {
    return product.price || Math.round(product.mrp - (product.mrp * (product.discountPercent || 0) / 100));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-gray-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Reset
                </button>
              </div>

              {/* Price Filter */}
              <div className="mb-6 border-b border-gray-200 pb-4">
                <button
                  onClick={() => setOpenSections({ ...openSections, price: !openSections.price })}
                  className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-2"
                >
                  <span>Price</span>
                  {openSections.price ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
                </button>
                {openSections.price && (
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <label key={range.id} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={selectedPriceRange === range.id}
                          onChange={() => setSelectedPriceRange(range.id)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{range.label}</span>
                      </label>
                    ))}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-900 mb-2">Custom Range</p>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={customPriceFrom}
                          onChange={(e) => setCustomPriceFrom(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={customPriceTo}
                          onChange={(e) => setCustomPriceTo(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Material Filter */}
              {availableMaterials.length > 0 && (
                <div className="mb-6">
                  <button
                    onClick={() => setOpenSections({ ...openSections, material: !openSections.material })}
                    className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-2"
                  >
                    <span>Material</span>
                    {openSections.material ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
                  </button>
                  {openSections.material && (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {availableMaterials.map((material) => (
                        <label key={material} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFabrics.includes(material)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFabrics([...selectedFabrics, material]);
                              } else {
                                setSelectedFabrics(selectedFabrics.filter(f => f !== material));
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{material}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <FaFilter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>

            {/* Mobile Filters */}
            {showMobileFilters && (
              <div className="md:hidden bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
                {/* Same filter content as desktop */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Price</h3>
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <label key={range.id} className="flex items-center">
                          <input
                            type="radio"
                            name="priceRangeMobile"
                            checked={selectedPriceRange === range.id}
                            onChange={() => setSelectedPriceRange(range.id)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {availableMaterials.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Material</h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {availableMaterials.map((material) => (
                          <label key={material} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedFabrics.includes(material)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedFabrics([...selectedFabrics, material]);
                                } else {
                                  setSelectedFabrics(selectedFabrics.filter(f => f !== material));
                                }
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">{material}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={resetFilters}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 text-black hover:text-gray-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {filteredProducts.map((p) => (
                  <div
                    key={p._id || p.title}
                    className="group bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-black"
                    onClick={() => handleCardClick(p)}
                  >
                    <div className="relative w-full aspect-[3/4] bg-gray-50">
                      <img
                        src={p.images?.image1 || p.image || 'https://via.placeholder.com/300x400?text=Image+Not+Available'}
                        alt={p.title || p.name || 'Product'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x400?text=Image+Not+Available';
                        }}
                      />
                      {(p.discountPercent > 0 || p.discount) && (
                        <span className="absolute top-3 right-3 bg-white text-red-600 border border-red-600 text-xs font-bold px-2 py-1 rounded-full">
                          {p.discountPercent || p.discount}% OFF
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition-colors">
                        {p.title || p.name || 'Product'}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <div className="flex items-baseline">
                          <FaRupeeSign className="text-xs text-gray-700" />
                          <span className="text-lg font-bold text-gray-900">
                            {calculatePrice(p).toLocaleString()}
                          </span>
                        </div>
                        {p.discountPercent > 0 && (
                          <>
                            <span className="text-sm text-gray-400 line-through">
                              ₹{p.mrp?.toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
