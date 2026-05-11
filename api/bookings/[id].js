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

    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*, trips(*), payments(*)')
      .eq('id', id)
      .single();

    if (error) {
      throw new APIError('Booking not found', 404);
    }

    // Get user profile
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    // Verify ownership
    if (booking.user_id !== userProfile.id) {
      throw new APIError('Unauthorized', 403);
    }

    return successResponse({ booking });
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
    const { data: booking } = await supabase
      .from('bookings')
      .select('user_id')
      .eq('id', id)
      .single();

    if (booking.user_id !== userProfile.id) {
      throw new APIError('Unauthorized', 403);
    }

    const { data: updatedBooking, error } = await supabase
      .from('bookings')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new APIError('Failed to update booking', 400);
    }

    return successResponse({ booking: updatedBooking });
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
    const { data: booking } = await supabase
      .from('bookings')
      .select('user_id')
      .eq('id', id)
      .single();

    if (booking.user_id !== userProfile.id) {
      throw new APIError('Unauthorized', 403);
    }

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      throw new APIError('Failed to delete booking', 400);
    }

    return successResponse({ message: 'Booking deleted' });
  } catch (error) {
    return errorResponse(error, error.status || 500);
  }
}
