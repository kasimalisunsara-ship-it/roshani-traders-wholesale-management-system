import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ToastContext } from '../../context/ToastContext';
import API from '../../services/api';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Power,
  AlertTriangle,
  X,
  Save,
  Tag,
  DollarSign,
  Layers,
  ShieldAlert,
  Image as ImageIcon
} from 'lucide-react';
import { getProductImage } from '../../utils/productImages';
import { handleImageError } from '../../utils/placeholder';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Confirmation Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [clearAllConfirmOpen, setClearAllConfirmOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Add / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    name: '',
    category: '',
    description: '',
    price: 450,
    MOQ: 10,
    stock: 100,
    brand: 'Roshani Traders',
    image: '',
    status: 'active'
  };

  const [formData, setFormData] = useState(initialForm);

  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showError('Image file size should be less than 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 800;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setFormData(prev => ({ ...prev, image: compressed }));
          showSuccess('Product image processed successfully!');
        };
        img.onerror = () => {
          setFormData(prev => ({ ...prev, image: reader.result }));
          showSuccess('Product image attached!');
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const { showSuccess, showError } = useContext(ToastContext);

  const fetchProductsAndCats = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        API.get('/products?admin=true&limit=500'),
        API.get('/categories')
      ]);
      if (prodRes.data.success) setProducts(prodRes.data.products || []);
      if (catRes.data.success) setCategories(catRes.data.categories || []);
    } catch (err) {
      console.error('Failed to load products:', err);
      showError('Failed to load product catalogue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCats();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      ...initialForm,
      category: categories[0]?._id || ''
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingId(p._id);
    const initialImg = p.image || (p.images && p.images[0]) || getProductImage(p) || '';
    setFormData({
      name: p.name || '',
      category: p.category?._id || p.category || categories[0]?._id || '',
      description: p.description || '',
      price: p.price || 0,
      MOQ: p.MOQ || 1,
      stock: p.stock ?? 100,
      brand: p.brand || 'Roshani Traders',
      image: initialImg,
      status: p.status || 'active'
    });
    setModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showError('Product Name is required.');
      return;
    }

    setSaving(true);
    try {
      const selectedCategory = formData.category || (categories[0] ? categories[0]._id : 'General Auto Parts');
      const payload = {
        ...formData,
        category: selectedCategory,
        price: Number(formData.price) || 100,
        MOQ: Number(formData.MOQ) || 1,
        stock: Number(formData.stock) ?? 100,
        availability: formData.status === 'active',
        images: formData.image ? [formData.image] : []
      };

      if (editingId) {
        const res = await API.put(`/products/${editingId}`, payload);
        if (res.data.success) {
          showSuccess('Product updated successfully!');
        }
      } else {
        const res = await API.post('/products', payload);
        if (res.data.success) {
          showSuccess('New product added successfully to wholesale catalogue!');
        }
      }

      setModalOpen(false);
      fetchProductsAndCats();
    } catch (err) {
      console.error('Save product error:', err);
      showError(err.response?.data?.message || 'Error saving product.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const res = await API.put(`/products/${id}/status`, { status: nextStatus });
      if (res.data.success) {
        showSuccess(`Product status changed to ${nextStatus}.`);
        fetchProductsAndCats();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const confirmRemoveProduct = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const res = await API.delete(`/products/${deleteTarget._id}`);
      if (res.data.success) {
        showSuccess(`Product "${deleteTarget.name}" removed successfully.`);
        setProducts(prev => prev.filter(p => p._id !== deleteTarget._id));
        setDeleteTarget(null);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to remove product.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearAllProducts = async () => {
    setActionLoading(true);
    try {
      const res = await API.delete('/products/clear/all');
      if (res.data.success) {
        showSuccess('All products removed successfully.');
        setProducts([]);
        setClearAllConfirmOpen(false);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to remove products.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar activeTab="products" />

      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Wholesale Administration</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-0.5">Product Management</h1>
            <p className="text-xs text-slate-400">Add, edit, remove or deactivate three-wheeler auto spare parts</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
            <button
              type="button"
              onClick={() => setClearAllConfirmOpen(true)}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold px-4 py-3 rounded-xl text-xs flex items-center gap-2 transition"
            >
              <Trash2 className="w-4 h-4" /> Clear All Products
            </button>
            <Link
              to="/admin/products/add"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-4 py-3 rounded-xl text-xs transition hidden sm:inline-block"
            >
              Full Page Form
            </Link>
          </div>
        </div>

        {/* Statistics Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
            <span className="text-slate-400 text-xs font-medium">Total Products</span>
            <p className="text-2xl font-extrabold text-white mt-1">{products.length}</p>
          </div>
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
            <span className="text-slate-400 text-xs font-medium">Available (Active)</span>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">
              {products.filter(p => p.status === 'active' && p.availability).length}
            </p>
          </div>
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
            <span className="text-slate-400 text-xs font-medium">Unavailable (Inactive)</span>
            <p className="text-2xl font-extrabold text-rose-400 mt-1">
              {products.filter(p => p.status === 'inactive' || !p.availability).length}
            </p>
          </div>
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
            <span className="text-slate-400 text-xs font-medium">Categories Linked</span>
            <p className="text-2xl font-extrabold text-amber-400 mt-1">{categories.length}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product, category, or brand..."
              className="w-full bg-slate-900 text-white text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <span className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredProducts.length}</strong> of {products.length} products
          </span>
        </div>

        {/* Products Data Table */}
        {loading ? (
          <LoadingSpinner message="Loading wholesale product catalog..." />
        ) : (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Product Image</th>
                    <th className="p-4">Product ID</th>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Brand</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">MOQ</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Created Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredProducts.map((p) => {
                    const isActive = p.status === 'active' && p.availability;
                    return (
                      <tr key={p._id} className="hover:bg-slate-850 transition">
                        <td className="p-4">
                          <div className="w-12 h-12 rounded-xl bg-[#F3F5F7] p-1 flex items-center justify-center border border-slate-800 shadow-sm overflow-hidden">
                            <img
                              src={getProductImage(p)}
                              alt={p.imageMetadata?.altText || p.name}
                              onError={handleImageError}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-amber-400 font-bold">
                          {p.sku || p._id.substring(0, 8)}
                        </td>
                        <td className="p-4 font-bold text-white max-w-xs">
                          {p.name}
                        </td>
                        <td className="p-4 text-cyan-400 font-medium">
                          {p.category?.name || 'General Parts'}
                        </td>
                        <td className="p-4 text-slate-300">{p.brand}</td>
                        <td className="p-4 font-extrabold text-white">₹{p.price?.toLocaleString()}</td>
                        <td className="p-4 font-bold text-amber-400">{p.MOQ} Pcs</td>
                        <td className="p-4 font-medium">{p.stock}</td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              isActive
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {isActive ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 text-[11px]">
                          {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleStatus(p._id, p.status)}
                              className={`p-2 rounded-lg border text-xs transition ${
                                isActive
                                  ? 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                              }`}
                              title={isActive ? 'Deactivate Product' : 'Activate Product'}
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg border border-slate-700 transition"
                              title="Edit Product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(p)}
                              className="p-2 bg-slate-800 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-slate-700 transition"
                              title="Remove Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
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

        {/* Add / Edit Product Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-white text-base">
                  {editingId ? 'Edit Product Details' : 'Add New Product to Catalogue'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Three Wheeler Bumper / Side Mirror"
                    className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-amber-400">MOQ (Pcs) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.MOQ}
                      onChange={(e) => setFormData({ ...formData, MOQ: e.target.value })}
                      className="w-full bg-slate-950 text-amber-300 font-bold p-3 rounded-xl border border-amber-500/40 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Stock (Units) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Product Image Management & Live Preview */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-amber-400" /> Product Image *
                    </span>
                    {formData.image && (
                      <span className="text-[11px] text-emerald-400 font-medium">✓ Image Attached</span>
                    )}
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Live Preview Box */}
                    <div className="sm:col-span-1 flex flex-col items-center justify-center p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                      <span className="text-[10px] text-slate-400 mb-2 font-bold uppercase tracking-wider">Live Preview</span>
                      <div className="w-24 h-24 rounded-xl bg-[#F3F5F7] p-2 flex items-center justify-center border border-slate-700 shadow-inner overflow-hidden">
                        {formData.image ? (
                          <img
                            src={formData.image}
                            alt="Preview"
                            onError={handleImageError}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Upload & Path Controls */}
                    <div className="sm:col-span-2 flex flex-col justify-between space-y-2">
                      {/* File Upload Button */}
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-amber-500/50 bg-slate-950 p-3 rounded-xl cursor-pointer transition text-center group">
                        <ImageIcon className="w-5 h-5 text-amber-400 group-hover:scale-110 transition mb-0.5" />
                        <span className="text-xs font-bold text-slate-200">Upload / Replace Image File</span>
                        <span className="text-[10px] text-slate-400">PNG, JPG, WEBP, SVG (Max 10MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                      </label>

                      {/* Or direct URL/Path */}
                      <div>
                        <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-between">
                          <span>Or local image path / URL:</span>
                          {formData.image && (
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                              className="text-rose-400 hover:underline"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="/images/products/example.webp or https://..."
                          className="w-full bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Auto rickshaw spare part specifications..."
                    className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" /> {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product Now'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="bg-slate-800 text-slate-300 px-5 py-3 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal (Prompt Section 14) */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
              <div className="flex items-center gap-3 text-rose-400">
                <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Remove Product</h3>
                  <p className="text-xs text-slate-400">Confirmation Required</p>
                </div>
              </div>

              <p className="text-sm text-slate-300">
                Are you sure you want to remove <strong className="text-white">"{deleteTarget.name}"</strong>?
              </p>
              <p className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
                This action will delete the product from the wholesale catalogue database table.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmRemoveProduct}
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-rose-500/20"
                >
                  {actionLoading ? 'Removing...' : 'Yes, Remove'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Clear All Confirmation Modal */}
        {clearAllConfirmOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
              <div className="flex items-center gap-3 text-rose-400">
                <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Clear All Products</h3>
                  <p className="text-xs text-slate-400">Confirmation Required</p>
                </div>
              </div>

              <p className="text-sm text-slate-300">
                Are you sure you want to remove <strong className="text-white">ALL products</strong> from your catalogue database?
              </p>
              <p className="text-xs text-rose-300 bg-rose-950/40 p-3 rounded-xl border border-rose-900/50">
                This will wipe out all sample products so you can add your own products from scratch.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setClearAllConfirmOpen(false)}
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleClearAllProducts}
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-rose-600/20"
                >
                  {actionLoading ? 'Clearing...' : 'Yes, Delete All Products'}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
