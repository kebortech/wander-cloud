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

    const { data: trip, error } = await supabase
      .from('trips')
      .select('*, destinations(*)')
      .eq('id', id)
      .single();

    if (error) {
      throw new APIError('Trip not found', 404);
    }

    // Verify ownership
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (trip.user_id !== userProfile.id) {
      throw new APIError('Unauthorized', 403);
    }

    return successResponse({ trip });
  } catch (error) {
    return errorResponse(error, error.status || 500);
  }
}

export async function PUT(req, { params }) {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const user = await requireAuth(req);
    const { id } = params;
    const updates = await req.json();

    // Get user profile
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    // Verify ownership
    const { data: trip } = await supabase
      .from('trips')
      .select('user_id')
      .eq('id', id)
      .single();

    if (trip.user_id !== userProfile.id) {
      throw new APIError('Unauthorized', 403);
    }

    const { data: updatedTrip, error } = await supabase
      .from('trips')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new APIError('Failed to update trip', 400);
    }

    return successResponse({ trip: updatedTrip });
  } catch (error) {
    return errorResponse(error, error.status || 500);
  }
}

export async function DELETE(req, { params }) {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const user = await requireAuth(req);
    const { id } = params;

    // Get user profile
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    // Verify ownership
    const { data: trip } = await supabase
      .from('trips')
      .select('user_id')
      .eq('id', id)
      .single();

    if (trip.user_id !== userProfile.id) {
      throw new APIError('Unauthorized', 403);
    }

    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id);

    if (error) {
      throw new APIError('Failed to delete trip', 400);
    }

    return successResponse({ message: 'Trip deleted' });
  } catch (error) {
    return errorResponse(error, error.status || 500);
  }
}
