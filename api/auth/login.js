import { supabase } from '../utils/supabase.js';
import { successResponse, errorResponse, validateRequired, validateEmail, APIError } from '../utils/errors.js';
import { corsHeaders, handleCORS } from '../middleware/auth.js';

export async function POST(req) {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const { email, password } = await req.json();

    validateRequired({ email, password }, ['email', 'password']);
    validateEmail(email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new APIError(error.message, 401);
    }

    return successResponse({
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      },
    });
  } catch (error) {
    return errorResponse(error, error.status || 500);
  }
}
