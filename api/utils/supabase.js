import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client for public/anon operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for service role operations (server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey);

// Helper to verify JWT tokens
export async function verifyToken(token) {
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return null;
    }
    return data.user;
  } catch (error) {
    console.error('[v0] Token verification error:', error);
    return null;
  }
}

// Helper to get current user from request
export async function getCurrentUser(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  return await verifyToken(token);
}
