/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import AiConsultant from './components/AiConsultant';

// Views
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import ServicesView from './components/ServicesView';
import ProductsView from './components/ProductsView';
import ProjectsView from './components/ProjectsView';
import BlogView from './components/BlogView';
import ContactView from './components/ContactView';
import PortalView from './components/PortalView';
import ServiceDetailPage from './components/ServiceDetailPage';
import LeadershipView from './components/LeadershipView';
import CompanyResourcesView from './components/CompanyResourcesView';
import RealEstateView from './components/RealEstateView';
import { submitContactMessage } from './lib/api';

// Icons for Careers Sub-View
import { Briefcase, MapPin, Clock, DollarSign, Send, CheckCircle, ArrowRight } from 'lucide-react';

import { insforgeClient } from './lib/insforge';

export default function App() {
  const [view, setView] = useState<string>('home');
  const [viewParams, setViewParams] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  
  // Quote basket count
  const [cartCount, setCartCount] = useState<number>(0);

  // Careers Interactive Form States
  const [applyJob, setApplyJob] = useState<any | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantCVLink, setApplicantCVLink] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  // Sync auth session and check for Google OAuth callback parameters on boot
  useEffect(() => {
    const syncSession = async () => {
      try {
        // Check if there is an active InsForge auth session (e.g., from Google OAuth)
        const { data, error } = await insforgeClient.auth.getCurrentUser();
        if (data?.user) {
          const userId = data.user.id;
          const email = data.user.email;
          const name = (data.user as any).name || (data.user as any).profile?.name || email.split('@')[0].toUpperCase();

          // Check if a database profile already exists
          const resProfile = await fetch(`/api/user/profile?id=${userId}`);
          if (resProfile.ok) {
            const profileData = await resProfile.json();
            if (profileData && profileData.user) {
              const loggedInUser = {
                id: profileData.user.id,
                email: profileData.user.email,
                name: profileData.user.name,
                role: profileData.user.role,
                company: profileData.user.company,
                phone: profileData.user.phone,
                avatarUrl: profileData.user.avatar_url,
                completedOnboarding: profileData.user.completedOnboarding ?? (profileData.user.role !== 'pending' && Boolean(profileData.user.role)),
                createdAt: profileData.user.created_at,
              };
              setUser(loggedInUser);
              localStorage.setItem('cab_user', JSON.stringify(loggedInUser));
              
              // Clean URL query parameters
              const url = new URL(window.location.href);
              url.searchParams.delete('insforge_code');
              window.history.replaceState({}, document.title, url.pathname);
              setView('portal');
              return;
            }
          }

          // If profile doesn't exist, auto-create profile via InsForge client SDK
          const pendingRole = localStorage.getItem('pending_oauth_role') || 'user';
          localStorage.removeItem('pending_oauth_role');

          const newProfile = {
            id: userId,
            email,
            name: name || email.split('@')[0],
            role: pendingRole,
            company: '',
            phone: '',
            avatar_url: '',
            updated_at: new Date().toISOString()
          };

          await insforgeClient.database.from('users_profiles').upsert([newProfile]);

          const loggedInUser = {
            id: userId,
            email,
            name: name || email.split('@')[0],
            role: pendingRole,
            company: '',
            phone: '',
            avatarUrl: '',
            createdAt: new Date().toISOString(),
          };
          setUser(loggedInUser);
          localStorage.setItem('cab_user', JSON.stringify(loggedInUser));
          
          // Clean URL query parameters
          const url = new URL(window.location.href);
          url.searchParams.delete('insforge_code');
          window.history.replaceState({}, document.title, url.pathname);
          setView('portal');
          return;
        }
      } catch (err) {
        console.error('Failed to sync InsForge auth session:', err);
      }

      // Fallback to local storage if no active InsForge session detected
      try {
        const savedUser = localStorage.getItem('cab_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.warn('Local session retrieval bypassed.');
      }
    };

    syncSession();
  }, []);

  const handleLogin = (authenticatedUser: any) => {
    setUser(authenticatedUser);
    localStorage.setItem('cab_user', JSON.stringify(authenticatedUser));
    setView('portal');
  };

  const handleLogout = async () => {
    try {
      await insforgeClient.auth.signOut();
    } catch (e) {
      console.warn('InsForge signOut bypassed.');
    }
    setUser(null);
    localStorage.removeItem('cab_user');
    setView('home');
  };

  const handleNavigate = (targetView: string, params: any = null) => {
    setView(targetView);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Demo Vacancies inside Careers view
  const careers = [
    {
      id: 'job-1',
      title: 'Senior Fluid & Filtration Systems Engineer',
      department: 'Water Engineering',
      location: 'Anyirawase, Awudome HQ (with site travel)',
      type: 'Full-Time (Contract)',
      salary: '$6,500 - $8,200 / month',
      desc: 'Design reverse osmosis water treatment units and automated solar drip loops. Requires 5+ years experience with high-pressure pumps and ASME fluid dynamics.'
    },
    {
      id: 'job-2',
      title: 'Lead Agronomist & Organic Chemist',
      department: 'Agriculture Advisory',
      location: 'Keta Basin and Volta Region',
      type: 'Full-Time',
      salary: '$5,000 - $6,400 / month',
      desc: 'Oversee soil macronutrient mapping, design custom organic fertilizer recipes, and guide greenhouse crop rotation systems for cooperative onion/maize projects.'
    },
    {
      id: 'job-3',
      title: 'autonomous Greenhouse Telemetry Specialist',
      department: 'Agriculture Technology',
      location: 'Ashanti Regional Park',
      type: 'Full-Time (Remote hybrid)',
      salary: '$4,500 - $5,800 / month',
      desc: 'Deploy and calibrate IoT soil probes, automated air vents, and humidity dampers inside poly-greenhouse complexes. Experience with PLC programming preferred.'
    }
  ];

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail || !applyJob) return;

    try {
      await submitContactMessage({
        name: applicantName,
        email: applicantEmail,
        subject: `Job Application: ${applyJob.title}`,
        department: 'Human Resources & Careers',
        message: `Applicant Name: ${applicantName}\nApplicant Email: ${applicantEmail}\nCV Portfolios: ${applicantCVLink || 'See attached registry'}\nTarget vacancy: ${applyJob.title}`
      });

      setApplySuccess(true);
      setApplicantName('');
      setApplicantEmail('');
      setApplicantCVLink('');
      setTimeout(() => {
        setApplySuccess(false);
        setApplyJob(null);
      }, 5000);
    } catch (err) {
      console.error('Job application submission error:', err);
    }
  };

  // Render Page Content Router
  const renderViewContent = () => {
    switch (view) {
      case 'home':
        return <HomeView onNavigate={handleNavigate} />;
      
      case 'about':
        return <AboutView />;
      
      case 'services':
        return (
          <ServicesView 
            onNavigate={handleNavigate} 
            initialCategory={viewParams?.category || 'agriculture'} 
          />
        );
      
      case 'products':
        return <ProductsView onNavigate={handleNavigate} user={user} />;
      
      case 'projects':
        return <ProjectsView user={user} />;
      
      case 'blog':
        return <BlogView />;

      case 'careers':
        return (
          <div className="space-y-16 pb-20 pt-10">
            {/* Header */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
              <span className="text-xs font-black tracking-widest text-brand-blue uppercase font-mono">Join Our Mission</span>
              <h1 className="text-4xl sm:text-6xl font-black text-brand-dark tracking-tight leading-none">
                Enterprise Vacancies
              </h1>
              <p className="text-brand-dark/60 text-xs sm:text-base max-w-2xl mx-auto">
                C.A.B is hiring certified soil chemists, mechanical filtration developers, and telemetry technicians. Build durable, resource-secure communities with us.
              </p>
            </section>

            {/* List Careers */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              {applyJob ? (
                // Application Form Block
                <div className="p-8 bg-white rounded-3xl border border-black/5 shadow-xl space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-brand-blue">Direct Application</span>
                      <h3 className="font-extrabold text-sm sm:text-lg text-brand-dark">{applyJob.title}</h3>
                    </div>
                    <button 
                      onClick={() => setApplyJob(null)}
                      className="px-3 py-1.5 rounded-lg bg-gray-50 text-brand-dark hover:bg-gray-100 text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>

                  {applySuccess ? (
                    <div className="p-8 text-center space-y-4 bg-brand-blue/5 border border-brand-blue/10 rounded-2xl">
                      <CheckCircle size={44} className="text-brand-blue mx-auto" />
                      <h4 className="font-extrabold text-sm text-brand-dark">Application Telemetry Dispatched</h4>
                      <p className="text-brand-dark/65 text-xs max-w-sm mx-auto leading-relaxed">
                        Your professional dossier has been registered with C.A.B Human Resources division. We will notify you via corporate email shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleApplySubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-brand-dark/45">Full Name</label>
                          <input
                            type="text"
                            required
                            value={applicantName}
                            onChange={(e) => setApplicantName(e.target.value)}
                            placeholder="John Mahama..."
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-brand-dark/45">Email Address</label>
                          <input
                            type="email"
                            required
                            value={applicantEmail}
                            onChange={(e) => setApplicantEmail(e.target.value)}
                            placeholder="j.mahama@gmail.com..."
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-brand-dark/45">Dossier / CV Portfolio Link (e.g. Google Drive, LinkedIn)</label>
                        <input
                          type="url"
                          required
                          value={applicantCVLink}
                          onChange={(e) => setApplicantCVLink(e.target.value)}
                          placeholder="https://drive.google.com/your-resume-pdf..."
                          className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs"
                        />
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button
                          type="submit"
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-green to-brand-blue text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer hover:brightness-110 hover:shadow-md transition"
                        >
                          <Send size={14} />
                          <span>Submit Application</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                careers.map((job) => (
                  <div key={job.id} className="p-6 sm:p-8 bg-white border border-black/5 rounded-3xl hover:shadow-md transition space-y-6 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-brand-dark/40 font-mono">
                        <span className="flex items-center space-x-1">
                          <Briefcase size={12} className="text-brand-blue" />
                          <span>{job.department}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <MapPin size={12} className="text-brand-blue" />
                          <span>{job.location}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Clock size={12} className="text-brand-gold" />
                          <span>{job.type}</span>
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-extrabold text-brand-dark tracking-tight leading-snug">
                        {job.title}
                      </h3>

                      <p className="text-brand-dark/70 text-xs sm:text-sm leading-relaxed">
                        {job.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <span className="text-xs font-mono font-bold text-brand-blue">Est. Value: {job.salary}</span>
                      <button
                        onClick={() => setApplyJob(job)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-green to-brand-blue text-white font-black text-xs cursor-pointer flex items-center space-x-1.5 shadow-sm active:scale-95 hover:brightness-110 transition"
                      >
                        <span>Apply for vacancy</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </section>
          </div>
        );

      case 'contact':
        return (
          <ContactView 
            initialTab={viewParams?.tab || 'message'} 
            preFilledDetails={viewParams?.preFilledDetails || ''}
            departmentParam={viewParams?.department || ''}
          />
        );
      
      case 'portal':
        return (
          <PortalView 
            user={user} 
            onLogin={handleLogin} 
            onLogout={handleLogout} 
            onNavigate={handleNavigate}
          />
        );

      case 'real-estate':
        return (
          <RealEstateView 
            onNavigate={handleNavigate}
            user={user}
          />
        );

      case 'agriculture-sector':
        return (
          <ServicesView 
            onNavigate={handleNavigate} 
            initialCategory="agriculture" 
          />
        );

      case 'water-solutions':
        return (
          <ServicesView 
            onNavigate={handleNavigate} 
            initialCategory="water" 
          />
        );

      case 'company-resources':
        return <CompanyResourcesView onNavigate={handleNavigate} />;

      case 'crop-production':
      case 'greenhouse-farming':
      case 'precision-irrigation':
      case 'agronomy-consultancy':
      case 'reverse-osmosis-plants':
      case 'bottled-mineral-water':
      case 'wastewater-recycling':
      case 'water-quality-testing':
        return <ServiceDetailPage serviceId={view} onNavigate={handleNavigate} />;

      case 'leadership':
        return <LeadershipView onNavigate={handleNavigate} />;

      default:
        return <HomeView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col justify-between relative selection:bg-brand-blue selection:text-white">
      
      {/* 1. STICKY HEADER NAVBAR */}
      <Header 
        currentView={view} 
        onNavigate={handleNavigate} 
        user={user} 
        onLogout={handleLogout}
        cartCount={cartCount}
      />

      {/* 2. CORE VIEW WINDOW */}
      <main className="flex-grow z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, cubicBezier: [0.16, 1, 0.3, 1] }}
          >
            {renderViewContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. GEMINI CONSULTING FLOATING WIDGET */}
      <AiConsultant />

      {/* 4. EXECUTIVE FOOTER */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
