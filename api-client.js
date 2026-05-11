// ========================================
// API Client Utilities
// ========================================

const API_BASE_URL = window.location.origin + '/api';

// Helper function to make API requests with token
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('wandercloud_access_token') || sessionStorage.getItem('wandercloud_access_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('[v0] API Response:', {
      endpoint,
      status: response.status,
      ok: response.ok,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[v0] API Call Error:', error);
    throw error;
  }
}

// ========================================
// Authentication API
// ========================================

async function apiSignUp(email, password, fullName) {
  const data = await apiCall('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, full_name: fullName }),
  });

  if (data.session) {
    localStorage.setItem('wandercloud_access_token', data.session.access_token);
    localStorage.setItem('wandercloud_refresh_token', data.session.refresh_token);
  }

  return data;
}

async function apiLogin(email, password, rememberMe = false) {
  const data = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (data.session) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('wandercloud_access_token', data.session.access_token);
    storage.setItem('wandercloud_refresh_token', data.session.refresh_token);
  }

  return data;
}

async function apiLogout() {
  localStorage.removeItem('wandercloud_access_token');
  localStorage.removeItem('wandercloud_refresh_token');
  sessionStorage.removeItem('wandercloud_access_token');
  sessionStorage.removeItem('wandercloud_refresh_token');
  return await apiCall('/auth/logout', { method: 'POST' });
}

async function apiGetSession() {
  return await apiCall('/auth/session', { method: 'GET' });
}

// ========================================
// User Profile API
// ========================================

async function apiGetProfile() {
  return await apiCall('/users/profile', { method: 'GET' });
}

async function apiUpdateProfile(data) {
  return await apiCall('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

async function apiGetUser(userId) {
  return await apiCall(`/users/${userId}`, { method: 'GET' });
}

// ========================================
// Destinations API
// ========================================

async function apiGetDestinations(filters = {}) {
  const params = new URLSearchParams();
  if (filters.country) params.append('country', filters.country);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);

  return await apiCall(`/destinations?${params.toString()}`, { method: 'GET' });
}

async function apiGetDestination(id) {
  return await apiCall(`/destinations/${id}`, { method: 'GET' });
}

async function apiCreateDestination(data) {
  return await apiCall('/destinations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async function apiUpdateDestination(id, data) {
  return await apiCall(`/destinations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

async function apiDeleteDestination(id) {
  return await apiCall(`/destinations/${id}`, { method: 'DELETE' });
}

// ========================================
// Trips API
// ========================================

async function apiGetTrips() {
  return await apiCall('/trips', { method: 'GET' });
}

async function apiCreateTrip(data) {
  return await apiCall('/trips', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async function apiGetTrip(id) {
  return await apiCall(`/trips/${id}`, { method: 'GET' });
}

async function apiUpdateTrip(id, data) {
  return await apiCall(`/trips/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

async function apiDeleteTrip(id) {
  return await apiCall(`/trips/${id}`, { method: 'DELETE' });
}

// ========================================
// Bookings API
// ========================================

async function apiGetBookings() {
  return await apiCall('/bookings', { method: 'GET' });
}

async function apiCreateBooking(data) {
  return await apiCall('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async function apiGetBooking(id) {
  return await apiCall(`/bookings/${id}`, { method: 'GET' });
}

async function apiUpdateBooking(id, data) {
  return await apiCall(`/bookings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

async function apiDeleteBooking(id) {
  return await apiCall(`/bookings/${id}`, { method: 'DELETE' });
}

// ========================================
// Payments API
// ========================================

async function apiCreatePayment(bookingId, amount, paymentMethod = 'card') {
  return await apiCall('/payments/create', {
    method: 'POST',
    body: JSON.stringify({
      booking_id: bookingId,
      amount,
      payment_method: paymentMethod,
    }),
  });
}

async function apiConfirmPayment(paymentId) {
  return await apiCall('/payments/confirm', {
    method: 'POST',
    body: JSON.stringify({ payment_id: paymentId }),
  });
}

async function apiGetPayment(id) {
  return await apiCall(`/payments/${id}`, { method: 'GET' });
}
