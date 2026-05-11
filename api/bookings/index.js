import { supabase } from '../utils/supabase.js';
import { successResponse, errorResponse, APIError, validateRequired } from '../utils/errors.js';
import { corsHeaders, handleCORS } from '../middleware/auth.js';
import { requireAuth } from '../middleware/auth.js';

export async function GET(req) {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const user = await requireAuth(req);

    // Get user profile
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*, trips(*), payments(*)')
      .eq('user_id', userProfile.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new APIError('Failed to fetch bookings', 400);
    }

    return successResponse({ bookings });
  } catch (error) {
    return errorResponse(error, error.status || 500);
  }
}

export async function POST(req) {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const user = await requireAuth(req);

    const { trip_id, total_amount } = await req.json();

    validateRequired({ trip_id, total_amount }, ['trip_id', 'total_amount']);

    // Get user profile
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    // Verify trip exists and belongs to user
    const { data: trip } = await supabase
      .from('trips')
      .select('id')
      .eq('id', trip_id)
      .eq('user_id', userProfile.id)
      .single();

    if (!trip) {
      throw new APIError('Trip not found', 404);
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        user_id: userProfile.id,
        trip_id,
        total_amount: parseFloat(total_amount),
        status: 'pending',
        payment_status: 'unpaid',
      })
      .select()
      .single();

    if (error) {
      throw new APIError('Failed to create booking', 400);
    }

    // Update trip status
    await supabase
      .from('trips')
      .update({ status: 'booked' })
      .eq('id', trip_id);

    return successResponse({ booking }, 201);
  } catch (error) {
    return errorResponse(error, error.status || 500);
  }
}
