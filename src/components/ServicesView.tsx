/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Leaf, Droplet, Sun, Activity, Settings, ShieldCheck, ArrowRight, ClipboardList, Building } from 'lucide-react';
import { SERVICES } from '../data/mockData';

interface ServicesViewProps {
  onNavigate: (view: string, params?: any) => void;
  initialCategory?: 'agriculture' | 'water' | 'realestate';
}

export default function ServicesView({ onNavigate, initialCategory = 'agriculture' }: ServicesViewProps) {
  const [activeTab, setActiveTab] = useState<'agriculture' | 'water' | 'realestate'>(initialCategory);

  const agServices = SERVICES.agriculture;
  const waterServices = SERVICES.water;
  const realestateServices = SERVICES.realestate || [];

  const getCurrentServices = () => {
    if (activeTab === 'agriculture') return agServices;
    if (activeTab === 'water') return waterServices;
    return realestateServices;
  };

  return (
    <div className="space-y-20 pb-20 pt-10">
      
      {/* 1. HERO HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-black tracking-widest text-brand-blue uppercase">Corporate Operations</span>
        <h1 className="text-4xl sm:text-6xl font-black text-brand-dark tracking-tight leading-none">
          Technical Solutions Blueprint
        </h1>
        <p className="text-brand-dark/60 text-xs sm:text-base max-w-2xl mx-auto">
          Explore C.A.B’s specialized structural divisions, built on uncompromised mechanical quality control, absolute safety guidelines, and active environmental telemetry.
        </p>
      </section>

      {/* 2. SERVICES TAB CONTROLS */}
      <section className="max-w-xl mx-auto px-4">
        <div className="p-1 rounded-2xl bg-gray-100/80 border border-gray-200/50 flex space-x-1">
          <button
            onClick={() => setActiveTab('agriculture')}
            className={`flex-grow py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'agriculture' 
                ? 'bg-white text-brand-blue shadow-md' 
                : 'text-brand-dark/60 hover:text-brand-dark'
            }`}
          >
            <Leaf size={16} />
            <span>Agriculture</span>
          </button>
          <button
            onClick={() => setActiveTab('water')}
            className={`flex-grow py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'water' 
                ? 'bg-white text-brand-blue-ocean shadow-md' 
                : 'text-brand-dark/60 hover:text-brand-dark'
            }`}
          >
            <Droplet size={16} />
            <span>Water</span>
          </button>
          <button
            onClick={() => setActiveTab('realestate')}
            className={`flex-grow py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'realestate' 
                ? 'bg-white text-[#059669] shadow-md' 
                : 'text-brand-dark/60 hover:text-brand-dark'
            }`}
          >
            <Building size={16} />
            <span>Real Estate</span>
          </button>
        </div>
      </section>

      {/* 3. DYNAMIC SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {getCurrentServices().map((service) => (
            <div 
              key={service.id} 
              className="rounded-3xl bg-white border border-black/5 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
            >
              {/* Media preview */}
              <div className="h-72 overflow-hidden relative">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h3 className="absolute bottom-6 left-6 text-xl sm:text-2xl font-black text-white tracking-tight">
                  {service.title}
                </h3>
              </div>

              {/* Service Details */}
              <div className="p-8 space-y-6 flex-grow flex flex-col justify-between">
                <p className="text-brand-dark/70 text-xs sm:text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Checklist Specifications */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-brand-dark/40 block">Division Deliverables:</span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {service.features.map((feat, i) => (
                      <li key={i} className="flex items-start space-x-2 text-xs text-brand-dark/85 font-medium">
                        <ShieldCheck size={14} className="text-brand-blue flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sub CTA to instant quotes with department params */}
                <div className="pt-6 flex justify-end">
                  <button
                    onClick={() => onNavigate('contact', { tab: 'quote', department: service.title })}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-ocean transition cursor-pointer"
                  >
                    <span>Request Custom Specifications</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

            </div>
          ))}

        </div>
      </section>

      {/* 4. SECTOR COMPLIANCE AND SAFETY BLUEPRINT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-brand-dark text-white p-10 sm:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="w-12 h-12 rounded-xl bg-white/10 text-brand-blue-sky flex items-center justify-center shadow-inner">
              <ShieldCheck size={26} />
            </div>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Absolute Compliance & Safety Certifications
            </h3>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Every turn-key system, municipal reverse osmosis unit, and hybrid maize seed line delivered by C.A.B is subject to strict testing. We align with the World Health Organization (WHO) water standards, GlobalG.A.P greenhouse farming methodologies, and ISO 9001 quality management systems.
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-end">
            <button
              onClick={() => onNavigate('contact', { tab: 'quote' })}
              className="px-6 py-4 rounded-xl bg-gradient-to-r from-brand-green to-brand-blue text-white font-black text-xs hover:brightness-110 shadow-lg transition cursor-pointer flex items-center space-x-2"
            >
              <ClipboardList size={16} />
              <span>Get Certified Quote</span>
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
