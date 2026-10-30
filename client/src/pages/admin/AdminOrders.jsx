import React, { useState, useEffect, useContext } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ToastContext } from '../../context/ToastContext';
import API from '../../services/api';
import { FileText, Eye, CheckCircle2, Clock, XCircle, Building, Phone, Mail, Truck, Navigation } from 'lucide-react';

export default function AdminOrders() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);

  const { showSuccess, showError } = useContext(ToastContext);

  const fetchQuotes = async () => {
    try {
      const res = await API.get('/quotes');
      if (res.data.success) {
        setQuotes(res.data.quotes);
      }
    } catch (err) {
      console.error('Failed to load quotes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleStatusChange = async (quoteId, newStatus) => {
    try {
      const res = await API.put(`/quotes/${quoteId}/status`, { status: newStatus });
      if (res.data.success) {
        showSuccess(`Quote status updated to ${newStatus}`);
        fetchQuotes();
        if (selectedQuote && selectedQuote._id === quoteId) {
          setSelectedQuote(res.data.quote);
        }
      }
    } catch (err) {
      showError('Failed to update status.');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-extrabold text-white">Quotations & Orders Management</h1>
          <p className="text-xs text-slate-400 mt-1">Review incoming bulk quote requests, confirm order statuses & manage wholesale customer dispatch</p>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching quotes..." />
        ) : (
          <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Quote ID</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Customer & Business</th>
                    <th className="p-4">Line Items</th>
                    <th className="p-4">Estimated Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {quotes.map((q) => {
                    const totalQty = q.products.reduce((sum, item) => sum + item.quantity, 0);

                    return (
                      <tr key={q._id} className="hover:bg-slate-900/50">
                        <td className="p-4 font-bold text-cyan-400">{q.quoteId}</td>
                        <td className="p-4 text-slate-300">
                          {new Date(q.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white">{q.user?.name || 'Customer'}</div>
                          <div className="text-[11px] text-amber-400 font-semibold">{q.user?.businessName || 'General Shop'}</div>
                          <div className="text-[10px] text-slate-400">{q.user?.mobile} • {q.user?.city}</div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            {q.products.slice(0, 2).map((item, idx) => (
                              <div key={idx} className="text-slate-200">
                                {item.productName || item.product?.name} <span className="text-cyan-400 font-bold">x {item.quantity}</span>
                              </div>
                            ))}
                            {q.products.length > 2 && (
                              <span className="text-[10px] text-slate-500 italic">+ {q.products.length - 2} more items</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-extrabold text-amber-400">
                          ₹{q.estimatedAmount.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1.5">
                            <select
                              value={q.status}
                              onChange={(e) => handleStatusChange(q._id, e.target.value)}
                              className="bg-slate-900 text-white text-xs p-1.5 rounded-lg border border-slate-800 focus:border-cyan-500 font-bold"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed / Accepted</option>
                              <option value="Processing">Processing</option>
                              <option value="Completed">Completed</option>
                              <option value="Rejected">Rejected</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            
                            {q.status === 'Pending' ? (
                              <button
                                onClick={() => handleStatusChange(q._id, 'Confirmed')}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-lg transition shadow-md flex items-center justify-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Accept Order
                              </button>
                            ) : (
                              <span className="text-[10px] font-extrabold text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Accepted ({q.status})
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedQuote(q)}
                              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 rounded-lg text-xs font-semibold flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> Details
                            </button>
                            <a
                              href={`/track/${q.trackingNumber || q.quoteId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-xs font-semibold flex items-center gap-1 border border-amber-500/30"
                            >
                              <Navigation className="w-3.5 h-3.5" /> Track
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detailed Modal */}
        {selectedQuote && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-white text-base">Quotation Detail #{selectedQuote.quoteId}</h3>
                  <p className="text-xs text-slate-400">Submitted on {new Date(selectedQuote.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => setSelectedQuote(null)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              {/* Customer Business Card */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-amber-400" /> Buyer Profile: {selectedQuote.user?.businessName}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <p>Contact Person: <strong className="text-white">{selectedQuote.user?.name}</strong></p>
                  <p>Mobile: <strong className="text-white">{selectedQuote.user?.mobile}</strong></p>
                  <p>Email: <strong className="text-white">{selectedQuote.user?.email}</strong></p>
                  <p>City/Address: <strong className="text-white">{selectedQuote.user?.city}, {selectedQuote.user?.address}</strong></p>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs">Requested Products</h4>
                <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Requested Qty</th>
                        <th className="p-3">MOQ</th>
                        <th className="p-3">Price</th>
                        <th className="p-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {selectedQuote.products.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3 font-bold text-white">{item.productName || item.product?.name}</td>
                          <td className="p-3 font-bold text-cyan-400">{item.quantity} units</td>
                          <td className="p-3 text-slate-400">{item.moq} units</td>
                          <td className="p-3 text-slate-300">₹{item.price}</td>
                          <td className="p-3 text-right font-bold text-amber-400">₹{(item.estimatedTotal || item.quantity * item.price).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedQuote.remarks && (
                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-400">Customer Remarks / Instructions:</label>
                  <p className="p-3 bg-slate-950 rounded-xl text-slate-300 italic border border-slate-800">
                    "{selectedQuote.remarks}"
                  </p>
                </div>
              )}

              {/* Live Tracking Telemetry Controls for Admin */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <h4 className="font-bold text-amber-400 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-400" /> Live Tracking Telemetry & Freight Status
                  </h4>
                  <span className="font-mono text-cyan-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {selectedQuote.trackingNumber || 'TRK-AUTO-GEN'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 text-[11px] block font-semibold mb-1">Live Tracking Stage:</label>
                    <select
                      value={selectedQuote.trackingStatus || 'In Transit'}
                      onChange={async (e) => {
                        const newStage = e.target.value;
                        try {
                          const res = await API.put(`/quotes/${selectedQuote._id}/tracking`, { trackingStatus: newStage });
                          if (res.data.success) {
                            showSuccess(`Tracking status updated to ${newStage}`);
                            setSelectedQuote(res.data.quote);
                            fetchQuotes();
                          }
                        } catch (err) {
                          showError('Failed to update tracking status.');
                        }
                      }}
                      className="w-full bg-slate-900 text-white font-bold p-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Processing">Processing & Payment</option>
                      <option value="Packed">Packed at Warehouse</option>
                      <option value="Dispatched">Dispatched to Transport</option>
                      <option value="In Transit">In Transit (Highway)</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered to Godown</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 text-[11px] block font-semibold mb-1">Current Hub Location:</label>
                    <input
                      type="text"
                      defaultValue={selectedQuote.currentLocation || 'Bhiwandi Freight Hub, MH'}
                      onBlur={async (e) => {
                        const newLoc = e.target.value;
                        try {
                          const res = await API.put(`/quotes/${selectedQuote._id}/tracking`, { currentLocation: newLoc });
                          if (res.data.success) {
                            showSuccess('Location updated!');
                            setSelectedQuote(res.data.quote);
                          }
                        } catch (err) {}
                      }}
                      placeholder="e.g. Bhiwandi Freight Hub, MH"
                      className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <a
                    href={`/track/${selectedQuote.trackingNumber || selectedQuote.quoteId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline text-[11px] font-bold flex items-center gap-1"
                  >
                    <Navigation className="w-3.5 h-3.5" /> View Public Customer Live Tracking Page →
                  </a>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <div className="text-xs">
                  <span className="text-slate-400">Total Estimated Amount:</span>
                  <span className="text-lg font-extrabold text-amber-400 ml-2">₹{selectedQuote.estimatedAmount.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold"
                >
                  Close Modal
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
