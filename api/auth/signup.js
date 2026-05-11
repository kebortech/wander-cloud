import { supabaseAdmin } from '../utils/supabase.js';
import { successResponse, errorResponse, validateRequired, validateEmail, APIError } from '../utils/errors.js';
import { corsHeaders, handleCORS } from '../middleware/auth.js';

export async function POST(req) {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const { email, password, full_name } = await req.json();

    validateRequired({ email, password, full_name }, ['email', 'password', 'full_name']);
    validateEmail(email);

    if (password.length < 6) {
      throw new APIError('Password must be at least 6 characters', 400);
    }

    // Create user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      throw new APIError(error.message, 400);
    }

    // Create user profile
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        user_id: data.user.id,
        full_name,
        email,
        is_admin: false,
      });

    if (profileError) {
      throw new APIError('Failed to create user profile', 400);
    }

    return successResponse({
      message: 'User created successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    }, 201);
  } catch (error) {
    return errorResponse(error, error.status || 500);
  }
}
