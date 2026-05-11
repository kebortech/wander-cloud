import { supabase } from '../utils/supabase.js';
import { successResponse, errorResponse, APIError } from '../utils/errors.js';
import { corsHeaders, handleCORS, requireAdmin } from '../middleware/auth.js';

export async function GET(req, { params }) {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const { id } = params;

    const { data: destination, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new APIError('Destination not found', 404);
    }

    return successResponse({ destination });
  } catch (error) {
    return errorResponse(error, error.status || 500);
  }
}

export async function PUT(req, { params }) {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    await requireAdmin(req);

    const { id } = params;
    const updates = await req.json();

    const { data: destination, error } = await supabase
      .from('destinations')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new APIError('Failed to update destination', 400);
    }

    return successResponse({ destination });
  } catch (error) {
    return errorResponse(error, error.status || 500);
  }
}

export async function DELETE(req, { params }) {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    await requireAdmin(req);

    const { id } = params;

    const { error } = await supabase
      .from('destinations')
      .delete()
      .eq('id', id);

    if (error) {
      throw new APIError('Failed to delete destination', 400);
    }

    return successResponse({ message: 'Destination deleted' });
  } catch (error) {
    return errorResponse(error, error.status || 500);
  }
}
