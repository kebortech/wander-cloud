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

    // Get user profile to access their trips
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !userProfile) {
      throw new APIError('User profile not found', 404);
    }

    const { data: trips, error } = await supabase
      .from('trips')
      .select('*, destinations(*)')
      .eq('user_id', userProfile.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new APIError('Failed to fetch trips', 400);
    }

    return successResponse({ trips });
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

    const { destination_id, start_date, end_date, notes } = await req.json();

    validateRequired(
      { destination_id, start_date, end_date },
      ['destination_id', 'start_date', 'end_date']
    );

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !userProfile) {
      throw new APIError('User profile not found', 404);
    }

    // Calculate total cost based on destination price and trip duration
    const start = new Date(start_date);
    const end = new Date(end_date);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    const { data: destination } = await supabase
      .from('destinations')
      .select('price_per_day')
      .eq('id', destination_id)
      .single();

    const totalCost = (destination?.price_per_day || 0) * days;

    const { data: trip, error } = await supabase
      .from('trips')
      .insert({
        user_id: userProfile.id,
        destination_id,
        start_date,
        end_date,
        total_cost: totalCost,
        notes,
        status: 'draft',
      })
      .select()
      .single();

    if (error) {
      throw new APIError('Failed to create trip', 400);
    }

    return successResponse({ trip }, 201);
  } catch (error) {
    return errorResponse(error, error.status || 500);
  }
}
