/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, ShieldCheck, Mail, ArrowLeft, ExternalLink, Calendar, Milestone } from 'lucide-react';
import { TEAM } from '../data/mockData';
import ceoImg from '../assets/staff/ceo.jpg';

interface LeadershipViewProps {
  onNavigate: (view: string, params?: any) => void;
}

export default function LeadershipView({ onNavigate }: LeadershipViewProps) {
  return (
    <div className="space-y-16 pb-24 pt-10">
      
      {/* 1. HEADER BREADCRUMB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => onNavigate('about')}
          className="flex items-center space-x-2 text-xs font-extrabold text-brand-dark/50 hover:text-brand-dark transition group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition" />
          <span>About C.A.B Company</span>
        </button>
      </section>

      {/* 2. TITLE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-black tracking-widest text-brand-gold uppercase">Corporate Governance</span>
        <h1 className="text-4xl sm:text-6xl font-black text-brand-dark tracking-tight leading-none">
          Executive Leadership Team
        </h1>
        <p className="text-brand-dark/60 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
          The governance and technical directors leading West Africa’s most specialized agricultural development and industrial water purification group.
        </p>
      </section>

      {/* 3. FOUNDER MESSAGE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-brand-dark text-white p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center border border-black/5">
          
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative group">
              <img 
                src={ceoImg} 
                alt="Christian Asara Boafo" 
                className="w-64 h-64 sm:w-72 sm:h-72 object-cover rounded-2xl border-4 border-brand-gold/20"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/ceo.jpg';
                }}
              />
              <div className="absolute -bottom-3 -right-3 bg-brand-gold text-brand-dark p-3.5 rounded-xl font-black text-xs shadow-lg font-mono">
                CEO & FOUNDER
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full border border-white/5">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></span>
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider font-mono">CEO’s Vision Statement</span>
            </div>
            
            <blockquote className="text-lg sm:text-xl font-bold text-white/90 leading-relaxed italic">
              "Sustainable industrialization is built on robust resource stewardship. We do not simply install machinery; we calibrate sustainable systems that safeguard community food sovereignty and water purity for generations."
            </blockquote>

            <div>
              <p className="text-base font-extrabold text-white">Christian Asara Boafo</p>
              <p className="text-xs text-brand-gold font-mono uppercase mt-0.5">Chief Executive Officer - CEO, C.A.B Company Ltd.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. BOARD OF DIRECTORS LIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-xl font-black text-brand-dark tracking-tight">Active Operations Directors</h2>
          <p className="text-xs text-brand-dark/50 font-mono mt-1">C.A.B Technical Division Directors & Strategic Officers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((director, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition group"
            >
              <div className="relative h-80 overflow-hidden bg-gray-50">
                <img 
                  src={director.image} 
                  alt={director.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    const filename = director.image.split('/').pop() || '';
                    target.src = '/ImageAssets/' + filename;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-lg font-black text-white leading-tight">{director.name}</h3>
                  <p className="text-xs text-brand-gold font-mono uppercase mt-1 tracking-wide">{director.role}</p>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-brand-dark/70 leading-relaxed font-medium">
                  {director.bio}
                </p>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
                  <span className="font-mono text-brand-dark/45 font-black uppercase text-[10px]">Credential Profile</span>
                  <div className="flex space-x-2">
                    <span className="p-1 px-2.5 bg-gray-100 text-brand-dark rounded-md text-[10px] font-bold font-mono">
                      {idx === 0 ? 'MD' : idx === 1 ? 'PhD' : idx === 2 ? 'Ing' : 'BA'}
                    </span>
                    <span className="p-1 px-2.5 bg-brand-green/10 text-brand-green rounded-md text-[10px] font-bold font-mono">
                      ACTIVE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. GOVERNANCE AND COMPLIANCE POLICIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 p-8 sm:p-12 rounded-3xl border border-black/5 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center">
              <Award size={20} />
            </div>
            <h3 className="text-lg font-extrabold text-brand-dark">Fiduciary & Social Responsibility</h3>
            <p className="text-xs sm:text-sm text-brand-dark/65 leading-relaxed font-medium">
              C.A.B Company operates under a strict, board-level compliance policy overseen by our founder. We pledge absolute financial audit transparency, safe labor guidelines for field staff, and clean supply-chain standards aligned with the Environmental Protection Agency (EPA) of Ghana.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center">
              <Milestone size={20} />
            </div>
            <h3 className="text-lg font-extrabold text-brand-dark">Decentralized Technical Advisors</h3>
            <p className="text-xs sm:text-sm text-brand-dark/65 leading-relaxed font-medium">
              In addition to our resident directors, C.A.B consults with external panels of agricultural researchers from Wageningen University and regional engineering bodies. This guarantees every municipal RO plant and irrigation scheme matches elite global practices.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
