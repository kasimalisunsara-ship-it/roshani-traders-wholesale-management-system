import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  X,
  CheckCircle,
  Truck,
  ShieldCheck,
  CreditCard,
  Store,
  Phone,
  MapPin,
  Building,
  QrCode,
  Copy,
  Check,
  Navigation,
  ArrowRight
} from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import API from '../services/api';

export const CheckoutModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { showSuccess, showError } = useContext(ToastContext);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    businessName: user?.businessName || '',
    mobile: user?.mobile || '',
    address: user?.address || '',
    city: user?.city || '',
    paymentMethod: 'UPI',
    utrNumber: '',
    remarks: ''
  });

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('roshanitraders@upi');
    setCopiedUpi(true);
    if (showSuccess) showSuccess('UPI ID copied to clipboard!');
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.address || !formData.city) {
      showError('Please complete all required shipping fields.');
      return;
    }

    if (formData.paymentMethod === 'UPI' && formData.utrNumber && formData.utrNumber.length < 6) {
      showError('Please enter a valid 12-digit UTR/UPI Transaction Reference Number.');
      return;
    }

    if (cartItems.length === 0) {
      showError('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    try {
      const remarksText = `[Payment: ${formData.paymentMethod}${formData.utrNumber ? ` | UTR: ${formData.utrNumber}` : ''}] Shop: ${formData.businessName || 'General Shop'} | Mobile: ${formData.mobile} | Address: ${formData.address}, ${formData.city} | ${formData.remarks || 'Wholesale Order Dispatch'}`;
      
      const res = await API.post('/quotes', {
        items: cartItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity
        })),
        name: formData.name,
        businessName: formData.businessName,
        mobile: formData.mobile,
        email: user?.email || `${formData.mobile.replace(/\D/g, '') || Date.now()}@roshanitraders.com`,
        address: formData.address,
        city: formData.city,
        paymentMethod: formData.paymentMethod,
        utrNumber: formData.utrNumber,
        remarks: remarksText
      });

      if (res.data.success) {
        const createdQuote = res.data.quote;
        const trackingNo = createdQuote?.trackingNumber || createdQuote?.quoteId || `TRK-${Math.floor(100000 + Math.random() * 900000)}`;
        setOrderComplete({
          orderId: createdQuote?.quoteId || `QT-${Math.floor(100000 + Math.random() * 900000)}`,
          trackingNumber: trackingNo,
          total: createdQuote?.estimatedAmount || cartTotal,
          itemsCount: cartItems.reduce((acc, i) => acc + i.quantity, 0),
          paymentMethod: formData.paymentMethod
        });
        clearCart();
        showSuccess('🎉 Wholesale order confirmed & saved to database!');
      }
    } catch (err) {
      console.error('Order Submission Error:', err);
      showError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setOrderComplete(null);
    onClose();
  };

  const handleGoToTracking = () => {
    const trackNo = orderComplete?.trackingNumber || orderComplete?.orderId;
    resetAndClose();
    navigate(`/track/${trackNo}`);
  };

  // Demo SVG QR Code Data Generator for UPI
  const upiId = 'roshanitraders@upi';
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi%3A%2F%2Fpay%3Fpa%3Droshanitraders%40upi%26pn%3DRoshani%2520Traders%2520Wholesale%26am%3D${cartTotal}%26cu%3DINR&color=f59e0b&bgcolor=0f172a`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Header Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Three-Wheeler Wholesale Checkout</h3>
              <p className="text-xs text-slate-400">Direct Factory Wholesale Dispatch & Payment</p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderComplete ? (
          /* Success & Live Tracking Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40 shadow-lg shadow-emerald-500/20">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                Wholesale Order Confirmed
              </span>
              <h2 className="text-2xl font-black text-white">Order Received & Placed!</h2>
              <p className="text-xs text-slate-400 mt-1">
                Order ID: <span className="font-mono text-white font-bold">{orderComplete.orderId}</span>
              </p>
            </div>

            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 text-left space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400">Tracking Reference No:</span>
                <span className="font-mono text-amber-400 font-extrabold text-sm">{orderComplete.trackingNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400">Payment Status:</span>
                <span className="font-bold text-emerald-400">
                  {orderComplete.paymentMethod === 'UPI' ? '✓ Paid via UPI QR Code' : 'Cash on Delivery (Pending Freight)'}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2.5">
                <span className="text-slate-400">Total Items:</span>
                <span className="font-semibold text-white">{orderComplete.itemsCount} Pieces</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400 font-bold">Total Amount Paid:</span>
                <span className="font-mono text-emerald-400 font-extrabold text-xl">₹{orderComplete.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons: Live Tracking & Continue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleGoToTracking}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>🚀 Track Order Live</span>
              </button>

              <button
                type="button"
                onClick={resetAndClose}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs border border-slate-700 transition-all"
              >
                Back to Store Catalog
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form with Demo QR Code */
          <form onSubmit={handleSubmitOrder} className="p-6 space-y-6 max-h-[82vh] overflow-y-auto text-xs">
            
            {/* Order Items Preview */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-amber-400 uppercase tracking-wider">Order Summary</span>
                <span className="text-slate-400 font-medium">{cartItems.length} Products</span>
              </div>
              <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-slate-900 last:border-0">
                    <span className="text-slate-200 truncate pr-2">{item.product.name} (x{item.quantity})</span>
                    <span className="font-mono text-emerald-400 font-bold">₹{(item.quantity * item.product.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800 font-extrabold text-sm">
                <span className="text-white">Total Amount:</span>
                <span className="text-emerald-400 font-mono text-base">₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" /> Select Payment Method
              </h4>

              <div className="grid grid-cols-3 gap-3">
                <label
                  className={`border rounded-2xl p-3 cursor-pointer flex flex-col justify-between transition ${
                    formData.paymentMethod === 'UPI'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={formData.paymentMethod === 'UPI'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div>
                    <span className="font-extrabold text-white text-xs block">UPI / QR Code</span>
                    <span className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 mt-2 block">✓ Instant Fast Track</span>
                </label>

                <label
                  className={`border rounded-2xl p-3 cursor-pointer flex flex-col justify-between transition ${
                    formData.paymentMethod === 'COD'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div>
                    <span className="font-extrabold text-white text-xs block">Cash on Delivery</span>
                    <span className="text-[10px] text-slate-400">Pay transport at hub</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 mt-2 block">Available</span>
                </label>

                <label
                  className={`border rounded-2xl p-3 cursor-pointer flex flex-col justify-between transition ${
                    formData.paymentMethod === 'Credit'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Credit"
                    checked={formData.paymentMethod === 'Credit'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div>
                    <span className="font-extrabold text-white text-xs block">Wholesale Credit</span>
                    <span className="text-[10px] text-slate-400">30-day bill invoice</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-400 mt-2 block">Dealers Only</span>
                </label>
              </div>
            </div>

            {/* DEMO UPI QR CODE DISPLAY BOX */}
            {formData.paymentMethod === 'UPI' && (
              <div className="bg-slate-950 p-5 rounded-3xl border-2 border-amber-500/40 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-amber-400" />
                    <div>
                      <h4 className="font-extrabold text-white text-xs">Scan & Pay via Demo UPI QR</h4>
                      <p className="text-[10px] text-slate-400">Scan using Google Pay, PhonePe, Paytm or BHIM UPI</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
                    ₹{cartTotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Demo QR Canvas graphic */}
                  <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 shadow-md shrink-0 text-center">
                    <img
                      src={qrSvgUrl}
                      alt="Roshani Traders UPI QR Code"
                      className="w-36 h-36 rounded-xl object-contain mx-auto"
                    />
                    <span className="text-[10px] font-bold text-amber-400 mt-1 block">Roshani Traders Official</span>
                  </div>

                  {/* Payment Details & Copy UPI */}
                  <div className="space-y-3 flex-1 w-full text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-400 text-[11px] block">Roshani Traders UPI VPA:</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-slate-900 px-3 py-2 rounded-xl text-amber-300 font-mono font-bold border border-slate-800 flex-1 truncate text-xs">
                          {upiId}
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 transition shrink-0"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold block text-[11px]">
                        UPI UTR / Transaction Reference Number (Optional):
                      </label>
                      <input
                        type="text"
                        name="utrNumber"
                        value={formData.utrNumber}
                        onChange={handleChange}
                        placeholder="e.g. 12-digit UTR 984210385712"
                        className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery & Shop Details */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-400" /> Shop & Shipping Address
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Auto Spares Shop Name</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. Metro Auto Spares & Accessories"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Mobile Number (Transport SMS) *</label>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+91 98123 45678"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">City / Transport Hub *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Jaipur / Mumbai / Delhi"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Detailed Shop Address / Transport Godown *</label>
                <textarea
                  name="address"
                  required
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Shop number, street address, transport godown details..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>
            </div>

            {/* Special Remarks */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">Packaging Instructions (Optional)</label>
              <input
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="e.g. Extra heavy wooden crate packing..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold py-4 px-6 rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 text-xs disabled:opacity-50"
              >
                {submitting ? (
                  <span>Processing Order & Registering Tracking...</span>
                ) : (
                  <>
                    <span>Confirm Payment & Place Wholesale Order (₹{cartTotal.toLocaleString()})</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
