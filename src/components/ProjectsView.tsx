/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, MapPin, Activity, ShieldCheck, CheckCircle2, 
  Plus, Edit, Trash, HelpCircle, X, Send, Award, FileText 
} from 'lucide-react';
import { PROJECTS } from '../data/mockData';
import { Project } from '../types';
import ImageUploader from './ImageUploader';
import { getProjects, saveProject, deleteProject, submitBuyRequest } from '../lib/api';

interface ProjectsViewProps {
  user?: any;
  openPublishModal?: boolean;
  onModalClosed?: () => void;
}

export default function ProjectsView({ user, openPublishModal, onModalClosed }: ProjectsViewProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'agriculture' | 'water' | 'sustainability'>('all');

  // Purchase / System Inquiry Modal States
  const [activeInquireProject, setActiveInquireProject] = useState<Project | null>(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [inquireMessage, setInquireMessage] = useState('');
  const [isSubmittingInquire, setIsSubmittingInquire] = useState(false);
  const [inquireSuccessMessage, setInquireSuccessMessage] = useState('');

  // Admin CRUD States
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [adminTitle, setAdminTitle] = useState('');
  const [adminSlug, setAdminSlug] = useState('');
  const [adminCategory, setAdminCategory] = useState<'agriculture' | 'water' | 'sustainability'>('agriculture');
  const [adminClient, setAdminClient] = useState('');
  const [adminLocation, setAdminLocation] = useState('');
  const [adminDate, setAdminDate] = useState('');
  const [adminDescription, setAdminDescription] = useState('');
  const [adminImageUrl, setAdminImageUrl] = useState('');
  const [adminImageKey, setAdminImageKey] = useState<string | undefined>(undefined);
  const [adminBeforeImage, setAdminBeforeImage] = useState('');
  const [adminAfterImage, setAdminAfterImage] = useState('');
  const [adminStatus, setAdminStatus] = useState('Completed');
  const [adminImpact, setAdminImpact] = useState('');
  const [adminFeatures, setAdminFeatures] = useState('');
  const [adminIsFeatured, setAdminIsFeatured] = useState(false);
  const [adminSeoTitle, setAdminSeoTitle] = useState('');
  const [adminSeoDescription, setAdminSeoDescription] = useState('');
  const [adminSeoKeywords, setAdminSeoKeywords] = useState('');
  const [isSavingAdmin, setIsSavingAdmin] = useState(false);
  const [adminError, setAdminError] = useState('');

  const isAdmin = user?.role === 'admin' || user?.email === 'cabcompanyltd@gmail.com';

  // Load projects from API on boot
  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      if (data && data.length > 0) {
        const mapped = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          client: item.client,
          location: item.location,
          date: item.date,
          description: item.description,
          image: item.image_url || item.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
          beforeImage: item.before_image || item.beforeImage || null,
          afterImage: item.after_image || item.afterImage || null,
          status: item.status || 'Completed',
          impact: item.impact || null,
          features: Array.isArray(item.features) ? item.features : (typeof item.features === 'string' ? JSON.parse(item.features || '[]') : [])
        }));
        setProjects(mapped);
        setLoading(false);
        return;
      }
      throw new Error('No projects in DB');
    } catch (err) {
      console.warn('DB loading projects failed, falling back to static portfolio:', err);
      setProjects(PROJECTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (openPublishModal) {
      setEditingProject(null);
      setAdminTitle('');
      setAdminSlug('');
      setAdminCategory('agriculture');
      setAdminClient('');
      setAdminLocation('');
      setAdminDate('');
      setAdminDescription('');
      setAdminImageUrl('');
      setAdminImageKey(undefined);
      setAdminBeforeImage('');
      setAdminAfterImage('');
      setAdminStatus('Completed');
      setAdminImpact('');
      setAdminFeatures('');
      setAdminIsFeatured(false);
      setAdminSeoTitle('');
      setAdminSeoDescription('');
      setAdminSeoKeywords('');
      setAdminError('');
      setShowAdminForm(true);
      if (onModalClosed) onModalClosed();
    }
  }, [openPublishModal]);

  // Pre-populate user credentials
  useEffect(() => {
    if (activeInquireProject) {
      setBuyerName(user?.name || '');
      setBuyerEmail(user?.email || '');
      setBuyerPhone(user?.phone || '');
      setInquireMessage(`We are interested in commissioning a custom engineering setup modeled on: ${activeInquireProject.title}. Please provide an engineered feasibility assessment and commercial estimate.`);
      setInquireSuccessMessage('');
    }
  }, [activeInquireProject, user]);

  const filteredProjects = projects.filter(p => activeFilter === 'all' || p.category === activeFilter);

  // Submit Inquire Handler
  const handleInquireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInquireProject) return;
    setIsSubmittingInquire(true);
    try {
      await submitBuyRequest({
        itemId: activeInquireProject.id,
        itemType: 'project',
        itemName: activeInquireProject.title,
        buyerName,
        buyerEmail,
        buyerPhone,
        quantity: 1,
        message: inquireMessage,
        priceOffered: null,
      });

      setInquireSuccessMessage(`Inquiry Dispatched! Thank you, ${buyerName}. Your project system consultation ticket has been logged into the CAB admin dashboard. A corporate engineering representative will reach out shortly at ${buyerPhone || buyerEmail}.`);
      setTimeout(() => {
        setActiveInquireProject(null);
      }, 6000);
    } catch (err: any) {
      console.error('Submit inquire error:', err);
      alert(`Error logging inquiry: ${err.message}`);
    } finally {
      setIsSubmittingInquire(false);
    }
  };

  // Open Admin tool to Create Project
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setAdminTitle('');
    setAdminSlug('');
    setAdminCategory('agriculture');
    setAdminClient('');
    setAdminLocation('');
    setAdminDate('');
    setAdminDescription('');
    setAdminImageUrl('');
    setAdminImageKey(undefined);
    setAdminBeforeImage('');
    setAdminAfterImage('');
    setAdminStatus('Completed');
    setAdminImpact('');
    setAdminFeatures('["Engineered design", "Community training"]');
    setAdminIsFeatured(false);
    setAdminSeoTitle('');
    setAdminSeoDescription('');
    setAdminSeoKeywords('');
    setAdminError('');
    setShowAdminForm(true);
  };

  // Open Admin tool to Edit Project
  const handleOpenEditProject = (proj: any) => {
    setEditingProject(proj);
    setAdminTitle(proj.title);
    setAdminSlug(proj.slug || '');
    setAdminCategory(proj.category as any);
    setAdminClient(proj.client || '');
    setAdminLocation(proj.location);
    setAdminDate(proj.date);
    setAdminDescription(proj.description);
    setAdminImageUrl(proj.image || proj.image_url);
    setAdminImageKey(proj.imageKey || proj.image_key);
    setAdminBeforeImage(proj.beforeImage || '');
    setAdminAfterImage(proj.afterImage || '');
    setAdminStatus(proj.status || 'Completed');
    setAdminImpact(proj.impact || '');
    setAdminFeatures(JSON.stringify(proj.features || []));
    setAdminIsFeatured(!!proj.isFeatured);
    setAdminSeoTitle(proj.seoTitle || proj.title || '');
    setAdminSeoDescription(proj.seoDescription || proj.description || '');
    setAdminSeoKeywords(proj.seoKeywords || proj.category || '');
    setAdminError('');
    setShowAdminForm(true);
  };

  // Save Project Handler
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminTitle || !adminCategory || !adminClient || !adminLocation || !adminDate || !adminDescription || !adminImageUrl) {
      setAdminError('Please fill out all required fields.');
      return;
    }

    setIsSavingAdmin(true);
    setAdminError('');

    let parsedFeatures: string[] = [];
    try {
      parsedFeatures = JSON.parse(adminFeatures);
      if (!Array.isArray(parsedFeatures)) {
        throw new Error('Must be a JSON Array');
      }
    } catch (err) {
      parsedFeatures = adminFeatures.split('\n').map(x => x.trim()).filter(Boolean);
    }

    const payload = {
      id: editingProject ? editingProject.id : undefined,
      title: adminTitle,
      slug: adminSlug || adminTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: adminCategory,
      client: adminClient,
      location: adminLocation,
      date: adminDate,
      description: adminDescription,
      image_url: adminImageUrl,
      before_image: adminBeforeImage || null,
      after_image: adminAfterImage || null,
      status: adminStatus,
      impact: adminImpact || null,
      features: parsedFeatures,
    };

    try {
      await saveProject(payload);
      setShowAdminForm(false);
      loadProjects();
    } catch (err: any) {
      console.error('Admin project save error:', err);
      setAdminError(`Error saving project: ${err.message}`);
    } finally {
      setIsSavingAdmin(false);
    }
  };

  // Delete Project Handler
  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you absolutely sure you want to delete this case study project from the portfolio?')) return;
    try {
      await deleteProject(projectId);
      loadProjects();
    } catch (err: any) {
      console.error('Delete project error:', err);
      alert(`Error deleting project: ${err.message}`);
    }
  };

  return (
    <div className="space-y-16 pb-20 pt-28 sm:pt-32">
      
      {/* 1. HERO HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-black tracking-widest text-brand-green uppercase">Corporate Portfolio</span>
        <h1 className="text-4xl sm:text-6xl font-black text-brand-dark tracking-tight leading-none">
          Proven Case Studies
        </h1>
        <p className="text-brand-dark/60 text-xs sm:text-base max-w-2xl mx-auto">
          Explore C.A.B’s successfully completed turnkey physical systems across municipal, commercial, and rural cooperative scales in West Africa.
        </p>

        {isAdmin && (
          <div className="pt-4">
            <button
              onClick={handleOpenAddProject}
              className="px-6 py-3 rounded-xl bg-brand-green text-white font-extrabold text-xs hover:shadow-lg transition flex items-center space-x-2 mx-auto cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Case Study Project</span>
            </button>
          </div>
        )}
      </section>

      {/* 2. FILTERS CONTROLLER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-2">
        {[
          { key: 'all', label: 'All Portfolios' },
          { key: 'agriculture', label: 'Irrigation & Agronomy' },
          { key: 'water', label: 'Water Purification' },
          { key: 'sustainability', label: 'Sustainable Greenhouses' }
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key as any)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition ${
              activeFilter === filter.key 
                ? 'bg-brand-green text-white shadow-md' 
                : 'bg-white text-brand-dark hover:bg-gray-100'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </section>

      {/* 3. CASE STUDY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-24 space-y-4">
            <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-brand-dark/50">Querying Corporate System Logs...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 space-y-4 bg-white rounded-3xl border border-black/5 p-8 max-w-md mx-auto">
            <HelpCircle size={40} className="text-brand-dark/20 mx-auto" />
            <h3 className="font-extrabold text-sm text-brand-dark">No Case Studies Found</h3>
            <p className="text-xs text-brand-dark/50">Try selecting a different portfolio category.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {filteredProjects.map((proj, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={proj.id}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white p-6 sm:p-10 rounded-3xl border border-black/5 relative ${
                    isEven ? '' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Admin Controls */}
                  {isAdmin && (
                    <div className="absolute top-4 right-4 z-20 flex space-x-1">
                      <button
                        onClick={() => handleOpenEditProject(proj)}
                        className="p-2 bg-white rounded-xl border border-black/10 text-brand-dark hover:text-brand-green shadow-md hover:scale-105 transition"
                        title="Edit Project Details"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-2 bg-white rounded-xl border border-black/10 text-red-500 hover:bg-red-50 shadow-md hover:scale-105 transition"
                        title="Delete Project"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  )}
                  
                  {/* Image Block */}
                  <div className={`lg:col-span-5 h-[350px] sm:h-[450px] rounded-2xl overflow-hidden relative ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}>
                    <img 
                      src={proj.image} 
                      alt={proj.title} 
                      className="w-full h-full object-cover filter saturate-100 hover:scale-102 transition duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-brand-dark/95 text-white text-[10px] uppercase font-mono tracking-widest px-3 py-1.5 rounded-full border border-white/10">
                      {proj.category}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-black/5 flex justify-between items-center">
                      <div>
                        <span className="text-[9px] uppercase font-mono text-brand-dark/40 block">Project Status</span>
                        <span className="text-xs font-bold text-brand-dark">{proj.status}</span>
                      </div>
                      <button
                        onClick={() => setActiveInquireProject(proj)}
                        className="px-4 py-2 bg-brand-green text-white font-black text-[10px] uppercase tracking-wider rounded-lg shadow-sm hover:bg-brand-green-dark transition cursor-pointer"
                      >
                        Commission System
                      </button>
                    </div>
                  </div>

                  {/* Info Text block */}
                  <div className={`lg:col-span-7 space-y-6 ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-brand-dark/50">
                      <span className="flex items-center space-x-1">
                        <MapPin size={12} className="text-brand-green" />
                        <span>{proj.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar size={12} className="text-brand-blue" />
                        <span>{proj.date}</span>
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-brand-dark leading-tight tracking-tight">
                      {proj.title}
                    </h2>

                    <div className="space-y-3.5">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-red-500 block">Baseline Challenge & Request:</span>
                        <p className="text-brand-dark/70 text-xs sm:text-sm mt-1 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>

                      {proj.impact && (
                        <div className="border-t border-gray-100 pt-3.5">
                          <span className="text-[10px] uppercase tracking-wider font-extrabold text-brand-green block">C.A.B Engineering Output:</span>
                          <p className="text-brand-dark/70 text-xs sm:text-sm mt-1 leading-relaxed">
                            {proj.impact}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Quantitative metrics badges */}
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-5 rounded-2xl border border-black/5">
                      {(proj.features && proj.features.length > 0 ? proj.features.slice(0, 4) : ["100% Quality Output Verified", "Post-Commissioning Certified"]).map((feat, idx) => (
                        <div key={idx} className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-brand-dark/40 font-mono tracking-wider block">System Feature</span>
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 size={14} className="text-brand-green flex-shrink-0" />
                            <span className="text-xs font-extrabold text-brand-dark line-clamp-1">{feat}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-[10px] text-brand-dark/40 font-mono flex items-center space-x-1.5">
                      <ShieldCheck size={12} className="text-brand-green" />
                      <span>Quality control certificates validated post-commissioning and fully signed-off.</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. INQUIRE SYSTEM / COMMISSION MODAL */}
      <AnimatePresence>
        {activeInquireProject && (
          <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-3 sm:p-6 md:p-8 pt-16 sm:pt-20 pb-12 overflow-y-auto bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[85vh] sm:max-h-[90vh] my-auto border border-black/5"
            >
              <button 
                onClick={() => setActiveInquireProject(null)}
                className="absolute top-4 right-4 p-2 rounded-lg text-brand-dark/40 hover:bg-gray-100 transition"
              >
                <X size={18} />
              </button>

              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <Award size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-green block">Inquire Engineering Consultation</span>
                  <h3 className="text-lg font-black text-brand-dark">Commission System</h3>
                </div>
              </div>

              {inquireSuccessMessage ? (
                <div className="p-6 text-center space-y-4 bg-brand-green-light/20 border border-brand-green/10 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-brand-green text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="font-extrabold text-sm text-brand-dark">Inquiry Dispatched</h4>
                  <p className="text-xs text-brand-dark/70 leading-relaxed max-w-sm mx-auto">
                    {inquireSuccessMessage}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquireSubmit} className="space-y-4">
                  
                  {/* Selected Project snippet */}
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-black/5 flex items-center space-x-3">
                    <img 
                      src={activeInquireProject.image} 
                      alt={activeInquireProject.title} 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <span className="text-[9px] uppercase font-mono text-brand-dark/40">Model Architecture:</span>
                      <p className="text-xs font-bold text-brand-dark leading-tight">{activeInquireProject.title}</p>
                      <span className="text-[10px] text-brand-dark/50">{activeInquireProject.location}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-brand-dark/45">Inquirer Full Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="John Mahama"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-green text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-brand-dark/45">Corporate Email</label>
                      <input 
                        type="email" 
                        required
                        placeholder="john@example.com"
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-green text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-dark/45">Phone Number (Active)</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+233 24 555 1234"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-green text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-dark/45">Consultation Requirements & Specifications</label>
                    <textarea 
                      placeholder="Specify size, physical boundaries, and crop types..."
                      value={inquireMessage}
                      onChange={(e) => setInquireMessage(e.target.value)}
                      rows={4}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-green text-xs resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingInquire}
                    className="w-full py-3.5 rounded-xl bg-brand-green text-white font-black text-xs text-center cursor-pointer hover:shadow-lg hover:bg-brand-green-dark transition flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isSubmittingInquire ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting Inquire Request...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Log Consultation Feedback with Admin</span>
                      </>
                    )}
                  </button>
                  
                  <p className="text-[10px] text-brand-dark/45 text-center leading-relaxed">
                    This inquiry alerts corporate leadership directly. CAB engineers will coordinate site validation and provide physical blueprints.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. ADMIN ADD/EDIT PROJECT MODAL FORM */}
      <AnimatePresence>
        {isAdmin && showAdminForm && (
          <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-3 sm:p-6 md:p-8 pt-16 sm:pt-20 pb-12 overflow-y-auto bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[85vh] sm:max-h-[90vh] my-auto border border-black/5"
            >
              <button 
                onClick={() => setShowAdminForm(false)}
                className="absolute top-4 right-4 p-2 rounded-lg text-brand-dark/40 hover:bg-gray-100 transition"
              >
                <X size={18} />
              </button>

              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <FileText size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-green block">Portfolio Registry Controller</span>
                  <h3 className="text-lg font-black text-brand-dark">
                    {editingProject ? 'Modify Project Case Study' : 'Insert Case Study Project'}
                  </h3>
                </div>
              </div>

              {adminError && (
                <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center space-x-2">
                  <X size={14} />
                  <span>{adminError}</span>
                </div>
              )}

              <form onSubmit={handleSaveProject} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-dark/45">Project Title *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Volta Basin Drip Upgrade"
                      value={adminTitle}
                      onChange={(e) => setAdminTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-green text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-dark/45">Category *</label>
                    <select 
                      value={adminCategory}
                      onChange={(e) => setAdminCategory(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-green text-xs"
                    >
                      <option value="agriculture">Irrigation & Agronomy</option>
                      <option value="water">Water Purification</option>
                      <option value="sustainability">Sustainable Greenhouses</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-dark/45">Client / Partner Organization *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Ministry of Agriculture"
                      value={adminClient}
                      onChange={(e) => setAdminClient(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-green text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-dark/45">Location *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Keta, Volta Region"
                      value={adminLocation}
                      onChange={(e) => setAdminLocation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-green text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-dark/45">Commission Date *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. February 2025"
                      value={adminDate}
                      onChange={(e) => setAdminDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-green text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-dark/45">Project Status *</label>
                    <select 
                      value={adminStatus}
                      onChange={(e) => setAdminStatus(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-green text-xs"
                    >
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Post-Commissioning">Post-Commissioning</option>
                    </select>
                  </div>
                </div>

                <ImageUploader
                  bucket="project-images"
                  imageUrl={adminImageUrl}
                  imageKey={adminImageKey}
                  onUploadSuccess={(url, key) => {
                    setAdminImageUrl(url);
                    setAdminImageKey(key);
                  }}
                  onRemove={() => {
                    setAdminImageUrl('');
                    setAdminImageKey(undefined);
                  }}
                  label="Cover Image (Upload directly to InsForge Storage) *"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ImageUploader
                    bucket="project-images"
                    imageUrl={adminBeforeImage}
                    onUploadSuccess={(url) => setAdminBeforeImage(url)}
                    onRemove={() => setAdminBeforeImage('')}
                    label="Before Image (Optional Upload)"
                  />
                  <ImageUploader
                    bucket="project-images"
                    imageUrl={adminAfterImage}
                    onUploadSuccess={(url) => setAdminAfterImage(url)}
                    onRemove={() => setAdminAfterImage('')}
                    label="After Image (Optional Upload)"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-brand-dark/45">Project Challenge & Request Details *</label>
                  <textarea 
                    required
                    placeholder="Describe the client request and baseline technical crisis..."
                    value={adminDescription}
                    onChange={(e) => setAdminDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-green text-xs resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-brand-dark/45">Impact & Engineering Outputs (Optional)</label>
                  <textarea 
                    placeholder="Quantified achievements, water saved, yield increment, etc..."
                    value={adminImpact}
                    onChange={(e) => setAdminImpact(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-green text-xs resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-brand-dark/45">System Key Features (JSON Array or List)</label>
                  <textarea 
                    placeholder='["Solar pumps with smart frequency converters", "Soil sensor array"]'
                    value={adminFeatures}
                    onChange={(e) => setAdminFeatures(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-green text-xs font-mono resize-none"
                  />
                </div>

                <div className="pt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAdminForm(false)}
                    className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-brand-dark text-xs font-extrabold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingAdmin}
                    className="px-6 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-dark text-white text-xs font-extrabold flex items-center space-x-2"
                  >
                    {isSavingAdmin ? 'Saving Project...' : 'Save Project Portfolio'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
