/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, ShoppingBag, Check, Plus, Minus, Trash2, 
  ClipboardList, Star, AlertCircle, ShoppingCart, X, Send, Edit, Trash, HelpCircle, Package, Layers
} from 'lucide-react';
import { PRODUCTS } from '../data/mockData';
import { Product } from '../types';
import ImageUploader from './ImageUploader';
import { getProducts, saveProduct, deleteProduct, submitBuyRequest } from '../lib/api';

interface ProductsViewProps {
  onNavigate: (view: string, params?: any) => void;
  user?: any;
  openPublishModal?: boolean;
  onModalClosed?: () => void;
}

export default function ProductsView({ onNavigate, user, openPublishModal, onModalClosed }: ProductsViewProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<'all' | 'agriculture' | 'water'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Local interactive Quote Cart
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  // Buy Inquiry Modal States
  const [activeBuyItem, setActiveBuyItem] = useState<Product | null>(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [buyMessage, setBuyMessage] = useState('');
  const [buyOfferedPrice, setBuyOfferedPrice] = useState('');
  const [isSubmittingBuy, setIsSubmittingBuy] = useState(false);
  const [buySuccessMessage, setBuySuccessMessage] = useState('');

  // Admin CRUD States
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [adminName, setAdminName] = useState('');
  const [adminSlug, setAdminSlug] = useState('');
  const [adminCategory, setAdminCategory] = useState<'agriculture' | 'water'>('agriculture');
  const [adminSubCategory, setAdminSubCategory] = useState('');
  const [adminDescription, setAdminDescription] = useState('');
  const [adminPrice, setAdminPrice] = useState('');
  const [adminUnit, setAdminUnit] = useState('');
  const [adminImageUrl, setAdminImageUrl] = useState('');
  const [adminImageKey, setAdminImageKey] = useState<string | undefined>(undefined);
  const [adminFeatures, setAdminFeatures] = useState<string>('');
  const [adminInStock, setAdminInStock] = useState(true);
  const [adminStatus, setAdminStatus] = useState<'Published' | 'Draft' | 'Archived'>('Published');
  const [adminIsFeatured, setAdminIsFeatured] = useState(false);
  const [adminSeoTitle, setAdminSeoTitle] = useState('');
  const [adminSeoDescription, setAdminSeoDescription] = useState('');
  const [adminSeoKeywords, setAdminSeoKeywords] = useState('');
  const [isSavingAdmin, setIsSavingAdmin] = useState(false);
  const [adminError, setAdminError] = useState('');

  const isAdmin = user?.role === 'admin' || user?.email === 'cabcompanyltd@gmail.com';

  // Load products from API on boot
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      if (data && data.length > 0) {
        const mapped = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          subCategory: item.sub_category || item.subCategory,
          description: item.description,
          price: Number(item.price),
          unit: item.unit,
          image: item.image_url || item.image || 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=800',
          features: Array.isArray(item.features) ? item.features : (typeof item.features === 'string' ? JSON.parse(item.features || '[]') : []),
          inStock: !!item.in_stock,
          rating: Number(item.rating) || 4.8
        }));
        setProducts(mapped);
        setLoading(false);
        return;
      }
      throw new Error('No products in DB');
    } catch (err) {
      console.warn('DB load failed, using local fallback products:', err);
      setProducts(PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (openPublishModal) {
      setEditingProduct(null);
      setAdminName('');
      setAdminSlug('');
      setAdminCategory('agriculture');
      setAdminSubCategory('');
      setAdminDescription('');
      setAdminPrice('');
      setAdminUnit('unit');
      setAdminInStock(true);
      setAdminIsFeatured(false);
      setAdminFeatures('');
      setAdminImageUrl('');
      setAdminImageKey(undefined);
      setAdminError('');
      setShowAdminForm(true);
      if (onModalClosed) onModalClosed();
    }
  }, [openPublishModal]);

  // Pre-fill user data when active buy item is opened
  useEffect(() => {
    if (activeBuyItem) {
      setBuyerName(user?.name || '');
      setBuyerEmail(user?.email || '');
      setBuyerPhone(user?.phone || '');
      setBuyQuantity(1);
      setBuyMessage('');
      setBuyOfferedPrice(activeBuyItem.price.toString());
      setBuySuccessMessage('');
    }
  }, [activeBuyItem, user]);

  const filteredProducts = products.filter((prod) => {
    const matchesCategory = filterCategory === 'all' || prod.category === filterCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setShowCartDrawer(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleSubmitQuoteList = () => {
    const listDetails = cart.map(item => `- ${item.product.name} (Qty: ${item.quantity})`).join('\n');
    setCart([]);
    setShowCartDrawer(false);
    // Navigate to Contact/Quote tab with pre-filled details
    onNavigate('contact', { tab: 'quote', preFilledDetails: `Industrial Quote Request for:\n${listDetails}` });
  };

  // Handle Buy / Order now
  const handleBuySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBuyItem) return;
    setIsSubmittingBuy(true);
    try {
      await submitBuyRequest({
        itemId: activeBuyItem.id,
        itemType: 'product',
        itemName: activeBuyItem.name,
        buyerName,
        buyerEmail,
        buyerPhone,
        quantity: buyQuantity,
        message: buyMessage,
        priceOffered: Number(buyOfferedPrice) || activeBuyItem.price,
      });

      setBuySuccessMessage(`Thank you, ${buyerName}! Your purchase request has been transmitted directly to our admin team. A corporate representative will contact you shortly at ${buyerPhone || buyerEmail} to coordinate details and GHS pricing.`);
      setTimeout(() => {
        setActiveBuyItem(null);
      }, 6000);
    } catch (err: any) {
      console.error('Submit purchase error:', err);
      alert(`Error submitting purchase: ${err.message}`);
    } finally {
      setIsSubmittingBuy(false);
    }
  };

  // Open Admin tool to Create Product
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setAdminName('');
    setAdminSlug('');
    setAdminCategory('agriculture');
    setAdminSubCategory('Seeds & Seedlings');
    setAdminDescription('');
    setAdminPrice('');
    setAdminUnit('per bag');
    setAdminImageUrl('');
    setAdminImageKey(undefined);
    setAdminFeatures('["Engineered design", "InsForge Quality Guaranteed"]');
    setAdminInStock(true);
    setAdminStatus('Published');
    setAdminIsFeatured(false);
    setAdminSeoTitle('');
    setAdminSeoDescription('');
    setAdminSeoKeywords('');
    setAdminError('');
    setShowAdminForm(true);
  };

  // Open Admin tool to Edit Product
  const handleOpenEditProduct = (prod: any) => {
    setEditingProduct(prod);
    setAdminName(prod.name);
    setAdminSlug(prod.slug || '');
    setAdminCategory(prod.category as any);
    setAdminSubCategory(prod.subCategory || prod.sub_category || '');
    setAdminDescription(prod.description);
    setAdminPrice(prod.price.toString());
    setAdminUnit(prod.unit);
    setAdminImageUrl(prod.image || prod.image_url);
    setAdminImageKey(prod.imageKey || prod.image_key);
    setAdminFeatures(JSON.stringify(prod.features || []));
    setAdminInStock(prod.inStock !== undefined ? prod.inStock : true);
    setAdminStatus(prod.status || 'Published');
    setAdminIsFeatured(!!prod.isFeatured);
    setAdminSeoTitle(prod.seoTitle || prod.name || '');
    setAdminSeoDescription(prod.seoDescription || prod.description || '');
    setAdminSeoKeywords(prod.seoKeywords || prod.category || '');
    setAdminError('');
    setShowAdminForm(true);
  };

  // Save Product (Admin CRUD)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName || !adminCategory || !adminDescription || !adminPrice || !adminUnit || !adminImageUrl) {
      setAdminError('Please fill out all required fields.');
      return;
    }

    setIsSavingAdmin(true);
    setAdminError('');

    let parsedFeatures: string[] = [];
    try {
      parsedFeatures = JSON.parse(adminFeatures);
      if (!Array.isArray(parsedFeatures)) {
        throw new Error('Must be a JSON Array of strings');
      }
    } catch (err) {
      parsedFeatures = adminFeatures.split('\n').map(x => x.trim()).filter(Boolean);
    }

    const payload = {
      id: editingProduct ? editingProduct.id : undefined,
      name: adminName,
      title: adminName,
      slug: adminSlug || adminName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: adminCategory,
      sub_category: adminSubCategory || adminCategory,
      description: adminDescription,
      price: Number(adminPrice),
      unit: adminUnit,
      image_url: adminImageUrl,
      features: parsedFeatures,
      in_stock: adminInStock,
      rating: editingProduct ? editingProduct.rating : 4.8,
    };

    try {
      await saveProduct(payload);
      setShowAdminForm(false);
      loadProducts();
    } catch (err: any) {
      console.error('Admin save error:', err);
      setAdminError(`Error saving product: ${err.message}`);
    } finally {
      setIsSavingAdmin(false);
    }
  };

  // Delete Product (Admin CRUD)
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you absolutely sure you want to delete this product from the database catalog?')) return;
    try {
      await deleteProduct(productId);
      loadProducts();
    } catch (err: any) {
      console.error('Delete product error:', err);
      alert(`Error deleting: ${err.message}`);
    }
  };

  return (
    <div className="space-y-16 pb-20 pt-28 sm:pt-32">
      
      {/* 1. HEADER HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-black tracking-widest text-brand-blue uppercase">Corporate Catalog</span>
        <h1 className="text-4xl sm:text-6xl font-black text-brand-dark tracking-tight leading-none">
          Industrial Products & Supplies
        </h1>
        <p className="text-brand-dark/65 text-xs sm:text-base max-w-2xl mx-auto">
          Procure certified agronomy seeds, organic liquid fertilizers, smart solar irrigation kits, water storage units, and reverse osmosis plants in Ghana Cedis (GHS).
        </p>

        {isAdmin && (
          <div className="pt-4">
            <button
              onClick={handleOpenAddProduct}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-green to-brand-blue text-white font-extrabold text-xs hover:shadow-lg transition flex items-center space-x-2 mx-auto cursor-pointer"
            >
              <Plus size={16} />
              <span>Add New Catalog Product</span>
            </button>
          </div>
        )}
      </section>

      {/* 2. CATALOG CONTROLS & FILTER SYSTEM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Search bar */}
        <div className="relative w-full md:max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-dark/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search industrial codes or items..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-black/5 focus:outline-none focus:border-brand-blue text-xs font-medium"
          />
        </div>

        {/* Categories togglers */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition ${
              filterCategory === 'all' ? 'bg-brand-blue text-white shadow-md' : 'bg-white text-brand-dark hover:bg-gray-100'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setFilterCategory('agriculture')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition ${
              filterCategory === 'agriculture' ? 'bg-brand-blue text-white shadow-md' : 'bg-white text-brand-dark hover:bg-gray-100'
            }`}
          >
            Agribusiness Supplies
          </button>
          <button
            onClick={() => setFilterCategory('water')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition ${
              filterCategory === 'water' ? 'bg-brand-blue text-white shadow-md' : 'bg-white text-brand-dark hover:bg-gray-100'
            }`}
          >
            Water Solutions
          </button>

          {/* Quick Cart Indicator trigger */}
          {cart.length > 0 && (
            <button
              onClick={() => setShowCartDrawer(true)}
              className="px-5 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-extrabold text-xs cursor-pointer hover:shadow-lg transition flex items-center space-x-2 animate-bounce"
            >
              <ShoppingCart size={14} />
              <span>Quote List ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
            </button>
          )}
        </div>

      </section>

      {/* 3. DYNAMIC PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-24 space-y-4">
            <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-brand-dark/50">Consulting InsForge Product Registry...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 space-y-4 bg-white rounded-3xl border border-black/5 p-8 max-w-md mx-auto">
            <HelpCircle size={40} className="text-brand-dark/20 mx-auto" />
            <h3 className="font-extrabold text-sm text-brand-dark">No Products Found</h3>
            <p className="text-xs text-brand-dark/50">Try selecting a different category or refining your search parameters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((prod) => (
              <div 
                key={prod.id} 
                className="rounded-2xl bg-white border border-black/5 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative"
              >
                {/* Admin context tools */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 z-25 flex space-x-1">
                    <button
                      onClick={() => handleOpenEditProduct(prod)}
                      className="p-1.5 bg-white/95 rounded-lg border border-black/10 text-brand-dark hover:text-brand-blue shadow-sm hover:scale-105 transition"
                      title="Edit Catalog Details"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-1.5 bg-white/95 rounded-lg border border-black/10 text-red-500 hover:bg-red-50 shadow-sm hover:scale-105 transition"
                      title="Delete Product"
                    >
                      <Trash size={12} />
                    </button>
                  </div>
                )}

                {/* Image with overlay badge */}
                <div className="h-52 overflow-hidden relative bg-gray-100">
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md text-[9px] uppercase font-black tracking-widest text-brand-blue-ocean px-2.5 py-1 rounded-full shadow-sm border border-black/5">
                    {prod.subCategory}
                  </span>
                  {!prod.inStock && (
                    <span className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center text-white font-extrabold text-xs">
                      STOCK RUNNING OUT (BACKORDER)
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-brand-dark/40 font-mono">CODE: {prod.id}</span>
                      <div className="flex items-center space-x-1 text-brand-gold">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-bold font-mono">{prod.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <h3 className="font-extrabold text-sm text-brand-dark leading-snug group-hover:text-brand-blue transition">
                      {prod.name}
                    </h3>
                    <p className="text-brand-dark/65 text-[11px] leading-relaxed line-clamp-2">
                      {prod.description}
                    </p>
                  </div>

                  {/* Technical Bullet points */}
                  <div className="bg-gray-50 p-3 rounded-xl space-y-1.5 border border-black/5">
                    {prod.features.slice(0, 2).map((feat, i) => (
                      <div key={i} className="flex items-start space-x-1 text-[10px] text-brand-dark/75 leading-relaxed">
                        <Check size={10} className="text-brand-blue flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price and quote cart additions */}
                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] text-brand-dark/40 block leading-none uppercase font-mono">GHS Price</span>
                      <span className="text-sm font-black font-mono text-brand-dark">
                        GH₵ {prod.price.toLocaleString()} <span className="text-[10px] text-brand-dark/50">/ {prod.unit}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setActiveBuyItem(prod)}
                        className="px-3 py-2 rounded-xl bg-gradient-to-r from-brand-green to-brand-blue text-white hover:brightness-110 font-extrabold text-[10px] transition cursor-pointer active:scale-95"
                      >
                        Buy Now
                      </button>
                      <button
                        disabled={!prod.inStock}
                        onClick={() => handleAddToCart(prod)}
                        className="p-2 rounded-xl bg-gray-100 text-brand-dark hover:bg-brand-blue hover:text-white disabled:opacity-30 transition flex items-center justify-center cursor-pointer active:scale-95"
                        title="Add to Multi-Item Estimate"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. MODAL QUOTE CART DRAWER */}
      <AnimatePresence>
        {showCartDrawer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCartDrawer(false)}
              className="fixed inset-0 bg-black z-50"
            />

            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-96 max-w-full bg-white shadow-2xl z-50 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center text-white">
                      <ShoppingBag size={16} />
                    </div>
                    <span className="font-extrabold text-sm text-brand-dark">Quote Estimation Basket</span>
                  </div>
                  <button 
                    onClick={() => setShowCartDrawer(false)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition"
                  >
                    <X size={18} />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-20 space-y-4">
                    <AlertCircle size={40} className="text-brand-dark/20 mx-auto" />
                    <p className="text-xs text-brand-dark/40">No items loaded. Please add equipment, fertilizers or seeds.</p>
                  </div>
                ) : (
                  <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-1">
                    {cart.map((item) => (
                      <div key={item.product.id} className="p-3 bg-gray-50 rounded-xl border border-black/5 flex justify-between items-center gap-3">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-brand-dark line-clamp-1">{item.product.name}</h4>
                          <span className="text-[10px] font-mono text-brand-dark/45">GH₵ {item.product.price} / {item.product.unit}</span>
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <button 
                            onClick={() => handleUpdateQuantity(item.product.id, -1)}
                            className="p-1 bg-white border border-black/5 rounded hover:bg-gray-100 text-brand-dark transition"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-xs font-mono font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateQuantity(item.product.id, 1)}
                            className="p-1 bg-white border border-black/5 rounded hover:bg-gray-100 text-brand-dark transition"
                          >
                            <Plus size={10} />
                          </button>
                          
                          <button 
                            onClick={() => handleRemoveFromCart(item.product.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t pt-6 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-brand-dark/60">Estimated Cost Total</span>
                    <span className="font-mono font-bold text-brand-blue text-sm">
                      GH₵ {cart.reduce((total, item) => total + (item.product.price * item.quantity), 0).toLocaleString()}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleSubmitQuoteList}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-green to-brand-blue text-white font-black text-xs text-center cursor-pointer hover:shadow-lg transition flex items-center justify-center space-x-2 active:scale-95"
                  >
                    <ClipboardList size={14} />
                    <span>Generate Multi-Item Estimate</span>
                  </button>
                  <p className="text-[10px] text-center text-brand-dark/40">
                    Submit list to pre-populate our formal Quote Request forms.
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 5. BUY INQUIRY FEEDBACK MODAL */}
      <AnimatePresence>
        {activeBuyItem && (
          <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-3 sm:p-6 md:p-8 pt-16 sm:pt-20 pb-12 overflow-y-auto bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[85vh] sm:max-h-[90vh] my-auto border border-black/5"
            >
              <button 
                onClick={() => setActiveBuyItem(null)}
                className="absolute top-4 right-4 p-2 rounded-lg text-brand-dark/40 hover:bg-gray-100 transition"
              >
                <X size={18} />
              </button>

              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                  <Package size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-blue block">Transmit Purchase Inquiry</span>
                  <h3 className="text-lg font-black text-brand-dark">{activeBuyItem.name}</h3>
                </div>
              </div>

              {buySuccessMessage ? (
                <div className="p-6 text-center space-y-4 bg-brand-blue-sky/40 border border-brand-blue/10 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center mx-auto shadow-md">
                    <Check size={24} />
                  </div>
                  <h4 className="font-extrabold text-sm text-brand-dark">Order Transmitted Successfully</h4>
                  <p className="text-xs text-brand-dark/70 leading-relaxed max-w-sm mx-auto">
                    {buySuccessMessage}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBuySubmit} className="space-y-4">
                  
                  {/* Selected Item Card snippet */}
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-black/5 flex items-center space-x-3">
                    <img 
                      src={activeBuyItem.image} 
                      alt={activeBuyItem.name} 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <span className="text-[9px] uppercase font-mono text-brand-dark/40">Item Reference GHS:</span>
                      <p className="text-xs font-bold text-brand-dark leading-tight">{activeBuyItem.name}</p>
                      <span className="text-xs font-mono font-black text-brand-blue">GH₵ {activeBuyItem.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-brand-dark/45">Buyer Full Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Samuel Osei"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-brand-dark/45">Email Address</label>
                      <input 
                        type="email" 
                        required
                        placeholder="sam@example.com"
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-brand-dark/45">Phone Number (WhatsApp Active)</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="e.g. +233 24 000 0000"
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-brand-dark/45">Purchase Quantity ({activeBuyItem.unit})</label>
                      <div className="flex items-center space-x-2">
                        <button 
                          type="button"
                          onClick={() => setBuyQuantity(q => Math.max(1, q - 1))}
                          className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-xs font-black"
                        >
                          -
                        </button>
                        <span className="text-xs font-mono font-bold w-10 text-center">{buyQuantity}</span>
                        <button 
                          type="button"
                          onClick={() => setBuyQuantity(q => q + 1)}
                          className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-xs font-black"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-brand-dark/45">Your Price Offer (GHS per {activeBuyItem.unit})</label>
                      <input 
                        type="number" 
                        required
                        placeholder={activeBuyItem.price.toString()}
                        value={buyOfferedPrice}
                        onChange={(e) => setBuyOfferedPrice(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-brand-dark/45">Total GHS Commitment</label>
                      <div className="px-4 py-2.5 rounded-xl bg-brand-blue/5 border border-brand-blue/10 text-xs font-bold text-brand-blue font-mono">
                        GH₵ {(buyQuantity * (Number(buyOfferedPrice) || activeBuyItem.price)).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-dark/45">Inquiry Message / Delivery Site Location</label>
                    <textarea 
                      placeholder="Mention shipping address or custom supply schedules (e.g. delivery to Keta coops)..."
                      value={buyMessage}
                      onChange={(e) => setBuyMessage(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingBuy}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-green to-brand-blue text-white font-black text-xs text-center cursor-pointer hover:shadow-lg hover:brightness-110 transition flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isSubmittingBuy ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Transmitting Order Details...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Send Order & GHS Quote Feedback to Admin</span>
                      </>
                    )}
                  </button>
                  
                  <p className="text-[10px] text-brand-dark/45 text-center leading-relaxed">
                    This order generates real-time feedback in the Corporate Lead dashboard. CAB executives will verify inventory and arrange manual bank/Momo transfer invoice.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. ADMIN ADD/EDIT PRODUCT MODAL FORM */}
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
                <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                  <Layers size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-blue block">Corporate Registry Controller</span>
                  <h3 className="text-lg font-black text-brand-dark">
                    {editingProduct ? 'Modify Product Specifications' : 'Insert New Catalog Product'}
                  </h3>
                </div>
              </div>

              {adminError && (
                <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center space-x-2">
                  <AlertCircle size={14} />
                  <span>{adminError}</span>
                </div>
              )}

              <form onSubmit={handleSaveProduct} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-dark/45">Product Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. CAB Sol-Max Pump"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-dark/45">Main Category *</label>
                    <select 
                      value={adminCategory}
                      onChange={(e) => setAdminCategory(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs"
                    >
                      <option value="agriculture">Agribusiness Supplies</option>
                      <option value="water">Water Solutions</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-dark/45">Sub Category Badge *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Irrigation Equipment"
                      value={adminSubCategory}
                      onChange={(e) => setAdminSubCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-dark/45">Unit of Measure *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Unit, case of 24, 25kg bag"
                      value={adminUnit}
                      onChange={(e) => setAdminUnit(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-dark/45">Price in GHS *</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 1450"
                      value={adminPrice}
                      onChange={(e) => setAdminPrice(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-brand-dark/45">Initial Inventory Availability</label>
                    <div className="flex items-center space-x-3 pt-2">
                      <input 
                        type="checkbox"
                        id="adminInStock"
                        checked={adminInStock}
                        onChange={(e) => setAdminInStock(e.target.checked)}
                        className="w-4 h-4 rounded text-brand-blue focus:ring-brand-blue border-black/10"
                      />
                      <label htmlFor="adminInStock" className="text-xs font-bold text-brand-dark">Item Is In Stock</label>
                    </div>
                  </div>
                </div>

                <ImageUploader
                  bucket="product-images"
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
                  label="Product Image (Upload directly to InsForge Storage) *"
                />

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-brand-dark/45">Description *</label>
                  <textarea 
                    required
                    placeholder="Provide a comprehensive technical description for corporate procurement teams..."
                    value={adminDescription}
                    onChange={(e) => setAdminDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-brand-dark/45">Technical Features (JSON list or Split by line)</label>
                  <textarea 
                    placeholder='["100% UV Resistant", "Certified Organic-Safe coatings"]'
                    value={adminFeatures}
                    onChange={(e) => setAdminFeatures(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/5 focus:outline-none focus:border-brand-blue text-xs font-mono resize-none"
                  />
                  <span className="text-[9px] text-brand-dark/40 block">Provide a valid JSON stringified array or simply paste one feature per line.</span>
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
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-green to-brand-blue text-white text-xs font-extrabold flex items-center space-x-2"
                  >
                    {isSavingAdmin ? 'Saving Specifications...' : 'Save Catalog Product'}
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
