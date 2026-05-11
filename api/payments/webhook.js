import { successResponse, errorResponse } from '../utils/errors.js';
import { corsHeaders, handleCORS } from '../middleware/auth.js';

export async function POST(req) {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    // In a real implementation, verify the webhook signature from Stripe
    const event = await req.json();

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('[v0] Payment succeeded:', event.data.object);
        break;
      case 'payment_intent.payment_failed':
        console.log('[v0] Payment failed:', event.data.object);
        break;
    }

    return successResponse({ received: true });
  } catch (error) {
    console.error('[v0] Webhook error:', error);
    return errorResponse(error);
  }
}
