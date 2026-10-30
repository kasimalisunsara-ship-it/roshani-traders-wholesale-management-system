import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Package,
  PhoneCall,
  MessageSquare,
  RefreshCw,
  Navigation,
  AlertCircle,
  FileText
} from 'lucide-react';

export default function LiveTrackingPage() {
  const { code: paramCode } = useParams();
  const [searchCode, setSearchCode] = useState(paramCode || 'TRK-884210');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTracking = async (codeToFetch) => {
    const query = codeToFetch || searchCode;
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await API.get(`/quotes/track/${encodeURIComponent(query.trim())}`);
      if (res.data.success && res.data.order) {
        setTrackingData(res.data.order);
      } else {
        setError('No tracking record found for this Order or Tracking ID.');
      }
    } catch (err) {
      console.error('Tracking fetch error:', err);
      setError('Unable to retrieve live tracking details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking(paramCode || 'TRK-884210');
  }, [paramCode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTracking(searchCode);
  };

  // Tracking Stages Configuration
  const stages = [
    { key: 'Order Placed', title: 'Order Placed', desc: 'Wholesale order registered' },
    { key: 'Processing', title: 'Payment & Verification', desc: 'UPI/COD invoice confirmed' },
    { key: 'Packed', title: 'Packed at Warehouse', desc: 'Heavy wooden crate packaging' },
    { key: 'Dispatched', title: 'Dispatched to Transport', desc: 'Handed to VRL Express' },
    { key: 'In Transit', title: 'In Transit on Highway', desc: 'En route with GPS tracking' },
    { key: 'Out for Delivery', title: 'Out for Delivery', desc: 'Local hub dispatch vehicle' },
    { key: 'Delivered', title: 'Delivered', desc: 'Received at shop/godown' }
  ];

  const getStageIndex = (currentStatus) => {
    const idx = stages.findIndex(s => s.key.toLowerCase() === (currentStatus || '').toLowerCase());
    return idx >= 0 ? idx : 4; // Default to 'In Transit' if not matched
  };

  const currentStageIndex = trackingData ? getStageIndex(trackingData.trackingStatus) : 4;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header & Breadcrumb */}
        <div className="space-y-4">
          <Breadcrumbs items={[{ label: 'Live Order Tracking', path: '/track' }]} />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Truck className="w-4 h-4" /> Live Freight & GPS Tracking
              </span>
              <h1 className="text-3xl font-extrabold text-white mt-1">Track Your Wholesale Order</h1>
              <p className="text-xs text-slate-400 mt-1">
                Real-time transport updates from Roshani Traders Central Dispatch Hub to your shop.
              </p>
            </div>

            {/* Quick Search Form */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="Enter Order ID or Tracking No (e.g. TRK-884210)"
                  className="w-full bg-slate-900 text-white pl-10 pr-3 py-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none text-xs font-mono"
                />
              </div>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 shrink-0 transition"
              >
                <Search className="w-3.5 h-3.5" /> Track Live
              </button>
            </form>
          </div>
        </div>

        {/* Demo Quick Lookup Buttons */}
        <div className="flex items-center gap-2 text-xs flex-wrap bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 font-semibold">Try Quick Demo Tracking Numbers:</span>
          <button
            type="button"
            onClick={() => { setSearchCode('TRK-884210'); fetchTracking('TRK-884210'); }}
            className="px-2.5 py-1 bg-slate-800 hover:bg-amber-500/20 text-amber-300 font-mono rounded-lg border border-amber-500/30 transition"
          >
            TRK-884210 (In Transit)
          </button>
          <button
            type="button"
            onClick={() => { setSearchCode('TRK-552190'); fetchTracking('TRK-552190'); }}
            className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-500/20 text-emerald-300 font-mono rounded-lg border border-emerald-500/30 transition"
          >
            TRK-552190 (Delivered)
          </button>
        </div>

        {loading ? (
          <LoadingSpinner message="Connecting to GPS logistics transport server..." />
        ) : error ? (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-4 max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Tracking Details Not Found</h3>
            <p className="text-xs text-slate-400">{error}</p>
            <button
              onClick={() => fetchTracking('TRK-884210')}
              className="bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs"
            >
              Load Demo Tracking Data
            </button>
          </div>
        ) : trackingData && (
          <div className="space-y-8">
            
            {/* Top Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Status & Tracking No */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Tracking Reference</span>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                    ● {trackingData.trackingStatus}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white font-mono">{trackingData.trackingNumber}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Order ID: <strong className="text-cyan-400">{trackingData.quoteId}</strong></p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Buyer Shop:</span>
                  <span className="font-bold text-white truncate max-w-[150px]">{trackingData.businessName}</span>
                </div>
              </div>

              {/* Card 2: Transport & Courier */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Logistics Carrier</span>
                  <Truck className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{trackingData.courierPartner}</h3>
                  <p className="text-xs text-amber-400 font-mono mt-0.5">Vehicle: {trackingData.vehicleNumber}</p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Current Hub:</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {trackingData.currentLocation}
                  </span>
                </div>
              </div>

              {/* Card 3: Destination & Support */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Destination</span>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{trackingData.destinationCity}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Contact: {trackingData.customerName}</p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                  <a
                    href="https://wa.me/918879003738?text=Hello%20Roshani%20Logistics%2C%20I%20want%20status%20update%20on%20Tracking%20No%20"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Support
                  </a>
                </div>
              </div>

            </div>

            {/* Interactive Live Freight Route & Map Visualizer */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-amber-400" /> Live Express Transport Route
                  </h3>
                  <p className="text-xs text-slate-400">Live GPS telemetry updating every 30 seconds</p>
                </div>
                <button
                  type="button"
                  onClick={() => fetchTracking()}
                  className="self-start sm:self-auto bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> Refresh Signal
                </button>
              </div>

              {/* Animated Map Graphic Route */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative space-y-6 overflow-hidden">
                
                {/* SVG Route Line with Moving Truck */}
                <div className="relative py-8">
                  {/* Progress Line */}
                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden relative">
                    <div
                      className="bg-gradient-to-r from-cyan-500 via-amber-500 to-emerald-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, Math.max(15, (currentStageIndex + 1) * 15))}%` }}
                    ></div>
                  </div>

                  {/* Moving Animated Freight Truck Icon */}
                  <div
                    className="absolute top-3 transition-all duration-1000 transform -translate-x-1/2 flex flex-col items-center"
                    style={{ left: `${Math.min(92, Math.max(8, (currentStageIndex + 1) * 14))}%` }}
                  >
                    <div className="bg-amber-500 text-slate-950 p-2.5 rounded-2xl shadow-xl shadow-amber-500/40 border-2 border-slate-900 animate-bounce">
                      <Truck className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-amber-300 bg-slate-900 px-2 py-0.5 rounded-full border border-amber-500/40 mt-1 whitespace-nowrap shadow-md">
                      {trackingData.currentLocation.split(',')[0]}
                    </span>
                  </div>
                </div>

                {/* Map Hub Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-4 border-t border-slate-900">
                  <div className="space-y-1">
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Origin Godown</span>
                    <p className="font-extrabold text-white">Mumbai Head Office</p>
                    <span className="text-[11px] text-emerald-400 block">✓ Loaded</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Logistics Station</span>
                    <p className="font-extrabold text-white">Bhiwandi Central Hub</p>
                    <span className="text-[11px] text-amber-400 block">● Active Transit</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Highway Express</span>
                    <p className="font-extrabold text-white">National Highway Checkpoint</p>
                    <span className="text-[11px] text-slate-400 block">En Route</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Final Destination</span>
                    <p className="font-extrabold text-white">{trackingData.destinationCity}</p>
                    <span className="text-[11px] text-slate-400 block">Destination Hub</span>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Stage Progression Timeline */}
              <div className="space-y-4 pt-2">
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Live Status Progression</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {stages.map((stage, idx) => {
                    const isCompleted = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div
                        key={stage.key}
                        className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-2 ${
                          isCurrent
                            ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10'
                            : isCompleted
                            ? 'bg-emerald-950/30 border-emerald-600/40 text-emerald-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold">Step {idx + 1}</span>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-slate-600 shrink-0" />
                          )}
                        </div>
                        <div>
                          <h5 className="font-bold text-xs leading-tight text-white">{stage.title}</h5>
                          <p className="text-[10px] opacity-75 mt-0.5 leading-tight">{stage.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Tracking Event Log History Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" /> Detailed Transport Log & Audit History
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Status Checkpoint</th>
                      <th className="p-3.5">Hub / Location</th>
                      <th className="p-3.5">Timestamp</th>
                      <th className="p-3.5">Freight Comments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {trackingData.history.map((event, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition">
                        <td className="p-3.5 font-bold text-amber-400 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          {event.status}
                        </td>
                        <td className="p-3.5 font-medium text-white">{event.location}</td>
                        <td className="p-3.5 text-slate-400 font-mono">
                          {new Date(event.timestamp).toLocaleString()}
                        </td>
                        <td className="p-3.5 text-slate-300">{event.comment || 'Checkpoint scan verified.'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
