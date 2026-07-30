/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, ArrowLeft, Send, MessageSquare, Tag, Trash2, Plus, Sparkles, BookOpen, Edit, Eye, ShieldCheck, Search, X } from 'lucide-react';
import ImageUploader from './ImageUploader';
import { getBlogPosts, saveBlogPost, deleteBlogPost } from '../lib/api';

interface BlogViewProps {
  user?: any;
  openPublishModal?: boolean;
  onModalClosed?: () => void;
}

export default function BlogView({ user: propUser, openPublishModal, onModalClosed }: BlogViewProps) {
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [filterTag, setFilterTag] = useState<'all' | 'Agronomy' | 'Hydrology' | 'Agribusiness'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(propUser || null);

  // Comments State
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<Record<string, { name: string; text: string; date: string }[]>>({
    'blog-1': [
      { name: 'Dr. Mensah Kojo', text: 'This formula matches our field measurements in Akuse. Drip flow reduction keeps the surface soil matrix intact.', date: '3 days ago' }
    ]
  });

  // Admin Form State (Create or Edit)
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<'Agronomy' | 'Hydrology' | 'Agribusiness'>('Agronomy');
  const [readTime, setReadTime] = useState('5 min read');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageKey, setImageKey] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<'Published' | 'Draft' | 'Archived'>('Published');
  const [isFeatured, setIsFeatured] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const isAdmin = (user?.role === 'admin' || user?.email === 'cabcompanyltd@gmail.com');

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getBlogPosts();
      setArticles(data || []);
    } catch (e) {
      console.error('Failed to load blogs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!propUser) {
      try {
        const saved = localStorage.getItem('cab_user');
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } catch (e) {}
    } else {
      setUser(propUser);
    }
  }, [propUser]);

  useEffect(() => {
    fetchBlogs();
  }, [user]);

  useEffect(() => {
    if (openPublishModal) {
      handleOpenCreateForm();
      if (onModalClosed) onModalClosed();
    }
  }, [openPublishModal]);

  const handleOpenCreateForm = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setCategory('Agronomy');
    setReadTime('5 min read');
    setSummary('');
    setContent('');
    setImageUrl('');
    setImageKey(undefined);
    setStatus('Published');
    setIsFeatured(false);
    setSeoTitle('');
    setSeoDescription('');
    setSeoKeywords('');
    setShowForm(true);
    setSuccessMsg('');
  };

  const handleOpenEditForm = (art: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingPost(art);
    setTitle(art.title || '');
    setSlug(art.slug || '');
    setCategory(art.category || 'Agronomy');
    setReadTime(art.readTime || '5 min read');
    setSummary(art.summary || '');
    setContent(art.content || '');
    setImageUrl(art.image || art.image_url || '');
    setImageKey(art.imageKey || art.image_key);
    setStatus(art.status || 'Published');
    setIsFeatured(!!art.isFeatured);
    setSeoTitle(art.seoTitle || art.title || '');
    setSeoDescription(art.seoDescription || art.summary || '');
    setSeoKeywords(art.seoKeywords || art.category || '');
    setShowForm(true);
    setSuccessMsg('');
  };

  const handleAddComment = (e: React.FormEvent, artId: string) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    const newComment = {
      name: commentName,
      text: commentText,
      date: 'Just now'
    };

    setLocalComments(prev => ({
      ...prev,
      [artId]: [newComment, ...(prev[artId] || [])]
    }));

    setCommentName('');
    setCommentText('');
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !summary.trim()) return;

    setPublishing(true);
    setSuccessMsg('');

    const payload = {
      id: editingPost ? editingPost.id : undefined,
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      content,
      excerpt: summary,
      category,
      read_time: readTime,
      cover_image: imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
      author: user?.name || 'C.A.B Editorial',
    };

    try {
      await saveBlogPost(payload);

      setSuccessMsg(editingPost ? 'Insight updated successfully!' : 'Insight published successfully to InsForge Database!');
      if (!editingPost) {
        setTitle('');
        setSummary('');
        setContent('');
        setReadTime('5 min read');
      }
      setTimeout(() => {
        setSuccessMsg('');
        setShowForm(false);
      }, 2000);
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert('Error saving article');
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this scientific insight post from the C.A.B Database?')) return;

    try {
      await deleteBlogPost(id);
      fetchBlogs();
      if (selectedArticle?.id === id) {
        setSelectedArticle(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredArticles = articles.filter((art) => {
    const matchesTag = filterTag === 'all' || art.category === filterTag;
    const matchesSearch = !searchQuery || 
      art.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      art.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-linear-to-b from-brand-canvas via-white to-brand-canvas pt-28 pb-12 sm:pt-32 space-y-12">
      {/* 1. HERO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green text-xs font-bold uppercase tracking-wider">
          <BookOpen size={14} />
          <span>Knowledge Hub & Research</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-brand-dark tracking-tight">
          C.A.B Agricultural & Hydrological Insights
        </h1>
        <p className="max-w-2xl mx-auto text-brand-dark/70 text-sm sm:text-base leading-relaxed">
          Technical briefings, soil chemistry analyses, smart drip guidelines, and greenhouse operational benchmarks authored by our engineering desk.
        </p>

        {isAdmin && (
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => {
                if (showForm) {
                  setShowForm(false);
                } else {
                  handleOpenCreateForm();
                }
              }}
              className="px-6 py-3 rounded-2xl bg-brand-dark hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition flex items-center space-x-2 shadow-lg cursor-pointer"
            >
              {showForm ? <ArrowLeft size={16} /> : <Plus size={16} />}
              <span>{showForm ? 'Close Publishing Console' : 'Publish New Technical Article'}</span>
            </button>
          </div>
        )}
      </section>

      {/* Admin Publish Console Modal */}
      {isAdmin && showForm && (
        <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-3 sm:p-6 md:p-8 pt-16 sm:pt-20 pb-12 overflow-y-auto bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-brand-blue/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-y-auto max-h-[85vh] sm:max-h-[90vh] my-auto w-full max-w-3xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <Sparkles className="text-brand-blue" size={20} />
                <h2 className="text-lg font-black text-brand-dark uppercase tracking-wider">
                  {editingPost ? 'Edit Article Entry' : 'New Article Console'}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  InsForge CMS
                </span>
                <button 
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-brand-dark transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {successMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
                <ShieldCheck size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSavePost} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-brand-dark/50 mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!slug) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                      }
                    }}
                    placeholder="e.g. Calibrating pH for High-Yield Strawberries"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/10 focus:outline-none focus:border-brand-blue text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-brand-dark/50 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="calibrating-ph-strawberry-yield"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/10 focus:outline-none focus:border-brand-blue text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-brand-dark/50 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/10 focus:outline-none focus:border-brand-blue text-xs"
                  >
                    <option value="Agronomy">Agronomy</option>
                    <option value="Hydrology">Hydrology</option>
                    <option value="Agribusiness">Agribusiness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-brand-dark/50 mb-1">Publication Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/10 focus:outline-none focus:border-brand-blue text-xs font-bold"
                  >
                    <option value="Published">Published (Live)</option>
                    <option value="Draft">Draft (Internal)</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-brand-dark/50 mb-1">Read Time</label>
                  <input
                    type="text"
                    required
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="e.g. 5 min read"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-black/10 focus:outline-none focus:border-brand-blue text-xs"
                  />
                </div>
              </div>

              {/* InsForge Bucket Image Upload */}
              <ImageUploader
                bucket="blog-images"
                imageUrl={imageUrl}
                imageKey={imageKey}
                onUploadSuccess={(url, key) => {
                  setImageUrl(url);
                  setImageKey(key);
                }}
                onRemove={() => {
                  setImageUrl('');
                  setImageKey(undefined);
                }}
                label="Article Hero Image (Upload directly to InsForge Storage)"
              />

              <div>
                <label className="block text-[10px] font-black uppercase text-brand-dark/50 mb-1">Abstract / Summary *</label>
                <textarea
                  required
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="A brief overview of what this insight covers..."
                  className="w-full p-4 rounded-xl bg-gray-50 border border-black/10 focus:outline-none focus:border-brand-blue text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-brand-dark/50 mb-1">Full Technical Article Content *</label>
                <textarea
                  required
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Use paragraphs to structure your full technical writeup..."
                  className="w-full p-4 rounded-xl bg-gray-50 border border-black/10 focus:outline-none focus:border-brand-blue text-xs"
                />
              </div>

              {/* SEO & Featured Toggle */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-black/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-dark">Featured Article</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-green"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-black/5">
                  <div>
                    <label className="block text-[9px] font-black uppercase text-brand-dark/50 mb-1">SEO Title Tag</label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder={title || 'SEO Title'}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-black/10 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase text-brand-dark/50 mb-1">SEO Keywords</label>
                    <input
                      type="text"
                      value={seoKeywords}
                      onChange={(e) => setSeoKeywords(e.target.value)}
                      placeholder="e.g. agronomy, ghana irrigation, greenhouse"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-black/10 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={publishing}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-brand-green to-brand-blue text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 transition flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                >
                  {publishing ? (
                    <span>Saving to InsForge...</span>
                  ) : (
                    <>
                      <BookOpen size={15} />
                      <span>{editingPost ? 'Update Post in Database' : 'Publish Article to Live Feed'}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-3.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-brand-dark font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. TAG & SEARCH CONTROLLER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap justify-center gap-2">
            {(['all', 'Agronomy', 'Hydrology', 'Agribusiness'] as const).map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  filterTag === tag
                    ? 'bg-brand-dark text-white shadow-md'
                    : 'bg-white border border-black/10 text-brand-dark/70 hover:bg-gray-50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 text-brand-dark/40" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-black/10 focus:outline-none focus:border-brand-green text-xs"
            />
          </div>
        </div>
      </section>

      {/* 3. SELECTED ARTICLE READER MODAL */}
      {selectedArticle && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-black/10 shadow-2xl p-6 sm:p-10 space-y-8">
            <button
              onClick={() => setSelectedArticle(null)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-brand-dark text-xs font-bold transition cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Articles</span>
            </button>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-xs font-mono text-brand-dark/60">
                <span className="px-3 py-1 rounded-full bg-brand-green/10 text-brand-green font-bold uppercase">
                  {selectedArticle.category}
                </span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-brand-dark">
                {selectedArticle.title}
              </h1>

              <div className="flex items-center space-x-3 pt-2">
                <img
                  src={selectedArticle.author?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'}
                  alt={selectedArticle.author?.name || 'Author'}
                  className="w-10 h-10 rounded-full object-cover border border-black/10"
                />
                <div>
                  <p className="text-xs font-bold text-brand-dark">{selectedArticle.author?.name || 'C.A.B Administrator'}</p>
                  <p className="text-[10px] text-brand-dark/50">{selectedArticle.author?.role || 'Expert Contributor'}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-black/10">
              <img
                src={selectedArticle.image || selectedArticle.image_url}
                alt={selectedArticle.title}
                className="w-full max-h-96 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="prose max-w-none text-brand-dark/80 text-sm sm:text-base leading-relaxed space-y-4 font-sans whitespace-pre-line">
              {selectedArticle.content}
            </div>

            {/* Comments Section */}
            <div className="pt-8 border-t border-black/10 space-y-6">
              <h3 className="text-lg font-bold text-brand-dark flex items-center space-x-2">
                <MessageSquare size={18} />
                <span>Engineering & Research Discussion</span>
              </h3>

              <form onSubmit={(e) => handleAddComment(e, selectedArticle.id)} className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-black/5">
                <input
                  type="text"
                  required
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="Your Name / Institution"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-black/10 text-xs focus:outline-none focus:border-brand-blue"
                />
                <textarea
                  required
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share field insights or technical feedback..."
                  className="w-full p-4 rounded-xl bg-white border border-black/10 text-xs focus:outline-none focus:border-brand-blue"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-dark text-white font-bold text-xs hover:bg-black transition flex items-center space-x-2 cursor-pointer"
                >
                  <Send size={12} />
                  <span>Post Comment</span>
                </button>
              </form>

              <div className="space-y-3">
                {(localComments[selectedArticle.id] || []).map((comm, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white border border-black/5 space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-brand-dark">
                      <span>{comm.name}</span>
                      <span className="text-[10px] font-normal text-brand-dark/40">{comm.date}</span>
                    </div>
                    <p className="text-xs text-brand-dark/70">{comm.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. ARTICLES GRID */}
      {!selectedArticle && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="py-20 text-center text-sm font-bold text-brand-dark/50">
              Loading Research Feed from InsForge Database...
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="py-20 text-center text-sm text-brand-dark/50">
              No articles match your search filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className="bg-white rounded-3xl border border-black/10 shadow-lg hover:shadow-2xl transition overflow-hidden group cursor-pointer flex flex-col relative"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={art.image || art.image_url}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                        {art.category}
                      </span>
                      {art.status && art.status !== 'Published' && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase">
                          {art.status}
                        </span>
                      )}
                    </div>

                    {isAdmin && (
                      <div className="absolute top-3 right-3 flex items-center space-x-1">
                        <button
                          onClick={(e) => handleOpenEditForm(art, e)}
                          className="p-2 rounded-xl bg-white/90 text-brand-dark hover:bg-white shadow transition cursor-pointer"
                          title="Edit Post"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, art.id)}
                          className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow transition cursor-pointer"
                          title="Delete Post"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-[10px] font-mono text-brand-dark/50">
                        <Calendar size={12} />
                        <span>{art.date}</span>
                        <span>•</span>
                        <Clock size={12} />
                        <span>{art.readTime}</span>
                      </div>

                      <h3 className="text-lg font-bold text-brand-dark group-hover:text-brand-green transition line-clamp-2">
                        {art.title}
                      </h3>

                      <p className="text-xs text-brand-dark/70 line-clamp-3 leading-relaxed">
                        {art.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-black/5 flex items-center justify-between text-xs font-bold text-brand-green group-hover:translate-x-1 transition">
                      <span>Read Full Insight</span>
                      <ArrowLeft size={14} className="rotate-180" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
