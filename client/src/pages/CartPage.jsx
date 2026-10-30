import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { CheckoutModal } from '../components/CheckoutModal';
import { getProductImage } from '../utils/productImages';
import { handleImageError } from '../utils/placeholder';

export const CartPage = () => {
  const {
    cartItems,
    cartTotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    isCheckoutOpen,
    setIsCheckoutOpen
  } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md bg-slate-900/80 p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="w-20 h-20 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h2>
          <p className="text-slate-400 text-sm mb-6">
            Explore our genuine Three-Wheeler Auto Rickshaw spare parts catalog and add Bajaj RE, TVS King, or Piaggio Ape items to your order.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-amber-500/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Auto Parts</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <span>Roshani Traders</span>
              <span>•</span>
              <span>Wholesale Cart</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white flex items-center">
              Auto Rickshaw Spare Parts Cart
              <span className="ml-3 text-sm bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full">
                {cartCount} Items
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={clearCart}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition border border-rose-500/20"
            >
              Clear Cart
            </button>
            <Link
              to="/products"
              className="text-xs text-slate-300 hover:text-white font-medium px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition border border-slate-700 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Item List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const itemSubtotal = item.quantity * item.product.price;
              const compatible = item.product.compatibleModels || [];

              return (
                <div
                  key={item.product._id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition shadow-lg"
                >
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <div className="w-20 h-20 rounded-xl bg-[#F3F5F7] p-2 flex items-center justify-center shrink-0 border border-slate-700 shadow-sm overflow-hidden">
                      <img
                        src={getProductImage(item.product)}
                        alt={item.product.imageMetadata?.altText || item.product.name}
                        onError={handleImageError}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                        {item.product.brand || 'Auto Rickshaw Spare'}
                      </span>
                      <h3 className="font-bold text-white text-base mt-1 line-clamp-1">
                        {item.product.name}
                      </h3>
                      
                      {compatible.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {compatible.slice(0, 2).map((m, idx) => (
                            <span key={idx} className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                              {m}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="text-xs text-slate-400 mt-1">
                        Wholesale Rate: <span className="text-white font-mono font-medium">₹{item.product.price}</span> / unit (MOQ: {item.moq})
                      </div>
                    </div>
                  </div>

                  {/* Quantity controls & Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                    <div className="flex items-center border border-slate-700 bg-slate-800/80 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-mono font-bold text-white text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-400">Subtotal</div>
                      <div className="text-lg font-extrabold text-emerald-400 font-mono">
                        ₹{itemSubtotal.toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-slate-500 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Wholesale Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({cartCount} units)</span>
                  <span className="font-mono text-white">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GST / Tax</span>
                  <span className="text-emerald-400 text-xs font-semibold">Included</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Transport Freight</span>
                  <span className="text-amber-400 text-xs font-semibold">Calculated at Dispatch</span>
                </div>

                <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-lg font-bold">
                  <span className="text-white">Total Amount:</span>
                  <span className="text-emerald-400 text-2xl font-mono">₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full mt-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold py-3.5 px-6 rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Express Transport Dispatch across India</span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Genuine Auto Rickshaw OEM Fitment</span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>24-48 Hours Order Packing Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
};
