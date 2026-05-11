import { getCurrentUser } from '../utils/supabase.js';
import { successResponse, errorResponse, APIError } from '../utils/errors.js';
import { corsHeaders, handleCORS } from '../middleware/auth.js';

export async function GET(req) {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const user = await getCurrentUser(req);

    if (!user) {
      throw new APIError('Unauthorized', 401);
    }

    return successResponse({
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    return errorResponse(error, error.status || 500);
  }
}
