import React, { useState, useEffect, useContext } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ToastContext } from '../../context/ToastContext';
import API from '../../services/api';
import { MessageSquare, Bot, Sparkles, CheckCircle2, Clock, X, AlertCircle } from 'lucide-react';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false);

  const { showSuccess, showError } = useContext(ToastContext);

  const fetchEnquiries = async () => {
    try {
      const res = await API.get('/enquiries');
      if (res.data.success) {
        setEnquiries(res.data.enquiries);
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      const res = await API.put(`/enquiries/${enquiryId}/status`, { status: newStatus });
      if (res.data.success) {
        showSuccess(`Enquiry status updated to ${newStatus}`);
        fetchEnquiries();
      }
    } catch (err) {
      showError('Failed to update status.');
    }
  };

  const handleGenerateAISummary = async (enquiryId) => {
    setAiGenerating(true);
    try {
      const res = await API.post(`/enquiries/${enquiryId}/ai-summary`);
      if (res.data.success) {
        showSuccess('AI Enquiry Summary generated!');
        fetchEnquiries();
        if (selectedEnquiry && selectedEnquiry._id === enquiryId) {
          setSelectedEnquiry(res.data.enquiry);
        }
      }
    } catch (err) {
      showError('Failed to generate AI summary.');
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-extrabold text-white">Customer Enquiries & AI Summarizer</h1>
          <p className="text-xs text-slate-400 mt-1">Review contact inquiries with automated AI intent breakdown and suggested manager response points</p>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching customer enquiries..." />
        ) : (
          <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Customer & Business</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">AI Priority</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">AI Summary & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {enquiries.map((e) => (
                    <tr key={e._id} className="hover:bg-slate-900/50">
                      <td className="p-4 text-slate-300">
                        {new Date(e.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{e.name}</div>
                        <div className="text-[11px] text-cyan-400 font-semibold">{e.businessName}</div>
                        <div className="text-[10px] text-slate-400">{e.mobile} • {e.email}</div>
                      </td>
                      <td className="p-4 font-semibold text-slate-200 max-w-xs truncate">{e.subject}</td>
                      <td className="p-4">
                        {e.aiSummary?.priority === 'High' ? (
                          <span className="bg-rose-950 text-rose-300 px-2 py-0.5 rounded text-[10px] font-bold border border-rose-500/40">🔥 High Urgency</span>
                        ) : (
                          <span className="bg-amber-950 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-500/40">Medium</span>
                        )}
                      </td>
                      <td className="p-4">
                        <select
                          value={e.status}
                          onChange={(ev) => handleStatusChange(e._id, ev.target.value)}
                          className="bg-slate-900 text-white text-xs p-1.5 rounded-lg border border-slate-800 focus:border-cyan-500 font-semibold"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedEnquiry(e)}
                          className="bg-gradient-to-r from-amber-500 to-cyan-500 hover:brightness-110 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 ml-auto shadow"
                        >
                          <Bot className="w-3.5 h-3.5" /> AI Summary & View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detailed Modal with AI Summary */}
        {selectedEnquiry && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-extrabold text-white text-base">Enquiry Detail & AI Breakdown</h3>
                </div>
                <button onClick={() => setSelectedEnquiry(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Original Message */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>From: <strong className="text-white">{selectedEnquiry.name}</strong> ({selectedEnquiry.businessName})</span>
                  <span>{new Date(selectedEnquiry.createdAt).toLocaleString()}</span>
                </div>
                <p className="font-bold text-cyan-400 mt-1">Subject: {selectedEnquiry.subject}</p>
                <div className="p-3 bg-slate-900 rounded-xl text-slate-200 mt-2 border border-slate-800/80 leading-relaxed">
                  "{selectedEnquiry.message}"
                </div>
              </div>

              {/* AI Generated Intelligence Card */}
              <div className="glass-panel p-5 rounded-2xl border border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-amber-950/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-amber-400" />
                    <h4 className="font-extrabold text-amber-300 text-sm">AI Executive Summary</h4>
                  </div>
                  <button
                    onClick={() => handleGenerateAISummary(selectedEnquiry._id)}
                    disabled={aiGenerating}
                    className="text-[11px] bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded-lg hover:bg-amber-400 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> {aiGenerating ? 'Regenerating...' : 'Regenerate AI'}
                  </button>
                </div>

                {selectedEnquiry.aiSummary ? (
                  <div className="space-y-3 text-xs">
                    <p className="text-slate-200 font-medium leading-relaxed">
                      {selectedEnquiry.aiSummary.summary}
                    </p>

                    <div className="grid grid-cols-2 gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Identified Parts Requested</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedEnquiry.aiSummary.requestedItems?.map((item, i) => (
                            <span key={i} className="bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded font-bold">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Extracted Quantity</span>
                        <span className="text-amber-400 font-bold mt-1 block">{selectedEnquiry.aiSummary.quantity}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <span className="font-bold text-white block">Suggested Manager Action Points:</span>
                      <ul className="space-y-1 text-slate-300 list-disc list-inside">
                        {selectedEnquiry.aiSummary.suggestedResponsePoints?.map((pt, idx) => (
                          <li key={idx} className="leading-relaxed">{pt}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleGenerateAISummary(selectedEnquiry._id)}
                    disabled={aiGenerating}
                    className="w-full bg-amber-500 text-slate-950 font-bold py-2 rounded-xl text-xs"
                  >
                    Generate AI Summary Now
                  </button>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold"
                >
                  Close Summary
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
