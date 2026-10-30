import React, { useState, useRef, useEffect, useContext } from 'react';
import { Bot, X, Send, Sparkles, ShoppingBag, Eye, ArrowRight, CornerDownRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { CartContext } from '../context/CartContext';
import { handleImageError } from '../utils/placeholder';
import { getProductImage } from '../utils/productImages';

export default function FloatingAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am Roshani AI Assistant 🤖. Ask me about three-wheeler auto parts, MOQ, wholesale prices, vehicle compatibility (Bajaj RE, Piaggio Ape, TVS King), or order items!',
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
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
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
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Sorry, I encountered an issue querying the product database. Please try again.',
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
      setIsOpen(false);
      navigate('/cart');
    }
  };

  return (
    <>
      {/* Floating Toggle Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2.5 px-4 py-3.5 rounded-full shadow-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
            isOpen
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 text-slate-950 shadow-amber-500/25 ring-4 ring-amber-500/20'
          }`}
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <>
              <Bot className="w-6 h-6 text-slate-950" />
              <span className="hidden sm:inline text-sm font-extrabold tracking-wide">Roshani AI Parts</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-950 border border-emerald-400 animate-ping"></span>
            </>
          )}
        </button>
      </div>

      {/* Floating Modal Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[550px] max-h-[80vh] glass-panel rounded-3xl border border-amber-500/30 shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-slate-900/90 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  Roshani AI Expert
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h3>
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Database Connected
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Chips */}
          <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
            <button
              onClick={() => handleSend('Bajaj RE Bumper')}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 border border-slate-700"
            >
              🔍 Bajaj RE Bumper
            </button>
            <button
              onClick={() => handleSend('Side mirror under 500')}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 border border-slate-700"
            >
              💰 Mirrors &lt; ₹500
            </button>
            <button
              onClick={() => handleSend('What is the MOQ of brake shoes?')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 border border-slate-700"
            >
              📋 Brake Shoe MOQ
            </button>
          </div>

          {/* Chat Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Inline Product Recommendation Cards */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3 w-full space-y-2">
                    {msg.products.map((p) => (
                      <div
                        key={p.id}
                        className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-xl p-2.5 flex items-center gap-3 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg bg-[#F3F5F7] p-1 flex items-center justify-center shrink-0 border border-slate-750 overflow-hidden shadow-sm">
                          <img
                            src={getProductImage(p)}
                            alt={p.name}
                            onError={handleImageError}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white text-xs truncate">{p.name}</h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span className="text-emerald-400 font-bold">₹{p.price}</span>
                            <span>•</span>
                            <span>MOQ: {p.moq || p.MOQ} Pcs</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setIsOpen(false);
                              navigate(`/products/${p.id}`);
                            }}
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => addToCart({ _id: p.id, name: p.name, price: p.price, MOQ: p.moq || p.MOQ }, p.moq || p.MOQ)}
                            className="p-1.5 text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg font-bold"
                            title="Add to Cart"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Cart Load Action */}
                {msg.quoteDraft && (
                  <div className="mt-3 w-full">
                    <button
                      onClick={() => handleLoadQuote(msg.quoteDraft)}
                      className="w-full bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:brightness-110 shadow-lg"
                    >
                      <CornerDownRight className="w-4 h-4" />
                      Add Items to Cart (₹{msg.quoteDraft.totalEstimated.toLocaleString()})
                    </button>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic bg-slate-800/50 p-3 rounded-2xl max-w-[70%]">
                <Bot className="w-4 h-4 text-amber-400 animate-spin" />
                <span>Searching live database catalog...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-900 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about auto parts, MOQ, price or orders..."
                className="flex-1 bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 p-2.5 rounded-xl disabled:opacity-50 font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
