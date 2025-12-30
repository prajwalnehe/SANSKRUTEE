import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaRupeeSign, FaFilter, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { searchProducts } from '../services/api';

// Add CSS to hide scrollbar
const styles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const Search = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const q = (query.get('q') || '').trim();

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [error, setError] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filter states
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  
  // Accordion states for filters
  const [openSections, setOpenSections] = useState({
    price: true,
    material: true
  });
  
  // Available fabric options
  const allPossibleFabrics = ['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Linen', 'Satin', 'Velvet', 'Organza', 'Banarasi', 'Kanjivaram'];
  
  // Extract unique fabrics from results
  const availableFabrics = React.useMemo(() => {
    const fabricSet = new Set();
    
    results.forEach(product => {
      const possibleFabricFields = [
        product.fabric,
        product.material,
        product.product_info?.fabric,
        product.product_info?.material,
        product.details?.fabric,
        product.details?.material,
        product.description,
        product.title
      ];
      
      possibleFabricFields.forEach(field => {
        if (field) {
          const fieldStr = String(field).toLowerCase();
          allPossibleFabrics.forEach(fabric => {
            if (fieldStr.includes(fabric.toLowerCase())) {
              fabricSet.add(fabric);
            }
          });
        }
      });
    });
    
    return Array.from(fabricSet).sort();
  }, [results]);
  
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
  
  // Apply filters to results
  useEffect(() => {
    let result = [...results];
    
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
    
    // Filter by fabric
    if (selectedFabrics.length > 0) {
      result = result.filter(p => {
        const possibleFabricFields = [
          p.fabric,
          p.material,
          p.product_info?.fabric,
          p.product_info?.material,
          p.details?.fabric,
          p.details?.material,
          p.description,
          p.title
        ];
        
        const fabricSearchString = possibleFabricFields
          .filter(Boolean)
          .map(String)
          .join(' ')
          .toLowerCase();
        
        return selectedFabrics.some(fabric => 
          fabricSearchString.includes(fabric.toLowerCase())
        );
      });
    }
    
    setFilteredResults(result);
  }, [results, selectedPriceRange, selectedFabrics]);
  
  const toggleFabric = (fabric) => {
    setSelectedFabrics(prev => 
      prev.includes(fabric)
        ? prev.filter(f => f !== fabric)
        : [...prev, fabric]
    );
  };
  
  const resetFilters = () => {
    setSelectedPriceRange(null);
    setSelectedFabrics([]);
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const activeFilterCount = [
    selectedFabrics.length,
    selectedPriceRange ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  useEffect(() => {
    let active = true;
    const fetchResults = async () => {
      setError('');
      setResults([]);
      if (!q || q.length < 2) return;
      setLoading(true);
      try {
        const data = await searchProducts(q);
        const items = data?.results || [];
        if (active) {
          setResults(items);
          setFilteredResults(items);
        }
      } catch (e) {
        if (active) setError('Failed to load results');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchResults();
    return () => { active = false; };
  }, [q]);

  const onSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const term = (form.get('q') || '').toString().trim();
    if (term.length >= 2) {
      navigate(`/search?q=${encodeURIComponent(term)}`);
    }
  };

  // Filter Content Component
  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {activeFilterCount > 0 && (
          <button 
            onClick={resetFilters}
            className="text-sm text-pink-600 hover:text-pink-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="border-b border-gray-200 pb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex justify-between items-center w-full mb-4"
        >
          <h4 className="text-sm font-medium text-gray-900">Price</h4>
          {openSections.price ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
        </button>
        
        {openSections.price && (
          <div className="space-y-3">
            {priceRanges.map(range => (
              <div key={range.id} className="flex items-center">
                <input
                  type="radio"
                  id={`price-${range.id}`}
                  name="priceRange"
                  checked={selectedPriceRange === range.id}
                  onChange={() => setSelectedPriceRange(range.id)}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 cursor-pointer"
                />
                <label htmlFor={`price-${range.id}`} className="ml-3 text-sm text-gray-700 cursor-pointer">
                  {range.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Material Filter */}
      <div className="border-b border-gray-200 pb-6">
        <button
          onClick={() => toggleSection('material')}
          className="flex justify-between items-center w-full mb-4"
        >
          <h4 className="text-sm font-medium text-gray-900">Fabric</h4>
          <div className="flex items-center">
            {selectedFabrics.length > 0 && (
              <span className="mr-2 inline-flex items-center justify-center h-5 w-5 bg-pink-100 text-pink-800 text-xs font-semibold rounded-full">
                {selectedFabrics.length}
              </span>
            )}
            {openSections.material ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
          </div>
        </button>
        
        {openSections.material && (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {availableFabrics && availableFabrics.length > 0 ? (
              availableFabrics.map(material => (
                <div key={material} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`material-${material}`}
                    checked={selectedFabrics.includes(material)}
                    onChange={() => toggleFabric(material)}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor={`material-${material}`} className="ml-3 text-sm text-gray-700 cursor-pointer">
                    {material}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No fabric options available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <style>{styles}</style>
      <div className="max-w-[1600px] mx-auto">
        {q && (
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Search Results for "{q}"
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#7A2A2A] via-[#A56E2C] to-[#C89D4B] mt-2 rounded-full"></div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && q && results.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">No products found matching your search.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="flex gap-6 relative">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-32 bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide">
                <FilterContent />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Mobile Filter Button & Active Filters */}
              <div className="lg:hidden mb-4 space-y-3">
                <button 
                  onClick={() => setShowMobileFilters(true)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm"
                >
                  <FaFilter className="text-gray-500" />
                  <span className="font-medium">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="ml-2 px-2.5 py-0.5 bg-pink-100 text-pink-800 text-xs font-semibold rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Active Filters Pills */}
                {activeFilterCount > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedPriceRange && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                        {priceRanges.find(r => r.id === selectedPriceRange)?.label}
                        <button 
                          onClick={() => setSelectedPriceRange(null)}
                          className="ml-2 hover:text-pink-900"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    
                    {selectedFabrics.map(fabric => (
                      <span key={fabric} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                        {fabric}
                        <button 
                          onClick={() => toggleFabric(fabric)}
                          className="ml-2 hover:text-pink-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Results Count */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{filteredResults.length}</span> products
                </p>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {filteredResults.map((p) => (
              <div
                key={p._id || p.title}
                className="group bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-pink-100"
              >
                <Link to={`/product/${p._id || p.id || ''}`} className="block">
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
                      <span className="absolute top-3 right-3 bg-white text-green-600 border border-green-600 text-xs font-bold px-2 py-1 rounded-full">
                        {p.discountPercent || p.discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="relative p-4">
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7A2A2A] via-[#A56E2C] to-[#C89D4B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10"></div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-medium text-gray-600 line-clamp-1">
                        {p.product_info?.manufacturer || 'VARNICRAFTS'}
                      </h3>
                    </div>
                    <p className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
                      {p.title || p.name || 'Untitled Product'}
                    </p>
                
                    <div className="flex items-baseline gap-1.5 mt-2">
                      <div className="flex items-center">
                        <FaRupeeSign className="h-3.5 w-3.5 text-gray-900" />
                        <span className="text-lg font-bold text-gray-900 ml-0.5">
                          {p.price?.toLocaleString() || (p.mrp ? Math.round(p.mrp - p.mrp * ((p.discountPercent || 0) / 100)).toLocaleString() : '0')}
                        </span>
                      </div>
                      {p.mrp && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{p.mrp.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)}></div>
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <FilterContent />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
