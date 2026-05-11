import { getCurrentUser } from '../utils/supabase.js';
import { APIError } from '../utils/errors.js';

export async function requireAuth(req) {
  const user = await getCurrentUser(req);
  if (!user) {
    throw new APIError('Unauthorized', 401);
  }
  return user;
}

export async function requireAdmin(req) {
  const user = await requireAuth(req);
  
  // Check if user is admin
  const { data: profile } = await import('../utils/supabase.js').then(m => 
    m.supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()
  );

  if (!profile?.is_admin) {
    throw new APIError('Admin privileges required', 403);
  }

  return user;
}

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export function handleCORS(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders(),
    });
  }
}
