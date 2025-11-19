import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaRupeeSign } from 'react-icons/fa';

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

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setItems(readWishlist());
  }, []);

  const removeItem = (id) => {
    const next = items.filter((p) => p._id !== id);
    setItems(next);
    writeWishlist(next);
    try { window.dispatchEvent(new Event('wishlist:updated')); } catch {}
  };

  if (!items.length) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Wishlist is Empty</h2>
        <p className="text-gray-600 mb-4">Tap the heart on any product to save it here.</p>
        <button
          className="px-4 py-2 bg-black text-white rounded-lg shadow hover:bg-gray-800"
          onClick={() => navigate('/collections')}
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">My Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((p) => (
          <div key={p._id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div
              className="relative w-full pt-[125%] bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/product/${p._id}`)}
            >
              <img
                src={p.images?.image1 || 'https://via.placeholder.com/600x800?text=Image+Not+Available'}
                alt={p.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://via.placeholder.com/600x800?text=Image+Not+Available';
                }}
              />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[2.5rem]">{p.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center text-gray-900">
                  <FaRupeeSign className="w-3.5 h-3.5" />
                  <span className="text-base font-semibold">{p.price?.toLocaleString?.() || p.sellingPrice?.toLocaleString?.() || ''}</span>
                </div>
                {p.mrp && (
                  <span className="text-xs text-gray-400 line-through">₹{p.mrp.toLocaleString?.()}</span>
                )}
              </div>
              <div className="mt-3 flex justify-between items-center">
                <button
                  className="text-sm text-black hover:underline"
                  onClick={() => navigate(`/product/${p._id}`)}
                >
                  View Details
                </button>
                <button
                  className="text-gray-500 hover:text-red-600"
                  onClick={() => removeItem(p._id)}
                  title="Remove"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
