import { supabase } from '../utils/supabase.js';
import { successResponse, errorResponse, APIError } from '../utils/errors.js';
import { corsHeaders, handleCORS } from '../middleware/auth.js';

export async function GET(req, { params }) {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const { userId } = params;

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('id, full_name, bio, avatar_url, created_at')
      .eq('id', userId)
      .single();

    if (error) {
      throw new APIError('User not found', 404);
    }

    return successResponse({ profile });
  } catch (error) {
    return errorResponse(error, error.status || 500);
  }
}
