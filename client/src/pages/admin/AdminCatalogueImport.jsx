import React, { useState, useEffect, useContext } from 'react';
import API from '../../services/api';
import { ToastContext } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Download,
  Image as ImageIcon,
  DollarSign,
  Package,
  Layers,
  Database,
  FileCode,
  Sparkles,
  Edit2
} from 'lucide-react';

export default function AdminCatalogueImport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [pasteData, setPasteData] = useState('');
  const [importFormat, setImportFormat] = useState('json');
  const [importResult, setImportResult] = useState(null);
  const [editingImageItem, setEditingImageItem] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState('');

  const { showSuccess, showError } = useContext(ToastContext);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await API.get('/catalogue/report');
      if (res.data.success) {
        setReport(res.data.report);
      }
    } catch (err) {
      showError('Failed to load catalogue validation report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleDownloadTemplate = () => {
    window.open('/api/catalogue/template', '_blank');
  };

  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      // Split by comma ignoring commas inside quotes
      const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
      const obj = {};
      headers.forEach((h, idx) => {
        let val = values[idx] ? values[idx].trim().replace(/^"|"$/g, '') : '';
        obj[h] = val;
      });
      result.push(obj);
    }
    return result;
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!pasteData.trim()) {
      showError('Please paste or enter CSV/JSON catalogue data to import.');
      return;
    }

    let parsedProducts = [];
    try {
      if (importFormat === 'json') {
        parsedProducts = JSON.parse(pasteData);
      } else {
        parsedProducts = parseCSV(pasteData);
      }
    } catch (err) {
      showError(`Invalid ${importFormat.toUpperCase()} format syntax: ${err.message}`);
      return;
    }

    if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
      showError('No valid product array could be extracted from input');
      return;
    }

    setImporting(true);
    setImportResult(null);

    try {
      const res = await API.post('/catalogue/import', { products: parsedProducts });
      if (res.data.success) {
        setImportResult(res.data);
        showSuccess(res.data.message);
        setPasteData('');
        fetchReport();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to import catalogue');
    } finally {
      setImporting(false);
    }
  };

  const handleUpdateProductImage = async (productId) => {
    if (!newImageUrl.trim()) return;
    try {
      const res = await API.put(`/products/${productId}`, { image: newImageUrl.trim() });
      if (res.data.success) {
        showSuccess('Product image updated successfully!');
        setEditingImageItem(null);
        setNewImageUrl('');
        fetchReport();
      }
    } catch (err) {
      showError('Failed to update product image');
    }
  };

  if (loading) return <LoadingSpinner message="Generating Catalogue Validation Report..." />;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Catalogue Sync & Import Engine
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Import, sync, and validate the Roshani Traders WhatsApp Product Catalogue with zero duplicate records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchReport}
            className="p-3 bg-slate-900 text-slate-300 hover:text-white rounded-xl border border-slate-800 flex items-center gap-2 text-xs font-bold transition-all"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            Refresh Quality Report
          </button>

          <button
            onClick={handleDownloadTemplate}
            className="p-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold flex items-center gap-2 text-xs transition-all shadow-lg shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            Download CSV Template
          </button>
        </div>
      </div>

      {/* Validation Quality Report Cards (Step 16) */}
      {report && (
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Catalogue Data Quality Report
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Total Products</span>
                <Package className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl font-black text-white">{report.totalProducts}</p>
              <p className="text-[11px] text-cyan-400 font-semibold">{report.activeProducts} Active</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Categories</span>
                <Layers className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-black text-white">{report.totalCategories}</p>
              <p className="text-[11px] text-purple-400 font-semibold">Organized</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">With Images</span>
                <ImageIcon className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-emerald-400">{report.productsWithImages}</p>
              <p className="text-[11px] text-slate-400 font-semibold">{report.productsWithoutImages} Missing Image</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">With Price</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-amber-400">{report.productsWithPrice}</p>
              <p className="text-[11px] text-slate-400 font-semibold">{report.productsWithoutPrice} Contact for Price</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">With MOQ</span>
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl font-black text-cyan-400">{report.productsWithMOQ}</p>
              <p className="text-[11px] text-cyan-400 font-semibold">Verified MOQ</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Duplicates</span>
                <Sparkles className="w-4 h-4 text-pink-400" />
              </div>
              <p className="text-2xl font-black text-white">0</p>
              <p className="text-[11px] text-emerald-400 font-semibold">Auto Deduplicated</p>
            </div>
          </div>
        </div>
      )}

      {/* Importer Form Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-cyan-400" /> WhatsApp Catalogue Importer & Synchronizer
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Paste product data in CSV or JSON format to automatically populate or update the website catalogue.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setImportFormat('json')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                importFormat === 'json' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              JSON Array
            </button>
            <button
              onClick={() => setImportFormat('csv')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                importFormat === 'csv' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              CSV Text
            </button>
          </div>
        </div>

        <form onSubmit={handleImportSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Paste {importFormat.toUpperCase()} Catalogue Content
            </label>
            <textarea
              rows={8}
              value={pasteData}
              onChange={(e) => setPasteData(e.target.value)}
              placeholder={
                importFormat === 'json'
                  ? `[\n  {\n    "name": "Bajaj RE Front Bumper",\n    "category": "Bumpers",\n    "price": 850,\n    "MOQ": 10,\n    "stock": 250,\n    "brand": "Roshani Pro",\n    "image": "https://example.com/image.jpg"\n  }\n]`
                  : `name,category,subcategory,brand,description,price,MOQ,stock,availability,compatible_models,image,sku\n"Bajaj RE Front Bumper","Bumpers","Front","Roshani Pro","Heavy duty bumper",850,10,250,true,"Bajaj RE","https://example.com/image.jpg","SKU-001"`
              }
              className="w-full bg-slate-950 text-slate-200 font-mono text-xs p-4 rounded-2xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Existing products with matching Name or SKU will be updated automatically without duplicates.
            </p>

            <button
              type="submit"
              disabled={importing}
              className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              {importing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Synchronizing Catalogue...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Import & Sync Catalogue
                </>
              )}
            </button>
          </div>
        </form>

        {importResult && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-sm text-white">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> {importResult.message}
            </div>
            <p>• Products Inserted: <strong>{importResult.stats.inserted}</strong></p>
            <p>• Products Updated (Duplicates Merged): <strong>{importResult.stats.updated}</strong></p>
          </div>
        )}
      </div>

      {/* Items Missing Images Table (Step 16 Action) */}
      {report && report.missingImagesList && report.missingImagesList.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" /> Products Missing Catalogue Images
              </h3>
              <p className="text-xs text-slate-400">Add or update image URLs directly to complete the product listing.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">MOQ</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {report.missingImagesList.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-white">{item.name}</td>
                    <td className="p-3 text-cyan-400">{item.categoryName}</td>
                    <td className="p-3 text-slate-300">{item.price > 0 ? `₹${item.price}` : 'Contact for price'}</td>
                    <td className="p-3 text-slate-300">{item.MOQ} units</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setEditingImageItem(item._id);
                          setNewImageUrl('');
                        }}
                        className="px-3 py-1.5 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 font-bold rounded-lg transition-all"
                      >
                        Set Image URL
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Image Modal */}
      {editingImageItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white">Update Product Image URL</h3>
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-slate-900 text-white text-xs p-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setEditingImageItem(null)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateProductImage(editingImageItem)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl"
              >
                Save Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
