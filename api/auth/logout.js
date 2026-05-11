import { successResponse, errorResponse } from '../utils/errors.js';
import { corsHeaders, handleCORS } from '../middleware/auth.js';

export async function POST(req) {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    return successResponse({
      message: 'Logout successful',
    });
  } catch (error) {
    return errorResponse(error);
  }
}
