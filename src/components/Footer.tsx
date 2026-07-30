/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Mail, Phone, MapPin, Globe, ArrowUp, Send, Check,
  Facebook, Instagram, Linkedin, Youtube, Shield
} from 'lucide-react';
import { submitContactMessage } from '../lib/api';

interface FooterProps {
  onNavigate: (view: string, params?: any) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(true);

  const handleSubmitNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await submitContactMessage({
        name: 'Newsletter Subscriber',
        email,
        subject: 'Newsletter Signup',
        department: 'Marketing & CRM',
        message: 'Subscribed to CAB Company Ltd weekly agronomy and water technology newsletters.'
      });
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-dark text-white pt-20 pb-10 relative overflow-hidden">
      {/* Subtle organic green radial background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* UPPER FOOTER: BRAND & NEWSLETTER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/ImageAssets/logo.png" 
                alt="C.A.B Logo" 
                className="w-12 h-12 object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="text-xl font-black tracking-wide">C.A.B COMPANY LTD</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm">
              Global leaders in precision agriculture, smart irrigation loops, and industrial reverse osmosis water purification. Committed to building secure food and water systems.
            </p>
            <div className="flex items-center space-x-3">
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-gradient-to-r hover:from-brand-green hover:to-brand-blue flex items-center justify-center hover:text-white text-white/70 transition">
                <Facebook size={16} />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-gradient-to-r hover:from-brand-green hover:to-brand-blue flex items-center justify-center hover:text-white text-white/70 transition">
                <Linkedin size={16} />
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-gradient-to-r hover:from-brand-green hover:to-brand-blue flex items-center justify-center hover:text-white text-white/70 transition">
                <Instagram size={16} />
              </a>
              <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-gradient-to-r hover:from-brand-green hover:to-brand-blue flex items-center justify-center hover:text-white text-white/70 transition">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold">Subscribe to Our Enterprise Insights</h3>
            <p className="text-sm text-white/60 max-w-xl">
              Get weekly scientific analyses, modern farming nutrient recipes, global water quality alerts, and corporate updates directly from our chief agronomists.
            </p>
            <form onSubmit={handleSubmitNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your corporate email address..."
                className="flex-grow px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-brand-blue text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-green to-brand-blue hover:brightness-110 text-white font-bold text-sm transition flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
              >
                {subscribed ? (
                  <>
                    <Check size={16} className="text-white" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Join Newsletter</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* MIDDLE FOOTER: 4 COLUMNS LINKS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16">
          
          {/* Services */}
          <div className="space-y-4">
            <button 
              onClick={() => onNavigate('agriculture-sector')}
              className="text-xs font-black uppercase tracking-widest text-brand-blue hover:text-white transition text-left cursor-pointer focus:outline-none"
            >
              Agriculture Sector
            </button>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><button onClick={() => onNavigate('crop-production')} className="hover:text-brand-blue transition cursor-pointer">Crop Production</button></li>
              <li><button onClick={() => onNavigate('greenhouse-farming')} className="hover:text-brand-blue transition cursor-pointer">Greenhouse Farming</button></li>
              <li><button onClick={() => onNavigate('precision-irrigation')} className="hover:text-brand-blue transition cursor-pointer">Precision Irrigation</button></li>
              <li><button onClick={() => onNavigate('agronomy-consultancy')} className="hover:text-brand-blue transition cursor-pointer">Agronomy Consultancy</button></li>
            </ul>
          </div>

          {/* Water Technologies */}
          <div className="space-y-4">
            <button 
              onClick={() => onNavigate('water-solutions')}
              className="text-xs font-black uppercase tracking-widest text-brand-blue-sky hover:text-white transition text-left cursor-pointer focus:outline-none"
            >
              Water Solutions
            </button>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><button onClick={() => onNavigate('reverse-osmosis-plants')} className="hover:text-brand-blue-sky transition cursor-pointer">Reverse Osmosis Plants</button></li>
              <li><button onClick={() => onNavigate('bottled-mineral-water')} className="hover:text-brand-blue-sky transition cursor-pointer">Bottled Mineral Water</button></li>
              <li><button onClick={() => onNavigate('wastewater-recycling')} className="hover:text-brand-blue-sky transition cursor-pointer">Wastewater Recycling</button></li>
              <li><button onClick={() => onNavigate('water-quality-testing')} className="hover:text-brand-blue-sky transition cursor-pointer">Water Quality Testing</button></li>
            </ul>
          </div>

          {/* Resources & Portal */}
          <div className="space-y-4">
            <button 
              onClick={() => onNavigate('company-resources')}
              className="text-xs font-black uppercase tracking-widest text-brand-gold hover:text-white transition text-left cursor-pointer focus:outline-none"
            >
              Company Resources
            </button>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><button onClick={() => onNavigate('leadership')} className="hover:text-brand-gold transition cursor-pointer">Our Leadership</button></li>
              <li><button onClick={() => onNavigate('blog')} className="hover:text-brand-gold transition cursor-pointer">Insights Blog</button></li>
              <li><button onClick={() => onNavigate('real-estate')} className="hover:text-brand-gold transition cursor-pointer font-bold text-brand-blue-sky">Real Estate Portfolio</button></li>
              <li><button onClick={() => onNavigate('careers')} className="hover:text-brand-gold transition cursor-pointer">Careers & CSR</button></li>
              <li><button onClick={() => onNavigate('portal')} className="hover:text-brand-gold transition font-bold text-brand-blue-sky cursor-pointer">Secure Client Portal</button></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Headquarters</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="text-brand-blue mt-0.5 flex-shrink-0" />
                <span>C.A.B Headquarters, Anyirawase, Awudome, VR, Ghana</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="text-brand-blue mt-0.5 flex-shrink-0" />
                <span>45 Broad Street, 22nd Floor, New York, NY, USA</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={14} className="text-brand-blue flex-shrink-0" />
                <span>+233 53 255 2533</span>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM FOOTER: LEGAL & FLOATING SCROLL */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 space-y-4 md:space-y-0">
          <div>
            <p>© {new Date().getFullYear()} C.A.B Company Ltd. All rights reserved. Designed with sustainable integrity.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms & Conditions</a>
            <a href="#" className="hover:text-white transition">Cookie Preferences</a>
          </div>
        </div>

      </div>

      {/* Floating back-to-top button */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed bottom-6 right-6 z-30 p-3 rounded-full bg-gradient-to-r from-brand-green to-brand-blue text-white hover:brightness-110 shadow-lg transition hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer"
      >
        <ArrowUp size={20} />
      </button>

      {/* Cookie Consent Toast banner */}
      {showCookieConsent && (
        <div className="fixed bottom-6 left-6 z-30 max-w-sm bg-brand-dark/95 border border-white/10 text-white p-5 rounded-2xl shadow-2xl flex flex-col space-y-3 glass-panel-dark animate-fade-in">
          <div className="flex items-start space-x-3">
            <Shield size={24} className="text-brand-blue flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold">Privacy & Analytics Integrity</p>
              <p className="text-[10px] text-white/70 mt-1">
                Our enterprise uses security and lightweight telemetry systems to optimize reverse osmosis telemetry and drone maps.
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-3 text-[10px] font-bold">
            <button onClick={() => setShowCookieConsent(false)} className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition">
              Decline
            </button>
            <button onClick={() => setShowCookieConsent(false)} className="px-3 py-1.5 rounded-lg bg-brand-blue text-white hover:bg-brand-blue-ocean transition">
              Accept
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
