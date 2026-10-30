import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import Breadcrumbs from '../components/Breadcrumbs';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckoutModal } from '../components/CheckoutModal';
import { handleImageError } from '../utils/placeholder';
import { getProductImage } from '../utils/productImages';
import {
  ShoppingCart,
  Zap,
  Bot,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Truck,
  AlertTriangle,
  Minus,
  Plus,
  MessageSquare
} from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [moqError, setMoqError] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const { addToCart, buyNow } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${id}`);
        if (res.data.success) {
          const prodData = res.data.product || res.data.data;
          setProduct(prodData);
          setQuantity(prodData.MOQ || 1);
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (newVal) => {
    const val = parseInt(newVal) || 0;
    setQuantity(val);

    if (product && val < product.MOQ) {
      setMoqError(`Quantity must be equal to or greater than Minimum Order Quantity (MOQ: ${product.MOQ} units).`);
    } else {
      setMoqError('');
    }
  };

  const { user } = useContext(AuthContext);

  const handleAddToCart = () => {
    if (!product) return;
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(`/products/${product._id}`));
      return;
    }
    if (quantity < product.MOQ) {
      setMoqError(`Minimum Order Quantity required is ${product.MOQ} units.`);
      return;
    }
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(`/products/${product._id}`));
      return;
    }
    if (quantity < product.MOQ) {
      setMoqError(`Minimum Order Quantity required is ${product.MOQ} units.`);
      return;
    }
    buyNow(product, quantity);
  };

  if (loading) return <LoadingSpinner message="Loading auto-rickshaw part details..." />;

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
        <p className="text-slate-400 text-sm">The auto rickshaw spare part may have been removed or renamed.</p>
        <Link to="/products" className="inline-block bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isAvailable = product.availability && product.stock > 0;
  const estimatedTotal = quantity * product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Auto Parts Catalog', path: '/products' },
          { label: product.name, path: `/products/${product._id}` }
        ]}
      />

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left: Image Container (Studio 1:1 Presentation) */}
        <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F3F5F7] p-8 sm:p-12 flex items-center justify-center shadow-inner">
            <img
              src={getProductImage(product)}
              alt={product.imageMetadata?.altText || product.name}
              onError={handleImageError}
              className="w-full h-full object-contain transition-transform duration-500 hover:scale-105 select-none drop-shadow-sm"
            />
          </div>

          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Genuine OEM Auto Parts</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Express Transport Ready</span>
            </div>
          </div>
        </div>

        {/* Right: Product Details & Purchase Controls */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-slate-800 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-md">
                {product.category?.name || 'Auto Rickshaw Spare'}
              </span>
              {isAvailable ? (
                <span className="bg-emerald-950 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({product.stock} units)
                </span>
              ) : (
                <span className="bg-rose-950 text-rose-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-rose-800 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Out of Stock
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-slate-400">Brand: <strong className="text-slate-200">{product.brand || 'Roshani Auto Parts'}</strong></p>
          </div>

          {/* Price Box */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs font-medium text-slate-400">Wholesale Unit Price</span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">₹{product.price.toLocaleString()}</span>
              <span className="text-xs text-slate-400">/ Piece</span>
            </div>
            <p className="text-[11px] text-amber-400 pt-1">
              • Minimum Order Quantity (MOQ): <strong>{product.MOQ} units</strong>
            </p>
          </div>

          {/* Compatible Vehicle Models */}
          {product.compatibleModels && product.compatibleModels.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Three-Wheeler Compatibility</label>
              <div className="flex flex-wrap gap-2">
                {product.compatibleModels.map((m, idx) => (
                  <span key={idx} className="bg-slate-900 text-amber-300 text-xs font-semibold px-3 py-1 rounded-lg border border-slate-800">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</label>
            <p className="text-slate-300 text-xs leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              {product.description}
            </p>
          </div>

          {/* Quantity Selector & Purchase Box */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-white block">Order Quantity</label>
                <span className="text-[11px] text-slate-400">Must be &gt;= MOQ ({product.MOQ})</span>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(Math.max(quantity - 1, 1))}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="w-16 bg-transparent text-center font-extrabold text-white text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Validation Message Banner */}
            {moqError && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-200 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{moqError}</span>
              </div>
            )}

            {/* Estimated Total Calculation */}
            <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800">
              <span className="text-slate-400">Total Subtotal Amount:</span>
              <span className="text-xl font-mono font-extrabold text-emerald-400">₹{estimatedTotal.toLocaleString()}</span>
            </div>

            {/* CTA Buttons: Add to Cart, Buy Now, WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!isAvailable || !!moqError}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700 disabled:opacity-50 transition-all"
              >
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!isAvailable || !!moqError}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold py-3.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Buy Now</span>
              </button>

              <a
                href={`https://wa.me/918879003738?text=Hello%20Roshani%20Traders%2C%20I%20want%20to%20buy%20${encodeURIComponent(product.name)}%20(Qty%3A%20${quantity}%20units).`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all text-center"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Technical Specifications Table */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Technical Specifications</h3>
              <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 text-xs">
                {Object.entries(product.specifications).map(([key, val], idx) => (
                  <div
                    key={key}
                    className={`flex items-center justify-between p-3.5 ${
                      idx % 2 === 0 ? 'bg-slate-900' : 'bg-slate-950/60'
                    }`}
                  >
                    <span className="text-slate-400 font-medium">{key}</span>
                    <span className="text-white font-bold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
}
