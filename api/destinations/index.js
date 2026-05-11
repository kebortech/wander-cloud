import { supabase } from '../utils/supabase.js';
import { successResponse, errorResponse, APIError, validateRequired } from '../utils/errors.js';
import { corsHeaders, handleCORS, requireAdmin } from '../middleware/auth.js';

export async function GET(req) {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const url = new URL(req.url);
    const country = url.searchParams.get('country');
    const sortBy = url.searchParams.get('sortBy') || 'created_at';

    let query = supabase.from('destinations').select('*');

    if (country) {
      query = query.eq('country', country);
    }

    const { data: destinations, error } = await query.order(sortBy, { ascending: false });

    if (error) {
      throw new APIError('Failed to fetch destinations', 400);
    }

    return successResponse({ destinations });
  } catch (error) {
    return errorResponse(error, error.status || 500);
  }
}

export async function POST(req) {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    await requireAdmin(req);

    const { name, country, description, image_url, rating, price_per_day, best_season } = await req.json();

    validateRequired(
      { name, country, price_per_day },
      ['name', 'country', 'price_per_day']
    );

    const { data: destination, error } = await supabase
      .from('destinations')
      .insert({
        name,
        country,
        description,
        image_url,
        rating: parseFloat(rating) || 0,
        price_per_day: parseFloat(price_per_day),
        best_season,
      })
      .select()
      .single();

    if (error) {
      throw new APIError('Failed to create destination', 400);
    }

    return successResponse({ destination }, 201);
  } catch (error) {
    return errorResponse(error, error.status || 500);
  }
}
