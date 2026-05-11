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

    const { payment_id } = await req.json();

    validateRequired({ payment_id }, ['payment_id']);

    // Update payment status
    const { data: payment, error } = await supabaseAdmin
      .from('payments')
      .update({
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment_id)
      .select()
      .single();

    if (error) {
      throw new APIError('Failed to update payment', 400);
    }

    // Update booking status
    const { data: booking } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('id', payment.booking_id)
      .single();

    if (booking) {
      await supabaseAdmin
        .from('bookings')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          updated_at: new Date().toISOString(),
        })
        .eq('id', booking.id);
    }

    return successResponse({ payment });
  } catch (error) {
    return errorResponse(error, error.status || 500);
  }
}
