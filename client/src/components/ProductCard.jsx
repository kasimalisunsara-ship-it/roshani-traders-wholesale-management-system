import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';
import { ShoppingCart, Zap, CheckCircle, XCircle, Tag } from 'lucide-react';
import { handleImageError } from '../utils/placeholder';
import { getProductImage } from '../utils/productImages';

export default function ProductCard({ product }) {
  if (!product) return null;

  const { addToCart } = useContext(CartContext);
  const toastContext = useContext(ToastContext);
  const showSuccess = toastContext?.showSuccess;
  const navigate = useNavigate();

  const isAvailable = Boolean(product?.availability && product?.status === 'active' && (product?.stock ?? 0) > 0);
  const priceDisplay = (product?.price && product.price > 0) ? `₹${product.price.toLocaleString()}` : (product?.priceText || 'Wholesale pricing');
  const moqDisplay = (product?.MOQ && product.MOQ > 0) ? `${product.MOQ} Pcs` : '10 Pcs';

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (addToCart) addToCart(product, product?.MOQ || 1);
    if (showSuccess) showSuccess(`Added ${product?.name || 'Item'} to cart!`);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    if (addToCart) addToCart(product, product?.MOQ || 1);
    if (navigate) navigate('/cart');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden flex flex-col group h-full transition-all duration-300 shadow-xl">
      
      {/* Product Image Container (1:1 Studio Presentation) */}
      <Link
        to={`/products/${product._id}`}
        className="relative aspect-square w-full bg-[#F3F5F7] p-5 sm:p-6 overflow-hidden flex items-center justify-center rounded-t-2xl shadow-inner group/img"
      >
        <img
          src={getProductImage(product)}
          alt={product.imageMetadata?.altText || product.name}
          onError={handleImageError}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-sm select-none"
          loading="lazy"
        />
      </Link>

      {/* Card Body (All product information strictly outside the image) */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category & Availability Status */}
          <div className="text-xs font-medium text-slate-400 mb-2 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1 text-amber-400 font-semibold truncate">
              <Tag className="w-3 h-3 shrink-0" />
              {product.category?.name || product.categoryName || 'Three Wheeler Parts'}
            </span>
            {isAvailable ? (
              <span className="bg-emerald-950/80 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 shrink-0">
                <CheckCircle className="w-3 h-3 text-emerald-400" /> In Stock ({product.stock})
              </span>
            ) : (
              <span className="bg-rose-950/80 text-rose-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-rose-500/30 flex items-center gap-1 shrink-0">
                <XCircle className="w-3 h-3 text-rose-400" /> Unavailable
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link
            to={`/products/${product._id}`}
            className="font-extrabold text-base text-white group-hover:text-amber-400 transition-colors line-clamp-2"
          >
            {product.name}
          </Link>

          {/* Brand & MOQ Badges */}
          <div className="mt-2.5 flex items-center gap-2 flex-wrap text-[11px]">
            <span className="bg-slate-800 text-slate-300 font-medium px-2 py-0.5 rounded-md border border-slate-700">
              {product.brand || 'Roshani Auto Parts'}
            </span>
            <span className="bg-amber-500/15 text-amber-400 font-bold px-2 py-0.5 rounded-md border border-amber-500/30">
              MOQ: {moqDisplay}
            </span>
          </div>

          {/* Compatible Auto Rickshaws */}
          {product.compatibleModels && product.compatibleModels.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {product.compatibleModels.slice(0, 3).map((m, idx) => (
                <span key={idx} className="text-[10px] bg-slate-800/80 text-slate-400 px-2 py-0.5 rounded-md border border-slate-700/60 font-medium">
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-400">Wholesale Price</span>
            <div className="text-right">
              <span className="text-lg font-black text-emerald-400 font-mono">{priceDisplay}</span>
              {product.price > 0 && <span className="text-[10px] text-slate-400 block">/ piece</span>}
            </div>
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className={`flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 px-2.5 rounded-xl border transition-all ${
                isAvailable
                  ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed border-slate-800'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!isAvailable}
              className={`flex items-center justify-center gap-1.5 text-xs font-extrabold py-2.5 px-2.5 rounded-xl transition-all ${
                isAvailable
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
