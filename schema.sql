-- C.A.B Company Ltd. Database Schema
-- Optimized for InsForge (PostgreSQL)

-- 1. User Profiles
CREATE TABLE IF NOT EXISTS users_profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL DEFAULT 'admin123',
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user', -- 'admin' or 'user'
  company TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Contact Messages (with reply capability)
CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  department TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Unread', -- 'Unread', 'Resolved'
  reply TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Quote Requests
CREATE TABLE IF NOT EXISTS quote_requests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  category TEXT,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Approved'
  estimate_amount INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Consultation Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  type TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'declined'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Technical Support Tickets
CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  category TEXT,
  priority TEXT, -- 'low', 'medium', 'high'
  status TEXT NOT NULL DEFAULT 'open', -- 'open', 'closed'
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Profiles
INSERT INTO users_profiles (id, email, password, name, role, company, phone, avatar_url)
VALUES 
  ('admin-1', 'admin@cabcompanyltd.com', 'admin123', 'Charles A. Boateng', 'admin', 'C.A.B Company Ltd', '+233 54 221 0099', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150')
ON CONFLICT (email) DO UPDATE 
SET name = EXCLUDED.name, role = EXCLUDED.role, company = EXCLUDED.company, phone = EXCLUDED.phone, avatar_url = EXCLUDED.avatar_url;

INSERT INTO users_profiles (id, email, password, name, role, company, phone, avatar_url)
VALUES 
  ('user-123', 'client@cabcompanyltd.com', 'admin123', 'C.A.B Client Representative', 'user', 'C.A.B Enterprise Client', '+233 54 111 0000', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=150')
ON CONFLICT (email) DO UPDATE 
SET name = EXCLUDED.name, role = EXCLUDED.role, company = EXCLUDED.company, phone = EXCLUDED.phone, avatar_url = EXCLUDED.avatar_url;

INSERT INTO users_profiles (id, email, password, name, role, company, phone, avatar_url)
VALUES 
  ('user-124', 'cabcompanyltd@gmail.com', 'admin123', 'CAB Corporate Lead', 'user', 'CAB Cooperatives', '+233 24 555 1111', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150')
ON CONFLICT (email) DO UPDATE 
SET name = EXCLUDED.name, role = EXCLUDED.role, company = EXCLUDED.company, phone = EXCLUDED.phone, avatar_url = EXCLUDED.avatar_url;


-- 6. Products Catalog
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  image_url TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC NOT NULL DEFAULT 4.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Projects Portfolio
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  client TEXT NOT NULL,
  location TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  before_image TEXT,
  after_image TEXT,
  status TEXT NOT NULL DEFAULT 'Completed',
  impact TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Buy and Purchase Requests (Feedback/Inquiries to Admin Dashboard)
CREATE TABLE IF NOT EXISTS buy_requests (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL, -- 'product' or 'project'
  item_name TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  message TEXT,
  price_offered NUMERIC,
  status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Contacted', 'Completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

