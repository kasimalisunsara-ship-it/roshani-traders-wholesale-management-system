import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { QuoteContext } from '../context/QuoteContext';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import API from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import EmptyState from '../components/EmptyState';
import { getProductImage } from '../utils/productImages';
import { handleImageError } from '../utils/placeholder';
import {
  FileText,
  Trash2,
  AlertTriangle,
  Send,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Plus,
  Minus,
  CheckCircle2,
  Bot
} from 'lucide-react';

export default function QuotePage() {
  const { quoteItems, updateQuantity, removeFromQuote, clearQuote, totalEstimatedAmount } = useContext(QuoteContext);
  const { user } = useContext(AuthContext);
  const { showSuccess, showError } = useContext(ToastContext);
  const navigate = useNavigate();

  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer Contact Info State
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    businessName: user?.businessName || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    address: user?.address || '',
    city: user?.city || ''
  });

  useEffect(() => {
    if (user) {
      setCustomerInfo({
        name: user.name || '',
        businessName: user.businessName || '',
        email: user.email || '',
        mobile: user.mobile || '',
        address: user.address || '',
        city: user.city || ''
      });
    }
  }, [user]);

  // Check if any product violates MOQ requirement
  const hasMoqViolation = quoteItems.some((item) => item.quantity < item.moq);

  const handleSubmitQuote = async (e) => {
    e.preventDefault();

    if (!user) {
      showError('Please login or create a wholesale account to submit a formal quotation request.');
      navigate('/login?redirect=/quote');
      return;
    }

    if (quoteItems.length === 0) {
      showError('Your quote request basket is empty.');
      return;
    }

    if (hasMoqViolation) {
      showError('Cannot submit quotation request: One or more products do not meet the required Minimum Order Quantity (MOQ).');
      return;
    }

    setIsSubmitting(true);

    try {
      const itemsPayload = quoteItems.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity
      }));

      const res = await API.post('/quotes', {
        items: itemsPayload,
        remarks
      });

      if (res.data.success) {
        showSuccess(`Quotation Request #${res.data.quote.quoteId} submitted successfully!`);
        clearQuote();
        navigate('/profile');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to submit quote request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Bulk Quote Request', path: '/quote' }]} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">B2B QUOTATION SYSTEM</span>
          <h1 className="text-3xl font-extrabold text-white">Bulk Order Quotation Builder</h1>
        </div>
        <Link
          to="/products"
          className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-400 px-4 py-2.5 rounded-xl border border-slate-700 self-start md:self-auto"
        >
          + Add More Products to Quote
        </Link>
      </div>

      {quoteItems.length === 0 ? (
        <EmptyState
          title="Your Quotation Basket is Empty"
          message="Select wholesale products from our catalogue or ask the AI Assistant to build a quote draft."
          action={
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/products" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs">
                Browse Products
              </Link>
              <Link to="/ai-assistant" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5">
                <Bot className="w-4 h-4" /> Ask AI Assistant
              </Link>
            </div>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Selected Products Table */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Global MOQ Warning Banner if any item breaks MOQ */}
            {hasMoqViolation && (
              <div className="p-4 bg-rose-950/90 border border-rose-500/50 rounded-2xl text-rose-200 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">MOQ Validation Alert</h4>
                  <p>One or more requested quantities are below the required Minimum Order Quantity (MOQ). Please adjust quantities highlighted in red below.</p>
                </div>
              </div>
            )}

            <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" /> Selected Items ({quoteItems.length})
                </h3>
                <button
                  onClick={clearQuote}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                >
                  Clear All
                </button>
              </div>

              <div className="divide-y divide-slate-800">
                {quoteItems.map((item) => {
                  const isMoqViolated = item.quantity < item.moq;
                  const itemTotal = item.quantity * item.product.price;

                  return (
                    <div key={item.product._id} className="p-5 space-y-3">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl bg-[#F3F5F7] p-1.5 flex items-center justify-center shrink-0 border border-slate-700/60 shadow-sm overflow-hidden">
                          <img
                            src={getProductImage(item.product)}
                            alt={item.product.imageMetadata?.altText || item.product.name}
                            onError={handleImageError}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link to={`/products/${item.product._id}`} className="font-bold text-white text-sm hover:text-cyan-400 transition-colors line-clamp-1">
                            {item.product.name}
                          </Link>
                          <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                            <span>Brand: <strong className="text-slate-200">{item.product.brand}</strong></span>
                            <span>•</span>
                            <span className="text-amber-400 font-bold">MOQ: {item.moq} Pcs</span>
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromQuote(item.product._id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Item Quantity Controller & Price Calculation */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">Order Qty:</span>
                          <div className={`flex items-center gap-2 bg-slate-950 p-1 rounded-lg border ${isMoqViolated ? 'border-rose-500 text-rose-300' : 'border-slate-800'}`}>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                              className="p-1 text-slate-400 hover:text-white"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.product._id, parseInt(e.target.value) || 0)}
                              className="w-12 bg-transparent text-center font-bold text-white focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              className="p-1 text-slate-400 hover:text-white"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-right">
                          <div>
                            <span className="text-slate-400 text-[11px] block">Unit Price</span>
                            <span className="font-bold text-white">₹{item.product.price}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[11px] block">Estimated Subtotal</span>
                            <span className="font-extrabold text-cyan-400 text-sm">₹{itemTotal.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {isMoqViolated && (
                        <p className="text-[11px] text-rose-400 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Quantity is below Minimum Order Quantity of {item.moq} Pcs!
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Customer Info & Submission Card */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
              <h3 className="font-extrabold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
                <Building className="w-5 h-5 text-amber-400" /> Wholesale Buyer Details
              </h3>

              {user ? (
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Customer Name:</span>
                    <span className="font-bold text-white">{customerInfo.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Business/Shop Name:</span>
                    <span className="font-bold text-cyan-400">{customerInfo.businessName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Mobile Number:</span>
                    <span className="font-bold text-white">{customerInfo.mobile}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Email Address:</span>
                    <span className="font-bold text-white">{customerInfo.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-bold text-white">{customerInfo.city}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 p-4 rounded-xl text-center space-y-3 text-xs">
                  <p className="text-slate-300">Log in to automatically attach your shop details to this quote request.</p>
                  <Link to="/login?redirect=/quote" className="inline-block bg-cyan-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs">
                    Login / Register
                  </Link>
                </div>
              )}

              {/* Remarks Field */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-white">Special Remarks / Freight Requirements</label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="E.g., Preferred transport service, urgency level, customized packaging requirements..."
                  className="w-full bg-slate-900 text-white text-xs p-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none placeholder-slate-500"
                />
              </div>

              {/* Total Estimated Calculation Box */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Total Line Items:</span>
                  <span className="font-bold text-white">{quoteItems.length}</span>
                </div>
                <div className="flex items-baseline justify-between pt-1 border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-200">Estimated Total Amount:</span>
                  <span className="text-xl font-extrabold text-amber-400">₹{totalEstimatedAmount.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-slate-500 italic">
                  *Final wholesale invoice including freight taxes will be confirmed by Roshani Traders.
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitQuote}
                disabled={isSubmitting || hasMoqViolation}
                className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-cyan-500 hover:brightness-110 text-slate-950 font-extrabold py-4 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 disabled:opacity-50 transition-all hover:scale-[1.02]"
              >
                <Send className="w-4 h-4 text-slate-950" />
                {isSubmitting ? 'Submitting Quotation...' : 'Submit Quotation Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
