/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

export default function AiConsultant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: 'Hello, I am C.A.B Company’s Chief AI Consulting Engineer. How may I assist you with modern farming calculations, organic fertilization, drip irrigation loops, or custom reverse osmosis setups today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Server connection failed');
      }

      const botMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'bot',
        text: data.text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError('Connection interrupted. Please verify your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const presetQuestions = [
    'Explain your reverse osmosis process.',
    'Tell me about greenhouse CEA settings.',
    'How do I calibrate a solar drip irrigation loop?',
    'What organic fertilizer fits maize farming?'
  ];

  return (
    <div className="fixed bottom-24 right-6 z-40 select-none">
      
      {/* 1. FLOATING CHAT WINDOW CONTAINER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-96 max-w-[calc(100vw-32px)] h-[550px] bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden flex flex-col justify-between"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-green to-brand-green-dark p-4 flex justify-between items-center text-white">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center relative">
                  <Bot size={18} />
                  <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-brand-blue-sky animate-ping" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold tracking-wide flex items-center">
                    CAB AI Consultant
                    <Sparkles size={12} className="text-brand-blue-sky ml-1.5 animate-pulse" />
                  </h4>
                  <p className="text-[10px] text-white/70">Expert Agronomic & Water Telemetry</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body Scroll Container */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50/50">
              
              {messages.map((msg) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div key={msg.id} className={`flex ${isBot ? 'justify-start' : 'justify-end'} items-start space-x-2`}>
                    {isBot && (
                      <div className="w-8 h-8 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green mt-1 flex-shrink-0">
                        <Bot size={16} />
                      </div>
                    )}
                    <div className={`p-3.5 rounded-2xl max-w-[80%] text-xs leading-relaxed shadow-sm ${
                      isBot 
                        ? 'bg-white text-brand-dark border border-black/5 rounded-tl-none' 
                        : 'bg-brand-green text-white rounded-tr-none'
                    }`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <span className={`block text-[8px] text-right mt-1.5 ${isBot ? 'text-brand-dark/40' : 'text-white/60'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Loader */}
              {isLoading && (
                <div className="flex justify-start items-start space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green flex-shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white text-brand-dark border border-black/5 p-3.5 rounded-2xl rounded-tl-none flex space-x-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* Error warning */}
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl flex items-center space-x-2 text-xs">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Suggestions chips on startup or reset */}
              {!isLoading && messages.length < 3 && (
                <div className="space-y-2 pt-2">
                  <p className="text-[10px] text-brand-dark/40 font-bold uppercase tracking-wider">Suggested Topics:</p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {presetQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="text-left p-2 rounded-xl bg-white border border-black/5 text-[11px] text-brand-dark/80 hover:border-brand-green hover:text-brand-green transition"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
              className="p-3.5 bg-white border-t border-black/5 flex items-center space-x-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask our chief agronomist..."
                className="flex-grow px-3.5 py-2 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-green text-xs"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-xl bg-brand-green text-white hover:bg-brand-green-dark disabled:opacity-40 transition flex items-center justify-center cursor-pointer"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CHAT TRIGGER BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(prev => !prev)}
        className="p-4 rounded-full bg-gradient-to-r from-brand-green to-brand-green-dark text-white shadow-2xl flex items-center justify-center relative hover:brightness-110 cursor-pointer border border-white/10"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-blue-sky border-2 border-white flex items-center justify-center text-[8px] font-black animate-pulse" />
        )}
      </motion.button>
    </div>
  );
}
