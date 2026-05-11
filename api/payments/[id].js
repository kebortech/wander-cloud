import { supabase } from '../utils/supabase.js';
import { successResponse, errorResponse, APIError } from '../utils/errors.js';
import { corsHeaders, handleCORS } from '../middleware/auth.js';
import { requireAuth } from '../middleware/auth.js';

export async function GET(req, { params }) {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const user = await requireAuth(req);
    const { id } = params;

    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new APIError('Payment not found', 404);
    }

    // Get user profile
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    // Verify ownership
    if (payment.user_id !== userProfile.id) {
      throw new APIError('Unauthorized', 403);
    }

    return successResponse({ payment });
  } catch (error) {
    return errorResponse(error, error.status || 500);
  }
}
