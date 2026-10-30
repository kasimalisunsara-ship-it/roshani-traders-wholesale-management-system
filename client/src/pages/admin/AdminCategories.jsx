import React, { useState, useEffect, useContext } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ToastContext } from '../../context/ToastContext';
import API from '../../services/api';
import { Layers, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { handleImageError } from '../../utils/placeholder';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const { showSuccess, showError } = useContext(ToastContext);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
  });

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      if (res.data.success) setCategories(res.data.categories);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingId(cat._id);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      image: cat.image || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete category? Associated products will remain intact.')) return;
    try {
      const res = await API.delete(`/categories/${id}`);
      if (res.data.success) {
        showSuccess('Category removed.');
        fetchCategories();
      }
    } catch (err) {
      showError('Failed to delete category.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await API.put(`/categories/${editingId}`, formData);
        showSuccess('Category updated.');
      } else {
        await API.post('/categories', formData);
        showSuccess('Category created.');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      showError(err.response?.data?.message || 'Error saving category.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Product Category Management</h1>
            <p className="text-xs text-slate-400 mt-1">Organize spare parts and accessories into structured business categories</p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching categories..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat._id} className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    onError={handleImageError}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-900 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-white text-base truncate">{cat.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{cat.description}</p>
                    <span className="inline-block mt-2 bg-slate-800 text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded">
                      {cat.productCount || 0} Products
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 text-slate-400 hover:text-cyan-400 bg-slate-900 rounded-lg text-xs flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="p-2 text-slate-400 hover:text-rose-400 bg-slate-900 rounded-lg text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-white text-base">
                  {editingId ? 'Edit Category' : 'Create Category'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Category'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="bg-slate-800 text-slate-300 px-4 py-3 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
