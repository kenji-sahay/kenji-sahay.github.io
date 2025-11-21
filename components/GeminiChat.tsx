import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Cpu, Sparkles } from 'lucide-react';
import { streamChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm the En Garde AI. Ask me about the blog posts, portfolio, or the author's research." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    let fullResponse = "";
    // Placeholder for streaming content
    setMessages(prev => [...prev, { role: 'model', text: "" }]);

    try {
      const stream = streamChatResponse(userMsg.text);
      
      for await (const chunk of stream) {
        if (chunk.text) {
          fullResponse += chunk.text;
          setMessages(prev => {
            const newMsgs = [...prev];
            const lastMsg = newMsgs[newMsgs.length - 1];
            if (lastMsg.role === 'model') {
              lastMsg.text = fullResponse;
            }
            return newMsgs;
          });
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Connection interrupted. Please try again.", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-brand-primary rounded-full text-white shadow-lg shadow-brand-primary/30 hover:scale-110 transition-all z-40 ${isOpen ? 'hidden' : 'flex'} items-center justify-center`}
      >
        <Sparkles size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[90vw] md:w-96 h-[500px] bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-float">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Cpu size={20} className="text-brand-glow" />
              <span className="font-bold text-white text-sm tracking-wide">EN GARDE AI CORE</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-primary text-white rounded-tr-none'
                      : 'bg-slate-800 text-gray-200 rounded-tl-none border border-white/5'
                  } ${msg.isError ? 'border-red-500/50 text-red-200' : ''}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-slate-900">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about RAG or Art..."
                className="w-full bg-slate-800 text-white pl-4 pr-12 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 border border-white/5 text-sm"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-2 top-2 p-1.5 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/80 disabled:opacity-50 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiChat;