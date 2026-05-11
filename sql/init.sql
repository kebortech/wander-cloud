-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Destinations Table
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  rating DECIMAL(3, 2),
  price_per_day DECIMAL(10, 2),
  best_season TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trips Table
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE RESTRICT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'booked', 'completed', 'cancelled')),
  total_cost DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_method TEXT,
  stripe_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_destination_id ON trips(destination_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_trip_id ON bookings(trip_id);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies

-- User Profiles: Users can view their own profile, admins can view all
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id OR is_admin = TRUE);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can create profiles" ON user_profiles
  FOR INSERT WITH CHECK (TRUE);

-- Destinations: Everyone can read, only admins can write
CREATE POLICY "Anyone can read destinations" ON destinations
  FOR SELECT USING (TRUE);

CREATE POLICY "Only admins can insert destinations" ON destinations
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Only admins can update destinations" ON destinations
  FOR UPDATE USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Only admins can delete destinations" ON destinations
  FOR DELETE USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = TRUE));

-- Trips: Users can only access their own trips
CREATE POLICY "Users can read their own trips" ON trips
  FOR SELECT USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE id = user_id));

CREATE POLICY "Users can create trips" ON trips
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM user_profiles WHERE id = user_id));

CREATE POLICY "Users can update their own trips" ON trips
  FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE id = user_id));

CREATE POLICY "Users can delete their own trips" ON trips
  FOR DELETE USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE id = user_id));

-- Bookings: Users can only access their own bookings
CREATE POLICY "Users can read their own bookings" ON bookings
  FOR SELECT USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE id = user_id));

CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM user_profiles WHERE id = user_id));

CREATE POLICY "Users can update their own bookings" ON bookings
  FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE id = user_id));

CREATE POLICY "Users can delete their own bookings" ON bookings
  FOR DELETE USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE id = user_id));

-- Payments: Users can only access their own payments
CREATE POLICY "Users can read their own payments" ON payments
  FOR SELECT USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE id = user_id));

CREATE POLICY "Users can create payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM user_profiles WHERE id = user_id));

-- Sample Destinations Data
INSERT INTO destinations (name, country, description, image_url, rating, price_per_day, best_season) VALUES
('Paris', 'France', 'The City of Light - iconic landmarks, museums, and romantic atmosphere', '/images/paris.jpg', 4.8, 150.00, 'Spring, Fall'),
('Tokyo', 'Japan', 'Modern metropolis with ancient temples, unique culture, and amazing food', '/images/tokyo.jpg', 4.9, 140.00, 'Spring, Fall'),
('Bali', 'Indonesia', 'Tropical paradise with beaches, temples, and vibrant culture', '/images/bali.jpg', 4.7, 80.00, 'Dry Season'),
('New York', 'USA', 'The city that never sleeps - iconic skyline, Broadway, and diverse neighborhoods', '/images/newyork.jpg', 4.6, 180.00, 'Spring, Fall'),
('Barcelona', 'Spain', 'Architectural wonders, beautiful beaches, and vibrant nightlife', '/images/barcelona.jpg', 4.7, 120.00, 'Spring, Fall');
