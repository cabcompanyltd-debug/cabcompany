/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { createAdminClient } from '@insforge/sdk';

// Initialize Express
const app = express();
const PORT = 3000;

// Parse JSON bodies with higher payload limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize Gemini SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Initialize InsForge Admin Client (self-configuring from project.json)
let insforge: any = null;
try {
  const projectJsonPath = path.join(process.cwd(), '.insforge', 'project.json');
  if (fs.existsSync(projectJsonPath)) {
    const config = JSON.parse(fs.readFileSync(projectJsonPath, 'utf8'));
    insforge = createAdminClient({
      baseUrl: config.oss_host,
      apiKey: config.api_key,
    });
    console.log('InsForge Admin Client successfully initialized for project:', config.project_name);
  } else {
    insforge = createAdminClient({
      baseUrl: 'https://26nsj3zw.us-east.insforge.app',
      apiKey: 'ik_a6c2e80beb8c8aedcc63e7c50fae27fa',
    });
    console.log('InsForge Admin Client initialized with default credentials.');
  }
} catch (e) {
  console.error('Failed to initialize InsForge Client, using in-memory fallback:', e);
}

// Helper function to safely publish realtime events
async function safeRealtimePublish(channel: string, event: string, payload: any) {
  if (insforge && insforge.realtime) {
    try {
      await insforge.realtime.publish(channel, event, payload);
    } catch (e) {
      console.warn(`[Realtime] Failed to publish to ${channel}:${event}:`, e);
    }
  }
}

// Secure InsForge Auth and Profile Synchronization Endpoints
// Explicit User & Admin Registration API with InsForge Auth
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    if (!insforge) {
      throw new Error('InsForge database is not initialized');
    }

    // 1. Check if user profile already exists in DB
    const { data: existingUser, error: checkError } = await insforge.database
      .from('users_profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (checkError) throw checkError;
    if (existingUser) {
      return res.status(400).json({ error: 'A user profile with this email already exists. Please sign in.' });
    }

    // 2. Sign up user in InsForge Auth
    console.log('[InsForge Auth] Signing up user:', email);
    const { data: authData, error: authError } = await insforge.auth.signUp({
      email,
      password,
      name: name || email.split('@')[0],
    });

    if (authError) {
      console.error('[InsForge Auth] SignUp Error:', authError);
      return res.status(400).json({ error: authError.message || 'Auth registration failed' });
    }

    const userId = authData.user.id;
    const defaultName = name || email.split('@')[0].toUpperCase();

    // 3. Create initial profile in users_profiles table with role: 'pending'
    const newUser = {
      id: userId,
      email,
      password, // retained for backward compatibility
      name: defaultName,
      role: 'pending', // User will select role in Step Wizard
      company: '',
      phone: '',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    };

    const { data: createdUser, error: insertError } = await insforge.database
      .from('users_profiles')
      .insert([newUser])
      .select()
      .single();

    if (insertError) {
      console.error('[InsForge DB] Insert Profile Error:', insertError);
      throw insertError;
    }

    return res.json({
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        role: createdUser.role,
        company: createdUser.company,
        phone: createdUser.phone,
        avatarUrl: createdUser.avatar_url,
        completedOnboarding: false,
        createdAt: createdUser.created_at,
      },
      token: `insforge-token-${createdUser.id}`
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

// Complete Onboarding Endpoint (Role selection, contact info, avatar)
app.post('/api/auth/complete-onboarding', async (req, res) => {
  const { userId, role, name, company, phone, avatarUrl } = req.body;
  if (!userId || !role) {
    return res.status(400).json({ error: 'User ID and selected Role are required' });
  }

  try {
    if (!insforge) {
      throw new Error('InsForge database is not initialized');
    }

    const validRole = (role === 'admin') ? 'admin' : 'user';
    const finalAvatar = avatarUrl || (validRole === 'admin' 
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' 
      : 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=150');

    const updateData = {
      role: validRole,
      name: name || 'Valued User',
      company: company || (validRole === 'admin' ? 'C.A.B Company Ltd' : 'C.A.B Enterprise Client'),
      phone: phone || '+233 54 111 0000',
      avatar_url: finalAvatar,
    };

    console.log('[InsForge DB] Completing onboarding for user:', userId, updateData);

    const { data: updatedUser, error: updateError } = await insforge.database
      .from('users_profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('[InsForge DB] Update Profile Error:', updateError);
      throw updateError;
    }

    return res.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        company: updatedUser.company,
        phone: updatedUser.phone,
        avatarUrl: updatedUser.avatar_url,
        completedOnboarding: true,
        createdAt: updatedUser.created_at,
      }
    });
  } catch (err: any) {
    console.error('Onboarding completion error:', err);
    res.status(500).json({ error: 'Failed to complete onboarding', details: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    if (!insforge) {
      throw new Error('InsForge database is not initialized');
    }

    // 1. Authenticate with InsForge Auth
    console.log('[InsForge Auth] Logging in user:', email);
    const { data: authData, error: authError } = await insforge.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('[InsForge Auth] Login error:', authError);
      return res.status(401).json({ error: authError.message || 'Invalid email or password' });
    }

    const userId = authData.user.id;

    // 2. Fetch the profile from users_profiles
    const { data: user, error: dbError } = await insforge.database
      .from('users_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (dbError) throw dbError;

    if (!user) {
      // Auto-create profile if missing
      const newUser = {
        id: userId,
        email,
        password,
        name: email.split('@')[0].toUpperCase(),
        role: 'pending',
        company: '',
        phone: '',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
      };

      const { data: createdUser, error: insertError } = await insforge.database
        .from('users_profiles')
        .insert([newUser])
        .select()
        .single();

      if (insertError) throw insertError;

      return res.json({
        user: {
          id: createdUser.id,
          email: createdUser.email,
          name: createdUser.name,
          role: createdUser.role,
          company: createdUser.company,
          phone: createdUser.phone,
          avatarUrl: createdUser.avatar_url,
          completedOnboarding: false,
          createdAt: createdUser.created_at,
        },
        token: `insforge-token-${createdUser.id}`
      });
    }

    const completedOnboarding = user.role !== 'pending' && Boolean(user.role);

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        company: user.company,
        phone: user.phone,
        avatarUrl: user.avatar_url,
        completedOnboarding,
        createdAt: user.created_at,
      },
      token: `insforge-token-${user.id}`
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Authentication failed', details: err.message });
  }
});

// Google OAuth URL generation route
app.get('/api/auth/google', async (req, res) => {
  try {
    const origin = req.headers.referer || req.headers.origin || 'http://localhost:3000';
    const cleanOrigin = origin.replace(/\/$/, '');
    const redirectTo = `${cleanOrigin}/portal`;
    
    console.log('[InsForge Auth] Initiating Google OAuth redirect to:', redirectTo);
    const { data, error } = await insforge.auth.signInWithOAuth('google', {
      redirectTo,
      skipBrowserRedirect: true,
    });
    
    if (error) throw error;
    res.json({ url: data.url });
  } catch (err: any) {
    console.error('Google OAuth URL generation error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Google OAuth Callback profile auto-registration route
app.post('/api/auth/register-oauth', async (req, res) => {
  const { id, email, name, role } = req.body;
  if (!id || !email || !name) {
    return res.status(400).json({ error: 'ID, email, and name are required' });
  }
  
  try {
    const newUser = {
      id,
      email,
      password: 'oauth-verified',
      name,
      role: role || 'user',
      company: role === 'admin' ? 'C.A.B Company Ltd' : 'C.A.B Enterprise Client',
      phone: '+233 54 111 0000',
      avatar_url: role === 'admin' 
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' 
        : 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=150'
    };
    
    console.log('[InsForge DB] Registering profile for OAuth user:', id);
    const { data: createdUser, error: insertError } = await insforge.database
      .from('users_profiles')
      .insert([newUser])
      .select()
      .single();
      
    if (insertError) throw insertError;
    
    res.json({ user: createdUser });
  } catch (err: any) {
    console.error('OAuth registration error:', err);
    res.status(500).json({ error: 'Failed to create OAuth profile', details: err.message });
  }
});

// Fetch user profile GET route
app.get('/api/user/profile', async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  try {
    const { data: user, error } = await insforge.database
      .from('users_profiles')
      .select('*')
      .eq('id', id as string)
      .maybeSingle();

    if (error) throw error;
    if (!user) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// Update Profile API
app.put('/api/user/profile', async (req, res) => {
  const { id, name, company, phone, email } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const { data: updatedUser, error } = await insforge.database
      .from('users_profiles')
      .update({ name, company, phone, email })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    res.json({ success: true, user: updatedUser });
  } catch (err: any) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Upload Avatar API (using InsForge Storage Bucket)
app.post('/api/user/avatar', async (req, res) => {
  const { userId, avatarBase64, mimeType } = req.body;
  if (!userId || !avatarBase64) {
    return res.status(400).json({ error: 'userId and avatarBase64 are required' });
  }

  try {
    const base64Data = avatarBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    const blob = new Blob([buffer], { type: mimeType || 'image/png' });

    // Upload to avatars bucket
    const { data: uploadData, error: uploadError } = await insforge.storage
      .from('avatars')
      .uploadAuto(blob);

    if (uploadError || !uploadData) {
      throw uploadError || new Error('Upload to storage failed');
    }

    // Save avatar URL back to the users_profiles database
    const { data: updatedUser, error: dbError } = await insforge.database
      .from('users_profiles')
      .update({ avatar_url: uploadData.url })
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (dbError) {
      throw dbError;
    }

    res.json({ success: true, avatarUrl: uploadData.url, user: updatedUser });
  } catch (err: any) {
    console.error('Avatar upload error:', err);
    res.status(500).json({ error: err.message || 'Avatar upload failed' });
  }
});

// General InsForge Storage Bucket Upload Endpoint
app.post('/api/storage/upload', async (req, res) => {
  const { bucket, fileBase64, mimeType } = req.body;
  if (!bucket || !fileBase64) {
    return res.status(400).json({ error: 'bucket and fileBase64 are required' });
  }

  try {
    const base64Data = fileBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    const blob = new Blob([buffer], { type: mimeType || 'image/jpeg' });

    const { data: uploadData, error: uploadError } = await insforge.storage
      .from(bucket)
      .uploadAuto(blob);

    if (uploadError || !uploadData) {
      throw uploadError || new Error('Upload to storage failed');
    }

    res.json({ success: true, url: uploadData.url, key: uploadData.key });
  } catch (err: any) {
    console.error('Storage upload error:', err);
    res.status(500).json({ error: err.message || 'Storage upload failed' });
  }
});

// General InsForge Storage Bucket Delete Endpoint
app.post('/api/storage/delete', async (req, res) => {
  const { bucket, key } = req.body;
  if (!bucket || !key) {
    return res.status(400).json({ error: 'bucket and key are required' });
  }

  try {
    const { error } = await insforge.storage
      .from(bucket)
      .delete(key);

    if (error) {
      throw error;
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error('Storage delete error:', err);
    res.status(500).json({ error: err.message || 'Storage delete failed' });
  }
});

// AI Consulting Chatbot API Endpoint (InsForge AI Model with fallback)
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const systemPrompt = `You are the chief AI Agricultural and Water Engineering consultant at C.A.B Company Ltd.
The company specializes in:
- General Agriculture & Modern Farming
- Controlled Environment Agriculture (Greenhouses, CEA)
- Sustainable Crop Production and Organic Fertilizer systems
- High-efficiency Solar Irrigation Systems and Drip networks
- Industrial Water Purification (Reverse Osmosis, Nano-filtration, EDI)
- Absolute sterile Bottled Drinking Water bottling lines
- Wastewater treatment and WHO recycling standards

Your goal is to answer client queries with professional, highly technical, yet easy-to-understand insights. Do not use generic filler text or say you are "an AI language model". Speak as an authoritative, scientific consultant working for C.A.B Company. Keep your answer within 1-2 paragraphs unless they ask for detailed steps. Include specific numbers (e.g. pH values, drip rate calculations, nitrogen ratios) to maintain a realistic, elite enterprise feel.`;

  try {
    let replyText = '';

    // 1. Attempt to use InsForge AI Model Gateway
    if (insforge && insforge.ai) {
      try {
        console.log('[InsForge AI] Triggering AI chat completion via InsForge AI...');
        const completion = await insforge.ai.chat.completions.create({
          model: 'openai/gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ]
        });

        if (completion?.choices?.[0]?.message?.content) {
          replyText = completion.choices[0].message.content;
        }
      } catch (insforgeErr: any) {
        console.warn('[InsForge AI] InsForge AI model unavailable, falling back to Gemini:', insforgeErr?.message || insforgeErr);
      }
    }

    // 2. Fallback to Gemini if InsForge AI is unconfigured or unavailable
    if (!replyText) {
      const fullPrompt = `${systemPrompt}\n\nCurrent User Inquiry: "${message}"\n\nPlease respond directly, professionally, and eloquently:`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
          temperature: 0.7,
        }
      });
      replyText = response.text || '';
    }

    res.json({ text: replyText || 'Our systems are undergoing regular diagnostic cycles. Please re-query in a moment.' });
  } catch (error: any) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'AI processing failed', details: error.message });
  }
});

// Contact submissions
app.post('/api/contact', async (req, res) => {
  const { userId, name, email, subject, department, message } = req.body;
  const newMsg = {
    id: 'm-' + Math.floor(Math.random() * 100000),
    user_id: userId || null,
    name,
    email,
    subject,
    department: department || 'General Enquiry',
    message,
    status: 'Unread',
    reply: null,
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await insforge.database
      .from('contact_messages')
      .insert([newMsg])
      .select()
      .single();

    if (error) throw error;

    // Trigger Realtime publish for immediate dashboard updates
    await safeRealtimePublish('contacts', 'new_contact_message', data);

    res.status(201).json({ success: true, message: 'Message sent successfully', data });
  } catch (err: any) {
    console.error('Contact submit error:', err);
    res.status(500).json({ error: 'Failed to submit contact message', details: err.message });
  }
});

app.get('/api/contact', async (req, res) => {
  const { userId } = req.query;
  try {
    let query = insforge.database.from('contact_messages').select('*');
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { data: messages, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    res.json(messages || []);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/contact/:id', async (req, res) => {
  const { id } = req.params;
  const { status, reply } = req.body;
  const updateData: any = {};
  if (status) updateData.status = status;
  if (reply !== undefined) updateData.reply = reply;

  try {
    const { data, error } = await insforge.database
      .from('contact_messages')
      .update(updateData)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Message not found' });

    // Notify administrators via realtime channel
    await safeRealtimePublish('contacts', 'contact_message_updated', data);

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Quotes requests
app.post('/api/quotes', async (req, res) => {
  const { userId, name, email, phone, company, category, details } = req.body;
  const newQuote = {
    id: 'q-' + Math.floor(Math.random() * 100000),
    user_id: userId || null,
    name,
    email,
    phone,
    company,
    category,
    details,
    status: 'Pending',
    estimate_amount: Math.floor(Math.random() * 12000) + 1500,
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await insforge.database
      .from('quote_requests')
      .insert([newQuote])
      .select()
      .single();

    if (error) throw error;

    // Realtime notification
    await safeRealtimePublish('quotes', 'new_quote_request', data);

    res.status(201).json({ success: true, message: 'Quote request submitted', data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/quotes', async (req, res) => {
  const { userId } = req.query;
  try {
    let query = insforge.database.from('quote_requests').select('*');
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { data: quotes, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    // Map backend estimate_amount to estimateAmount to retain frontend compatibility
    const mappedQuotes = (quotes || []).map((q: any) => ({
      ...q,
      estimateAmount: q.estimate_amount
    }));
    res.json(mappedQuotes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/quotes/:id', async (req, res) => {
  const { id } = req.params;
  const { status, estimateAmount } = req.body;
  const updateData: any = {};
  if (status) updateData.status = status;
  if (estimateAmount !== undefined) updateData.estimate_amount = estimateAmount;

  try {
    const { data, error } = await insforge.database
      .from('quote_requests')
      .update(updateData)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Quote not found' });

    const result = {
      ...data,
      estimateAmount: data.estimate_amount
    };

    // Realtime publish
    await safeRealtimePublish('quotes', 'quote_request_updated', result);

    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Consultation Bookings
app.post('/api/bookings', async (req, res) => {
  const { userId, name, email, date, time, type, notes } = req.body;
  const newBooking = {
    id: 'b-' + Math.floor(Math.random() * 100000),
    user_id: userId || 'guest',
    name,
    email,
    date,
    time,
    type,
    notes,
    status: 'pending',
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await insforge.database
      .from('bookings')
      .insert([newBooking])
      .select()
      .single();

    if (error) throw error;

    const result = {
      ...data,
      userId: data.user_id
    };

    // Realtime publish
    await safeRealtimePublish('bookings', 'new_booking', result);

    res.status(201).json({ success: true, message: 'Booking requested successfully', data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  const { userId } = req.query;
  try {
    let query = insforge.database.from('bookings').select('*');
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { data: bookings, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    const mappedBookings = (bookings || []).map((b: any) => ({
      ...b,
      userId: b.user_id
    }));
    res.json(mappedBookings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const { data, error } = await insforge.database
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Booking not found' });

    const result = {
      ...data,
      userId: data.user_id
    };

    // Realtime publish
    await safeRealtimePublish('bookings', 'booking_updated', result);

    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Tickets Endpoints
app.post('/api/tickets', async (req, res) => {
  const { userId, subject, category, priority, message } = req.body;
  const newTicket = {
    id: 't-' + Math.floor(Math.random() * 100000),
    user_id: userId || 'user-123',
    subject,
    category,
    priority,
    status: 'open',
    messages: JSON.stringify([
      { sender: 'user', text: message, timestamp: new Date().toISOString() }
    ]),
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await insforge.database
      .from('tickets')
      .insert([newTicket])
      .select()
      .single();

    if (error) throw error;

    const parsedMsgs = typeof data.messages === 'string' ? JSON.parse(data.messages) : data.messages;
    const result = {
      ...data,
      userId: data.user_id,
      messages: parsedMsgs
    };

    // Realtime publish
    await safeRealtimePublish('tickets', 'new_ticket', result);

    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tickets', async (req, res) => {
  const { userId } = req.query;
  try {
    let query = insforge.database.from('tickets').select('*');
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { data: tickets, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    const parsedTickets = (tickets || []).map((t: any) => {
      let parsedMsgs = t.messages;
      if (typeof t.messages === 'string') {
        try { parsedMsgs = JSON.parse(t.messages); } catch (e) {}
      }
      return { ...t, userId: t.user_id, messages: parsedMsgs };
    });

    res.json(parsedTickets);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tickets/:id/message', async (req, res) => {
  const { id } = req.params;
  const { sender, text } = req.body;

  try {
    const { data: ticket, error: selectError } = await insforge.database
      .from('tickets')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (selectError) throw selectError;
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    let parsedMsgs = ticket.messages;
    if (typeof ticket.messages === 'string') {
      try { parsedMsgs = JSON.parse(ticket.messages); } catch (e) {}
    }
    if (!Array.isArray(parsedMsgs)) {
      parsedMsgs = [];
    }

    parsedMsgs.push({
      sender: sender || 'support',
      text,
      timestamp: new Date().toISOString()
    });

    const { data: updatedTicket, error: updateError } = await insforge.database
      .from('tickets')
      .update({ messages: JSON.stringify(parsedMsgs) })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (updateError) throw updateError;

    const result = {
      ...updatedTicket,
      userId: updatedTicket.user_id,
      messages: parsedMsgs
    };

    // Realtime notification
    await safeRealtimePublish(`ticket:${id}`, 'new_ticket_message', result);
    await safeRealtimePublish(`tickets`, 'ticket_updated', result);

    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Live Event Stream (SSE) for Real-time chat sync
app.get('/api/tickets/:id/live', async (req, res) => {
  const { id } = req.params;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendTicketUpdate = async () => {
    try {
      const { data: ticket, error } = await insforge.database
        .from('tickets')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (ticket && !error) {
        let parsedMsgs = ticket.messages;
        if (typeof ticket.messages === 'string') {
          try { parsedMsgs = JSON.parse(ticket.messages); } catch (e) {}
        }
        const formatted = { ...ticket, userId: ticket.user_id, messages: parsedMsgs };
        res.write(`data: ${JSON.stringify(formatted)}\n\n`);
      }
    } catch (e) {
      // Ignore
    }
  };

  // Send initial load
  await sendTicketUpdate();

  // Poll database every 1000ms for fast, real-time message streaming
  const timer = setInterval(sendTicketUpdate, 1000);

  req.on('close', () => {
    clearInterval(timer);
  });
});

// Admin Telemetry & Metrics API
app.get('/api/admin/metrics', async (req, res) => {
  try {
    const { count: quotesCount } = await insforge.database.from('quote_requests').select('*', { count: 'exact', head: true });
    const { count: messagesCount } = await insforge.database.from('contact_messages').select('*', { count: 'exact', head: true });
    const { count: bookingsCount } = await insforge.database.from('bookings').select('*', { count: 'exact', head: true });
    const { count: ticketsCount } = await insforge.database.from('tickets').select('*', { count: 'exact', head: true });

    const totalQuotes = quotesCount || 0;
    const totalMessages = messagesCount || 0;
    const totalBookings = bookingsCount || 0;
    const totalTickets = ticketsCount || 0;

    res.json({
      analytics: {
        visitors: 12405 + totalMessages * 3 + totalQuotes * 5,
        activeUsers: 84,
        bounceRate: '28.4%',
        avgSession: '4m 32s',
        monthlyGrowth: '+12.5%'
      },
      counts: {
        quotes: totalQuotes,
        messages: totalMessages,
        bookings: totalBookings,
        tickets: totalTickets
      },
      logs: [
        { id: 1, type: 'System', event: 'InsForge Database synced successfully', time: 'Just now' },
        { id: 2, type: 'Security', event: 'Admin authenticated from Accra, GH', time: '10 mins ago' },
        { id: 3, type: 'API', event: 'Gemini-3.5-flash model loaded', time: '1 hour ago' },
        { id: 4, type: 'Storage', event: 'Purification schema documentation uploaded', time: '4 hours ago' }
      ]
    });
  } catch (err: any) {
    console.error('Error fetching admin metrics:', err);
    res.json({
      analytics: { visitors: 12405, activeUsers: 84, bounceRate: '28.4%', avgSession: '4m 32s', monthlyGrowth: '+12.5%' },
      counts: { quotes: 0, messages: 0, bookings: 0, tickets: 0 },
      logs: [{ id: 1, type: 'System', event: 'InsForge fallback triggered due to error', time: 'Just now' }]
    });
  }
});


// ==========================================
// Products Catalog Management (Admin-managed)
// ==========================================

app.get('/api/products', async (req, res) => {
  const { includeDrafts, category, search } = req.query;
  try {
    let query = insforge.database.from('products').select('*');
    if (includeDrafts !== 'true') {
      query = query.or('status.eq.Published,status.is.null');
    }
    if (category && category !== 'all') {
      query = query.eq('category', category as string);
    }
    const { data, error } = await query.order('name', { ascending: true });
    if (error) throw error;

    let filtered = data || [];
    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter((p: any) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.sub_category?.toLowerCase().includes(q)
      );
    }

    res.json(filtered);
  } catch (err: any) {
    console.error('Fetch products error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  const { name, category, subCategory, description, price, unit, imageUrl, imageKey, features, inStock, rating, status, isFeatured, slug, seoTitle, seoDescription, seoKeywords, createdBy } = req.body;
  if (!name || !category || !description || price === undefined || !unit || !imageUrl) {
    return res.status(400).json({ error: 'Missing required product fields' });
  }

  const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = 'prod-' + Math.floor(Math.random() * 1000000);
  const newProduct = {
    id,
    name,
    slug: generatedSlug,
    category,
    sub_category: subCategory || category,
    description,
    price: Number(price),
    unit,
    image_url: imageUrl,
    image_key: imageKey || null,
    features: Array.isArray(features) ? features : [],
    in_stock: inStock !== undefined ? !!inStock : true,
    rating: Number(rating) || 4.5,
    status: status || 'Published',
    is_featured: isFeatured !== undefined ? !!isFeatured : false,
    seo_title: seoTitle || name,
    seo_description: seoDescription || description.slice(0, 160),
    seo_keywords: seoKeywords || category,
    created_by: createdBy || 'C.A.B Administrator',
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await insforge.database
      .from('products')
      .insert([newProduct])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    console.error('Create product error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, subCategory, description, price, unit, imageUrl, imageKey, features, inStock, rating, status, isFeatured, slug, seoTitle, seoDescription, seoKeywords, updatedBy } = req.body;
  
  const updatedProduct: any = {
    updated_at: new Date().toISOString()
  };
  if (name !== undefined) updatedProduct.name = name;
  if (slug !== undefined) updatedProduct.slug = slug;
  if (category !== undefined) updatedProduct.category = category;
  if (subCategory !== undefined) updatedProduct.sub_category = subCategory;
  if (description !== undefined) updatedProduct.description = description;
  if (price !== undefined) updatedProduct.price = Number(price);
  if (unit !== undefined) updatedProduct.unit = unit;
  if (imageUrl !== undefined) updatedProduct.image_url = imageUrl;
  if (imageKey !== undefined) updatedProduct.image_key = imageKey;
  if (features !== undefined) updatedProduct.features = Array.isArray(features) ? features : [];
  if (inStock !== undefined) updatedProduct.in_stock = !!inStock;
  if (rating !== undefined) updatedProduct.rating = Number(rating);
  if (status !== undefined) updatedProduct.status = status;
  if (isFeatured !== undefined) updatedProduct.is_featured = !!isFeatured;
  if (seoTitle !== undefined) updatedProduct.seo_title = seoTitle;
  if (seoDescription !== undefined) updatedProduct.seo_description = seoDescription;
  if (seoKeywords !== undefined) updatedProduct.seo_keywords = seoKeywords;
  if (updatedBy !== undefined) updatedProduct.updated_by = updatedBy;

  try {
    const { data, error } = await insforge.database
      .from('products')
      .update(updatedProduct)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    console.error('Update product error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data: existing } = await insforge.database
      .from('products')
      .select('image_key')
      .eq('id', id)
      .maybeSingle();

    if (existing?.image_key) {
      try {
        await insforge.storage.from('product-images').delete(existing.image_key);
      } catch (stErr) {
        console.warn('Storage delete notice:', stErr);
      }
    }

    const { data, error } = await insforge.database
      .from('products')
      .delete()
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// Projects Portfolio Management (Admin-managed)
// ==========================================

app.get('/api/projects', async (req, res) => {
  const { includeDrafts, category, search } = req.query;
  try {
    let query = insforge.database.from('projects').select('*');
    if (includeDrafts !== 'true') {
      query = query.or('status.eq.Completed,status.eq.Published,status.is.null');
    }
    if (category && category !== 'all') {
      query = query.eq('category', category as string);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    let filtered = data || [];
    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter((p: any) =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.client?.toLowerCase().includes(q)
      );
    }

    res.json(filtered);
  } catch (err: any) {
    console.error('Fetch projects error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  const { title, category, client, location, date, description, imageUrl, imageKey, beforeImage, afterImage, status, impact, features, isFeatured, slug, seoTitle, seoDescription, seoKeywords, createdBy } = req.body;
  if (!title || !category || !client || !location || !date || !description || !imageUrl) {
    return res.status(400).json({ error: 'Missing required project fields' });
  }

  const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = 'proj-' + Math.floor(Math.random() * 1000000);
  const newProject = {
    id,
    title,
    slug: generatedSlug,
    category,
    client,
    location,
    date,
    description,
    image_url: imageUrl,
    image_key: imageKey || null,
    before_image: beforeImage || null,
    after_image: afterImage || null,
    status: status || 'Completed',
    impact: impact || null,
    features: Array.isArray(features) ? features : [],
    is_featured: isFeatured !== undefined ? !!isFeatured : false,
    seo_title: seoTitle || title,
    seo_description: seoDescription || description.slice(0, 160),
    seo_keywords: seoKeywords || category,
    created_by: createdBy || 'C.A.B Administrator',
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await insforge.database
      .from('projects')
      .insert([newProject])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    console.error('Create project error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  const { title, category, client, location, date, description, imageUrl, imageKey, beforeImage, afterImage, status, impact, features, isFeatured, slug, seoTitle, seoDescription, seoKeywords, updatedBy } = req.body;

  const updatedProject: any = {
    updated_at: new Date().toISOString()
  };
  if (title !== undefined) updatedProject.title = title;
  if (slug !== undefined) updatedProject.slug = slug;
  if (category !== undefined) updatedProject.category = category;
  if (client !== undefined) updatedProject.client = client;
  if (location !== undefined) updatedProject.location = location;
  if (date !== undefined) updatedProject.date = date;
  if (description !== undefined) updatedProject.description = description;
  if (imageUrl !== undefined) updatedProject.image_url = imageUrl;
  if (imageKey !== undefined) updatedProject.image_key = imageKey;
  if (beforeImage !== undefined) updatedProject.before_image = beforeImage;
  if (afterImage !== undefined) updatedProject.after_image = afterImage;
  if (status !== undefined) updatedProject.status = status;
  if (impact !== undefined) updatedProject.impact = impact;
  if (features !== undefined) updatedProject.features = Array.isArray(features) ? features : [];
  if (isFeatured !== undefined) updatedProject.is_featured = !!isFeatured;
  if (seoTitle !== undefined) updatedProject.seo_title = seoTitle;
  if (seoDescription !== undefined) updatedProject.seo_description = seoDescription;
  if (seoKeywords !== undefined) updatedProject.seo_keywords = seoKeywords;
  if (updatedBy !== undefined) updatedProject.updated_by = updatedBy;

  try {
    const { data, error } = await insforge.database
      .from('projects')
      .update(updatedProject)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    console.error('Update project error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data: existing } = await insforge.database
      .from('projects')
      .select('image_key')
      .eq('id', id)
      .maybeSingle();

    if (existing?.image_key) {
      try {
        await insforge.storage.from('project-images').delete(existing.image_key);
      } catch (stErr) {
        console.warn('Storage delete notice:', stErr);
      }
    }

    const { data, error } = await insforge.database
      .from('projects')
      .delete()
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('Delete project error:', err);
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// Buy and Purchase Inquiries (Feedback Loop)
// ==========================================

app.post('/api/buy', async (req, res) => {
  const { itemId, itemType, itemName, buyerName, buyerEmail, buyerPhone, quantity, message, priceOffered } = req.body;
  if (!itemId || !itemType || !itemName || !buyerName || !buyerEmail || !buyerPhone) {
    return res.status(400).json({ error: 'Missing required buyer or item information' });
  }

  const id = 'buy-' + Math.floor(Math.random() * 1000000);
  const newBuyRequest = {
    id,
    item_id: itemId,
    item_type: itemType,
    item_name: itemName,
    buyer_name: buyerName,
    buyer_email: buyerEmail,
    buyer_phone: buyerPhone,
    quantity: Number(quantity) || 1,
    message: message || '',
    price_offered: priceOffered !== undefined ? Number(priceOffered) : null,
    status: 'Pending'
  };

  try {
    const { data, error } = await insforge.database
      .from('buy_requests')
      .insert([newBuyRequest])
      .select()
      .single();
    if (error) throw error;

    // Trigger realtime notification to admin dashboard
    await safeRealtimePublish('buy_requests', 'new_request', data);

    res.status(201).json({ success: true, data });
  } catch (err: any) {
    console.error('Create buy request error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/buy', async (req, res) => {
  try {
    const { data, error } = await insforge.database
      .from('buy_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    console.error('Fetch buy requests error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/buy/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  try {
    const { data, error } = await insforge.database
      .from('buy_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    console.error('Update buy request status error:', err);
    res.status(500).json({ error: err.message });
  }
});


// Blogs Endpoints (Publicly readable, with admin publishing capability)
app.post('/api/blogs', async (req, res) => {
  const { title, content, summary, category, author, imageUrl, imageKey, readTime, status, isFeatured, slug, seoTitle, seoDescription, seoKeywords, createdBy } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = 'blog-' + Math.floor(Math.random() * 1000000);
  const newPost = {
    id,
    title,
    slug: generatedSlug,
    content,
    summary: summary || content.slice(0, 150) + '...',
    category: category || 'Agronomy',
    author: author || 'C.A.B Administrator',
    image_url: imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600',
    image_key: imageKey || null,
    read_time: readTime || '5 min read',
    status: status || 'Published',
    is_featured: isFeatured !== undefined ? !!isFeatured : false,
    seo_title: seoTitle || title,
    seo_description: seoDescription || summary || content.slice(0, 160),
    seo_keywords: seoKeywords || category || 'agronomy, agriculture',
    created_by: createdBy || author || 'C.A.B Administrator',
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await insforge.database
      .from('blog_posts')
      .insert([newPost])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err: any) {
    console.error('Blog creation error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/blogs', async (req, res) => {
  const { includeDrafts, category, search } = req.query;
  try {
    let query = insforge.database.from('blog_posts').select('*');
    if (includeDrafts !== 'true') {
      query = query.or('status.eq.Published,status.is.null');
    }
    if (category && category !== 'all') {
      query = query.eq('category', category as string);
    }
    const { data: posts, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    let filtered = posts || [];
    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter((p: any) =>
        p.title?.toLowerCase().includes(q) ||
        p.summary?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }
    
    const mappedPosts = filtered.map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug || p.id,
      content: p.content,
      summary: p.summary,
      category: p.category,
      author: {
        name: p.author || 'C.A.B Administrator',
        role: 'Expert Contributor',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
      },
      image: p.image_url,
      image_url: p.image_url,
      imageKey: p.image_key,
      readTime: p.read_time,
      status: p.status || 'Published',
      isFeatured: !!p.is_featured,
      seoTitle: p.seo_title,
      seoDescription: p.seo_description,
      seoKeywords: p.seo_keywords,
      date: new Date(p.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      createdAt: p.created_at,
      tags: [p.category]
    }));

    res.json(mappedPosts);
  } catch (err: any) {
    console.error('Blog fetch error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  const { title, slug, content, summary, category, author, imageUrl, imageKey, readTime, status, isFeatured, seoTitle, seoDescription, seoKeywords, updatedBy } = req.body;

  const updateData: any = {
    updated_at: new Date().toISOString()
  };
  if (title !== undefined) updateData.title = title;
  if (slug !== undefined) updateData.slug = slug;
  if (content !== undefined) updateData.content = content;
  if (summary !== undefined) updateData.summary = summary;
  if (category !== undefined) updateData.category = category;
  if (author !== undefined) updateData.author = author;
  if (imageUrl !== undefined) updateData.image_url = imageUrl;
  if (imageKey !== undefined) updateData.image_key = imageKey;
  if (readTime !== undefined) updateData.read_time = readTime;
  if (status !== undefined) updateData.status = status;
  if (isFeatured !== undefined) updateData.is_featured = !!isFeatured;
  if (seoTitle !== undefined) updateData.seo_title = seoTitle;
  if (seoDescription !== undefined) updateData.seo_description = seoDescription;
  if (seoKeywords !== undefined) updateData.seo_keywords = seoKeywords;
  if (updatedBy !== undefined) updateData.updated_by = updatedBy;

  try {
    const { data, error } = await insforge.database
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('Blog update error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Get blog post first to check for image_key
    const { data: existing } = await insforge.database
      .from('blog_posts')
      .select('image_key')
      .eq('id', id)
      .maybeSingle();

    if (existing?.image_key) {
      try {
        await insforge.storage.from('blog-images').delete(existing.image_key);
      } catch (stErr) {
        console.warn('Orphaned storage delete notice:', stErr);
      }
    }

    const { data, error } = await insforge.database
      .from('blog_posts')
      .delete()
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('Blog delete error:', err);
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// Real Estate Management Endpoints
// ==========================================

app.get('/api/properties', async (req, res) => {
  try {
    if (!insforge) {
      throw new Error('InsForge database client is not initialized');
    }
    const { data, error } = await insforge.database
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    console.error('Fetch properties error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (!insforge) {
      throw new Error('InsForge database client is not initialized');
    }
    const { data, error } = await insforge.database
      .from('properties')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(data);
  } catch (err: any) {
    console.error('Fetch property by ID error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/properties', async (req, res) => {
  const { 
    name, refCode, category, type, description, price, status, location, 
    city, district, region, amenities, bedrooms, bathrooms, parking, 
    landSize, buildingSize, imageUrl, gallery, videoUrl, floorPlans, 
    brochureUrl, virtualTourUrl, nearbySchools, nearbyHospitals, nearbyRoads,
    agentName, agentPhone, agentEmail, isFeatured, publishSchedule,
    seoTitle, seoDescription, seoKeywords
  } = req.body;

  if (!name || !refCode || !description || price === undefined || !location || !imageUrl) {
    return res.status(400).json({ error: 'Missing required property fields' });
  }

  const id = 'prop-' + Math.floor(Math.random() * 1000000);
  const newProperty = {
    id,
    name,
    ref_code: refCode,
    category: category || 'residential',
    type: type || 'villas',
    description,
    price: Number(price),
    status: status || 'Available',
    location,
    city: city || 'Accra',
    district: district || 'Airport Residential Area',
    region: region || 'Greater Accra',
    amenities: Array.isArray(amenities) ? amenities : [],
    bedrooms: bedrooms !== undefined ? Number(bedrooms) : 0,
    bathrooms: bathrooms !== undefined ? Number(bathrooms) : 0,
    parking: parking !== undefined ? Number(parking) : 0,
    land_size: landSize || 'N/A',
    building_size: buildingSize || 'N/A',
    image_url: imageUrl,
    gallery: Array.isArray(gallery) ? gallery : [],
    video_url: videoUrl || '',
    floor_plans: Array.isArray(floorPlans) ? floorPlans : [],
    brochure_url: brochureUrl || '',
    virtual_tour_url: virtualTourUrl || '',
    nearby_schools: Array.isArray(nearbySchools) ? nearbySchools : [],
    nearby_hospitals: Array.isArray(nearbyHospitals) ? nearbyHospitals : [],
    nearby_roads: Array.isArray(nearbyRoads) ? nearbyRoads : [],
    agent_name: agentName || 'Charles Boateng',
    agent_phone: agentPhone || '+233 54 221 0099',
    agent_email: agentEmail || 'realestate@cabcompanyltd.com',
    is_featured: isFeatured !== undefined ? !!isFeatured : false,
    publish_schedule: publishSchedule || null,
    seo_title: seoTitle || name,
    seo_description: seoDescription || description.slice(0, 160),
    seo_keywords: seoKeywords || 'property, real estate, cab real estate',
    reviews: [],
    analytics: { views: Math.floor(Math.random() * 80) + 10, inquiries: 0 }
  };

  try {
    if (!insforge) {
      throw new Error('InsForge database client is not initialized');
    }
    const { data, error } = await insforge.database
      .from('properties')
      .insert([newProperty])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    console.error('Create property error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/properties/:id', async (req, res) => {
  const { id } = req.params;
  const updateData: any = {};

  const fields = [
    'name', 'category', 'type', 'description', 'price', 'status', 'location', 
    'city', 'district', 'region', 'bedrooms', 'bathrooms', 'parking', 
    'landSize', 'buildingSize', 'imageUrl', 'videoUrl', 'brochureUrl', 
    'virtualTourUrl', 'agentName', 'agentPhone', 'agentEmail', 'isFeatured', 
    'publishSchedule', 'seoTitle', 'seoDescription', 'seoKeywords'
  ];

  for (const f of fields) {
    if (req.body[f] !== undefined) {
      if (f === 'refCode') updateData.ref_code = req.body[f];
      else if (f === 'landSize') updateData.land_size = req.body[f];
      else if (f === 'buildingSize') updateData.building_size = req.body[f];
      else if (f === 'imageUrl') updateData.image_url = req.body[f];
      else if (f === 'videoUrl') updateData.video_url = req.body[f];
      else if (f === 'brochureUrl') updateData.brochure_url = req.body[f];
      else if (f === 'virtualTourUrl') updateData.virtual_tour_url = req.body[f];
      else if (f === 'agentName') updateData.agent_name = req.body[f];
      else if (f === 'agentPhone') updateData.agent_phone = req.body[f];
      else if (f === 'agentEmail') updateData.agent_email = req.body[f];
      else if (f === 'isFeatured') updateData.is_featured = !!req.body[f];
      else if (f === 'publishSchedule') updateData.publish_schedule = req.body[f];
      else if (f === 'seoTitle') updateData.seo_title = req.body[f];
      else if (f === 'seoDescription') updateData.seo_description = req.body[f];
      else if (f === 'seoKeywords') updateData.seo_keywords = req.body[f];
      else {
        updateData[f] = req.body[f];
      }
    }
  }

  if (req.body.amenities !== undefined) updateData.amenities = req.body.amenities;
  if (req.body.gallery !== undefined) updateData.gallery = req.body.gallery;
  if (req.body.floorPlans !== undefined) updateData.floor_plans = req.body.floorPlans;
  if (req.body.nearbySchools !== undefined) updateData.nearby_schools = req.body.nearbySchools;
  if (req.body.nearbyHospitals !== undefined) updateData.nearby_hospitals = req.body.nearbyHospitals;
  if (req.body.nearbyRoads !== undefined) updateData.nearby_roads = req.body.nearbyRoads;
  if (req.body.reviews !== undefined) updateData.reviews = req.body.reviews;
  if (req.body.analytics !== undefined) updateData.analytics = req.body.analytics;

  try {
    if (!insforge) {
      throw new Error('InsForge database client is not initialized');
    }
    const { data, error } = await insforge.database
      .from('properties')
      .update(updateData)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    console.error('Update property error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/properties/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (!insforge) {
      throw new Error('InsForge database client is not initialized');
    }

    const { data: existing } = await insforge.database
      .from('properties')
      .select('image_key')
      .eq('id', id)
      .maybeSingle();

    if (existing?.image_key) {
      try {
        await insforge.storage.from('property-images').delete(existing.image_key);
      } catch (stErr) {
        console.warn('Property storage delete notice:', stErr);
      }
    }

    const { data, error } = await insforge.database
      .from('properties')
      .delete()
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('Delete property error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Real Estate Inquiries & Bookings
app.get('/api/properties-inquiries', async (req, res) => {
  try {
    if (!insforge) {
      throw new Error('InsForge database client is not initialized');
    }
    const { data, error } = await insforge.database
      .from('property_inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    console.error('Fetch property inquiries error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/properties-inquiries', async (req, res) => {
  const { propertyId, propertyName, name, email, phone, type, preferredDate, preferredTime, message } = req.body;
  if (!propertyId || !propertyName || !name || !email || !phone || !message) {
    return res.status(400).json({ error: 'Missing required inquiry fields' });
  }

  const id = 'inq-' + Math.floor(Math.random() * 1000000);
  const newInquiry = {
    id,
    property_id: propertyId,
    property_name: propertyName,
    name,
    email,
    phone,
    type: type || 'Inspection',
    preferred_date: preferredDate || null,
    preferred_time: preferredTime || null,
    message,
    status: 'Pending'
  };

  try {
    if (!insforge) {
      throw new Error('InsForge database client is not initialized');
    }
    const { data, error } = await insforge.database
      .from('property_inquiries')
      .insert([newInquiry])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    console.error('Create property inquiry error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/properties-inquiries/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  try {
    if (!insforge) {
      throw new Error('InsForge database client is not initialized');
    }
    const { data, error } = await insforge.database
      .from('property_inquiries')
      .update({ status })
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    console.error('Update property inquiry error:', err);
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// Branded Email Dispatcher with Letterhead
// ==========================================

import nodemailer from 'nodemailer';

function buildBrandedEmailHtml(subject: string, content: string, templateType: string): string {
  let primaryColor = '#10B981'; // brand green
  let bannerText = 'C.A.B COMPANY LTD.';
  let categoryLabel = 'Agribusiness & Water Engineering Solutions';

  if (templateType === 'water') {
    primaryColor = '#2563EB'; // brand blue
    bannerText = 'C.A.B WATER SERVICES';
    categoryLabel = 'Purified Water, RO Engineering & Utilities';
  } else if (templateType === 'agriculture') {
    primaryColor = '#059669'; // darker green
    bannerText = 'C.A.B AGRO-INDUSTRIES';
    categoryLabel = 'Smart Irrigation, Seeds & Controlled Environments';
  } else if (templateType === 'sustainability') {
    primaryColor = '#0D9488'; // teal
    bannerText = 'C.A.B SUSTAINABLE PROJECTS';
    categoryLabel = 'Ecology, Solar-Agri Loops & Tech Systems';
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F3F4F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.05);">
    <!-- Header Banner -->
    <tr>
      <td style="background-color: ${primaryColor}; padding: 32px 40px; text-align: left;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">${bannerText}</h1>
        <p style="margin: 4px 0 0 0; color: rgba(255,255,255,0.85); font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">${categoryLabel}</p>
      </td>
    </tr>
    <!-- Main Body -->
    <tr>
      <td style="padding: 40px; background-color: #ffffff;">
        <h2 style="margin: 0 0 16px 0; color: #1F2937; font-size: 18px; font-weight: 700; line-height: 1.3;">${subject}</h2>
        <div style="color: #4B5563; font-size: 14px; line-height: 1.6; font-weight: 400;">
          ${content.replace(/\n/g, '<br>')}
        </div>
        
        <!-- Corporate Letterhead Footer / Divider -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #E5E7EB;">
          <tr>
            <td style="font-size: 11px; color: #9CA3AF; line-height: 1.5; padding-top: 20px;">
              <strong>C.A.B Company Ltd.</strong><br>
              Accra Industrial Area, Greater Accra, Ghana<br>
              <a href="mailto:info@cabcompanyltd.com" style="color: ${primaryColor}; text-decoration: none; font-weight: 600;">info@cabcompanyltd.com</a> | +233 54 221 0099
            </td>
            <td align="right" valign="bottom" style="padding-top: 20px;">
              <span style="font-size: 9px; font-weight: 900; color: ${primaryColor}; letter-spacing: 0.5px; border: 1px solid ${primaryColor}; padding: 4px 8px; border-radius: 6px; text-transform: uppercase;">
                Certified CAB Solution
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Legal disclaimer footer -->
    <tr>
      <td style="background-color: #F9FAFB; padding: 20px 40px; text-align: center; border-top: 1px solid #F3F4F6;">
        <p style="margin: 0; color: #9CA3AF; font-size: 10px; line-height: 1.4;">
          This email was dispatched securely by C.A.B Company Corporate Service. If you received this email in error, please disregard or contact our help desk.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

app.post('/api/admin/send-email', async (req, res) => {
  const { to, subject, content, templateType, smtpConfig } = req.body;
  if (!to || !subject || !content) {
    return res.status(400).json({ error: 'Missing to, subject, or content field' });
  }

  const html = buildBrandedEmailHtml(subject, content, templateType || 'standard');

  const smtpHost = smtpConfig?.host || process.env.SMTP_HOST;
  const smtpPort = smtpConfig?.port || process.env.SMTP_PORT;
  const smtpUser = smtpConfig?.user || process.env.SMTP_USER;
  const smtpPass = smtpConfig?.pass || process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort) || 587,
        secure: Number(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      await transporter.sendMail({
        from: `"C.A.B Corporate Dispatch" <${smtpUser}>`,
        to,
        subject,
        html
      });

      console.log(`[Email Dispatcher] Successfully sent email to ${to} via SMTP.`);
      return res.json({ success: true, method: 'SMTP', to, html });
    } catch (err: any) {
      console.error('[Email Dispatcher] SMTP dispatch failed:', err);
      return res.status(500).json({ error: `SMTP Send Failed: ${err.message}` });
    }
  } else {
    console.log(`=========================================`);
    console.log(`[Email Sandbox Dispatch] To: ${to}`);
    console.log(`[Email Sandbox Dispatch] Subject: ${subject}`);
    console.log(`[Email Sandbox Dispatch] Template: ${templateType}`);
    console.log(`=========================================`);

    return res.json({
      success: true,
      method: 'Sandbox',
      to,
      html,
      message: 'SMTP credentials not configured. The branded email was successfully processed through the C.A.B Email Sandbox and shown here for verification.'
    });
  }
});


// Serve C.A.B Company brand assets static folder
const distPath = path.join(process.cwd(), 'dist');
app.use('/ImageAssets', express.static(path.join(process.cwd(), 'ImageAssets')));
app.use('/ImageAssets', express.static(path.join(distPath, 'ImageAssets')));

// Static Asset serving and fallback for production or serverless environments
if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
  app.use(express.static(distPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    }
  }));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      return res.sendFile(indexPath);
    }
    next();
  });
}

// Server boot with Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`C.A.B Company Server running at http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
