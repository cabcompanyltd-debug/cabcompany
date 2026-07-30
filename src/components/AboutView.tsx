/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Leaf, Award, Shield, Target, BookOpen, Heart, Users, Mail, Linkedin, CheckCircle2, ShieldCheck } from 'lucide-react';
import { TEAM } from '../data/mockData';
import { motion } from 'motion/react';

export default function AboutView() {
  const values = [
    {
      title: 'Sustainable Stewardship',
      desc: 'We optimize food and water systems for zero waste and minimal climate footprint.',
      icon: Leaf,
      color: 'text-brand-blue bg-brand-blue/10'
    },
    {
      title: 'Absolute Integrity',
      desc: 'We follow absolute chemical precision and laboratory hygiene guidelines.',
      icon: Shield,
      color: 'text-brand-blue-sky bg-brand-blue-sky/10'
    },
    {
      title: 'Technological Excellence',
      desc: 'Deploying autonomous glasshouses, IoT sensors, and high recovery membranes.',
      icon: Target,
      color: 'text-brand-gold bg-brand-gold/10'
    }
  ];

  const milestones = [
    { year: '2016', title: 'Company Inception', desc: 'C.A.B Company Limited is incorporated in Anyirawase, Awudome, focusing on high-efficiency pump arrays.' },
    { year: '2019', title: 'Greenhouse Expansion', desc: 'Introduced automated modular polycarbonate greenhouse parks across the Ashanti Region.' },
    { year: '2022', title: 'Bottled Water Sourcing', desc: 'Launched premium deep aquifer mineral water plant with multi-barrier ozone stabilization.' },
    { year: '2025', title: 'Real Estate Division', desc: 'Established certified land blocks and luxury eco-villa real estate developments alongside solar drip loops.' }
  ];

  const certifications = [
    { title: 'Food & Drugs Authority (FDA)', desc: 'Certified pure drinking & mineral water bottling standards.' },
    { title: 'Ghana Standards Authority (GSA)', desc: 'Conforms to national mineral water & agricultural produce safety codes.' },
    { title: 'ISO 22000 Food Safety', desc: 'HACCP-certified international food and water packaging hygiene.' },
    { title: 'EPA Environmental Compliance', desc: 'Zero-harm agricultural runoff and groundwater extraction protocols.' }
  ];

  return (
    <div className="space-y-24 pb-20 pt-10">
      
      {/* 1. HERO HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl bg-gradient-to-br from-brand-blue-ocean via-brand-blue to-brand-green p-12 sm:p-20 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue-sky/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="text-xs font-black uppercase tracking-widest text-brand-blue-sky">C.A.B Legacy</span>
            <h1 className="text-3xl sm:text-6xl font-black tracking-tight leading-tight">
              Driving Excellence in Agriculture, Mineral Water & Real Estate
            </h1>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-xl">
              C.A.B Company Limited was founded to solve resource aridity, water scarcity, and land insecurity. By merging agricultural science, pure mineral water production, and certified civil real estate development, we empower corporate partners, landowners, and local communities.
            </p>
          </div>
        </motion.div>
      </section>

      {/* 2. VISION & MISSION STATEMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 rounded-3xl bg-white border border-black/5 space-y-6"
        >
          <div className="w-12 h-12 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
            <Target size={24} />
          </div>
          <h2 className="text-2xl font-black text-brand-dark">Our Ultimate Vision</h2>
          <p className="text-brand-dark/60 text-xs sm:text-sm leading-relaxed">
            To build complete food, water, and land security across West Africa and internationally—driving high crop yields, pure mineral water infrastructure, and certified litigation-free real estate developments.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 rounded-3xl bg-white border border-black/5 space-y-6"
        >
          <div className="w-12 h-12 rounded-xl bg-brand-blue-sky/10 text-brand-blue-sky flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <h2 className="text-2xl font-black text-brand-dark">Our Scientific Mission</h2>
          <p className="text-brand-dark/60 text-xs sm:text-sm leading-relaxed">
            To design, construct, and validate highly precise structural systems—including controlled greenhouses, reverse osmosis treatment loops, sterile water packaging lines, and certified luxury real estate developments—adhering strictly to WHO and international civil engineering standards.
          </p>
        </motion.div>

      </section>

      {/* 3. OUR STORY / TIMELINE OF PROGRESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-black tracking-widest text-[#4169E1] uppercase">Our Story</span>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-dark tracking-tight">Our Journey of Innovation</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {milestones.map((milestone, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-white border border-black/5 relative group hover:border-[#4169E1] transition"
            >
              <span className="block text-4xl font-black text-[#4169E1]/20 font-mono mb-4 group-hover:text-[#4169E1] transition">
                {milestone.year}
              </span>
              <h3 className="font-extrabold text-sm text-brand-dark mb-2">{milestone.title}</h3>
              <p className="text-brand-dark/60 text-xs leading-relaxed">{milestone.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. MEET OUR LEADERSHIP TEAM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-black tracking-widest text-[#2E7D32] uppercase font-sans">Corporate Executive Board</span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#4169E1] tracking-tight font-sans">
            Meet Our Leadership Team
          </h2>
          <p className="text-[#2E7D32] font-semibold text-sm sm:text-base tracking-wide uppercase font-sans">
            Driving Excellence in Agriculture and Mineral Water
          </p>
        </div>

        {/* 4 Cards in 2x2 Desktop Grid, 1x4 Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TEAM.map((member, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white border-t-4 border-t-[#4169E1] border-x border-b border-gray-100 rounded-2xl shadow-md p-6 flex flex-col sm:flex-row gap-6"
            >
              {/* Photo */}
              <div className="w-full sm:w-44 h-56 sm:h-auto flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100 relative">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    const filename = member.image.split('/').pop() || '';
                    target.src = '/newstaff/' + filename;
                  }}
                />
              </div>

              {/* Card Details */}
              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div>
                  {/* Name: Poppins Bold, Royal Blue */}
                  <h3 className="text-xl sm:text-2xl font-bold text-[#4169E1] font-sans tracking-tight">
                    {member.name}
                  </h3>
                  
                  {/* Position: Inter, Forest Green, ALL CAPS */}
                  <span className="text-[#2E7D32] font-semibold text-xs tracking-wider uppercase font-sans mt-1 block">
                    {member.position || member.role}
                  </span>

                  {/* Bio: Inter Regular, Dark Gray #333 */}
                  <p className="text-[#333333] text-xs sm:text-sm leading-relaxed mt-3 line-clamp-2 font-sans">
                    {member.bio}
                  </p>
                </div>

                {/* Connect Icons */}
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-100 mt-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-mono">Connect:</span>
                  <a 
                    href={`mailto:${member.email || 'info@cabcompany.com'}`} 
                    aria-label={`Send email to ${member.name}`}
                    className="w-8 h-8 rounded-full bg-gray-50 hover:bg-[#4169E1] hover:text-white text-[#4169E1] flex items-center justify-center transition border border-gray-200 shadow-xs"
                    title={`Email ${member.name}`}
                  >
                    <Mail size={14} />
                  </a>
                  <a 
                    href={member.linkedin || 'https://linkedin.com'} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label={`LinkedIn profile for ${member.name}`}
                    className="w-8 h-8 rounded-full bg-gray-50 hover:bg-[#4169E1] hover:text-white text-[#4169E1] flex items-center justify-center transition border border-gray-200 shadow-xs"
                    title={`LinkedIn - ${member.name}`}
                  >
                    <Linkedin size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. CERTIFICATIONS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gray-50 border border-black/5 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-black tracking-widest text-[#4169E1] uppercase font-mono">Regulatory Approvals</span>
              <h3 className="text-2xl font-black text-brand-dark tracking-tight">C.A.B Quality & Safety Certifications</h3>
            </div>
            <div className="flex items-center space-x-2 bg-[#2E7D32]/10 text-[#2E7D32] px-4 py-2 rounded-xl text-xs font-bold font-mono">
              <ShieldCheck size={18} />
              <span>WHO & FDA COMPLIANT</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-2">
                <div className="flex items-center space-x-2 text-[#4169E1]">
                  <CheckCircle2 size={16} />
                  <h4 className="font-extrabold text-xs text-brand-dark">{cert.title}</h4>
                </div>
                <p className="text-brand-dark/60 text-[11px] leading-relaxed">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CORE VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-black tracking-widest text-brand-blue uppercase">Corporate Pillars</span>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-dark tracking-tight">What Drives Our Work</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, index) => {
            const Icon = val.icon;
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-white border border-black/5 hover:shadow-lg transition"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${val.color}`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-brand-dark mb-2">{val.title}</h3>
                <p className="text-brand-dark/60 text-xs leading-relaxed">{val.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 7. CSR & ENVIRONMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl bg-gradient-to-r from-brand-blue/10 to-brand-green/10 border border-brand-blue/20 p-10 sm:p-16 flex flex-col md:flex-row items-center gap-12"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-green text-white flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse">
            <Heart size={32} />
          </div>
          <div className="space-y-4 max-w-3xl">
            <h3 className="text-xl sm:text-2xl font-black text-brand-dark">Active Sustainability Commitments</h3>
            <p className="text-brand-dark/70 text-xs sm:text-sm leading-relaxed">
              At C.A.B Company Limited, Corporate Social Responsibility is not a checkbox. We allocate 5% of all bottled water revenues to build solar-powered reverse osmosis boreholes in rural districts suffering from heavy metal groundwater contamination.
            </p>
          </div>
        </motion.div>
      </section>

    </div>
  );
}

