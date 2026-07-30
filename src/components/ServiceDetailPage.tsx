/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, ArrowLeft, ClipboardList, PhoneCall, TrendingUp, Sparkles, Activity, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface ServiceDetailPageProps {
  serviceId: string;
  onNavigate: (view: string, params?: any) => void;
}

interface ServiceData {
  title: string;
  slogan: string;
  image: string;
  details: string;
  bullets: string[];
  stats: { label: string; value: string }[];
  accentColor: string;
  division: string;
}

const SERVICES_DETAILS_MAP: Record<string, ServiceData> = {
  'crop-production': {
    title: 'Industrial Crop Production & High-Yield Agronomy',
    slogan: 'Deploying high-density precision crop science to build sustainable food security.',
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=1200',
    details: 'C.A.B’s crop production sector leverages multi-spectral drone mapping, specialized soil nutrition formulation, and customized crop management algorithms. We provide certified seed lines and organic fertilizers designed for high germination and rapid maturity, enabling cooperative farming structures to realize up to 45% yield increases.',
    bullets: [
      'Multi-spectral drone mapping & soil health scanning',
      'Drought-resistant hybrid seed distribution and trials',
      'Custom organic soil macronutrient programs',
      'Post-harvest preservation technology and warehouse integrations'
    ],
    stats: [
      { label: 'Yield Increase', value: '45%' },
      { label: 'Chemical Runoff Reduction', value: '70%' },
      { label: 'Seed Germination', value: '98%' }
    ],
    accentColor: 'text-brand-green',
    division: 'Agriculture Division'
  },
  'greenhouse-farming': {
    title: 'Automated Greenhouse & Controlled Environment Agriculture (CEA)',
    slogan: 'Engineering micro-climates for resilient, year-round harvest yield cycles.',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1200',
    details: 'Our modular glasshouses and double-wall polycarbonate greenhouse complexes integrate automated climate engines. These regulate temperature, shade, humidity, and soil nutrition in real-time. By utilizing hydroponic and aeroponic setups, we produce pristine crops with 90% less water.',
    bullets: [
      'Automated shading, vents, and climate controls',
      'Soilless hydroponic & aeroponic cultivation setups',
      'UV-sterile closed-loop irrigation systems',
      'Integrated biological pest management (IPM) protocols'
    ],
    stats: [
      { label: 'Water Saved', value: '90%' },
      { label: 'Harvest Frequency', value: 'Year-Round' },
      { label: 'Pesticide Reduction', value: '100%' }
    ],
    accentColor: 'text-brand-green',
    division: 'Agriculture Division'
  },
  'precision-irrigation': {
    title: 'Precision Irrigation & Solar Drip Systems',
    slogan: 'Delivering every droplet directly to the plant root with zero evaporation waste.',
    image: 'https://images.unsplash.com/photo-1563514223-745144f41df0?auto=format&fit=crop&q=80&w=1200',
    details: 'We construct smart irrigation networks featuring low-evaporation sub-surface drip loops, programmable valves, and off-grid solar-powered pump arrays. Synced with real-time weather stations, the systems prevent over-watering and lower energy costs to absolute zero.',
    bullets: [
      'Solar-powered pump arrays with frequency converters',
      'Sub-surface localized root water delivery loops',
      'Weather station API synchronized automated valves',
      'GPS-guided moisture telemetry nodes'
    ],
    stats: [
      { label: 'Water Waste Cut', value: '60%' },
      { label: 'Solar Power Efficiency', value: '100%' },
      { label: 'Operational Lifespan', value: '10+ Years' }
    ],
    accentColor: 'text-brand-green',
    division: 'Agriculture Division'
  },
  'agronomy-consultancy': {
    title: 'Scientific Agronomy & Agri-Business Advisory',
    slogan: 'Empowering cooperatives and enterprises with professional soil and crop telemetry.',
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=1200',
    details: 'C.A.B provides comprehensive agronomic diagnostic visits and feasibility studies. We analyze soil macronutrients, model local weather risk factors, and prepare crop rotation calendars. Our agronomists write custom organic nutrition recipes for cooperative farming projects.',
    bullets: [
      'Lab-grade soil chemical profiling and physical texturing',
      'Macro and micronutrient crop modeling algorithms',
      'Localized climate and water risk assessments',
      'Agribusiness financial feasibility and yield plans'
    ],
    stats: [
      { label: 'Hectares Calibrated', value: '450+' },
      { label: 'Partner Cooperatives', value: '120+' },
      { label: 'Soil Feeds Monitored', value: '24/7' }
    ],
    accentColor: 'text-brand-green',
    division: 'Agriculture Division'
  },
  'reverse-osmosis-plants': {
    title: 'Industrial Reverse Osmosis & Nanofiltration Plants',
    slogan: 'High-capacity water purification units engineered for zero-contamination standards.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
    details: 'We engineer turn-key commercial and municipal reverse osmosis (RO) systems. Incorporating dual-pass membranes, high-velocity nano-filtration, and automatic clean-in-place (CIP) protocols, our plants treat saline water, borehole contaminants, and heavy metals to pure, safe standards.',
    bullets: [
      'Dow Filmtec high-recovery membrane systems',
      'Multi-stage physical sediment barrier pre-filters',
      'Electro-deionization (EDI) systems for high resistivity',
      'PLC touchscreen automation control desks'
    ],
    stats: [
      { label: 'Plant Capacities', value: '5K - 50K GPD' },
      { label: 'Heavy Metal Rejection', value: '99.9%' },
      { label: 'Automation Level', value: '100% CIP' }
    ],
    accentColor: 'text-brand-blue-sky',
    division: 'Water Solutions Division'
  },
  'bottled-mineral-water': {
    title: 'Premium Sourced Deep Aquifer Bottled Water',
    slogan: 'Perfect mineral balance with continuous multi-barrier ozone stabilization.',
    image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=1200',
    details: 'Sourced from pristine deep volcanic aquifers, C.A.B bottled water undergoes ten levels of physical and chemical purification. We mineralize the water with ideal proportions of Calcium and Magnesium, raising the pH to a crisp, refreshing, and alkaline 8.2.',
    bullets: [
      'Multi-barrier absolute micro-filtration columns',
      'Active pH stabilization to alkaline 8.2',
      'Continuous closed-loop ozone sterilization units',
      'Zero-human-contact automated glass bottling lines'
    ],
    stats: [
      { label: 'Optimal pH Level', value: '8.2' },
      { label: 'Purification Stages', value: '10-Stage' },
      { label: 'Packaging', value: '100% rPET/Glass' }
    ],
    accentColor: 'text-brand-blue-sky',
    division: 'Water Solutions Division'
  },
  'wastewater-recycling': {
    title: 'Wastewater Treatment, Reclaimed Water & Bioreactors',
    slogan: 'Transforming sewage and industrial effluent into safe, certified irrigation water.',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200',
    details: 'C.A.B’s reclaimed water installations feature state-of-the-art Membrane Bioreactors (MBR) and high-dose UV sterilization. We convert greywater, sewage, and manufacturing discharges into certified water for crop irrigation, fully matching WHO and environmental protection guidelines.',
    bullets: [
      'Membrane bioreactor (MBR) ultra-fine physical barriers',
      'High-intensity UV-C disinfection chambers',
      'Eco-friendly aerobic sludge digestion loops',
      'Continuous water quality compliance testing systems'
    ],
    stats: [
      { label: 'WHO Compliance', value: '100%' },
      { label: 'Discharge Waste', value: '0%' },
      { label: 'Wastewater Recovery', value: '98%' }
    ],
    accentColor: 'text-brand-blue-sky',
    division: 'Water Solutions Division'
  },
  'water-quality-testing': {
    title: 'Scientific Water Quality Testing & Laboratory Diagnostics',
    slogan: 'Absolute chemical, physical, and biological verification for safety peace of mind.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
    details: 'We conduct physical, chemical, and microbiological analyses in certified laboratories. Our experts measure heavy metals, total dissolved solids (TDS), bacterial count (E. coli, coliforms), and pH levels. Every analysis is accompanied by an executive certificate and engineering recommendation.',
    bullets: [
      'Chemical profiling for agricultural borehole suitability',
      'Heavy metal and biological pathogen diagnostic testing',
      'Real-time telemetry sensor calibration services',
      'Formal certifications for regulatory and export approvals'
    ],
    stats: [
      { label: 'Turnaround Time', value: '24 Hours' },
      { label: 'Accuracy Rating', value: '99.9%' },
      { label: 'Methodology Standard', value: 'ISO-Certified' }
    ],
    accentColor: 'text-brand-blue-sky',
    division: 'Water Solutions Division'
  }
};

export default function ServiceDetailPage({ serviceId, onNavigate }: ServiceDetailPageProps) {
  const service = SERVICES_DETAILS_MAP[serviceId];

  if (!service) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-black/5 text-center space-y-6">
        <h2 className="text-xl font-bold text-brand-dark">Service Page Not Found</h2>
        <p className="text-sm text-brand-dark/60">The requested division details could not be located in our registers.</p>
        <button 
          onClick={() => onNavigate('home')} 
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-green to-brand-blue-ocean text-white text-xs font-bold hover:brightness-110 active:scale-98 transition"
        >
          Return to Corporate Home
        </button>
      </div>
    );
  }

  const isWater = service.division.includes('Water');

  return (
    <div className="space-y-16 pb-24 pt-10">
      
      {/* Back button header navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-2 text-xs font-extrabold text-brand-dark/50 hover:text-brand-dark transition group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition" />
          <span>Back to Corporate Operations</span>
        </button>
      </section>

      {/* Hero Banner Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl overflow-hidden relative h-[480px] sm:h-[540px]"
        >
          <img 
            src={service.image} 
            alt={service.title}
            className="w-full h-full object-cover scale-102"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/70 to-transparent" />
          
          <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-8 sm:px-16 max-w-2xl space-y-4">
            <span className={`text-xs font-black tracking-widest uppercase font-mono ${
              isWater ? 'text-brand-blue-sky' : 'text-brand-green'
            }`}>
              {service.division}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none">
              {service.title}
            </h1>
            <p className="text-white/80 text-xs sm:text-base font-medium leading-relaxed">
              {service.slogan}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Stats Block */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {service.stats.map((st, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-black/5 p-6 rounded-3xl flex items-center justify-between shadow-sm"
            >
              <div>
                <span className="text-[10px] text-brand-dark/40 font-mono uppercase font-black leading-none">{st.label}</span>
                <span className="text-2xl sm:text-3xl font-black text-brand-dark mt-1 block tracking-tight font-sans">{st.value}</span>
              </div>
              <div className={`p-3 rounded-2xl ${isWater ? 'bg-brand-blue/10 text-brand-blue' : 'bg-brand-green/10 text-brand-green'}`}>
                {i === 0 && <TrendingUp size={20} />}
                {i === 1 && <Activity size={20} />}
                {i === 2 && <Award size={20} />}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Details and Bullet Points layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Deep-Dive Description */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-3xl border border-black/5 space-y-6"
        >
          <div className="flex items-center space-x-2">
            <span className={isWater ? 'text-brand-blue' : 'text-brand-green'}>
              <Sparkles size={18} />
            </span>
            <h2 className="text-xs font-black uppercase tracking-widest text-brand-dark/50 font-mono">Operations Briefing</h2>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-brand-dark tracking-tight leading-snug">
            Corporate Standards and Project Execution Details
          </h3>
          <p className="text-brand-dark/75 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
            {service.details}
          </p>
          <div className="p-4 bg-gray-50 border border-black/5 rounded-2xl flex items-start space-x-3 text-xs text-brand-dark/65">
            <ShieldCheck size={18} className={`${isWater ? 'text-brand-blue' : 'text-brand-green'} flex-shrink-0 mt-0.5`} />
            <p className="leading-relaxed">
              Every C.A.B project is backed by active engineering warranties, routine telemetry calibrations, and remote support via our <span className="font-bold text-brand-dark">Secure Client Portal</span>.
            </p>
          </div>
        </motion.div>

        {/* Right Side: Deliverables Checklist */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 bg-white p-8 rounded-3xl border border-black/5 space-y-6"
        >
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-brand-dark/45 font-mono">Division Deliverables</h3>
          
          <ul className="space-y-4">
            {service.bullets.map((b, i) => (
              <li key={i} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl border border-black/5">
                <ShieldCheck size={18} className={`flex-shrink-0 mt-0.5 ${isWater ? 'text-brand-blue-sky' : 'text-brand-green'}`} />
                <span className="text-xs text-brand-dark font-medium leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => onNavigate('contact', { tab: 'quote', department: service.title })}
              className={`flex-grow px-4 py-3 rounded-xl font-black text-xs text-white shadow-md hover:brightness-110 active:scale-98 transition flex items-center justify-center space-x-2 cursor-pointer bg-gradient-to-r ${
                isWater ? 'from-brand-blue-ocean to-brand-blue-aqua' : 'from-brand-blue to-brand-green'
              }`}
            >
              <ClipboardList size={14} />
              <span>Request Specifications</span>
            </button>
            <button 
              onClick={() => onNavigate('contact', { tab: 'message', department: service.title })}
              className="px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-black/5 font-extrabold text-xs text-brand-dark flex items-center justify-center space-x-2 cursor-pointer transition"
            >
              <PhoneCall size={14} className="text-brand-dark/60" />
              <span>Consult Staff</span>
            </button>
          </div>
        </motion.div>

      </section>

    </div>
  );
}
