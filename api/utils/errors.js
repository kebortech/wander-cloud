// Error handling utilities

export class APIError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function errorResponse(error, status = 500) {
  console.error('[v0] API Error:', error);
  
  if (error instanceof APIError) {
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.details,
      }),
      {
        status: error.status,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify({
      error: error.message || 'Internal Server Error',
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export function successResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export function validateRequired(data, fields) {
  const missing = fields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new APIError(`Missing required fields: ${missing.join(', ')}`, 400);
  }
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new APIError('Invalid email format', 400);
  }
}
