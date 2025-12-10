import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaRupeeSign, FaSpinner, FaFilter, FaTimes, FaChevronDown, FaChevronUp, FaHeart } from 'react-icons/fa';
// import { IoEyeOutline } from 'react-icons/io5'; // IoEyeOutline is imported but not used, can be removed if not needed later

// --- IMPORTANT: This line is now the intended data source. Ensure 'fetchSarees' is available. ---
import { fetchSarees } from '../services/api'; 
// If '../services/api' does not exist, the component will fail to load data.

// Add CSS to hide scrollbar (Good for Tailwind UI)
const styles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// NOTE: staticCategories and CategoryFilterList have been removed as requested.

// Wishlist helper functions
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

const ProductList = ({ defaultCategory } = {}) => {
    const { categoryName, subCategoryName } = useParams();
    const navigate = useNavigate();
    
    // --- State Initialization ---
    const [products, setProducts] = useState([]); // Raw fetched products
    const [filteredProducts, setFilteredProducts] = useState([]); // Products after filtering/sorting
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [sortOption, setSortOption] = useState('featured');
    const [wishlist, setWishlist] = useState([]); // Wishlist products 
    
    // Filter states
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [selectedFabrics, setSelectedFabrics] = useState([]);
    
    // Accordion states for desktop filters
    const [openSections, setOpenSections] = useState({
      price: true,
      material: true
    });
    
    // --- Constants ---
    const allPossibleFabrics = ['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Linen', 'Satin', 'Velvet', 'Organza', 'Banarasi', 'Kanjivaram', 'Tussar', 'Maheshwari', 'Chanderi', 'Zari', 'Zardosi', 'Kalamkari', 'Bandhani', 'Patola', 'Paithani']; 
    
    // Derive available fabrics from fetched products
    const availableFabrics = React.useMemo(() => {
        const fabricSet = new Set();
        products.forEach(product => {
            const possibleFabricFields = [product.fabric, product.material, product.product_info?.fabric, product.product_info?.material, product.details?.fabric, product.details?.material, product.description, product.title];
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
        
        // Fallback or initialization fabrics if the API returns no specific fabric fields
        if (fabricSet.size === 0) {
            return ['Silk', 'Cotton', 'Georgette']; 
        }
        return Array.from(fabricSet).sort();
    }, [products]);
    
    // --- UPDATED PRICE RANGES ---
    const priceRanges = [
      { id: 1, label: '₹300 - ₹1,000', min: 300, max: 1000 },
      { id: 2, label: '₹1,001 - ₹2,000', min: 1001, max: 2000 },
      { id: 3, label: '₹2,001 - ₹3,000', min: 2001, max: 3000 },
      { id: 4, label: '₹3,001 - ₹4,000', min: 3001, max: 4000 },
      { id: 5, label: '₹4,001 - ₹5,000', min: 4001, max: 5000 },
      { id: 6, label: '₹5,001 - ₹6,000', min: 5001, max: 6000 },
      { id: 7, label: '₹6,001 - ₹7,000', min: 6001, max: 7000 },
      { id: 8, label: '₹7,001 - ₹8,000', min: 7001, max: 8000 },
      { id: 9, label: '₹8,001 - ₹10,000', min: 8001, max: 10000 },
      { id: 10, label: 'Above ₹10,000', min: 10001, max: Infinity },
    ];
    // ----------------------------
    
    // --- Utility Functions ---
    const normalize = (s) => {
        if (!s) return '';
        const t = s.replace(/-/g, ' ').toLowerCase();
        return t.replace(/\b\w/g, (c) => c.toUpperCase());
    };

    // Category display name mapping to match navbar
    const getCategoryDisplayName = (category) => {
        const categoryMap = {
            'accessories': 'PERFUMES',
            't-shirts': 'Tshirts',
            't shirts': 'Tshirts',
            'tshirts': 'Tshirts',
            'shirts': 'Shirts',
            'pants': 'Pants',
            'shoes': 'Shoes',
        };
        const normalized = category ? category.toLowerCase() : '';
        return categoryMap[normalized] || normalize(category || '');
    };

    // Get raw category from URL (backend will handle normalization)
    const rawCategory = subCategoryName || categoryName || defaultCategory || '';
    
    // For display purposes, normalize the category
    const effectiveCategory = normalize(rawCategory);
    const displayCategoryName = getCategoryDisplayName(rawCategory);
        
    // --- Load Wishlist ---
    useEffect(() => {
        const loadWishlist = () => {
            setWishlist(readWishlist());
        };
        
        loadWishlist();
        
        // Listen for wishlist updates
        const handleWishlistUpdate = () => {
            loadWishlist();
        };
        
        window.addEventListener('wishlist:updated', handleWishlistUpdate);
        window.addEventListener('storage', (e) => {
            if (e.key === 'wishlist') {
                loadWishlist();
            }
        });
        
        return () => {
            window.removeEventListener('wishlist:updated', handleWishlistUpdate);
        };
    }, []);

    // --- Data Fetching ---
    useEffect(() => {
        const load = async () => {
            if (!fetchSarees) {
                setError("Error: fetchSarees function is not defined. Please check your '../services/api' import.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                // Send raw category to backend (backend will handle normalization and mapping)
                const data = await fetchSarees(rawCategory || '');
                setProducts(data || []);
            } catch (err) {
                console.error('Failed to load products:', err);
                setError('Failed to load products. Please try again later.');
                setProducts([]); // Clear products on error
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [categoryName, subCategoryName, defaultCategory, effectiveCategory]);

    // --- Filter Application & Sorting ---
    useEffect(() => {
        let result = [...products];
        
        // 1. Filter by price range
        if (selectedPriceRange) {
            const range = priceRanges.find(r => r.id === selectedPriceRange);
            if (range) {
                result = result.filter(p => {
                    // Use a fallback price calculation if price field is missing
                    const price = p.price || (p.mrp * (1 - (p.discountPercent || 0) / 100)) || p.mrp || 0;
                    return price >= range.min && price <= range.max;
                });
            }
        }
        
        // 2. Filter by fabric
        if (selectedFabrics.length > 0) {
            result = result.filter(p => {
                const possibleFabricFields = [p.fabric, p.material, p.product_info?.fabric, p.product_info?.material, p.details?.fabric, p.details?.material, p.description, p.title];
                const fabricSearchString = possibleFabricFields.filter(Boolean).map(String).join(' ').toLowerCase();
                return selectedFabrics.some(fabric => 
                    fabricSearchString.includes(fabric.toLowerCase())
                );
            });
        }

        // 3. Apply Sorting
        const sorted = [...result];
        switch(sortOption) {
            case 'price-low-high':
                sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case 'price-high-low':
                sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case 'newest':
                sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                break;
            case 'featured':
            default:
                // Default order (usually API or database default)
                break;
        }
        
        setFilteredProducts(sorted);
    }, [products, selectedPriceRange, selectedFabrics, sortOption]); 
    
    // --- Filter Handlers ---
    const toggleFabric = useCallback((fabric) => {
        setSelectedFabrics(prev => 
            prev.includes(fabric)
              ? prev.filter(f => f !== fabric)
              : [...prev, fabric]
        );
    }, []);
    
    const resetFilters = useCallback(() => {
        setSelectedPriceRange(null);
        setSelectedFabrics([]);
    }, []);

    const toggleSection = useCallback((section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [categoryName, subCategoryName]);

    const handleCardClick = useCallback((product) => {
        navigate(`/product/${product._id}`);
    }, [navigate]);

    // Check if product is in wishlist
    const isWishlisted = useCallback((productId) => {
        return wishlist.some(item => (item._id || item.id) === productId);
    }, [wishlist]);

    // Toggle wishlist for a product
    const toggleWishlist = useCallback((product, e) => {
        if (e) {
            e.stopPropagation();
        }
        
        const pid = product._id;
        if (!pid) return;
        
        const list = readWishlist();
        const exists = list.some(p => (p._id || p.id) === pid);
        
        let finalPrice = product.price || (product.mrp * (1 - (product.discountPercent || 0) / 100)) || product.mrp || 0;
        
        if (exists) {
            // Remove from wishlist
            const next = list.filter(p => (p._id || p.id) !== pid);
            writeWishlist(next);
            setWishlist(next);
        } else {
            // Add to wishlist
            const item = {
                _id: pid,
                title: product.title,
                images: product.images,
                price: finalPrice,
                mrp: product.mrp,
                discountPercent: product.discountPercent || 0,
            };
            const next = [item, ...list.filter(p => (p._id || p.id) !== pid)];
            writeWishlist(next);
            setWishlist(next);
        }
        
        // Dispatch event for other components
        try { 
            window.dispatchEvent(new Event('wishlist:updated')); 
        } catch {}
    }, []);

    // Helper function to get category/type label for overlay
    const getCategoryLabel = (product) => {
        const info = product.product_info || {};
        const category = (product.category || '').toLowerCase();
        
        // Check for material-based labels
        if (info.tshirtMaterial || info.pantMaterial || info.shoeMaterial) {
            const material = info.tshirtMaterial || info.pantMaterial || info.shoeMaterial;
            if (material && material.toUpperCase().includes('LINEN')) {
                return 'LINEN BLEND';
            }
            if (material && material.toUpperCase().includes('COTTON')) {
                return 'COTTON BLEND';
            }
        }
        
        // Check for product type labels
        if (category.includes('utility') || info.pantType?.toLowerCase().includes('utility')) {
            return 'UTILITY POCKET';
        }
        if (category.includes('holiday') || product.title?.toLowerCase().includes('holiday')) {
            return 'HOLIDAY';
        }
        if (category.includes('oversized') || info.tshirtFit?.toLowerCase().includes('oversized')) {
            return 'OVERSIZED FIT';
        }
        
        // Fallback to category or manufacturer
        if (info.manufacturer) {
            return info.manufacturer.toUpperCase();
        }
        
        return null;
    };

    // Helper function to format product title for display
    const formatProductTitle = (product) => {
        const info = product.product_info || {};
        const title = product.title || '';
        
        // Try to extract color/material from title
        // Format like "Cotton Linen: Sky Blue"
        if (info.tshirtColor || info.pantColor || info.shoeColor) {
            const color = info.tshirtColor || info.pantColor || info.shoeColor;
            const material = info.tshirtMaterial || info.pantMaterial || info.shoeMaterial || 'Cotton';
            return `${material}: ${color}`;
        }
        
        return title;
    };

    // Helper function to get category display name
    const getCategoryDisplay = (product) => {
        const category = product.category || '';
        const info = product.product_info || {};
        
        // Map categories to display names
        if (category.toLowerCase().includes('tshirt') || category.toLowerCase().includes('t-shirt')) {
            return info.tshirtMaterial ? `${info.tshirtMaterial} Shirts` : 'T-Shirts';
        }
        if (category.toLowerCase().includes('shirt')) {
            return info.tshirtMaterial ? `${info.tshirtMaterial} Shirts` : 'Shirts';
        }
        if (category.toLowerCase().includes('pant')) {
            return info.pantType ? `Men ${info.pantType} Pants` : 'Pants';
        }
        if (category.toLowerCase().includes('holiday')) {
            return 'Holiday Shirts';
        }
        
        return category || 'Products';
    };

    const activeFilterCount = [
        selectedFabrics.length,
        selectedPriceRange ? 1 : 0
    ].reduce((a, b) => a + b, 0);

    // --- Filter Content Component (for Price and Material, below Categories) ---
    const FilterContent = React.memo(() => (
        <div className="space-y-6">
            
            {/* Price Range Filter */}
            <div className="pt-4"> {/* Removed border-t for first element since Categories is gone */}
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
                                    onChange={() => setSelectedPriceRange(range.id)}
                                    className="h-4 w-4 text-red-800 focus:ring-red-700 border-gray-300 cursor-pointer checked:bg-red-800"
                                    style={{ accentColor: '#7A2A2A' }}
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
                            availableFabrics.map(material => (
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

            {/* Clear All Button */}
            {activeFilterCount > 0 && (
                <div className="pt-4 border-t border-gray-200">
                    <button 
                        onClick={resetFilters}
                        className="text-sm text-amber-700 hover:text-amber-800 font-medium transition-colors w-full text-center py-2 border border-amber-700 rounded-md"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    ));

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-500 text-xl font-semibold">❌ {error}</p>
          <p className="text-gray-600 mt-2">Check the console for details, and ensure `fetchSarees` is correctly implemented.</p>
        </div>
      );
    }

    // --- Main Render Block ---
    return (
        <div className="min-h-screen bg-white">
            <style>{styles}</style>
            
            {/* Loading Bar */}
            {loading && (
                <div className="fixed left-0 right-0 top-0 z-50">
                    <div className="h-0.5 bg-gradient-to-r from-[#7A2A2A] via-[#A56E2C] to-[#C89D4B] animate-pulse"></div>
                </div>
            )}

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
                
                {/* --- TOP HEADER BAR --- */}
                <div className="mb-6">
                    {/* Breadcrumb & Sort */}
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-500">
                            Home / {displayCategoryName || 'Products'}
                        </p>
                        <div className="flex items-center">
                            <label htmlFor="sort" className="text-sm font-medium text-gray-600 whitespace-nowrap hidden sm:block">
                                Select Sorting Options
                            </label>
                            <select 
                                id="sort" 
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="text-sm border-gray-300 rounded-md focus:ring-amber-700 focus:border-amber-700 shadow-sm ml-2 py-1.5"
                            >
                                <option value="featured">Featured</option>
                                <option value="newest">Newest Arrivals</option>
                                <option value="price-low-high">Price: Low to High</option>
                                <option value="price-high-low">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Category Title & Count */}
                    <div className="border-b border-gray-200 pb-2">
                        <h1 className="text-xl font-semibold text-gray-900 inline-block mr-2">
                            {displayCategoryName || 'All Products'}
                        </h1>
                        <span className="text-gray-500 text-base">
                            - {products.length} Items
                        </span>
                    </div>
                </div>

                <div className="flex gap-8 relative">
                    {/* --- DESKTOP SIDEBAR FILTERS (Now starting with Price filter) --- */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-6 bg-white border border-gray-200 p-6 h-[calc(100vh-60px)] overflow-y-auto scrollbar-hide z-10 transition-shadow">
                            
                            <FilterContent /> 
                        </div>
                    </aside>

                    {/* --- MAIN CONTENT GRID --- */}
                    <div className="flex-1 min-w-0">
                        
                        {/* Mobile Filter Button & Active Filters */}
                        <div className="lg:hidden mb-6 space-y-4">
                            <button 
                                onClick={() => setShowMobileFilters(true)}
                                className="flex items-center justify-between gap-2 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50 shadow-sm transition-colors"
                            >
                                <span className="font-medium flex items-center gap-2"><FaFilter className="text-amber-700" /> Filters</span>
                                {activeFilterCount > 0 && (
                                    <span className="ml-2 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                                        {activeFilterCount} Active
                                    </span>
                                )}
                            </button>
                            {/* Active Filters Pills */}
                            {activeFilterCount > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {selectedPriceRange && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                            {priceRanges.find(r => r.id === selectedPriceRange)?.label}
                                            <button onClick={() => setSelectedPriceRange(null)} className="ml-2 hover:text-amber-900"><FaTimes className="w-3 h-3" /></button>
                                        </span>
                                    )}
                                    {selectedFabrics.map(fabric => (
                                        <span key={fabric} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            {fabric}
                                            <button onClick={() => toggleFabric(fabric)} className="ml-2 hover:text-red-900"><FaTimes className="w-3 h-3" /></button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Product Grid */}
                        {loading ? (
                            <div className="flex justify-center items-center py-20 text-gray-600">
                                <FaSpinner className="w-6 h-6 animate-spin mr-3 text-amber-700" />
                                <span className="text-lg">Loading products...</span>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl shadow-lg border border-gray-200">
                                <p className="text-gray-500 text-xl font-serif italic mb-4">No treasures found matching your selections.</p>
                                <button
                                    onClick={resetFilters}
                                    className="mt-4 text-amber-700 hover:text-amber-800 font-medium text-base transition-colors underline underline-offset-4"
                                >
                                    Clear all filters to see more
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {filteredProducts.map((p) => {
                                    const productTitle = formatProductTitle(p);
                                    const categoryDisplay = getCategoryDisplay(p);
                                    const finalPrice = Math.round(p.price || (p.mrp * (1 - (p.discountPercent || 0) / 100)) || p.mrp || 0);
                                    const wishlisted = isWishlisted(p._id);
                                    
                                    return (
                                        <div
                                            key={p._id || p.title}
                                            className="group bg-white overflow-hidden transition-all duration-300 cursor-pointer"
                                            onClick={() => handleCardClick(p)}
                                        >
                                            <div className="relative w-full aspect-[3/4] bg-gray-50 overflow-hidden">
                                                <img
                                                    src={p.images?.image1 || 'https://via.placeholder.com/300x400?text=Image+Not+Available'}
                                                    alt={p.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    onError={(e) => {e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x400?text=Image+Not+Available';}}
                                                />
                                                
                                                {/* Heart Icon - Top Right (Always Visible) */}
                                                <button 
                                                    onClick={(e) => toggleWishlist(p, e)} 
                                                    className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1 sm:p-1.5 md:p-2 bg-white/95 hover:bg-white rounded-full transition-all duration-200 z-10 shadow-sm"
                                                >
                                                    <FaHeart 
                                                        className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-colors ${
                                                            wishlisted 
                                                                ? 'text-pink-500' 
                                                                : 'text-gray-700 hover:text-pink-500'
                                                        }`} 
                                                    />
                                                </button>

                                                {/* Discount Badge - Bottom Left (if applicable) */}
                                                {p.discountPercent > 0 && (
                                                    <span className="absolute bottom-3 left-3 bg-green-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                                                        {p.discountPercent}% OFF
                                                    </span>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="relative pt-3 pb-2 px-1">
                                                {/* Product Title */}
                                                <p className="text-sm font-normal text-gray-900 line-clamp-1 mb-1.5">
                                                    {productTitle || p.title || 'Untitled Product'}
                                                </p>
                                                
                                                {/* Category Label */}
                                                <p className="text-xs font-normal text-gray-600 mb-2.5">
                                                    {categoryDisplay}
                                                </p>
                                            
                                                {/* Price */}
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-base font-medium text-gray-900">
                                                        ₹ {finalPrice.toLocaleString()}
                                                    </span>
                                                    {p.mrp && p.mrp > finalPrice && (
                                                        <span className="text-xs text-gray-400 line-through">
                                                            ₹{p.mrp.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Modal */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black bg-opacity-60" onClick={() => setShowMobileFilters(false)}></div>
                    <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-out">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                            <h3 className="text-xl font-serif italic text-gray-900">Filters</h3>
                            <button 
                                onClick={() => setShowMobileFilters(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            {/* CategoryFilterList removed here */}
                            <div className="mt-0"> {/* Adjusted margin since categories is removed */}
                                <FilterContent />
                            </div>
                        </div>
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 shadow-2xl">
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="w-full px-6 py-3 bg-gradient-to-r from-[#7A2A2A] to-[#C89D4B] text-white font-medium rounded-lg text-lg hover:opacity-90 transition-opacity shadow-lg"
                            >
                                Show {filteredProducts.length} Products
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;