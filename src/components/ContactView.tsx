/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, Phone, MapPin, Clock, Calendar, CheckCircle, 
  Send, ClipboardList, ShieldAlert, FileText 
} from 'lucide-react';
import { submitContactMessage, submitQuoteRequest } from '../lib/api';

interface ContactViewProps {
  initialTab?: 'message' | 'quote';
  preFilledDetails?: string;
  departmentParam?: string;
}

export default function ContactView({ initialTab = 'message', preFilledDetails = '', departmentParam = '' }: ContactViewProps) {
  const [activeTab, setActiveTab] = useState<'message' | 'quote'>(initialTab);
  
  // Tab 1: General Inquiry State
  const [msgName, setMsgName] = useState('');
  const [msgEmail, setMsgEmail] = useState('');
  const [msgDept, setMsgDept] = useState(departmentParam || 'General Enquiry');
  const [msgSubject, setMsgSubject] = useState('');
  const [msgContent, setMsgContent] = useState('');
  const [msgSuccess, setMsgSuccess] = useState(false);

  // Tab 2: Quote Form State
  const [quoteName, setQuoteName] = useState('');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteCompany, setQuoteCompany] = useState('');
  const [quoteCategory, setQuoteCategory] = useState(departmentParam || 'Irrigation Systems');
  const [quoteDetails, setQuoteDetails] = useState(preFilledDetails || '');
  const [quoteSuccess, setQuoteSuccess] = useState<any | null>(null);

  // Auto-fill from logged-in session if available
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('cab_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setMsgName(parsed.name || '');
        setMsgEmail(parsed.email || '');
        setQuoteName(parsed.name || '');
        setQuoteEmail(parsed.email || '');
        setQuotePhone(parsed.phone || '');
        setQuoteCompany(parsed.company || '');
      }
    } catch (e) {}
  }, []);

  // React to change in props
  useEffect(() => {
    if (preFilledDetails) {
      setQuoteDetails(preFilledDetails);
      setActiveTab('quote');
    }
  }, [preFilledDetails]);

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let userId = null;
      try {
        const saved = localStorage.getItem('cab_user');
        if (saved) userId = JSON.parse(saved).id;
      } catch (e) {}

      await submitContactMessage({
        userId,
        name: msgName,
        email: msgEmail,
        department: msgDept,
        subject: msgSubject,
        message: msgContent,
      });

      setMsgSuccess(true);
      setMsgSubject('');
      setMsgContent('');
    } catch (err) {
      console.error('Contact submit error:', err);
    }
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let userId = null;
      try {
        const saved = localStorage.getItem('cab_user');
        if (saved) userId = JSON.parse(saved).id;
      } catch (e) {}

      const created = await submitQuoteRequest({
        userId,
        name: quoteName,
        email: quoteEmail,
        phone: quotePhone,
        company: quoteCompany,
        category: quoteCategory,
        details: quoteDetails,
      });

      setQuoteSuccess(created);
      setQuoteDetails('');
    } catch (err) {
      console.error('Quote submit error:', err);
    }
  };

  return (
    <div className="space-y-16 pb-20 pt-28 sm:pt-32">
      
      {/* 1. HERO HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-black tracking-widest text-brand-blue uppercase font-mono">Corporate Relations</span>
        <h1 className="text-4xl sm:text-6xl font-black text-brand-dark tracking-tight leading-none">
          Connect With Our Engineers
        </h1>
        <p className="text-brand-dark/60 text-xs sm:text-base max-w-2xl mx-auto">
          Contact our technical divisions directly or request certified structural quote metrics. Our laboratories respond within 24 hours.
        </p>
      </section>

      {/* 2. CONTACT COLUMNS AND FORM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Office Hours, Emergency Info & Contact specs */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="p-6 bg-white border border-black/5 rounded-3xl space-y-6">
            <h3 className="font-extrabold text-base text-brand-dark">Division Hubs</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3.5">
                <MapPin size={20} className="text-brand-blue flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-brand-dark">Headquarters (Ghana)</p>
                  <p className="text-brand-dark/60 mt-1">C.A.B Headquarters, Anyirawase, Awudome, VR, Ghana</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 border-t pt-4">
                <MapPin size={20} className="text-brand-blue flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-brand-dark">Americas Hub (USA)</p>
                  <p className="text-brand-dark/60 mt-1">45 Broad Street, 22nd Floor, New York, NY, USA</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 border-t pt-4">
                <Phone size={18} className="text-brand-blue flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-brand-dark">Direct Support & Lines</p>
                  <p className="text-brand-dark/60 mt-1">+233 53 255 2533</p>
                  <p className="text-brand-dark/60">+1 (929) 765-5743</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 border-t pt-4">
                <Clock size={18} className="text-brand-blue flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-brand-dark">Laboratory Hours</p>
                  <p className="text-brand-dark/60 mt-1">Mon - Fri: 08:00 - 17:00 GMT</p>
                  <p className="text-brand-dark/60">Saturday Emergency Duty: 09:00 - 13:00 GMT</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-brand-blue/5 border border-brand-blue/10 rounded-3xl space-y-4">
            <h4 className="text-xs font-black text-brand-blue-ocean uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldAlert size={14} />
              <span>Rapid Emergency Water Services</span>
            </h4>
            <p className="text-brand-dark/70 text-xs leading-relaxed">
              Facing localized pump breakdown, irrigation loop pressure loss, or sterile bottled water line halts? Call our direct Field Emergency Team immediately at <strong className="text-brand-blue">+233 54 200 9988</strong>.
            </p>
          </div>

        </div>

        {/* Right Column: Interactive Tab Forms */}
        <div className="lg:col-span-8 bg-white border border-black/5 rounded-3xl overflow-hidden p-6 sm:p-10 space-y-8">
          
          {/* Tab buttons */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('message')}
              className={`pb-4 px-6 font-bold text-xs sm:text-sm border-b-2 cursor-pointer transition ${
                activeTab === 'message' 
                  ? 'border-brand-blue text-brand-blue' 
                  : 'border-transparent text-brand-dark/50 hover:text-brand-dark'
              }`}
            >
              General Message
            </button>
            <button
              onClick={() => setActiveTab('quote')}
              className={`pb-4 px-6 font-bold text-xs sm:text-sm border-b-2 cursor-pointer transition ${
                activeTab === 'quote' 
                  ? 'border-brand-blue text-brand-blue' 
                  : 'border-transparent text-brand-dark/50 hover:text-brand-dark'
              }`}
            >
              Request Custom Quote
            </button>
          </div>

          {/* TAB 1: MESSAGE FORM */}
          {activeTab === 'message' && (
            <div className="space-y-6">
              {msgSuccess ? (
                <div className="p-8 text-center space-y-4 bg-brand-blue/5 border border-brand-blue/10 rounded-2xl">
                  <CheckCircle size={44} className="text-brand-blue mx-auto" />
                  <h4 className="font-extrabold text-sm text-brand-dark">Message Dispatched Successfully!</h4>
                  <p className="text-brand-dark/65 text-xs max-w-sm mx-auto leading-relaxed">
                    Thank you. Your inquiry has been routed to our Agronomy and Filtration hubs. A chemical coordinator will respond within 24 hours.
                  </p>
                  <button 
                    onClick={() => setMsgSuccess(false)}
                    className="px-4 py-2 rounded-xl bg-brand-blue hover:bg-brand-blue-ocean text-white font-bold text-xs cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleMessageSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-extrabold text-brand-dark/50">Full Name</label>
                      <input
                        type="text"
                        required
                        value={msgName}
                        onChange={(e) => setMsgName(e.target.value)}
                        placeholder="John Mahama..."
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-extrabold text-brand-dark/50">Email Address</label>
                      <input
                        type="email"
                        required
                        value={msgEmail}
                        onChange={(e) => setMsgEmail(e.target.value)}
                        placeholder="j.mahama@coop.org..."
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-extrabold text-brand-dark/50">Target Division</label>
                      <select
                        value={msgDept}
                        onChange={(e) => setMsgDept(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs"
                      >
                        <option value="General Enquiry">General Corporate Division</option>
                        <option value="Water Purification">Water Purification Lab</option>
                        <option value="Controlled Environment Agriculture">Controlled Greenhouse CEA</option>
                        <option value="Precision Irrigation Systems">Precision Solar Irrigation</option>
                        <option value="Human Resources & Careers">Careers & Recruitment</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-extrabold text-brand-dark/50">Subject</label>
                      <input
                        type="text"
                        required
                        value={msgSubject}
                        onChange={(e) => setMsgSubject(e.target.value)}
                        placeholder="e.g. Drip loop installation inquiry..."
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-brand-dark/50">Detailed Message</label>
                    <textarea
                      required
                      rows={5}
                      value={msgContent}
                      onChange={(e) => setMsgContent(e.target.value)}
                      placeholder="Specify your system details, volume requirements, or technical queries..."
                      className="w-full p-4 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-green to-brand-blue text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer hover:brightness-110 shadow-md transition"
                    >
                      <Send size={14} />
                      <span>Submit Message</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: QUOTE REQUEST FORM */}
          {activeTab === 'quote' && (
            <div className="space-y-6">
              {quoteSuccess ? (
                <div className="p-8 text-center space-y-6 bg-brand-blue/5 border border-brand-blue/10 rounded-2xl">
                  <CheckCircle size={44} className="text-brand-blue mx-auto" />
                  <h4 className="font-extrabold text-sm text-brand-dark">Quote Estimation Successfully Generated!</h4>
                  
                  <div className="p-5 bg-white rounded-xl border border-black/5 max-w-md mx-auto text-left space-y-3">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-brand-dark/45 uppercase font-bold">Estimate ID</span>
                      <span className="font-extrabold text-brand-dark">{quoteSuccess.id}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono border-t pt-2">
                      <span className="text-brand-dark/45 uppercase font-bold">System Department</span>
                      <span className="font-extrabold text-brand-dark">{quoteSuccess.category}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono border-t pt-2">
                      <span className="text-brand-dark/45 uppercase font-bold">Reference Value</span>
                      <span className="font-extrabold text-brand-blue">${quoteSuccess.estimateAmount.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-brand-dark/50 leading-relaxed border-t pt-2 italic">
                      *This estimate represents an initial software-guided calculation. Our engineering team is reviewing your physical specs and will follow up with a certified legal blueprint document.
                    </p>
                  </div>

                  <button 
                    onClick={() => setQuoteSuccess(null)}
                    className="px-4 py-2 rounded-xl bg-brand-blue text-white font-bold text-xs cursor-pointer"
                  >
                    Submit Another Quote Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-extrabold text-brand-dark/50">Full Name</label>
                      <input
                        type="text"
                        required
                        value={quoteName}
                        onChange={(e) => setQuoteName(e.target.value)}
                        placeholder="e.g. Kwame Boateng..."
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-extrabold text-brand-dark/50">Corporate Email</label>
                      <input
                        type="email"
                        required
                        value={quoteEmail}
                        onChange={(e) => setQuoteEmail(e.target.value)}
                        placeholder="k.boateng@cooperative.com..."
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-extrabold text-brand-dark/50">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={quotePhone}
                        onChange={(e) => setQuotePhone(e.target.value)}
                        placeholder="+233 54 233 1122..."
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-extrabold text-brand-dark/50">Company Name</label>
                      <input
                        type="text"
                        value={quoteCompany}
                        onChange={(e) => setQuoteCompany(e.target.value)}
                        placeholder="e.g. Volta Agritech Alliance..."
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-brand-dark/50">Equipment/System Category</label>
                    <select
                      value={quoteCategory}
                      onChange={(e) => setQuoteCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs"
                    >
                      <option value="Irrigation Systems">Irrigation Loops & Pump Arrays</option>
                      <option value="Crop Production">Agronomy & Custom Nutrient Seeds</option>
                      <option value="Greenhouse Farming">Controlled Polycarbonate Greenhouse Parks</option>
                      <option value="Water Purification">Industrial RO Treatment Plants</option>
                      <option value="Bottled Water Supply">Bottled Drinking Water Bulk Pallets</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-brand-dark/50">System Specifications & Requirements</label>
                    <textarea
                      required
                      rows={5}
                      value={quoteDetails}
                      onChange={(e) => setQuoteDetails(e.target.value)}
                      placeholder="Specify approximate land acreage, flow volumes (e.g. 10k liters per day), raw water TDS value, soil layout, or specific catalog items added to basket..."
                      className="w-full p-4 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-green to-brand-blue text-white font-bold text-xs flex items-center space-x-2 cursor-pointer hover:brightness-110 shadow-md transition"
                    >
                      <ClipboardList size={14} />
                      <span>Request Estimation</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

      </section>

    </div>
  );
}
