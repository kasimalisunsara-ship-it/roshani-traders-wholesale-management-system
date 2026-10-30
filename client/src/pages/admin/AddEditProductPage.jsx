import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../../services/api';
import { ToastContext } from '../../context/ToastContext';
import AdminSidebar from '../../components/AdminSidebar';
import { 
  Package, 
  ArrowLeft, 
  Save, 
  Tag, 
  DollarSign, 
  Layers, 
  ShieldAlert, 
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';

export default function AddEditProductPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showSuccess, showError } = useContext(ToastContext);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: 450,
    MOQ: 10,
    stock: 100,
    brand: 'Roshani Traders',
    image: '',
    status: 'active',
    availability: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      if (res.data.success) {
        setCategories(res.data.categories || []);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/products/${id}`);
      if (res.data.success && res.data.product) {
        const p = res.data.product;
        setFormData({
          name: p.name || '',
          category: p.category?._id || p.category || '',
          description: p.description || '',
          price: p.price || 0,
          MOQ: p.MOQ || 1,
          stock: p.stock ?? 100,
          brand: p.brand || 'Roshani Traders',
          image: p.image || '',
          status: p.status || 'active',
          availability: p.availability ?? true
        });
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

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
          showSuccess('Product image processed!');
        };
        img.onerror = () => {
          setFormData(prev => ({ ...prev, image: reader.result }));
          showSuccess('Product image attached!');
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
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
        availability: formData.status === 'active'
      };

      if (isEdit) {
        const res = await API.put(`/products/${id}`, payload);
        if (res.data.success) {
          showSuccess('Product updated successfully!');
          navigate('/admin/products');
        }
      } else {
        const res = await API.post('/products', payload);
        if (res.data.success) {
          showSuccess('New product added successfully to wholesale catalogue!');
          navigate('/admin/products');
        }
      }
    } catch (err) {
      console.error('Submit product error:', err);
      showError(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar activeTab="products" />

      <div className="flex-1 p-6 md:p-10 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/products"
              className="p-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 text-slate-300 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Product Management</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                {isEdit ? 'Edit Product Details' : 'Add New Three-Wheeler Part'}
              </h1>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent mb-3"></div>
            <p className="text-sm">Loading product data...</p>
          </div>
        ) : (
          <div className="max-w-4xl bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6 text-sm">
              
              {/* Basic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="font-bold text-slate-300 flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-400" /> Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Three Wheeler Side Mirror / Bajaj RE Bumper"
                    className="w-full bg-slate-950 text-white p-3.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-slate-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" /> Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-slate-950 text-white p-3.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-slate-300 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-400" /> Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g. Roshani Pro / OEM"
                    className="w-full bg-slate-950 text-white p-3.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Price, MOQ, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                <div className="space-y-2">
                  <label className="font-bold text-slate-300 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" /> Wholesale Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="1"
                    className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-amber-400 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> MOQ (Min Order Qty) *
                  </label>
                  <input
                    type="number"
                    name="MOQ"
                    value={formData.MOQ}
                    onChange={handleChange}
                    min="1"
                    className="w-full bg-slate-900 text-amber-300 font-bold p-3 rounded-xl border border-amber-500/40 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-slate-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-400" /> Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Image Upload & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-bold text-slate-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-400" /> Product Image Upload *
                  </label>
                  
                  <div className="flex flex-col gap-3">
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-amber-500/50 bg-slate-950 p-4 rounded-2xl cursor-pointer transition text-center group">
                      <ImageIcon className="w-8 h-8 text-amber-400 group-hover:scale-110 transition mb-1" />
                      <span className="text-xs font-bold text-slate-200">Click to Choose Image File</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Supports PNG, JPG, WEBP, SVG (Max 5MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>

                    {formData.image && (
                      <div className="flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
                        <img
                          src={formData.image}
                          alt="Product Preview"
                          className="w-12 h-12 object-cover rounded-lg border border-slate-700 bg-slate-900"
                        />
                        <div className="flex-1 text-[11px] truncate">
                          <span className="text-emerald-400 font-bold block">✓ Image Attached</span>
                          <span className="text-slate-400 truncate block">Ready for catalogue display</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                          className="text-xs text-rose-400 hover:underline px-2"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" /> Catalogue Availability Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-slate-950 text-white p-3.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="active">Available (Active in Catalogue)</option>
                    <option value="inactive">Unavailable (Inactive / Deactivated)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="font-bold text-slate-300">Description</label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed specifications, vehicle fitment compatibility, material..."
                  className="w-full bg-slate-950 text-white p-3.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                ></textarea>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
                <Link
                  to="/admin/products"
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs transition"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-amber-500/20"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving Product...' : isEdit ? 'Save Changes' : 'Add Product to Catalogue'}
                </button>
              </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
}
