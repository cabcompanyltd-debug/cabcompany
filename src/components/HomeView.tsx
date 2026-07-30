/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, Leaf, Droplet, Award, Zap, Users, ShieldCheck, 
  HelpCircle, ChevronRight, Activity, Calendar, Play, MapPin, Building, Home, Trees
} from 'lucide-react';
import { PROJECTS, SERVICES, FAQS, PRODUCTS } from '../data/mockData';

interface HomeViewProps {
  onNavigate: (view: string, params?: any) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[90vh] bg-brand-dark overflow-hidden flex items-center px-4 sm:px-6 lg:px-8 py-20">
        {/* Immersive background image with green-blue gradient mask - enhanced visibility */}
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.85 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="/ImageAssets/herosection.png" 
            alt="Sustainable Modern Farm" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // fallback if brand asset fails
              e.currentTarget.src = "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=2000";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue-ocean/50 via-brand-dark/60 to-brand-green-forest/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 items-center">
          
          {/* Main Hero Copy */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="flex flex-wrap gap-2.5 items-center">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-flex items-center space-x-2 bg-brand-blue-ocean/40 border border-brand-blue-sky/30 px-3.5 py-1.5 rounded-full text-brand-blue-sky text-xs font-black uppercase tracking-wider backdrop-blur-md"
              >
                <MapPin size={12} className="text-brand-blue-sky animate-bounce" />
                <span>Anyirawase, Awudome, VR, Ghana</span>
              </motion.div>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md animate-pulse"
              >
                <Zap size={12} className="text-brand-blue-sky" />
                <span>Pioneering Agri-tech, Pure Water & Real Estate Solutions</span>
              </motion.div>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Securing the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue-sky to-brand-blue-aqua">Water</span>, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue-sky via-brand-blue to-brand-green">Agriculture</span> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#059669] via-[#2563EB] to-[#60A5FA]">Real Estate</span>.
            </h1>

            <p className="text-white/75 text-base sm:text-lg max-w-xl leading-relaxed">
              C.A.B Company Ltd builds world-class controlled-environment glasshouses, off-grid solar drip irrigation loops, industrial reverse osmosis water plants, and certified litigation-free real estate developments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onNavigate('services')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-brand-blue-ocean via-brand-blue to-brand-green text-white font-bold text-sm shadow-xl hover:shadow-brand-blue/25 hover:brightness-110 transition flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
              >
                <span>Explore Solutions</span>
                <ArrowRight size={16} />
              </button>
              <button 
                onClick={() => onNavigate('contact', { tab: 'quote' })}
                className="px-8 py-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-sm backdrop-blur-md transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Request Custom Quote</span>
              </button>
            </div>

            {/* Quick Hero Statistics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 max-w-lg">
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-brand-blue-sky font-mono">100%</span>
                <span className="text-[10px] sm:text-xs text-white/50 uppercase tracking-widest font-semibold">Chemical Purity</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-brand-blue-sky font-mono">12K+</span>
                <span className="text-[10px] sm:text-xs text-white/50 uppercase tracking-widest font-semibold">Hectares Irrigated</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-brand-gold font-mono">24/7</span>
                <span className="text-[10px] sm:text-xs text-white/50 uppercase tracking-widest font-semibold">Telemetry Feed</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Side Visual Glass Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 hidden lg:block"
          >
            <div className="p-8 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-white/60 font-mono text-[10px] uppercase tracking-wider">Active System Status</span>
                <div className="flex items-center space-x-1.5 bg-brand-blue/20 px-2.5 py-1 rounded-full border border-brand-blue/30">
                  <span className="w-2 h-2 rounded-full bg-brand-blue-sky animate-pulse" />
                  <span className="text-[9px] text-brand-blue-sky font-bold">ONLINE</span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-white text-sm font-bold">Keta Basin Reservoir Filtration</p>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/50">Membrane Recovery</span>
                    <span className="text-brand-blue-sky font-mono font-bold">98.4%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[98%] h-full bg-brand-blue" />
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/50">Drip Fertigation Flow</span>
                    <span className="text-brand-blue-sky font-mono font-bold">12.5 L/m</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-brand-blue" />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                <Activity size={20} className="text-brand-blue-aqua animate-pulse" />
                <span className="text-[10px] text-white/70 leading-relaxed font-mono">
                  Continuous multi-sensor telemetry analyzing soil hydration and chemical TDS.
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. CORPORATE DIVISIONS CARDS (AGRI, WATER & REAL ESTATE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-black tracking-widest text-brand-blue-sky uppercase">Triple Engine Synergy</span>
          <h2 className="text-3xl sm:text-5xl font-black text-brand-dark tracking-tight">
            Our Three Corporate Divisions
          </h2>
          <p className="text-brand-dark/60 text-sm">
            Providing turn-key technical infrastructure across modern crop husbandry, reverse osmosis water engineering, and certified luxury real estate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Agriculture Block */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="group rounded-3xl bg-white border border-black/5 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=800" 
                alt="Agribusiness Glasshouse" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 w-12 h-12 rounded-xl bg-gradient-to-r from-brand-blue to-brand-green text-white flex items-center justify-center shadow-lg">
                <Leaf size={22} />
              </div>
            </div>

            <div className="p-8 space-y-6 flex-grow flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-brand-dark">Controlled-Environment Agriculture</h3>
                <p className="text-brand-dark/60 text-sm leading-relaxed">
                  Pioneering autonomous drip loops, organic macro-nutrient bio-fertilization formulations, and fully integrated glasshouse cooling structures to unlock double crops per cycle.
                </p>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs font-black tracking-wider text-brand-blue uppercase">Agri Frameworks</span>
                <button 
                  onClick={() => onNavigate('services', { category: 'agriculture' })}
                  className="p-3.5 rounded-full bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white transition cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Water Block */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="group rounded-3xl bg-white border border-black/5 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=800" 
                alt="Water treatment plant" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 w-12 h-12 rounded-xl bg-brand-blue text-white flex items-center justify-center shadow-lg">
                <Droplet size={22} />
              </div>
            </div>

            <div className="p-8 space-y-6 flex-grow flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-brand-dark">Industrial Water Purification</h3>
                <p className="text-brand-dark/60 text-sm leading-relaxed">
                  Turnkey validation arrays for reverse osmosis, sterile ozone re-balancing, wastewater reclamation, and mineral stabilization to satisfy WHO drinking protocols.
                </p>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs font-black tracking-wider text-brand-blue-ocean uppercase">Water Systems</span>
                <button 
                  onClick={() => onNavigate('services', { category: 'water' })}
                  className="p-3.5 rounded-full bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white transition cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Real Estate Block */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="group rounded-3xl bg-white border border-black/5 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800" 
                alt="Real Estate & Certified Land" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 w-12 h-12 rounded-xl bg-gradient-to-r from-[#059669] to-[#2563EB] text-white flex items-center justify-center shadow-lg">
                <Building size={22} />
              </div>
            </div>

            <div className="p-8 space-y-6 flex-grow flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-brand-dark">Luxury Real Estate & Lands</h3>
                <p className="text-brand-dark/60 text-sm leading-relaxed">
                  Certified litigation-free land blocks, high-yield agricultural acreage, smart eco-villas, and commercial warehouse parks with full title documentation.
                </p>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs font-black tracking-wider text-[#059669] uppercase">Certified Listings</span>
                <button 
                  onClick={() => onNavigate('real-estate')}
                  className="p-3.5 rounded-full bg-[#059669]/10 text-[#059669] hover:bg-[#059669] hover:text-white transition cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 3. SUSTAINABILITY CASE HIGHLIGHT (BEFORE/AFTER SLIDE) */}
      <section className="bg-brand-dark text-white py-24 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue-ocean via-brand-blue to-brand-green" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 space-y-8"
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-full text-brand-blue-sky text-xs font-mono font-bold uppercase tracking-wider">
              <Activity size={12} className="animate-pulse" />
              <span>Project Focus: Keta basin cooperative</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Combating Aridity through Smart Drip Irrigation
            </h2>

            <p className="text-white/70 text-sm leading-relaxed">
              Before C.A.B arrived, cooperative onion farmers in the Volta basin lost up to 45% of crop yields during dry cycles. By deploying weather-integrated solar drip loops, water evaporation was cut by 60%, while farm yield rose by 85%.
            </p>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 grid grid-cols-2 gap-6">
              <div>
                <span className="text-xs text-white/50 block font-mono uppercase tracking-widest mb-1">Water Restored</span>
                <span className="text-3xl font-black text-brand-blue-aqua">4.2M Liters/m</span>
              </div>
              <div>
                <span className="text-xs text-white/50 block font-mono uppercase tracking-widest mb-1">Yield Increase</span>
                <span className="text-3xl font-black text-brand-blue-aqua">+85%</span>
              </div>
            </div>

            <div>
              <button 
                onClick={() => onNavigate('projects')}
                className="inline-flex items-center space-x-2 text-brand-blue-sky hover:text-brand-blue-aqua font-bold text-sm transition"
              >
                <span>Review Comprehensive Case Studies</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>

          {/* Visual comparison container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-red-400">Arid State (Pre-Treatment)</span>
                <div className="h-64 rounded-2xl overflow-hidden border border-white/5">
                  <img 
                    src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=400" 
                    alt="Dry Farm" 
                    className="w-full h-full object-cover filter saturate-50"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-blue">Drip Fertigation (Post-CAB)</span>
                <div className="h-64 rounded-2xl overflow-hidden border border-brand-blue/20">
                  <img 
                    src="/ImageAssets/healthyfarm.png" 
                    alt="Healthy Farm" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
            <div className="text-[10px] text-white/40 font-mono text-center">
              *Verified photographs showing comparative foliage density and soil moisture levels in Ghana.
            </div>
          </motion.div>

        </div>
      </section>

      {/* 4. WHY CHOOSE C.A.B (BENTO GRID VALUE ENGINES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-black tracking-widest text-brand-blue-sky uppercase">Corporate Trust</span>
          <h2 className="text-3xl sm:text-5xl font-black text-brand-dark tracking-tight">
            Why Fortune 500 Partners Align with Us
          </h2>
          <p className="text-brand-dark/60 text-sm">
            We merge cutting-edge laboratory chemistry with physical mechanical automation to deliver uncompromised reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-8 rounded-3xl bg-white border border-black/5 hover:shadow-lg transition flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center mb-6">
              <Award size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-brand-dark">Uncompromised Quality Controls</h3>
              <p className="text-brand-dark/60 text-xs leading-relaxed">
                We perform trace metal analyses, bacteriological plate counts, and chemical membrane audits weekly, ensuring strict FDA/WHO compliance.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 rounded-3xl bg-white border border-black/5 hover:shadow-lg transition flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center mb-6">
              <Zap size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-brand-dark">Climate-Smart Infrastructure</h3>
              <p className="text-brand-dark/60 text-xs leading-relaxed">
                By optimizing greenhouse micro-climates and using off-grid solar generators, we minimize diesel use by up to 90%.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-8 rounded-3xl bg-white border border-black/5 hover:shadow-lg transition flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-6">
              <Users size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-brand-dark">Certified Agronomic Advisory</h3>
              <p className="text-brand-dark/60 text-xs leading-relaxed">
                Our advisors provide customized soil maps, tailored organic fertigation designs, and training cycles to scale your cooperative.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 5. FAQS ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-black tracking-widest text-brand-blue-sky uppercase">Corporate Advisory</span>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-dark tracking-tight">
            Frequently Answered Inquiries
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-white border border-black/5"
            >
              <h3 className="font-bold text-sm text-brand-dark flex items-start space-x-3">
                <HelpCircle size={18} className="text-brand-blue mt-0.5 flex-shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-brand-dark/60 text-xs mt-3 pl-7 leading-relaxed">
                {faq.a}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl bg-gradient-to-r from-brand-blue-ocean via-brand-blue to-brand-green p-10 sm:p-16 overflow-hidden text-white flex flex-col lg:flex-row justify-between items-center gap-8"
        >
          <div className="absolute inset-0 z-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=800" 
              alt="Water purification pipelines" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="space-y-4 relative z-10 max-w-2xl">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Ready to Upgrade Your Agricultural Yield or Water Infrastructure?
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Connect with our scientific advisors today to secure detailed soil maps, purification analysis, or drone survey scheduling.
            </p>
          </div>

          <div className="relative z-10 flex flex-shrink-0 gap-3">
            <button 
              onClick={() => onNavigate('contact', { tab: 'quote' })}
              className="px-6 py-3.5 rounded-xl bg-white text-brand-blue font-black text-xs hover:shadow-lg transition cursor-pointer active:scale-95"
            >
              Book Corporate Consultation
            </button>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
