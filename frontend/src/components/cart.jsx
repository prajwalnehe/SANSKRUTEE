import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

function Cart() {
  const navigate = useNavigate();
  const { 
    cart = [], 
    updateQuantity, 
    removeFromCart, 
    cartTotal = 0, 
    cartCount = 0,
    clearCart 
  } = useCart();

  console.log('Cart component rendered with:', { cart, cartTotal, cartCount }); // Debug log

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <button 
        onClick={() => navigate('/collections')}
        className="flex items-center text-[#3E5F7A] hover:text-[#2D4860] mb-6 transition-colors cursor-pointer border border-[#3E5F7A] rounded-md px-4 py-2 hover:bg-[#3E5F7A] hover:text-white"
      >
        <FaArrowLeft className="mr-2" /> Continue Shopping
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <FaShoppingCart className="mx-auto text-5xl text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <button 
            onClick={() => navigate('/collections')}
            className="bg-[#3E5F7A] text-white px-6 py-2 rounded-md hover:bg-[#2D4860] transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 flex items-start border border-gray-100">
                <div className="w-24 h-24 flex items-center justify-center overflow-hidden rounded-md cursor-pointer">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="min-w-full min-h-full object-contain"
                    onClick={() => navigate(`/product/${item.id}`)}
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h3 
                    className="text-lg font-medium text-gray-800 cursor-pointer hover:text-amber-600"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">{item.material} with {item.work}</p>
                  
                  <div className="flex items-center mt-2">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button 
                        onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 cursor-pointer"
                      >
                        <FaMinus className="w-3 h-3" />
                      </button>
                      <span className="px-3 py-1 border-x border-gray-300">{item.quantity || 1}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 cursor-pointer"
                      >
                        <FaPlus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 text-red-500 hover:text-red-700 flex items-center cursor-pointer"
                    >
                      <FaTrash className="mr-1" /> Remove
                    </button>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-semibold">₹{(item.price * (item.quantity || 1)).toLocaleString()}</p>
                  {item.originalPrice > item.price && (
                    <p className="text-sm text-gray-500 line-through">₹{item.originalPrice.toLocaleString()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="lg:sticky lg:top-4 h-fit">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={cartTotal >= 1000 ? "text-green-600" : "text-gray-600"}>
                    {cartTotal >= 1000 ? 'Free' : '₹99'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span>₹{Math.round(cartTotal * 0.05).toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{(cartTotal + (cartTotal >= 1000 ? 0 : 99) + Math.round(cartTotal * 0.05)).toLocaleString()}</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/checkout/address')}
                className="w-full bg-[#3E5F7A] text-white py-3 px-4 rounded-md hover:bg-[#2D4860] transition-colors font-medium cursor-pointer"
              >
                Proceed to Checkout
              </button>
              
              <button 
                onClick={clearCart}
                className="w-full mt-3 text-[#3E5F7A] border border-[#3E5F7A] py-2 px-4 rounded-md hover:bg-[#3E5F7A] hover:text-white transition-colors text-sm font-medium cursor-pointer"
              >
                Clear Cart
              </button>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
