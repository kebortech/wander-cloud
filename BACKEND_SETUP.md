# WanderCloud Backend & Database Setup

This document provides instructions for setting up and using the WanderCloud backend with Supabase database.

## Architecture Overview

- **Frontend**: Static HTML/JS (index.html, admin.html, payment.html)
- **Backend**: Serverless API routes in `/api` directory
- **Database**: Supabase PostgreSQL with Row Level Security
- **Client SDK**: `api-client.js` for frontend API integration

## Prerequisites

1. Supabase project connected and configured
2. Environment variables set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Database Setup

### 1. Initialize Database Schema

Run the SQL schema from `/sql/init.sql` in your Supabase SQL editor:

1. Go to your Supabase project
2. Open the SQL editor
3. Create a new query
4. Copy contents from `sql/init.sql`
5. Execute the query

This will create:
- `user_profiles` - User profile information
- `destinations` - Travel destinations
- `trips` - User trip planning
- `bookings` - Booking records
- `payments` - Payment information

All tables include Row Level Security (RLS) policies for data protection.

### 2. Verify Sample Data

Sample destinations are automatically created:
- Paris, France
- Tokyo, Japan
- Bali, Indonesia
- New York, USA
- Barcelona, Spain

## API Endpoints

### Authentication

```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/session
```

### User Profiles

```
GET /api/users/profile
PUT /api/users/profile
GET /api/users/[userId]
```

### Destinations

```
GET /api/destinations (with optional filters: country, sortBy)
GET /api/destinations/[id]
POST /api/destinations (admin only)
PUT /api/destinations/[id] (admin only)
DELETE /api/destinations/[id] (admin only)
```

### Trips

```
GET /api/trips
POST /api/trips
GET /api/trips/[id]
PUT /api/trips/[id]
DELETE /api/trips/[id]
```

### Bookings

```
GET /api/bookings
POST /api/bookings
GET /api/bookings/[id]
PUT /api/bookings/[id]
DELETE /api/bookings/[id]
```

### Payments

```
POST /api/payments/create
POST /api/payments/confirm
GET /api/payments/[id]
POST /api/payments/webhook
```

## Frontend Integration

### Using the API Client

The `api-client.js` file provides JavaScript functions for all API endpoints.

#### Example: Sign Up

```javascript
try {
  const result = await apiSignUp('user@example.com', 'password123', 'John Doe');
  console.log('User created:', result);
} catch (error) {
  console.error('Signup failed:', error.message);
}
```

#### Example: Get Destinations

```javascript
try {
  const result = await apiGetDestinations({ country: 'France' });
  console.log('Destinations:', result.destinations);
} catch (error) {
  console.error('Failed to fetch destinations:', error.message);
}
```

#### Example: Create Trip

```javascript
try {
  const result = await apiCreateTrip({
    destination_id: 'destination-uuid',
    start_date: '2026-06-01',
    end_date: '2026-06-10',
    notes: 'Summer vacation'
  });
  console.log('Trip created:', result);
} catch (error) {
  console.error('Failed to create trip:', error.message);
}
```

### Authentication Flow

1. User signs up/logs in via login modal
2. API returns access and refresh tokens
3. Tokens are stored in localStorage or sessionStorage
4. All subsequent requests include the token in Authorization header
5. User profile is fetched and displayed in UI

### Data Persistence

All data is now stored in Supabase database instead of localStorage. This ensures:
- Data persists across sessions
- Real-time capabilities (if needed)
- Server-side access control via RLS
- Scalable infrastructure

## Security Features

### Row Level Security (RLS)

All tables have RLS policies enforcing:
- Users can only see/modify their own data
- Destinations are readable by all, writable only by admins
- Admin operations are restricted to users with admin flag

### Authentication

- Passwords are hashed using Supabase Auth
- JWT tokens are used for request authentication
- Service role key is server-side only
- Client uses anon key for public operations

### Input Validation

All endpoints validate and sanitize inputs:
- Required fields are checked
- Email format is validated
- Data types are enforced
- SQL injection is prevented via parameterized queries

## Development

### Adding New Endpoints

1. Create a new file in `/api` directory
2. Implement GET/POST/PUT/DELETE handlers
3. Add authentication middleware if needed
4. Add corresponding client function in `api-client.js`
5. Test with the frontend

### Testing

Use browser dev tools or curl to test endpoints:

```bash
# Get all destinations
curl https://your-domain.com/api/destinations

# Create trip (requires auth)
curl -X POST https://your-domain.com/api/trips \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"destination_id":"...", "start_date":"2026-06-01", "end_date":"2026-06-10"}'
```

## Deployment

The backend is deployed as Vercel serverless functions. Each file in `/api` becomes an endpoint automatically.

### Deploy Steps

1. Connect your Git repository to Vercel
2. Set environment variables in Vercel project settings
3. Deploy by pushing to main branch

## Troubleshooting

### "Missing environment variables" error

Ensure all three Supabase variables are set in Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### "Authentication failed" error

Check that:
- Valid JWT token is in Authorization header
- Token hasn't expired
- User profile exists in database

### "Permission denied" error

Verify:
- User has proper RLS permissions for the table
- Admin operations are done by admin users
- Row ownership matches authenticated user

## Next Steps

1. Run the database schema SQL
2. Test API endpoints with the frontend
3. Customize RLS policies as needed
4. Add payment integration (Stripe)
5. Set up email notifications
6. Configure webhooks for events
