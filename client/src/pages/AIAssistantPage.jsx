import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { CartContext } from '../context/CartContext';
import Breadcrumbs from '../components/Breadcrumbs';
import { handleImageError } from '../utils/placeholder';
import { getProductImage } from '../utils/productImages';
import {
  Bot,
  Send,
  Sparkles,
  ShoppingBag,
  Eye,
  CornerDownRight,
  ShoppingCart
} from 'lucide-react';

export default function AIAssistantPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am Roshani AI Assistant 🤖 – your Wholesale Three-Wheeler Auto Parts Expert.\n\nI can help you:\n• Search genuine replacement parts for Bajaj RE, Piaggio Ape, TVS King & Mahindra Alfa\n• Check wholesale prices, MOQ, and live warehouse stock\n• Find decorative accessories & alternatives under any budget\n• Auto-build orders and shopping carts!`,
      type: 'text'
    }
  ]);

  const messagesEndRef = useRef(null);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const exampleQuestions = [
    'I need a Bajaj RE bumper',
    'What is the MOQ of brake shoes?',
    'I need 100 brake shoes',
    'Show me decorative items under ₹1000',
    'Give me available alternatives',
    'I need 50 bumpers and 100 side mirrors'
  ];

  const handleSend = async (customText) => {
    const query = customText || input;
    if (!query.trim() || loading) return;

    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const res = await API.post('/ai/chat', { message: query });
      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: res.data.reply,
            products: res.data.products || [],
            quoteDraft: res.data.quoteDraft,
            type: res.data.type || 'text'
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Sorry, I encountered an issue querying the product catalogue database. Please try again.',
          type: 'text'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadQuote = (quoteDraft) => {
    if (quoteDraft && quoteDraft.items) {
      quoteDraft.items.forEach((item) => {
        addToCart({ _id: item.product, name: item.productName, price: item.price, MOQ: item.moq }, item.effectiveQty);
      });
      navigate('/cart');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={[{ label: 'AI Auto Parts Assistant', path: '/ai-assistant' }]} />

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold border border-amber-500/40">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>ROSHANI AI ASSISTANT • THREE WHEELER EXPERT</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Wholesale Three Wheeler Auto Parts Expert</h1>
        <p className="text-xs text-slate-400">
          Ask natural-language questions to search parts, check MOQ, calculate totals, or explore compatible alternatives.
        </p>
      </div>

      {/* Example Prompts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {exampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs p-3 rounded-xl border border-slate-800 text-left transition-colors font-medium flex items-center justify-between"
          >
            <span className="line-clamp-2">"{q}"</span>
          </button>
        ))}
      </div>

      {/* Main Chat Interface Container */}
      <div className="bg-slate-900 rounded-3xl border border-amber-500/30 overflow-hidden shadow-2xl h-[650px] flex flex-col">
        {/* Header Bar */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Roshani AI Expert</h3>
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Connected to Roshani Traders Live Catalog
              </p>
            </div>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 rounded-br-none font-medium'
                    : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-line text-xs sm:text-sm">{msg.text}</p>
              </div>

              {/* Product Recommendations Cards Grid */}
              {msg.products && msg.products.length > 0 && (
                <div className="mt-4 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {msg.products.map((p) => (
                    <div
                      key={p.id}
                      className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-3.5 flex flex-col justify-between space-y-3 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 rounded-xl bg-[#F3F5F7] p-1.5 flex items-center justify-center shrink-0 border border-slate-700/50 shadow-sm overflow-hidden">
                          <img
                            src={getProductImage(p)}
                            alt={p.name}
                            onError={handleImageError}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded">
                            {p.category}
                          </span>
                          <h4 className="font-bold text-white text-xs mt-1 truncate">{p.name}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">Brand: {p.brand}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-400 text-[10px] block">Wholesale Price</span>
                          <span className="font-extrabold text-emerald-400">₹{p.price}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">MOQ</span>
                          <span className="font-extrabold text-amber-400">{p.moq || p.MOQ} Pcs</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => navigate(`/products/${p.id}`)}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 rounded-xl border border-slate-700 flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                        <button
                          onClick={() => addToCart({ _id: p.id, name: p.name, price: p.price, MOQ: p.moq || p.MOQ }, p.moq || p.MOQ)}
                          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 shadow-sm"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Cart Assistant Summary Action */}
              {msg.quoteDraft && (
                <div className="mt-4 w-full max-w-xl">
                  <div className="bg-slate-950 border border-amber-500/40 p-4 rounded-2xl space-y-3">
                    <h4 className="font-extrabold text-white text-xs flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-amber-400" /> Cart Summary Ready
                    </h4>
                    <p className="text-xs text-slate-300">
                      Estimated Amount: <strong className="text-emerald-400">₹{msg.quoteDraft.totalEstimated.toLocaleString()}</strong>
                    </p>
                    <button
                      onClick={() => handleLoadQuote(msg.quoteDraft)}
                      className="w-full bg-gradient-to-r from-amber-500 to-emerald-500 hover:brightness-110 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
                    >
                      <CornerDownRight className="w-4 h-4" /> Add Items to Shopping Cart & Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic bg-slate-950 p-4 rounded-2xl max-w-xs">
              <Bot className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Querying database catalog...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Bajaj RE parts, side mirrors under 500, brake shoe MOQ, or 50 bumpers..."
              className="flex-1 bg-slate-900 text-white text-xs sm:text-sm px-4 py-3.5 rounded-2xl border border-slate-800 focus:border-amber-500 focus:outline-none placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-3.5 rounded-2xl font-bold text-xs disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Send className="w-4 h-4" /> Send Query
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
