# Quick Start Guide - WanderCloud Backend

Follow these steps to get the backend and database running:

## Step 1: Execute Database Schema

1. Log in to your Supabase project
2. Navigate to SQL Editor
3. Create a new query
4. Copy and paste the contents of `sql/init.sql`
5. Click "Run" to execute

This creates all tables and RLS policies.

## Step 2: Verify Environment Variables

Check that these are set in your deployment environment:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 3: Test Authentication

1. Open your site in a browser
2. Click "Register" button
3. Fill in registration form
4. Submit the form
5. You should see success message

Check browser console for any errors.

## Step 4: Test API Calls

After logging in, the frontend will automatically:
- Call `/api/auth/session` to verify auth
- Call `/api/users/profile` to load your profile
- Display your name in the UI

## Step 5: Test Destinations

1. On the main page, destinations should load from the database
2. Each destination card should display data from `/api/destinations`
3. Try filtering by country in search

## Step 6: Create a Trip

1. Make sure you're logged in
2. Select a destination
3. Fill in trip dates
4. Submit the booking form
5. Should redirect to payment page

## API Integration Points

The frontend automatically calls these APIs:

### On Page Load
- `GET /api/auth/session` - Check if user is logged in
- `GET /api/destinations` - Load all destinations

### On User Login/Register
- `POST /api/auth/login` or `POST /api/auth/signup`
- `GET /api/users/profile` - Load user profile

### On Booking Submit
- `POST /api/trips` - Create trip
- `POST /api/bookings` - Create booking
- `POST /api/payments/create` - Create payment

## Debugging

### Check Console Logs

All API calls log to console with `[v0]` prefix:
```javascript
console.log('[v0] API Response:', response);
console.error('[v0] API Error:', error);
```

### Check Network Tab

1. Open DevTools → Network tab
2. Try an action (like logging in)
3. Look for requests to `/api/...`
4. Check response status and body

### Check Supabase Logs

1. Go to Supabase dashboard
2. Look at the database logs
3. Check for any SQL errors

## Common Issues

### "Cannot POST /api/auth/signup"

The API files haven't been deployed yet. Make sure all files in `/api` are committed and pushed.

### "Unauthorized" error

The JWT token might be invalid or expired. Try:
1. Clear cookies/storage
2. Log in again
3. Check token in localStorage

### "User profile not found"

The profile wasn't created during signup. Manually create in Supabase:

```sql
INSERT INTO user_profiles (user_id, full_name, email)
VALUES ('user-uuid-here', 'Your Name', 'your@email.com');
```

## Next: Advanced Setup

Once basic API is working:

1. **Add payment integration**: Update `/api/payments/` endpoints with Stripe
2. **Add email notifications**: Send booking confirmations via email
3. **Add real-time updates**: Use Supabase subscriptions
4. **Add admin dashboard**: Create admin-only API endpoints
5. **Add file uploads**: Use Supabase Storage for images

## Support

For detailed API documentation, see `BACKEND_SETUP.md`

All API files are in `/api` directory with clear comments explaining each function.
