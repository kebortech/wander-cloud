import { supabaseAdmin } from '../utils/supabase.js';
import { successResponse, errorResponse, APIError, validateRequired } from '../utils/errors.js';
import { corsHeaders, handleCORS } from '../middleware/auth.js';
import { requireAuth } from '../middleware/auth.js';

export async function POST(req) {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const user = await requireAuth(req);

    const { booking_id, amount, payment_method } = await req.json();

    validateRequired({ booking_id, amount }, ['booking_id', 'amount']);

    // Get user profile
    const { data: userProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    // Verify booking exists and belongs to user
    const { data: booking } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', booking_id)
      .eq('user_id', userProfile.id)
      .single();

    if (!booking) {
      throw new APIError('Booking not found', 404);
    }

    // Create payment intent
    const { data: payment, error } = await supabaseAdmin
      .from('payments')
      .insert({
        booking_id,
        user_id: userProfile.id,
        amount: parseFloat(amount),
        payment_method: payment_method || 'card',
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      throw new APIError('Failed to create payment', 400);
    }

    return successResponse({ payment, clientSecret: 'test_secret' }, 201);
  } catch (error) {
    return errorResponse(error, error.status || 500);
  }
}
