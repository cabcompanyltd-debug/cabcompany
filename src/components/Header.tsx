/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, Mail, Globe, ArrowRight, Menu, X, 
  ChevronDown, Leaf, Droplet, Users, Shield, 
  Briefcase, MessageSquare, Compass, ClipboardList, LogIn,
  Facebook, Linkedin, Instagram, Youtube
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  user: any;
  onLogout: () => void;
  cartCount: number;
}

export default function Header({ currentView, onNavigate, user, onLogout, cartCount }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<'ag' | 'water' | null>(null);

  const navigationItems = [
    { name: 'Home', view: 'home' },
    { name: 'About Us', view: 'about' },
    { name: 'Services', view: 'services' },
    { name: 'Products', view: 'products' },
    { name: 'Projects', view: 'projects' },
    { name: 'Real Estate', view: 'real-estate' },
    { name: 'Blog', view: 'blog' },
    { name: 'Careers', view: 'careers' },
    { name: 'Contact', view: 'contact' },
  ];

  return (
    <>
      {/* 1. TOP BAR */}
      <div className="bg-gradient-to-r from-brand-blue-ocean to-brand-blue text-white/90 text-xs py-2 px-4 border-b border-white/10 relative z-50 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5">
              <Phone size={12} className="text-brand-blue-aqua" />
              <span>+1 (929) 765-5743 | +233 53 255 2533</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Mail size={12} className="text-brand-blue-aqua" />
              <a href="mailto:info@cabcompanyltd.com" className="hover:text-white transition">info@cabcompanyltd.com</a>
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <button 
              onClick={() => onNavigate('contact', { tab: 'quote' })}
              className="hover:text-brand-blue-sky transition flex items-center space-x-1"
            >
              <ClipboardList size={12} />
              <span>Request Quote</span>
            </button>
            <span className="text-white/30">|</span>
            <button 
              onClick={() => onNavigate('portal')} 
              className="hover:text-brand-blue-sky transition flex items-center space-x-1 font-medium text-brand-blue-aqua"
            >
              {user ? (
                <>
                  <Users size={12} />
                  <span>Dashboard ({user.name})</span>
                </>
              ) : (
                <>
                  <LogIn size={12} />
                  <span>Client & Admin Portal</span>
                </>
              )}
            </button>
            <span className="text-white/30">|</span>
            <span className="flex items-center space-x-1 text-white/70">
              <Globe size={12} />
              <span>EN</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (STICKY GLASSMORPHIC) */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-black/5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex justify-between items-center gap-x-2">
          
          {/* Logo Brand */}
          <div 
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className="flex-shrink-0 cursor-pointer group"
          >
            <div className="relative w-44 xl:w-56 h-20 flex items-center justify-start">
              <img 
                src="/ImageAssets/logo.png" 
                alt="C.A.B Company Logo" 
                className="w-full h-full object-contain group-hover:scale-105 transition"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden xl:flex items-center justify-center flex-grow gap-x-0.5 xl:gap-x-1 overflow-hidden">
            {navigationItems.map((item) => {
              const isActive = currentView === item.view;

              // Mega Menu trigger checking
              if (item.view === 'services') {
                return (
                  <div 
                    key={item.name}
                    className="relative flex-shrink-0"
                    onMouseEnter={() => setActiveMegaMenu('ag')}
                    onMouseLeave={() => setActiveMegaMenu(null)}
                  >
                    <button
                      onClick={() => onNavigate('services')}
                      style={{ 
                        paddingLeft: 'clamp(6px, 0.5vw, 14px)', 
                        paddingRight: 'clamp(6px, 0.5vw, 14px)',
                        fontSize: 'clamp(12.5px, 0.8vw, 15.5px)'
                      }}
                      className={`py-2 rounded-lg font-bold transition flex items-center space-x-1 whitespace-nowrap flex-shrink-0 ${
                        isActive ? 'text-brand-blue bg-brand-blue-sky/40' : 'text-brand-dark/80 hover:text-brand-blue hover:bg-black/5'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown size={13} className={`transform transition-transform ${activeMegaMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Mega Menu Dropdown */}
                    <AnimatePresence>
                      {activeMegaMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 15 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-1/2 -translate-x-1/2 mt-1 w-[550px] bg-white rounded-2xl shadow-xl border border-black/5 p-6 grid grid-cols-2 gap-6 z-50"
                        >
                          <div>
                            <div className="flex items-center space-x-2 text-brand-blue font-bold text-xs uppercase tracking-widest mb-4 border-b pb-2 border-brand-blue-sky/40">
                              <Leaf size={14} />
                              <span>Agriculture Solutions</span>
                            </div>
                            <ul className="space-y-3">
                              <li>
                                <button 
                                  onClick={() => { onNavigate('services', { category: 'agriculture' }); setActiveMegaMenu(null); }}
                                  className="text-left group"
                                >
                                  <p className="text-sm font-bold text-brand-dark group-hover:text-brand-blue transition">Crop & Greenhouse Farming</p>
                                  <p className="text-xs text-brand-dark/60">Automated micro-climate glasshouses.</p>
                                </button>
                              </li>
                              <li>
                                <button 
                                  onClick={() => { onNavigate('services', { category: 'agriculture' }); setActiveMegaMenu(null); }}
                                  className="text-left group"
                                >
                                  <p className="text-sm font-bold text-brand-dark group-hover:text-brand-blue transition">Precision Irrigation</p>
                                  <p className="text-xs text-brand-dark/60">Weather-synced low evaporation loops.</p>
                                </button>
                              </li>
                            </ul>
                          </div>

                          <div>
                            <div className="flex items-center space-x-2 text-brand-blue-ocean font-bold text-xs uppercase tracking-widest mb-4 border-b pb-2 border-brand-blue-sky/30">
                              <Droplet size={14} />
                              <span>Water Technologies</span>
                            </div>
                            <ul className="space-y-3">
                              <li>
                                <button 
                                  onClick={() => { onNavigate('services', { category: 'water' }); setActiveMegaMenu(null); }}
                                  className="text-left group"
                                >
                                  <p className="text-sm font-bold text-brand-dark group-hover:text-brand-blue-ocean transition">Industrial Purification</p>
                                  <p className="text-xs text-brand-dark/60">High recovery reverse osmosis systems.</p>
                                </button>
                              </li>
                              <li>
                                <button 
                                  onClick={() => { onNavigate('services', { category: 'water' }); setActiveMegaMenu(null); }}
                                  className="text-left group"
                                >
                                  <p className="text-sm font-bold text-brand-dark group-hover:text-brand-blue-ocean transition">Absolute Bottled Water</p>
                                  <p className="text-xs text-brand-dark/60">Crisp, alkaline mineral re-balanced bottled water.</p>
                                </button>
                              </li>
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <button
                  key={item.name}
                  onClick={() => onNavigate(item.view)}
                  style={{ 
                    paddingLeft: 'clamp(6px, 0.5vw, 14px)', 
                    paddingRight: 'clamp(6px, 0.5vw, 14px)',
                    fontSize: 'clamp(12.5px, 0.8vw, 15.5px)'
                  }}
                  className={`py-2 rounded-lg font-bold transition whitespace-nowrap flex-shrink-0 ${
                    isActive ? 'text-brand-blue bg-brand-blue-sky/40' : 'text-brand-dark/80 hover:text-brand-blue hover:bg-black/5'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Header Action Buttons (Desktop) */}
          <div className="hidden xl:flex items-center flex-shrink-0">
            {/* Quick Consultation CTA */}
            <button 
              onClick={() => onNavigate('contact', { tab: 'quote' })}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-green to-brand-blue text-white font-bold text-sm hover:shadow-md hover:brightness-110 active:scale-98 transition flex items-center space-x-1.5 cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              <span>Instant Quote</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="xl:hidden p-2 rounded-xl text-brand-dark hover:bg-black/5 transition flex-shrink-0"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* 3. MOBILE MENU SIDE-SLIDE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Dark overlay backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />

            {/* Sliding Drawer Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex justify-between items-center mb-8">
                   <div className="flex items-center">
                    <div className="relative w-44 h-20 flex items-center justify-center">
                      <img 
                        src="/ImageAssets/logo.png" 
                        alt="C.A.B Logo" 
                        className="w-44 h-20 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-black/5 transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col space-y-3">
                  {navigationItems.map((item) => {
                    if (item.view === 'services') {
                      return (
                        <div key={item.name} className="flex flex-col">
                          <button
                            onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition flex items-center justify-between ${
                              currentView === 'services' 
                                ? 'text-brand-blue bg-brand-blue-sky/40' 
                                : 'text-brand-dark/80 hover:text-brand-blue hover:bg-black/5'
                            }`}
                          >
                            <span>{item.name}</span>
                            <ChevronDown size={14} className={`transform transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {mobileServicesOpen && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden pl-6 pr-2 py-1.5 space-y-2.5 flex flex-col border-l-2 border-brand-blue/30 ml-4 mt-1"
                              >
                                <button 
                                  onClick={() => { onNavigate('services', { category: 'agriculture' }); setMobileMenuOpen(false); }}
                                  className="text-left text-xs font-bold text-brand-dark/80 hover:text-brand-blue transition"
                                >
                                  Crop & Greenhouse Farming
                                </button>
                                <button 
                                  onClick={() => { onNavigate('services', { category: 'agriculture' }); setMobileMenuOpen(false); }}
                                  className="text-left text-xs font-bold text-brand-dark/80 hover:text-brand-blue transition"
                                >
                                  Precision Irrigation
                                </button>
                                <button 
                                  onClick={() => { onNavigate('services', { category: 'water' }); setMobileMenuOpen(false); }}
                                  className="text-left text-xs font-bold text-brand-dark/80 hover:text-brand-blue transition"
                                >
                                  Industrial Purification
                                </button>
                                <button 
                                  onClick={() => { onNavigate('services', { category: 'water' }); setMobileMenuOpen(false); }}
                                  className="text-left text-xs font-bold text-brand-dark/80 hover:text-brand-blue transition"
                                >
                                  Absolute Bottled Water
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          onNavigate(item.view);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition flex items-center justify-between ${
                          currentView === item.view 
                            ? 'text-brand-blue bg-brand-blue-sky/40' 
                            : 'text-brand-dark/80 hover:text-brand-blue hover:bg-black/5'
                        }`}
                      >
                        <span>{item.name}</span>
                        <ArrowRight size={14} className="opacity-50" />
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Footer CTAs */}
              <div className="border-t pt-6 mt-6 space-y-4">
                <button 
                  onClick={() => { onNavigate('portal'); setMobileMenuOpen(false); }}
                  className="w-full py-3 rounded-xl border border-brand-blue/30 text-brand-blue font-bold text-xs flex items-center justify-center space-x-1.5"
                >
                  <LogIn size={14} />
                  <span>{user ? `Dashboard (${user.name})` : 'Client & Admin Portal'}</span>
                </button>
                <button 
                  onClick={() => { onNavigate('contact', { tab: 'quote' }); setMobileMenuOpen(false); }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-green to-brand-blue text-white font-bold text-xs text-center hover:brightness-110 active:scale-98 transition shadow"
                >
                  Request a Free Quote
                </button>
                
                {/* Mobile Social Media Icons */}
                <div className="flex items-center justify-center space-x-4 pt-2">
                  <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-lg bg-black/5 hover:bg-brand-blue/10 flex items-center justify-center text-brand-dark/70 hover:text-brand-blue transition">
                    <Facebook size={14} />
                  </a>
                  <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-lg bg-black/5 hover:bg-brand-blue/10 flex items-center justify-center text-brand-dark/70 hover:text-brand-blue transition">
                    <Linkedin size={14} />
                  </a>
                  <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-lg bg-black/5 hover:bg-brand-blue/10 flex items-center justify-center text-brand-dark/70 hover:text-brand-blue transition">
                    <Instagram size={14} />
                  </a>
                  <a href="#" aria-label="YouTube" className="w-8 h-8 rounded-lg bg-black/5 hover:bg-brand-blue/10 flex items-center justify-center text-brand-dark/70 hover:text-brand-blue transition">
                    <Youtube size={14} />
                  </a>
                </div>

                <div className="text-center text-[10px] text-brand-dark/50">
                  <p>+233 53 255 2533 | info@cabcompanyltd.com</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
