import React, { useState, useEffect, useContext } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ToastContext } from '../../context/ToastContext';
import API from '../../services/api';
import { FileCode, Save, RefreshCw } from 'lucide-react';

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    promotionalMessage: ''
  });

  const fetchContent = async (pageName) => {
    setLoading(true);
    try {
      const res = await API.get(`/content/${pageName}`);
      if (res.data.success && res.data.content) {
        setFormData({
          title: res.data.content.title || '',
          subtitle: res.data.content.subtitle || '',
          description: res.data.content.description || '',
          promotionalMessage: res.data.content.promotionalMessage || ''
        });
      }
    } catch (err) {
      console.error('Failed to load CMS content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent(activeTab);
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.put(`/content/${activeTab}`, formData);
      if (res.data.success) {
        showSuccess(`Content for page "${activeTab}" updated successfully!`);
      }
    } catch (err) {
      showError('Failed to update content.');
    } finally {
      setSaving(false);
    }
  };

  const { showSuccess, showError } = useContext(ToastContext);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-extrabold text-white">Content Management System (CMS)</h1>
          <p className="text-xs text-slate-400 mt-1">Manage website text, promotional banners & store announcements without touching source code</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          {['home', 'about', 'promotions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {tab} Page Content
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching CMS content..." />
        ) : (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 max-w-3xl space-y-6">
            <h3 className="font-extrabold text-white text-base">Editing {activeTab.toUpperCase()} Section</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Section Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none font-semibold text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Promotional Banner Announcement</label>
                <input
                  type="text"
                  value={formData.promotionalMessage}
                  onChange={(e) => setFormData({ ...formData, promotionalMessage: e.target.value })}
                  placeholder="E.g., Special Wholesale Discount 5% on orders above ₹50,000"
                  className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none text-amber-400 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Detailed Description Paragraph</label>
                <textarea
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3.5 px-6 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Save className="w-4 h-4" /> {saving ? 'Updating CMS...' : 'Save CMS Content Changes'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
