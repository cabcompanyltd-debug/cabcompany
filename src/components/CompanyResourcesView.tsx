/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Users, BookOpen, Briefcase, Lock, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface CompanyResourcesViewProps {
  onNavigate: (view: string, params?: any) => void;
}

export default function CompanyResourcesView({ onNavigate }: CompanyResourcesViewProps) {
  const resources = [
    {
      id: 'leadership',
      title: 'Our Leadership',
      description: 'Meet our executive founders, chief agronomists, and mechanical water engineers leading agricultural innovation.',
      icon: Users,
      color: 'bg-brand-green/10 text-brand-green',
      buttonText: 'Meet Leadership Team',
    },
    {
      id: 'blog',
      title: 'Insights Blog',
      description: 'Browse the latest agronomy studies, chemical water guidelines, site planning tutorials, and corporate insights.',
      icon: BookOpen,
      color: 'bg-brand-blue/10 text-brand-blue-ocean',
      buttonText: 'Read Corporate Blog',
    },
    {
      id: 'careers',
      title: 'Careers & CSR',
      description: 'Join our mission of resource security. Explore engineering vacancies, environmental telemetry roles, and rural outreach programs.',
      icon: Briefcase,
      color: 'bg-brand-gold/15 text-brand-gold',
      buttonText: 'Explore Vacancies',
    },
    {
      id: 'portal',
      title: 'Secure Client Portal',
      description: 'Access secure telemetry logs, check pending quote estimates, schedule surveyor duty, or speak to real-time support.',
      icon: Lock,
      color: 'bg-brand-green/10 text-brand-green',
      buttonText: 'Sign In to Portal',
      highlight: true,
    }
  ];

  return (
    <div className="space-y-16 pb-24 pt-10">
      
      {/* 1. HERO HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-black tracking-widest text-brand-green uppercase">Corporate Directory</span>
        <h1 className="text-4xl sm:text-6xl font-black text-brand-dark tracking-tight leading-none">
          Company Resources Hub
        </h1>
        <p className="text-brand-dark/60 text-xs sm:text-base max-w-2xl mx-auto">
          Access our internal divisions, corporate insights, operational leadership, and secure client-facing portals from a single consolidated dashboard.
        </p>
      </section>

      {/* 2. CORE RESOURCES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.map((res) => {
            const Icon = res.icon;
            return (
              <div 
                key={res.id}
                className={`p-8 rounded-3xl bg-white border border-black/5 hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                  res.highlight ? 'ring-2 ring-brand-green/30 relative overflow-hidden' : ''
                }`}
              >
                {res.highlight && (
                  <div className="absolute top-0 right-0 bg-brand-green text-white text-[10px] uppercase font-black px-4 py-1 rounded-bl-xl tracking-wider">
                    Secure Endpoint
                  </div>
                )}
                
                <div className="space-y-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${res.color}`}>
                    <Icon size={24} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-brand-dark tracking-tight flex items-center space-x-2">
                      <span>{res.title}</span>
                      {res.highlight && <Sparkles size={14} className="text-brand-green animate-pulse" />}
                    </h3>
                    <p className="text-brand-dark/70 text-xs sm:text-sm leading-relaxed font-medium">
                      {res.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 mt-6 flex justify-end">
                  <button
                    onClick={() => onNavigate(res.id)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 transition cursor-pointer ${
                      res.highlight 
                        ? 'bg-brand-green hover:bg-brand-green-dark text-white' 
                        : 'bg-gray-50 hover:bg-gray-100 text-brand-dark border border-black/5'
                    }`}
                  >
                    <span>{res.buttonText}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SECURITY INTEGRITY BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 bg-brand-dark text-white rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center space-x-3 text-left">
            <ShieldCheck size={24} className="text-brand-green flex-shrink-0" />
            <div>
              <p className="font-extrabold text-sm tracking-tight">Active Encryption Safeguards</p>
              <p className="text-white/60">All portal channels are fully sync-locked with our decentralized database architecture.</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('portal')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-wider text-white transition"
          >
            Authenticate Portal
          </button>
        </div>
      </section>

    </div>
  );
}
