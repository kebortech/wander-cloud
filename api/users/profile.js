import { supabase } from '../utils/supabase.js';
import { successResponse, errorResponse, APIError } from '../utils/errors.js';
import { corsHeaders, handleCORS } from '../middleware/auth.js';
import { requireAuth } from '../middleware/auth.js';

export async function GET(req) {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const user = await requireAuth(req);

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      throw new APIError('Profile not found', 404);
    }

    return successResponse({ profile });
  } catch (error) {
    return errorResponse(error, error.status || 500);
  }
}

export async function PUT(req) {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const user = await requireAuth(req);
    const updates = await req.json();

    // Prevent updating certain fields
    delete updates.user_id;
    delete updates.is_admin;
    delete updates.created_at;

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw new APIError('Failed to update profile', 400);
    }

    return successResponse({ profile });
  } catch (error) {
    return errorResponse(error, error.status || 500);
  }
}
