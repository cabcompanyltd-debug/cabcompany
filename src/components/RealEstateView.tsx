/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Home, Bed, Bath, Car, Video, Map, Download, 
  Share2, Heart, Calendar, Clock, User, Phone, Mail, 
  ArrowRight, Search, Filter, Check, CheckCircle, DollarSign, 
  Building, Trees, Warehouse, Shield, Info, Star, ChevronRight, X,
  Plus, Edit, Trash2, RefreshCw, FileText, ShieldCheck
} from 'lucide-react';
import ImageUploader from './ImageUploader';
import { getProperties, saveProperty, deleteProperty, submitPropertyInquiry } from '../lib/api';

interface Property {
  id: string;
  name: string;
  ref_code: string;
  category: string; // 'residential', 'commercial', 'industrial', 'land'
  type: string; // 'villas', 'apartments', 'offices', 'warehouses', 'agricultural', 'investment'
  description: string;
  price: number;
  status: string; // 'Available', 'Sold', 'Rented', 'Archived'
  location: string;
  city: string;
  district: string;
  region: string;
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  parking: number;
  land_size: string;
  building_size: string;
  image_url: string;
  gallery: string[];
  video_url?: string;
  floor_plans: string[];
  brochure_url?: string;
  virtual_tour_url?: string;
  nearby_schools: string[];
  nearby_hospitals: string[];
  nearby_roads: string[];
  agent_name: string;
  agent_phone: string;
  agent_email: string;
  is_featured: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  reviews?: any[];
  analytics?: { views: number; inquiries: number };
}

interface RealEstateViewProps {
  onNavigate: (view: string, params?: any) => void;
  user?: any;
  openPublishModal?: boolean;
  onModalClosed?: () => void;
}

export default function RealEstateView({ onNavigate, user, openPublishModal, onModalClosed }: RealEstateViewProps) {
  const isAdmin = user?.role === 'admin' || user?.role === 'staff' || user?.role === 'superadmin' || user?.role === 'board' || user?.role === 'executive';
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Publish / Edit Real Estate Listing State
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);
  const [editingProp, setEditingProp] = useState<Property | null>(null);
  const [pubName, setPubName] = useState('');
  const [pubRefCode, setPubRefCode] = useState('');
  const [pubCategory, setPubCategory] = useState('residential');
  const [pubType, setPubType] = useState('villas');
  const [pubPrice, setPubPrice] = useState('');
  const [pubCity, setPubCity] = useState('Accra');
  const [pubLocation, setPubLocation] = useState('');
  const [pubImageUrl, setPubImageUrl] = useState('');
  const [pubImageKey, setPubImageKey] = useState<string | undefined>(undefined);
  const [pubDescription, setPubDescription] = useState('');
  const [pubBedrooms, setPubBedrooms] = useState('3');
  const [pubBathrooms, setPubBathrooms] = useState('2');
  const [pubParking, setPubParking] = useState('2');
  const [pubLandSize, setPubLandSize] = useState('');
  const [pubAgentName, setPubAgentName] = useState('Charles Boateng');
  const [pubAgentPhone, setPubAgentPhone] = useState('+233 54 221 0099');
  const [pubAgentEmail, setPubAgentEmail] = useState('realestate@cabcompanyltd.com');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState('');

  // Navigation / active states
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(4000000);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  // Interactive booking & inquiry forms
  const [bookingType, setBookingType] = useState<'Inspection' | 'Request' | 'Contact'>('Inspection');
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('');
  const [inquiryMessage, setInquiryMessage] = useState<string>('');
  const [inquirySuccess, setInquirySuccess] = useState<boolean>(false);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cab_favorites') || '[]');
    } catch {
      return [];
    }
  });

  // Share overlay
  const [shareOverlay, setShareOverlay] = useState<string | null>(null);

  // Fetch properties from database on mount
  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (openPublishModal) {
      handleOpenPublishModal();
      if (onModalClosed) onModalClosed();
    }
  }, [openPublishModal]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await getProperties();
      setProperties(data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred while loading properties');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPublishModal = (propToEdit?: Property) => {
    if (propToEdit) {
      setEditingProp(propToEdit);
      setPubName(propToEdit.name || '');
      setPubRefCode(propToEdit.ref_code || '');
      setPubCategory(propToEdit.category || 'residential');
      setPubType(propToEdit.type || 'villas');
      setPubPrice(String(propToEdit.price || ''));
      setPubCity(propToEdit.city || 'Accra');
      setPubLocation(propToEdit.location || '');
      setPubImageUrl(propToEdit.image_url || '');
      setPubDescription(propToEdit.description || '');
      setPubBedrooms(String(propToEdit.bedrooms || '3'));
      setPubBathrooms(String(propToEdit.bathrooms || '2'));
      setPubParking(String(propToEdit.parking || '2'));
      setPubLandSize(propToEdit.land_size || '');
      setPubAgentName(propToEdit.agent_name || 'Charles Boateng');
      setPubAgentPhone(propToEdit.agent_phone || '+233 54 221 0099');
      setPubAgentEmail(propToEdit.agent_email || 'realestate@cabcompanyltd.com');
    } else {
      setEditingProp(null);
      setPubName('');
      setPubRefCode('CAB-REAL-' + Math.floor(Math.random() * 900 + 100));
      setPubCategory('residential');
      setPubType('villas');
      setPubPrice('');
      setPubCity('Accra');
      setPubLocation('');
      setPubImageUrl('');
      setPubDescription('');
      setPubBedrooms('3');
      setPubBathrooms('2');
      setPubParking('2');
      setPubLandSize('');
      setPubAgentName('Charles Boateng');
      setPubAgentPhone('+233 54 221 0099');
      setPubAgentEmail('realestate@cabcompanyltd.com');
    }
    setPublishSuccessMsg('');
    setShowPublishModal(true);
  };

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubName || !pubRefCode || !pubPrice || !pubLocation || !pubImageUrl || !pubDescription) {
      alert('Please fill in all required fields including uploading a property image.');
      return;
    }

    setIsPublishing(true);
    try {
      const payload = {
        id: editingProp ? editingProp.id : undefined,
        title: pubName,
        name: pubName,
        ref_code: pubRefCode,
        category: pubCategory,
        type: pubType,
        price: Number(pubPrice),
        city: pubCity,
        location: pubLocation,
        image_url: pubImageUrl,
        description: pubDescription,
        bedrooms: Number(pubBedrooms) || 0,
        bathrooms: Number(pubBathrooms) || 0,
        parking: Number(pubParking) || 0,
        land_size: pubLandSize || 'N/A',
        agent_name: pubAgentName,
        agent_phone: pubAgentPhone,
        agent_email: pubAgentEmail,
      };

      await saveProperty(payload);

      setPublishSuccessMsg(editingProp ? 'Property updated successfully!' : 'Property published to catalog live!');
      await fetchProperties();
      setTimeout(() => {
        setShowPublishModal(false);
        setEditingProp(null);
        setPublishSuccessMsg('');
      }, 1500);
    } catch (err: any) {
      console.error('Publish real estate error:', err);
      alert(err.message || 'Error saving property listing');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteProperty = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm('Are you sure you want to remove this property listing?')) return;

    try {
      await deleteProperty(id);
      if (selectedProperty?.id === id) setSelectedProperty(null);
      await fetchProperties();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('cab_favorites', JSON.stringify(updated));
  };

  const handleInquirySubmit = async (e: React.FormEvent, prop: Property) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone || !inquiryMessage) return;

    try {
      await submitPropertyInquiry({
        propertyId: prop.id,
        propertyTitle: prop.name,
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        message: inquiryMessage,
      });

      setInquirySuccess(true);
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setPreferredDate('');
      setPreferredTime('');
      setInquiryMessage('');
      setTimeout(() => setInquirySuccess(false), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const triggerShare = (prop: Property, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = `${window.location.origin}/#real-estate/property/${prop.id}`;
    if (navigator.share) {
      navigator.share({
        title: prop.name,
        text: prop.description,
        url: link
      }).catch(console.error);
    } else {
      setShareOverlay(link);
      setTimeout(() => {
        setShareOverlay(null);
      }, 3000);
    }
  };

  // Filter logic
  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.ref_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.district.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesType = selectedType === 'all' || p.type === selectedType;
    const matchesPrice = p.price <= maxPrice;
    const matchesLocation = selectedLocation === 'all' || p.city.toLowerCase() === selectedLocation.toLowerCase();

    return matchesSearch && matchesCategory && matchesType && matchesPrice && matchesLocation;
  });

  const featuredListings = properties.filter(p => p.is_featured);

  // List unique cities for dropdown
  const uniqueCities = Array.from(new Set(properties.map(p => p.city)));

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-[#1A1A1A]">
      
      {/* Property Details View Modal/Overlay */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100] overflow-y-auto flex items-start justify-center pt-16 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-8"
          >
            <motion.div 
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl relative max-h-[85vh] sm:max-h-[90vh] overflow-y-auto"
            >
              {/* Close & Action Buttons */}
              <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
                <button 
                  onClick={(e) => {
                    setSelectedProperty(null);
                    handleOpenPublishModal(selectedProperty);
                  }}
                  className="bg-white/90 hover:bg-white text-brand-dark p-2.5 rounded-full shadow-lg transition duration-200 flex items-center justify-center cursor-pointer"
                  title="Edit Property"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={(e) => handleDeleteProperty(selectedProperty.id, e)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-full shadow-lg transition duration-200 flex items-center justify-center cursor-pointer"
                  title="Delete Property"
                >
                  <Trash2 size={16} />
                </button>
                <button 
                  onClick={() => setSelectedProperty(null)}
                  className="bg-white/90 hover:bg-white text-black p-2.5 rounded-full shadow-lg transition duration-200 flex items-center justify-center cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Property Hero Image */}
              <div className="h-80 sm:h-[420px] relative overflow-hidden bg-gray-100">
                <img 
                  src={selectedProperty.image_url} 
                  alt={selectedProperty.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-10">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 bg-gradient-to-r from-[#059669] to-[#2563EB] text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                      {selectedProperty.category}
                    </span>
                    <span className="px-3 py-1 bg-[#4169E1] text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                      {selectedProperty.type}
                    </span>
                    <span className="px-3 py-1 bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-sm">
                      Ref: {selectedProperty.ref_code}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {selectedProperty.name}
                  </h1>
                  <p className="text-white/80 text-xs sm:text-sm mt-1.5 flex items-center">
                    <MapPin size={14} className="text-[#4169E1] mr-1.5" />
                    {selectedProperty.location}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main details */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* Basic Metadata Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#EDF2FF]/40 rounded-2xl border border-[#4169E1]/10">
                    <div className="text-center sm:border-r border-gray-100 py-1">
                      <p className="text-[10px] font-bold uppercase text-gray-400">Price</p>
                      <p className="text-lg font-extrabold text-[#4169E1] mt-0.5">
                        ${selectedProperty.price.toLocaleString()}
                      </p>
                    </div>
                    {selectedProperty.bedrooms > 0 && (
                      <div className="text-center sm:border-r border-gray-100 py-1">
                        <p className="text-[10px] font-bold uppercase text-gray-400">Bedrooms</p>
                        <p className="text-sm font-extrabold text-[#1A1A1A] mt-1 flex items-center justify-center gap-1">
                          <Bed size={14} className="text-[#4169E1]" /> {selectedProperty.bedrooms}
                        </p>
                      </div>
                    )}
                    {selectedProperty.bathrooms > 0 && (
                      <div className="text-center sm:border-r border-gray-100 py-1">
                        <p className="text-[10px] font-bold uppercase text-gray-400">Bathrooms</p>
                        <p className="text-sm font-extrabold text-[#1A1A1A] mt-1 flex items-center justify-center gap-1">
                          <Bath size={14} className="text-[#4169E1]" /> {selectedProperty.bathrooms}
                        </p>
                      </div>
                    )}
                    <div className="text-center py-1">
                      <p className="text-[10px] font-bold uppercase text-gray-400">Land Size</p>
                      <p className="text-xs font-extrabold text-[#1A1A1A] mt-1">
                        {selectedProperty.land_size || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-black text-[#1A1A1A] tracking-tight">Property Overview</h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                      {selectedProperty.description}
                    </p>
                  </div>

                  {/* Gallery */}
                  {selectedProperty.gallery && selectedProperty.gallery.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-black text-[#1A1A1A] tracking-tight">Image Gallery</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {selectedProperty.gallery.map((img, i) => (
                          <div key={i} className="h-24 sm:h-36 rounded-xl overflow-hidden bg-gray-100 group cursor-pointer border border-black/5">
                            <img 
                              src={img} 
                              alt={`Gallery ${i}`} 
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Amenities */}
                  {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-black text-[#1A1A1A] tracking-tight">Premium Amenities</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {selectedProperty.amenities.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-2 p-3 bg-[#F8F9FA] rounded-xl border border-gray-100">
                            <div className="bg-[#EDF2FF] p-1 rounded-full text-[#4169E1]">
                              <Check size={12} />
                            </div>
                            <span className="text-xs font-medium text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Nearbys */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-[#1A1A1A] tracking-tight">Neighborhood & Proximity</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-[#EDF2FF]/40 border border-[#4169E1]/10 rounded-2xl">
                        <p className="text-[10px] font-bold text-[#4169E1] uppercase mb-2">Nearby Schools</p>
                        <ul className="space-y-1.5">
                          {selectedProperty.nearby_schools.map((item, i) => (
                            <li key={i} className="text-[11px] text-gray-600 flex items-start gap-1">
                              <span className="text-[#4169E1]">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 bg-[#EDF2FF]/40 border border-[#4169E1]/10 rounded-2xl">
                        <p className="text-[10px] font-bold text-[#4169E1] uppercase mb-2">Nearby Medical Centers</p>
                        <ul className="space-y-1.5">
                          {selectedProperty.nearby_hospitals.map((item, i) => (
                            <li key={i} className="text-[11px] text-gray-600 flex items-start gap-1">
                              <span className="text-[#4169E1]">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 bg-[#EDF2FF]/40 border border-[#4169E1]/10 rounded-2xl">
                        <p className="text-[10px] font-bold text-[#4169E1] uppercase mb-2">Major Roads</p>
                        <ul className="space-y-1.5">
                          {selectedProperty.nearby_roads.map((item, i) => (
                            <li key={i} className="text-[11px] text-gray-600 flex items-start gap-1">
                              <span className="text-[#4169E1]">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Virtual Tour Mock / Video */}
                  <div className="p-6 bg-gradient-to-br from-[#1A1A1A] to-gray-800 rounded-3xl text-white space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-extrabold text-sm">3D Virtual Guided Tour</h4>
                        <p className="text-white/65 text-[10px]">Step inside the property from anywhere in the world.</p>
                      </div>
                      <Video size={18} className="text-[#4169E1]" />
                    </div>
                    <div className="aspect-video bg-black/40 rounded-2xl relative overflow-hidden flex items-center justify-center border border-white/5">
                      <img 
                        src={selectedProperty.image_url} 
                        className="absolute inset-0 w-full h-full object-cover opacity-30 filter blur-sm"
                        alt="Virtual preview"
                        referrerPolicy="no-referrer"
                      />
                      <div className="z-10 text-center space-y-2 max-w-sm px-4">
                        <p className="text-xs font-bold">Interactive virtual render model loaded</p>
                        <button 
                          onClick={() => alert('Launching immersive 3D virtual viewport. This allows spatial tour of all floors.')}
                          className="px-4 py-2 bg-gradient-to-r from-[#059669] to-[#2563EB] text-white font-black text-[10px] rounded-lg tracking-wide uppercase hover:brightness-110 transition"
                        >
                          Start Immersive Walkthrough
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Sidebar Inquiry Column */}
                <div className="space-y-6">
                  {/* Brochure Download & Action Panel */}
                  <div className="p-6 bg-[#F8F9FA] border border-gray-100 rounded-3xl space-y-4">
                    <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-widest">Dossier Downloads</h4>
                    <button 
                      onClick={() => alert(`Brochure dispatch queued. Downloading C.A.B Real Estate PDF metadata for ref ${selectedProperty.ref_code}`)}
                      className="w-full py-3 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-[#1A1A1A] rounded-xl text-xs font-black transition flex items-center justify-between shadow-sm"
                    >
                      <span className="flex items-center gap-1.5">
                        <Download size={14} className="text-[#4169E1]" />
                        Download Property Brochure
                      </span>
                      <span className="text-[10px] text-gray-400">PDF (4.2 MB)</span>
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={(e) => triggerShare(selectedProperty, e)}
                        className="py-2.5 px-3 bg-white hover:bg-gray-50 border border-gray-200 text-[#1A1A1A] rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Share2 size={13} className="text-[#4169E1]" />
                        Share
                      </button>
                      <button 
                        onClick={() => toggleFavorite(selectedProperty.id)}
                        className={`py-2.5 px-3 border text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm ${
                          favorites.includes(selectedProperty.id) 
                            ? 'bg-[#EDF2FF] border-[#4169E1]/20 text-[#4169E1]' 
                            : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                        }`}
                      >
                        <Heart size={13} className={favorites.includes(selectedProperty.id) ? 'fill-[#4169E1] text-[#4169E1]' : 'text-gray-400'} />
                        {favorites.includes(selectedProperty.id) ? 'Saved' : 'Favorite'}
                      </button>
                    </div>
                  </div>

                  {/* Contact Agent Info */}
                  <div className="p-6 bg-white border border-gray-100 rounded-3xl space-y-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" 
                          alt={selectedProperty.agent_name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Listing Officer</p>
                        <h5 className="font-extrabold text-xs text-[#1A1A1A]">{selectedProperty.agent_name}</h5>
                        <p className="text-[10px] text-[#4169E1] font-bold">C.A.B Executive Agent</p>
                      </div>
                    </div>
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <a href={`tel:${selectedProperty.agent_phone}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#4169E1] transition">
                        <Phone size={12} className="text-[#4169E1]" />
                        <span>{selectedProperty.agent_phone}</span>
                      </a>
                      <a href={`mailto:${selectedProperty.agent_email}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#4169E1] transition">
                        <Mail size={12} className="text-[#4169E1]" />
                        <span>{selectedProperty.agent_email}</span>
                      </a>
                    </div>
                  </div>

                  {/* Booking / Inquiry Form */}
                  <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-4">
                    <h4 className="font-black text-sm text-[#1A1A1A]">Inquiry & Site Inspection</h4>
                    
                    <div className="flex bg-[#F8F9FA] p-1 rounded-xl">
                      {(['Inspection', 'Request', 'Contact'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setBookingType(t)}
                          className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                            bookingType === t 
                              ? 'bg-[#4169E1] text-white shadow' 
                              : 'text-gray-500 hover:text-black'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    {inquirySuccess ? (
                      <div className="p-4 bg-[#EDF2FF] border border-[#4169E1]/10 rounded-2xl text-center space-y-2">
                        <CheckCircle size={32} className="text-[#4169E1] mx-auto" />
                        <h5 className="font-extrabold text-xs text-[#1A1A1A]">Inquiry Registered</h5>
                        <p className="text-gray-600 text-[10px] leading-relaxed">
                          Your request has been logged. {selectedProperty.agent_name} will get in touch shortly to confirm.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={(e) => handleInquirySubmit(e, selectedProperty)} className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-gray-400">Your Name</label>
                          <input 
                            type="text" 
                            required
                            placeholder="John Mahama" 
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4169E1]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-gray-400">Email</label>
                            <input 
                              type="email" 
                              required
                              placeholder="j.mahama@gmail.com" 
                              value={clientEmail}
                              onChange={(e) => setClientEmail(e.target.value)}
                              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4169E1]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-gray-400">Phone</label>
                            <input 
                              type="tel" 
                              required
                              placeholder="+233 54 000 0000" 
                              value={clientPhone}
                              onChange={(e) => setClientPhone(e.target.value)}
                              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4169E1]"
                            />
                          </div>
                        </div>

                        {bookingType === 'Inspection' && (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[9px] uppercase font-bold text-gray-400">Preferred Date</label>
                              <input 
                                type="date" 
                                required
                                value={preferredDate}
                                onChange={(e) => setPreferredDate(e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4169E1]"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] uppercase font-bold text-gray-400">Time</label>
                              <input 
                                type="time" 
                                required
                                value={preferredTime}
                                onChange={(e) => setPreferredTime(e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4169E1]"
                              />
                            </div>
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-gray-400">Special Instructions / Message</label>
                          <textarea 
                            rows={3}
                            required
                            placeholder="I would like to enquire about structural details..."
                            value={inquiryMessage}
                            onChange={(e) => setInquiryMessage(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4169E1]"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#4169E1] hover:bg-[#2E52C7] text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md"
                        >
                          Submit {bookingType}
                        </button>
                      </form>
                    )}
                  </div>
                </div>

              </div>

              {/* Related Properties */}
              {properties.filter(p => p.category === selectedProperty.category && p.id !== selectedProperty.id).length > 0 && (
                <div className="p-6 sm:p-10 bg-gray-50 border-t border-gray-100">
                  <h3 className="text-lg font-black text-[#1A1A1A] mb-4">Related Luxury Properties</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {properties
                      .filter(p => p.category === selectedProperty.category && p.id !== selectedProperty.id)
                      .slice(0, 3)
                      .map((prop) => (
                        <div 
                          key={prop.id}
                          onClick={() => {
                            setSelectedProperty(prop);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer"
                        >
                          <div className="h-40 relative bg-gray-100">
                            <img src={prop.image_url} alt={prop.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute top-2 right-2 px-2.5 py-1 bg-white/95 text-[#4169E1] text-[9px] font-black uppercase rounded-lg shadow">
                              ${prop.price.toLocaleString()}
                            </div>
                          </div>
                          <div className="p-4 space-y-1">
                            <h4 className="font-extrabold text-xs text-[#1A1A1A] truncate">{prop.name}</h4>
                            <p className="text-[10px] text-gray-500 flex items-center">
                              <MapPin size={10} className="mr-1 text-[#4169E1]" /> {prop.city}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Toast Notification */}
      {shareOverlay && (
        <div className="fixed bottom-10 right-10 bg-black text-white px-5 py-3 rounded-xl shadow-2xl z-50 text-xs font-bold flex items-center space-x-2">
          <span>Property link copied to clipboard!</span>
        </div>
      )}

      {/* Publish / Edit Real Estate Listing Modal */}
      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-3 sm:p-6 md:p-8 pt-16 sm:pt-20 pb-12 overflow-y-auto bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-y-auto max-h-[85vh] sm:max-h-[90vh] my-auto border border-black/5"
            >
              <div className="bg-gradient-to-r from-brand-green to-brand-green-dark p-6 text-white flex justify-between items-center sticky top-0 z-10">
                <div>
                  <h3 className="font-black text-lg font-sans">
                    {editingProp ? 'Modify Luxury Property' : 'Publish Luxury Property'}
                  </h3>
                  <p className="text-xs opacity-80 font-sans">
                    {editingProp ? 'Update existing real estate listing specs in C.A.B database' : 'Register and publish a new premium listing to the live C.A.B catalog'}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setShowPublishModal(false);
                    setEditingProp(null);
                  }}
                  className="p-2 rounded-full bg-white/15 hover:bg-white/25 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {publishSuccessMsg && (
                <div className="m-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
                  <ShieldCheck size={16} />
                  <span>{publishSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handlePublishSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-brand-dark/50">Property Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Volta Eco Sanctuary Villa"
                      value={pubName}
                      onChange={(e) => setPubName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-green text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-brand-dark/50">Reference Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CAB-REAL-101"
                      value={pubRefCode}
                      onChange={(e) => setPubRefCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-green text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-brand-dark/50">Sector Category</label>
                    <select
                      value={pubCategory}
                      onChange={(e) => setPubCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-green text-xs"
                    >
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="industrial">Industrial</option>
                      <option value="land">Agricultural Land</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-brand-dark/50">Asset Type</label>
                    <select
                      value={pubType}
                      onChange={(e) => setPubType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-green text-xs"
                    >
                      <option value="villas">Eco Villa</option>
                      <option value="apartments">Luxury Apartment</option>
                      <option value="offices">Executive Office Suite</option>
                      <option value="warehouses">Industrial Warehouse</option>
                      <option value="agricultural">Agricultural Green Block</option>
                      <option value="investment">Strategic Reserve Land</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-brand-dark/50">Price (USD) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 450000"
                      value={pubPrice}
                      onChange={(e) => setPubPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-green text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-brand-dark/50">City / Region</label>
                    <select
                      value={pubCity}
                      onChange={(e) => setPubCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-green text-xs"
                    >
                      <option value="Accra">Accra</option>
                      <option value="Kumasi">Kumasi</option>
                      <option value="Takoradi">Takoradi</option>
                      <option value="Tamale">Tamale</option>
                      <option value="Volta">Volta Region</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-brand-dark/50">Full Address Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Plot 42, Airport Residential Area, Accra"
                    value={pubLocation}
                    onChange={(e) => setPubLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-green text-xs"
                  />
                </div>

                <ImageUploader
                  bucket="property-images"
                  imageUrl={pubImageUrl}
                  imageKey={pubImageKey}
                  onUploadSuccess={(url, key) => {
                    setPubImageUrl(url);
                    setPubImageKey(key);
                  }}
                  onRemove={() => {
                    setPubImageUrl('');
                    setPubImageKey(undefined);
                  }}
                  label="Main Property Image (Upload directly to InsForge Storage) *"
                />

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-brand-dark/50">Bedrooms</label>
                    <input
                      type="number"
                      value={pubBedrooms}
                      onChange={(e) => setPubBedrooms(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-black/5 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-brand-dark/50">Bathrooms</label>
                    <input
                      type="number"
                      value={pubBathrooms}
                      onChange={(e) => setPubBathrooms(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-black/5 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-brand-dark/50">Parking</label>
                    <input
                      type="number"
                      value={pubParking}
                      onChange={(e) => setPubParking(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-black/5 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black text-brand-dark/50">Overview Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the structural specs, solar integration, irrigation access, or location perks..."
                    value={pubDescription}
                    onChange={(e) => setPubDescription(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-green text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPublishing}
                  className="w-full py-3.5 bg-brand-green hover:bg-brand-green-dark text-white font-black text-xs rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isPublishing ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <>
                      <Check size={14} />
                      <span>{editingProp ? 'Update Property Listing' : 'Publish Real Estate Listing'}</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Banner Section with mobile top padding for sticky header */}
      <section className="relative pt-28 pb-14 sm:pt-32 sm:pb-20 bg-gradient-to-br from-[#1E40AF] via-[#059669] to-[#0F172A] text-white overflow-hidden">
        {/* Background Overlay Art */}
        <div className="absolute inset-0 opacity-15 mix-blend-overlay">
          <div className="absolute inset-0 bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1.5 bg-white/15 border border-white/20 text-white rounded-full text-[11px] font-black tracking-widest uppercase font-mono shadow-sm">
                Luxury Real Estate Division
              </span>
              <button 
                onClick={() => handleOpenPublishModal()}
                className="px-4 py-1.5 bg-brand-green hover:bg-brand-green-dark text-white rounded-full text-[11px] font-black tracking-wider uppercase transition flex items-center space-x-1 shadow-md cursor-pointer"
              >
                <Plus size={13} />
                <span>Publish Real Estate</span>
              </button>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              High-Yield Lands & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34D399] via-[#60A5FA] to-white">Premium Residences</span>
            </h1>
            <p className="text-white/85 text-xs sm:text-base max-w-xl leading-relaxed">
              C.A.B Real Estate seamlessly integrates premium agricultural blocks, world-class eco-villas, commercial hubs, and strategic warehouses. We match durable structural engineering with certified deeds.
            </p>

            {/* Quick Action Category Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button 
                onClick={() => handleOpenPublishModal()}
                className="px-4 py-2 bg-gradient-to-r from-brand-green to-emerald-600 hover:from-emerald-600 hover:to-brand-green text-white font-black text-xs rounded-xl shadow-lg transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus size={15} />
                <span>Publish Real Estate Listing</span>
              </button>
              <button 
                onClick={() => { setSelectedCategory('residential'); }}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Home size={13} className="text-[#60A5FA]" />
                <span>Residential</span>
              </button>
              <button 
                onClick={() => { setSelectedCategory('commercial'); }}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Building size={13} className="text-[#60A5FA]" />
                <span>Commercial</span>
              </button>
              <button 
                onClick={() => { setSelectedCategory('industrial'); }}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Warehouse size={13} className="text-[#60A5FA]" />
                <span>Industrial</span>
              </button>
              <button 
                onClick={() => { setSelectedCategory('land'); }}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trees size={13} className="text-[#34D399]" />
                <span>Land Blocks</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Grid (Bento style) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4 mt-2 lg:mt-0">
            <div className="p-4 sm:p-5 bg-white/10 border border-white/15 rounded-2xl backdrop-blur-md space-y-1">
              <p className="text-[9px] sm:text-[10px] uppercase font-bold text-white/70 tracking-widest">Acreage Managed</p>
              <h4 className="text-xl sm:text-3xl font-black text-[#60A5FA]">4,200+</h4>
              <p className="text-[9px] sm:text-[10px] text-white/70">Fully Certified Deeds</p>
            </div>
            <div className="p-4 sm:p-5 bg-white/10 border border-white/15 rounded-2xl backdrop-blur-md space-y-1">
              <p className="text-[9px] sm:text-[10px] uppercase font-bold text-white/70 tracking-widest">Premium Assets</p>
              <h4 className="text-xl sm:text-3xl font-black text-[#34D399]">$45M+</h4>
              <p className="text-[9px] sm:text-[10px] text-white/70">Portfolio Valuation</p>
            </div>
            <div className="p-4 sm:p-5 bg-white/10 border border-white/15 rounded-2xl backdrop-blur-md space-y-1">
              <p className="text-[9px] sm:text-[10px] uppercase font-bold text-white/70 tracking-widest">Site Engineers</p>
              <h4 className="text-xl sm:text-3xl font-black text-[#60A5FA]">45+</h4>
              <p className="text-[9px] sm:text-[10px] text-white/70">Quality Supervisors</p>
            </div>
            <div className="p-4 sm:p-5 bg-gradient-to-br from-[#059669] to-[#1E40AF] text-white rounded-2xl space-y-1 shadow-lg border border-white/20">
              <p className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest opacity-80">Certifications</p>
              <h4 className="text-lg sm:text-2xl font-black leading-none">100% Certified</h4>
              <p className="text-[9px] sm:text-[10px] font-medium opacity-90">No Litigations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Filter Workspace */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:-mt-12 relative z-30">
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-black/5 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-[#1A1A1A]">Search Property Catalog</h3>
              <p className="text-gray-400 text-xs">Filter by categories, regions, pricing, or keywords.</p>
            </div>
            <div className="flex items-center space-x-2">
              {isAdmin && (
                <button
                  onClick={() => handleOpenPublishModal()}
                  className="px-3.5 py-1.5 bg-brand-green hover:bg-brand-green-dark text-white font-extrabold text-xs rounded-xl flex items-center space-x-1.5 shadow transition cursor-pointer mr-2"
                >
                  <Plus size={14} />
                  <span>Publish Property</span>
                </button>
              )}
              <span className="w-2.5 h-2.5 bg-[#4169E1] rounded-full animate-ping" />
              <span className="text-[10px] font-bold uppercase text-gray-400 font-mono">
                {filteredProperties.length} active listings match
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="District, reference code, name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#F8F9FA] rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#4169E1]"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-[#F8F9FA] rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#4169E1] cursor-pointer font-bold text-gray-600"
              >
                <option value="all">All Sectors</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="land">Agricultural Land</option>
              </select>
            </div>

            {/* Price Filter Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                <span>Max Price</span>
                <span className="text-[#4169E1]">${(maxPrice / 1000).toFixed(0)}k</span>
              </div>
              <input 
                type="range" 
                min={100000} 
                max={4000000} 
                step={50000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4169E1]"
              />
            </div>

            {/* City Location Filter */}
            <div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-3 bg-[#F8F9FA] rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#4169E1] cursor-pointer font-bold text-gray-600"
              >
                <option value="all">All Cities</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Reset Filters */}
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedType('all');
                setMaxPrice(4000000);
                setSelectedLocation('all');
              }}
              className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Filter size={14} />
              Reset Filters
            </button>
          </div>
        </div>
      </section>

      {/* Featured Properties Spotlight Slider / Grid */}
      {featuredListings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <span className="text-xs font-black tracking-widest text-[#4169E1] uppercase font-mono">Premium Highlights</span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#1A1A1A] tracking-tight">Featured Spotlight Properties</h2>
              <p className="text-gray-500 text-xs sm:text-sm">Carefully selected high-performing assets representing world-class design standards.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredListings.slice(0, 2).map((prop) => (
              <motion.div 
                key={prop.id}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedProperty(prop)}
                className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-lg group cursor-pointer flex flex-col sm:flex-row"
              >
                <div className="sm:w-1/2 h-64 sm:h-auto relative bg-gray-100 overflow-hidden">
                  <img 
                    src={prop.image_url} 
                    alt={prop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-[#059669] to-[#2563EB] text-white text-[9px] font-black uppercase rounded-lg tracking-wider shadow">
                    Featured Spotlight
                  </div>
                </div>
                <div className="sm:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-[#4169E1] tracking-wider font-mono">{prop.category}</span>
                      <span className="text-xs font-black text-[#4169E1] font-mono">${prop.price.toLocaleString()}</span>
                    </div>
                    <h3 className="font-extrabold text-sm sm:text-base text-[#1A1A1A] leading-tight group-hover:text-[#4169E1] transition">
                      {prop.name}
                    </h3>
                    <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-3">
                      {prop.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-medium flex items-center">
                      <MapPin size={11} className="mr-1 text-gray-300" /> {prop.city}
                    </span>
                    <button className="text-[10px] font-black text-[#4169E1] group-hover:text-[#2E52C7] flex items-center gap-1">
                      Explore Details <ArrowRight size={10} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="border-t border-gray-100 pt-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
            <div className="space-y-2">
              <span className="text-xs font-black tracking-widest text-[#4169E1] uppercase font-mono">C.A.B Real Estate Inventory</span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#1A1A1A] tracking-tight">Browse Luxury Listings</h2>
            </div>
            {/* Quick Filter Categories */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'residential', 'commercial', 'industrial', 'land'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                    selectedCategory === cat 
                      ? 'bg-[#4169E1] text-white shadow' 
                      : 'bg-white hover:bg-gray-100 border border-gray-200 text-gray-600'
                  }`}
                >
                  {cat === 'land' ? 'Agriculture Lands' : cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-3xl h-96 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-3xl border border-gray-200 space-y-4">
              <Info size={44} className="text-gray-300 mx-auto" />
              <h4 className="font-extrabold text-sm text-[#1A1A1A]">No Properties Found</h4>
              <p className="text-gray-500 text-xs max-w-sm mx-auto">We couldn't find any active listings matching your filters. Try resetting the filters or broadening your price query.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setMaxPrice(4000000);
                  setSelectedLocation('all');
                }}
                className="px-5 py-2.5 bg-[#4169E1] text-white text-xs font-bold rounded-xl shadow"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((prop) => (
                <motion.div 
                  key={prop.id}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedProperty(prop)}
                  className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm hover:shadow-lg transition duration-300 cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Hero Thumbnail */}
                    <div className="h-56 relative bg-gray-100 overflow-hidden">
                      <img 
                        src={prop.image_url} 
                        alt={prop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Status Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-2.5 py-1 bg-white/95 text-xs font-black uppercase text-[#4169E1] rounded-lg shadow-sm">
                          {prop.category}
                        </span>
                        {prop.is_featured && (
                          <span className="px-2.5 py-1 bg-gradient-to-r from-[#059669] to-[#2563EB] text-xs font-black uppercase text-white rounded-lg shadow-sm">
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Admin Controls & Favorite Button Overlay */}
                      <div className="absolute top-4 right-4 flex items-center space-x-1.5">
                        {isAdmin && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenPublishModal(prop);
                              }}
                              className="p-2 bg-white/95 hover:bg-white text-brand-dark hover:text-[#4169E1] rounded-full shadow-md backdrop-blur-sm transition cursor-pointer"
                              title="Edit Property Listing"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteProperty(prop.id, e)}
                              className="p-2 bg-white/95 hover:bg-red-50 text-red-600 rounded-full shadow-md backdrop-blur-sm transition cursor-pointer"
                              title="Delete Property Listing"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={(e) => toggleFavorite(prop.id, e)}
                          className="p-2 bg-white/80 hover:bg-white rounded-full shadow-md backdrop-blur-sm transition cursor-pointer"
                        >
                          <Heart 
                            size={15} 
                            className={favorites.includes(prop.id) ? 'fill-[#4169E1] text-[#4169E1]' : 'text-gray-500 hover:text-[#4169E1]'} 
                          />
                        </button>
                      </div>

                      {/* Price Tag Overlay */}
                      <div className="absolute bottom-4 left-4 px-3.5 py-1.5 bg-[#1A1A1A]/90 text-white text-xs font-black rounded-xl backdrop-blur-sm border border-white/10">
                        ${prop.price.toLocaleString()}
                      </div>
                    </div>

                    {/* Metadata Content */}
                    <div className="px-6 space-y-3">
                      <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono font-bold uppercase">
                        <span>Ref: {prop.ref_code}</span>
                        <span>{prop.type}</span>
                      </div>
                      
                      <h3 className="font-extrabold text-sm sm:text-base text-[#1A1A1A] tracking-tight group-hover:text-[#4169E1] transition line-clamp-1">
                        {prop.name}
                      </h3>

                      <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">
                        {prop.description}
                      </p>

                      {/* Micro Specs */}
                      {(prop.bedrooms > 0 || prop.bathrooms > 0) && (
                        <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                          {prop.bedrooms > 0 && (
                            <span className="flex items-center gap-1 font-medium">
                              <Bed size={13} className="text-[#4169E1]" /> {prop.bedrooms} Bed
                            </span>
                          )}
                          {prop.bathrooms > 0 && (
                            <span className="flex items-center gap-1 font-medium">
                              <Bath size={13} className="text-[#4169E1]" /> {prop.bathrooms} Bath
                            </span>
                          )}
                          {prop.parking > 0 && (
                            <span className="flex items-center gap-1 font-medium">
                              <Car size={13} className="text-[#4169E1]" /> {prop.parking} Car
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="px-6 py-5 mt-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[11px] text-gray-500 font-medium flex items-center">
                      <MapPin size={12} className="mr-1 text-[#4169E1]" /> {prop.city}
                    </span>
                    <button className="text-[11px] font-black text-[#4169E1] group-hover:text-[#2E52C7] flex items-center gap-1 transition">
                      View Dossier <ChevronRight size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Book Site Consultation & Inspection Center */}
      <section className="bg-gradient-to-br from-[#1A1A1A] via-[#4169E1]/20 to-[#1A1A1A] text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-black tracking-widest text-[#4169E1] uppercase font-mono">Schedule Inspections</span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
              Ready to view a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#059669] to-[#2563EB] font-extrabold">certified C.A.B block</span>?
            </h2>
            <p className="text-white/80 text-xs sm:text-sm max-w-xl leading-relaxed">
              We arrange luxurious, chauffeured executive inspection tours for our international clientele. All land assets feature drone-mapped boundaries and complete title documentation ready for transfer of ownership.
            </p>
            <div className="space-y-3 pt-4">
              <div className="flex items-center space-x-3 text-xs text-white/80">
                <CheckCircle size={16} className="text-[#4169E1]" />
                <span>Certified deeds with 100% litigation indemnity coverage.</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-white/80">
                <CheckCircle size={16} className="text-[#4169E1]" />
                <span>Direct on-site connection options to C.A.B Solar Drip and Pure Water grids.</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-white/80">
                <CheckCircle size={16} className="text-[#4169E1]" />
                <span>Dedicated legal officer guidance through ownership transfer.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white text-[#1A1A1A] p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/10 space-y-4">
            <h4 className="font-black text-base">Request Property / Custom Search</h4>
            <p className="text-gray-400 text-xs">Can't find what you are looking for? Our executive acquisition team will hunt down assets customized to your specifications.</p>
            
            <button 
              onClick={() => onNavigate('contact', { tab: 'message', department: 'Real Estate Division', preFilledDetails: 'Greetings, I would like to request a customized asset search based on my real estate requirements...' })}
              className="w-full py-3.5 bg-[#4169E1] hover:bg-[#2E52C7] text-white font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>Contact Executive Acquisition Officer</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black tracking-widest text-[#4169E1] uppercase font-mono">Expert Answers</span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#1A1A1A] tracking-tight">Real Estate FAQs</h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Are all C.A.B real estate land listings litigation-free?",
              a: "Absolutely. C.A.B Company Ltd works strictly with accredited state-certified surveyors and land registries. Every piece of agricultural or residential land in our portfolio is fully cleared of any local chieftain or communal disputes prior to publishing."
            },
            {
              q: "Can I connect my bought land directly to C.A.B agricultural systems?",
              a: "Yes. This is the C.A.B synergistic advantage. Buyers of our agricultural blocks can contract our corporate divisions to design and deploy specialized solar drip irrigation and automated greenhouses at preferential rates."
            },
            {
              q: "Do you offer flexible corporate payment models?",
              a: "Yes. For our commercial hubs and multi-acre land assets, we offer customizable installment structures synchronized against project milestones, backed by reputable banking institutions."
            }
          ].map((faq, i) => (
            <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-2">
              <h4 className="font-extrabold text-sm text-[#1A1A1A] flex items-start gap-2">
                <span className="text-[#4169E1]">Q.</span> {faq.q}
              </h4>
              <p className="text-gray-500 text-xs leading-relaxed pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
