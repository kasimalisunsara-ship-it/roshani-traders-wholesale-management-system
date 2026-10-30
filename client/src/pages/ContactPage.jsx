import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import API from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Building, User, Instagram, ExternalLink } from 'lucide-react';

export default function ContactPage() {
  const { user } = useContext(AuthContext);
  const { showSuccess, showError } = useContext(ToastContext);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    businessName: user?.businessName || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    subject: 'Wholesale Price & Availability Enquiry',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, businessName, mobile, email, subject, message } = formData;

    if (!name || !businessName || !mobile || !email || !subject || !message) {
      showError('Please fill in all enquiry details.');
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/enquiries', formData);
      if (res.data.success) {
        showSuccess('Your wholesale enquiry has been recorded. Our team will contact you shortly.');
        setFormData({
          name: user?.name || '',
          businessName: user?.businessName || '',
          mobile: user?.mobile || '',
          email: user?.email || '',
          subject: 'Wholesale Price & Availability Enquiry',
          message: ''
        });
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to submit enquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs items={[{ label: 'Contact Us', path: '/contact' }]} />

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-md border border-cyan-800">
          WHOLESALE HELP DESK
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Contact Roshani Traders</h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          Inquire about bulk product availability, container pricing, custom fittings, or shipping timelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Contact Cards */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3">Head Office & Depot</h3>
            
            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Wholesale Depot Address</h4>
                  <p className="text-slate-400 leading-relaxed mt-0.5">
                    Ajit Glass, Swami Vivekanand Rd, nr. Himalaya hotel, Behram Baug, Jogeshwari West, Mumbai, Maharashtra 400102, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Direct Phone Hotlines</h4>
                  <p className="text-slate-400 mt-0.5">+91 98929 87454 / +91 98984 01179</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Wholesale Email</h4>
                  <a href="mailto:roshanitraders780@gmail.com" className="text-cyan-400 hover:underline mt-0.5 block">
                    roshanitraders780@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Depot Operating Hours</h4>
                  <p className="text-slate-400 mt-0.5">Monday – Saturday: 9:00 AM – 8:00 PM</p>
                </div>
              </div>

              {/* 1-Click WhatsApp & Instagram Buttons */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <a
                  href="https://wa.me/918879003738?text=Hello%20Roshani%20Traders%2C%20I%20would%20like%20to%20enquire%20about%20wholesale%20three%20wheeler%20auto%20parts."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold p-3.5 rounded-2xl flex items-center justify-between shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-5 h-5 text-emerald-100" />
                    <span>WhatsApp Business (+91 88790 03738)</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-emerald-100" />
                </a>

                <a
                  href="https://www.instagram.com/roshanitraders_official?igsi=em9xYXFhZHR3Zzdz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 hover:brightness-110 text-white font-extrabold p-3.5 rounded-2xl flex items-center justify-between shadow-lg shadow-pink-600/20 transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-2.5">
                    <Instagram className="w-5 h-5" />
                    <span>Follow @roshanitraders_official</span>
                  </div>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Enquiry Form */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" /> Wholesale Enquiry Form
            </h3>
            <p className="text-xs text-slate-400">All submissions are stored securely and reviewed by our sales managers.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Your Full Name *</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="E.g., Rajesh Kumar"
                    className="w-full bg-slate-900 text-white pl-10 pr-3 py-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Business / Shop Name *</label>
                <div className="relative flex items-center">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="E.g., Metro Auto Spares"
                    className="w-full bg-slate-900 text-white pl-10 pr-3 py-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Mobile Phone *</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="+91 98123 45678"
                  className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@shop.com"
                  className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Enquiry Topic / Subject *</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none font-semibold"
              >
                <option value="Wholesale Price & Availability Enquiry">Wholesale Price & Availability Enquiry</option>
                <option value="Bulk Order MOQ & Volume Discount">Bulk Order MOQ & Volume Discount</option>
                <option value="Product Fitment & Alternatives Inquiry">Product Fitment & Alternatives Inquiry</option>
                <option value="Distributorship & Dealership Request">Distributorship & Dealership Request</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Detailed Message / Part Numbers Required *</label>
              <textarea
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Specify parts needed, quantities, vehicle models (Bajaj RE, Piaggio Ape, TVS King), or delivery destination..."
                className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none placeholder-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" /> {loading ? 'Submitting Message...' : 'Submit Contact Enquiry'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
