import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ProductFilters = ({
  priceRanges,
  selectedPriceRange,
  setSelectedPriceRange,
  customMinPrice,
  customMaxPrice,
  setCustomMinPrice,
  setCustomMaxPrice,
  openSections,
  toggleSection,
  availableFabrics,
  selectedFabrics,
  toggleFabric,
  activeFilterCount,
  resetFilters,
  categoryName
}) => {
  // Categories that should not show FABRIC/MATERIAL filter
  const categoriesWithoutMaterial = ['shoes', 'sneakers', 'accessories', 'perfumes'];
  const shouldShowMaterialFilter = !categoryName || !categoriesWithoutMaterial.includes(categoryName.toLowerCase());
  const [showCustomRange, setShowCustomRange] = useState(false);

  const handleCustomRangeChange = () => {
    // When custom range is used, clear preset price range
    if (customMinPrice || customMaxPrice) {
      setSelectedPriceRange(null);
    }
  };

  const handleReset = () => {
    setShowCustomRange(false);
    resetFilters();
  };

  return (
    <div className="space-y-6">
      {/* Reset Button */}
      {activeFilterCount > 0 && (
        <div className="pb-4 border-b border-gray-200">
          <button 
            onClick={handleReset}
            className="text-sm text-amber-700 hover:text-amber-800 font-medium transition-colors w-full text-center py-2 border border-amber-700 rounded-md"
          >
            Reset
          </button>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="pt-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex justify-between items-center w-full mb-3 group"
        >
          <h4 className="text-sm font-bold text-gray-900 group-hover:text-amber-700 transition-colors">PRICE</h4>
          {openSections.price ? <FaChevronUp className="text-gray-500 w-3 h-3" /> : <FaChevronDown className="text-gray-500 w-3 h-3" />}
        </button>
        
        {openSections.price && (
          <div className="space-y-2">
            {priceRanges.map(range => (
              <div key={range.id} className="flex items-center">
                <input
                  type="radio"
                  id={`price-${range.id}`}
                  name="priceRange"
                  checked={selectedPriceRange === range.id}
                  onChange={() => {
                    setSelectedPriceRange(range.id);
                    setCustomMinPrice('');
                    setCustomMaxPrice('');
                    setShowCustomRange(false);
                  }}
                  className="h-4 w-4 text-red-800 focus:ring-red-700 border-gray-300 cursor-pointer checked:bg-red-800"
                  style={{ accentColor: '#7A2A2A' }}
                />
                <label htmlFor={`price-${range.id}`} className="ml-3 text-sm text-gray-700 cursor-pointer">
                  {range.label}
                </label>
              </div>
            ))}
            
            {/* Custom Range Option */}
            <div className="pt-2 border-t border-gray-200 mt-2">
              <div className="flex items-center mb-3">
                <input
                  type="radio"
                  id="custom-range"
                  name="priceRange"
                  checked={showCustomRange || (customMinPrice || customMaxPrice)}
                  onChange={() => {
                    setShowCustomRange(true);
                    setSelectedPriceRange(null);
                  }}
                  className="h-4 w-4 text-red-800 focus:ring-red-700 border-gray-300 cursor-pointer checked:bg-red-800"
                  style={{ accentColor: '#7A2A2A' }}
                />
                <label htmlFor="custom-range" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                  Custom Range
                </label>
              </div>
              
              {(showCustomRange || customMinPrice || customMaxPrice) && (
                <div className="ml-7 space-y-3">
                  <div>
                    <label htmlFor="custom-min" className="block text-xs text-gray-600 mb-1">Min</label>
                    <input
                      type="number"
                      id="custom-min"
                      value={customMinPrice}
                      onChange={(e) => {
                        setCustomMinPrice(e.target.value);
                        handleCustomRangeChange();
                        if (!e.target.value && !customMaxPrice) {
                          setShowCustomRange(false);
                        }
                      }}
                      placeholder="Min price"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-red-700 focus:border-red-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="custom-max" className="block text-xs text-gray-600 mb-1">Max</label>
                    <input
                      type="number"
                      id="custom-max"
                      value={customMaxPrice}
                      onChange={(e) => {
                        setCustomMaxPrice(e.target.value);
                        handleCustomRangeChange();
                        if (!e.target.value && !customMinPrice) {
                          setShowCustomRange(false);
                        }
                      }}
                      placeholder="Max price"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-red-700 focus:border-red-700"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Material Filter - Hidden for shoes, sneakers, accessories, and perfumes */}
      {shouldShowMaterialFilter && (
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => toggleSection('material')}
          className="flex justify-between items-center w-full mb-3 group"
        >
          <h4 className="text-sm font-bold text-gray-900 group-hover:text-amber-700 transition-colors">FABRIC/MATERIAL</h4>
          {openSections.material ? <FaChevronUp className="text-gray-500 w-3 h-3" /> : <FaChevronDown className="text-gray-500 w-3 h-3" />}
        </button>
        
        {openSections.material && (
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide border border-gray-100 p-3 rounded-md">
            {availableFabrics && availableFabrics.length > 0 ? (
              availableFabrics.map(material => {
                // Normalize material name for display
                const displayName = material;
                return (
                  <div key={material} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`material-${material}`}
                      checked={selectedFabrics.includes(material)}
                      onChange={() => toggleFabric(material)}
                      className="h-4 w-4 text-red-800 focus:ring-red-700 border-gray-300 rounded cursor-pointer"
                      style={{ accentColor: '#7A2A2A' }}
                    />
                    <label htmlFor={`material-${material}`} className="ml-3 text-sm text-gray-700 cursor-pointer">
                      {displayName}
                    </label>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">No fabric options available</p>
            )}
          </div>
        )}
      </div>
      )}

    </div>
  );
};

export default React.memo(ProductFilters);

