/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  category: 'agriculture' | 'water';
  subCategory: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  features: string[];
  inStock: boolean;
  rating: number;
}

export interface Project {
  id: string;
  title: string;
  category: 'agriculture' | 'water' | 'sustainability';
  client: string;
  location: string;
  date: string;
  description: string;
  image: string;
  beforeImage?: string;
  afterImage?: string;
  status: 'Completed' | 'In Progress' | 'Planned';
  impact: string;
  features: string[];
  challenge?: string;
  solution?: string;
  metrics?: string[];
}

export interface BlogArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  image: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  tags: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'pending';
  company?: string;
  phone?: string;
  avatarUrl?: string;
  completedOnboarding?: boolean;
  createdAt: string;
}

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  category: 'Agriculture' | 'Water Purification' | 'Irrigation' | 'Consultancy' | 'Equipment';
  details: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Declined';
  createdAt: string;
  estimateAmount?: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  department: string;
  message: string;
  status: 'Unread' | 'In Progress' | 'Resolved';
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  category: 'technical' | 'billing' | 'consultancy' | 'general';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'pending' | 'closed';
  messages: Array<{
    sender: 'user' | 'support';
    text: string;
    timestamp: string;
  }>;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  name: string;
  email: string;
  date: string;
  time: string;
  type: 'consultation' | 'site-visit' | 'water-test';
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}
