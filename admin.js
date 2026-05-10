// ==========================================
// WANDERCLOUD ADMIN DASHBOARD v2.0
// Full End-to-End Functional Admin Panel
// ==========================================

// ==========================================
// DATA STORE (In production, use API calls)
// ==========================================
const DB = {
    adminUsers: [
        { id: 1, username: 'admin', email: 'admin@wandercloud.com', password: 'admin123', name: 'Sarah Admin', role: 'Super Admin', initials: 'SA', permissions: ['all'] },
        { id: 2, username: 'manager', email: 'manager@wandercloud.com', password: 'manager123', name: 'John Manager', role: 'Manager', initials: 'JM', permissions: ['bookings', 'users', 'reviews', 'blog'] }
    ],
    
    bookings: [],
    users: [],
    destinations: [],
    packages: [],
    reviews: [],
    blogPosts: [],
    notifications: [],
    
    init() {
        const saved = localStorage.getItem('wandercloud_db');
        if (saved) {
            const data = JSON.parse(saved);
            Object.assign(this, data);
        } else {
            this.seedData();
            this.save();
        }
    },
    
    save() {
        const data = {
            bookings: this.bookings,
            users: this.users,
            destinations: this.destinations,
            packages: this.packages,
            reviews: this.reviews,
            blogPosts: this.blogPosts,
            notifications: this.notifications
        };
        localStorage.setItem('wandercloud_db', JSON.stringify(data));
    },
    
    seedData() {
        this.bookings = [
            { id: 'WC-001', customer: 'John Doe', email: 'john@email.com', phone: '+1 (555) 123-4567', destination: 'Bali, Indonesia', package: 'Adventurer', dates: 'Jun 15-23, 2026', amount: 1699, status: 'confirmed', travelers: 2, createdAt: '2026-05-10', notes: 'Honeymoon package' },
            { id: 'WC-002', customer: 'Maria Chen', email: 'maria@email.com', phone: '+1 (555) 234-5678', destination: 'Tokyo, Japan', package: 'Explorer', dates: 'Jun 18-23, 2026', amount: 1299, status: 'pending', travelers: 1, createdAt: '2026-05-08', notes: '' },
            { id: 'WC-003', customer: 'Robert Wilson', email: 'robert@email.com', phone: '+1 (555) 345-6789', destination: 'Santorini, Greece', package: 'Concierge', dates: 'Jun 20-26, 2026', amount: 2500, status: 'confirmed', travelers: 2, createdAt: '2026-05-07', notes: 'VIP client' },
            { id: 'WC-004', customer: 'Emma Stone', email: 'emma@email.com', phone: '+1 (555) 456-7890', destination: 'Swiss Alps', package: 'Adventurer', dates: 'Jun 22-28, 2026', amount: 1499, status: 'cancelled', travelers: 4, createdAt: '2026-05-05', notes: 'Cancelled due to schedule' },
            { id: 'WC-005', customer: 'David Brown', email: 'david@email.com', phone: '+1 (555) 567-8901', destination: 'Maldives', package: 'Concierge', dates: 'Jul 1-7, 2026', amount: 3200, status: 'confirmed', travelers: 2, createdAt: '2026-05-03', notes: '' },
            { id: 'WC-006', customer: 'Lisa Anderson', email: 'lisa@email.com', phone: '+1 (555) 678-9012', destination: 'Bali, Indonesia', package: 'Explorer', dates: 'Jul 5-10, 2026', amount: 899, status: 'pending', travelers: 1, createdAt: '2026-05-01', notes: 'First time traveler' }
        ];
        
        this.users = [
            { id: 1, name: 'John Doe', email: 'john@email.com', phone: '+1 (555) 123-4567', role: 'Traveler', bookings: 12, status: 'active', joined: 'Jan 2026', initials: 'JD' },
            { id: 2, name: 'Maria Chen', email: 'maria@email.com', phone: '+1 (555) 234-5678', role: 'Traveler', bookings: 8, status: 'active', joined: 'Feb 2026', initials: 'MC' },
            { id: 3, name: 'Robert Wilson', email: 'robert@email.com', phone: '+1 (555) 345-6789', role: 'Premium', bookings: 15, status: 'active', joined: 'Mar 2026', initials: 'RW' },
            { id: 4, name: 'Emma Stone', email: 'emma@email.com', phone: '+1 (555) 456-7890', role: 'Traveler', bookings: 3, status: 'inactive', joined: 'Apr 2026', initials: 'ES' },
            { id: 5, name: 'David Brown', email: 'david@email.com', phone: '+1 (555) 567-8901', role: 'Premium', bookings: 20, status: 'active', joined: 'Jan 2026', initials: 'DB' }
        ];
        
        this.destinations = [
            { id: 1, name: 'Bali, Indonesia', type: 'Tropical', country: 'Indonesia', properties: 2500, tours: 150, rating: 4.8, gradient: 'gradient-1', icon: 'fa-umbrella-beach', active: true, description: 'Tropical paradise with pristine beaches' },
            { id: 2, name: 'Swiss Alps', type: 'Mountain', country: 'Switzerland', properties: 1800, tours: 200, rating: 4.9, gradient: 'gradient-2', icon: 'fa-mountain', active: true, description: 'Majestic mountains and skiing' },
            { id: 3, name: 'Tokyo, Japan', type: 'City', country: 'Japan', properties: 3200, tours: 180, rating: 4.7, gradient: 'gradient-3', icon: 'fa-city', active: true, description: 'Futuristic city with ancient traditions' },
            { id: 4, name: 'Santorini, Greece', type: 'Island', country: 'Greece', properties: 1200, tours: 90, rating: 4.9, gradient: 'gradient-4', icon: 'fa-water', active: true, description: 'Stunning sunsets and white buildings' }
        ];
        
        this.packages = [
            { id: 1, name: 'Explorer', type: 'Basic', pricePerPerson: 899, groupPrice: 764, features: ['5-day itinerary', '3-star accommodations', 'Guided city tours', 'Travel insurance basic'], bookings: 450, active: true },
            { id: 2, name: 'Adventurer', type: 'Premium', pricePerPerson: 1499, groupPrice: 1274, features: ['Everything in Explorer', '4-star luxury stays', 'Custom itinerary design', 'Airport transfers', 'Premium travel insurance'], bookings: 820, active: true },
            { id: 3, name: 'Concierge', type: 'Luxury', pricePerPerson: 0, groupPrice: 0, features: ['Unlimited destinations', '5-star luxury resorts', 'Private jet & yacht options', 'Personal travel concierge', 'Exclusive experiences'], bookings: 125, active: true }
        ];
        
        this.reviews = [
            { id: 1, user: 'Emily & Robert Chen', initials: 'ER', destination: 'Honeymoon in Bali & Maldives', rating: 5, text: 'WanderCloud planned our entire honeymoon perfectly!', status: 'approved', date: '2026-04-15' },
            { id: 2, user: 'Maria Santos', initials: 'MS', destination: 'Solo Adventure, Southeast Asia', rating: 5, text: 'Best travel experience ever! Highly recommended.', status: 'approved', date: '2026-04-10' },
            { id: 3, user: 'Sarah Johnson', initials: 'SJ', destination: 'Corporate Retreat', rating: 5, text: 'Seamless corporate travel management.', status: 'pending', date: '2026-04-05' }
        ];
        
        this.blogPosts = [
            { id: 1, title: 'Top 10 Hiking Trails in Patagonia', author: 'Maria Santos', category: 'Adventure', likes: 342, comments: 56, status: 'published', date: '2026-05-05', gradient: 'gradient-1', icon: 'fa-hiking', content: 'Detailed guide to Patagonia hiking trails...' },
            { id: 2, title: 'Street Food Guide: Bangkok', author: 'Chef Andrew', category: 'Food & Culture', likes: 289, comments: 43, status: 'published', date: '2026-05-03', gradient: 'gradient-2', icon: 'fa-utensils', content: 'Complete Bangkok street food guide...' },
            { id: 3, title: 'Capturing the Northern Lights', author: 'James Wilson', category: 'Photography', likes: 427, comments: 72, status: 'draft', date: '2026-04-28', gradient: 'gradient-3', icon: 'fa-camera', content: 'Photography tips for Aurora Borealis...' }
        ];
        
        this.notifications = [
            { id: 1, type: 'booking', message: 'New booking from John Doe - Bali', time: '5 minutes ago', read: false, icon: 'fa-calendar-check', color: 'gradient-1' },
            { id: 2, type: 'review', message: 'New 5-star review from Emily Chen', time: '1 hour ago', read: false, icon: 'fa-star', color: 'gradient-2' },
            { id: 3, type: 'user', message: 'New user registration: Maria Chen', time: '3 hours ago', read: true, icon: 'fa-user-plus', color: 'gradient-3' }
        ];
    },
    
    generateId(prefix = '') {
        return prefix + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
};

// ==========================================
// AUTHENTICATION SYSTEM
// ==========================================
let currentAdmin = null;
let sessionTimeout = null;
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

function checkAuth() {
    const session = localStorage.getItem('wandercloud_admin_session') || sessionStorage.getItem('wandercloud_admin_session');
    if (session) {
        const data = JSON.parse(session);
        if (Date.now() - data.timestamp < SESSION_DURATION) {
            currentAdmin = data.user;
            return true;
        }
    }
    return false;
}

function login(username, password, remember = false) {
    const user = DB.adminUsers.find(u => (u.username === username || u.email === username) && u.password === password);
    if (user) {
        currentAdmin = user;
        const session = { user, timestamp: Date.now() };
        if (remember) {
            localStorage.setItem('wandercloud_admin_session', JSON.stringify(session));
        } else {
            sessionStorage.setItem('wandercloud_admin_session', JSON.stringify(session));
        }
        startSessionTimer();
        return true;
    }
    return false;
}

function logout() {
    currentAdmin = null;
    localStorage.removeItem('wandercloud_admin_session');
    sessionStorage.removeItem('wandercloud_admin_session');
    clearTimeout(sessionTimeout);
    window.location.href = 'index.html';
}

function startSessionTimer() {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
        showToast('Session expired. Please login again.', 'warning');
        setTimeout(logout, 2000);
    }, SESSION_DURATION);
}

// ==========================================
// THEME MANAGEMENT
// ==========================================
const adminThemeToggle = document.getElementById('adminThemeToggle');
const body = document.body;
const themeIcon = adminThemeToggle.querySelector('i');
const savedTheme = localStorage.getItem('theme') || 'dark';

body.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

adminThemeToggle.addEventListener('click', () => {
    const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

// ==========================================
// NAVIGATION SYSTEM
// ==========================================
const menuToggle = document.getElementById('menuToggle');
const adminSidebar = document.getElementById('adminSidebar');
const adminOverlay = document.getElementById('adminOverlay');
const sidebarToggle = document.getElementById('sidebarToggle');

menuToggle.addEventListener('click', toggleSidebar);
adminOverlay.addEventListener('click', closeSidebar);
sidebarToggle.addEventListener('click', closeSidebar);

function toggleSidebar() {
    adminSidebar.classList.toggle('show');
    adminOverlay.classList.toggle('show');
}

function closeSidebar() {
    adminSidebar.classList.remove('show');
    adminOverlay.classList.remove('show');
}

const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.admin-section');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(item.getAttribute('data-section'));
    });
});

function navigateTo(sectionId) {
    navItems.forEach(nav => nav.classList.remove('active'));
    document.querySelector(`[data-section="${sectionId}"]`)?.classList.add('active');
    
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(`${sectionId}-section`)?.classList.add('active');
    
    loadSectionData(sectionId);
    if (window.innerWidth <= 1024) closeSidebar();
}

function loadSectionData(sectionId) {
    const loaders = {
        'dashboard': () => { updateDashboardStats(); renderRecentBookings(); initDashboardCharts(); },
        'bookings': () => renderAllBookings(),
        'users': () => renderAllUsers(),
        'destinations': () => renderDestinations(),
        'packages': () => renderPackages(),
        'analytics': () => initAnalyticsCharts(),
        'reviews': () => renderReviews(),
        'blog-manage': () => renderBlogPosts()
    };
    if (loaders[sectionId]) loaders[sectionId]();
}

// ==========================================
// DASHBOARD FUNCTIONS
// ==========================================
function updateDashboardStats() {
    const totalRevenue = DB.bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.amount, 0);
    const totalBookings = DB.bookings.length;
    const totalUsers = DB.users.length;
    const avgRating = DB.reviews.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.rating, 0) / DB.reviews.filter(r => r.status === 'approved').length || 0;
    
    document.getElementById('totalRevenue').textContent = '$' + totalRevenue.toLocaleString();
    document.getElementById('totalBookings').textContent = totalBookings;
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('avgRating').textContent = avgRating.toFixed(1);
    
    document.getElementById('bookingCount').textContent = DB.bookings.filter(b => b.status === 'pending').length;
    document.getElementById('userCount').textContent = totalUsers;
    document.getElementById('reviewPendingCount').textContent = DB.reviews.filter(r => r.status === 'pending').length;
    document.getElementById('messageCount').textContent = DB.notifications.filter(n => !n.read).length;
}

function renderRecentBookings() {
    const tbody = document.getElementById('recentBookingsTable');
    tbody.innerHTML = DB.bookings.slice(0, 5).map(b => `
        <tr>
            <td>#${b.id}</td>
            <td><div class="user-cell"><div class="user-avatar">${b.customer.split(' ').map(n => n[0]).join('')}</div><span>${b.customer}</span></div></td>
            <td>${b.destination}</td>
            <td>${b.package}</td>
            <td>$${b.amount.toLocaleString()}</td>
            <td><span class="status-badge ${b.status} clickable" onclick="cycleBookingStatus('${b.id}')">${b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span></td>
            <td>${b.dates}</td>
            <td>
                <button class="action-btn" onclick="viewBooking('${b.id}')" title="View"><i class="fas fa-eye"></i></button>
                <button class="action-btn" onclick="editBooking('${b.id}')" title="Edit"><i class="fas fa-edit"></i></button>
            </td>
        </tr>
    `).join('');
}

// ==========================================
// BOOKING MANAGEMENT (CRUD)
// ==========================================
function renderAllBookings(filter = 'all', search = '') {
    let bookings = DB.bookings;
    if (filter !== 'all') bookings = bookings.filter(b => b.status === filter);
    if (search) bookings = bookings.filter(b => 
        b.customer.toLowerCase().includes(search) || 
        b.destination.toLowerCase().includes(search) || 
        b.id.toLowerCase().includes(search)
    );
    
    document.getElementById('allBookingsTable').innerHTML = bookings.map(b => `
        <tr>
            <td>#${b.id}</td>
            <td><div class="user-cell"><div class="user-avatar">${b.customer.split(' ').map(n => n[0]).join('')}</div><span>${b.customer}</span></div></td>
            <td>${b.email}</td>
            <td>${b.destination}</td>
            <td>${b.package}</td>
            <td>${b.dates}</td>
            <td>$${b.amount.toLocaleString()}</td>
            <td><span class="status-badge ${b.status} clickable" onclick="cycleBookingStatus('${b.id}')">${b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span></td>
            <td>
                <button class="action-btn" onclick="viewBooking('${b.id}')" title="View"><i class="fas fa-eye"></i></button>
                <button class="action-btn" onclick="editBooking('${b.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="action-btn danger" onclick="deleteBooking('${b.id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function viewBooking(id) {
    const b = DB.bookings.find(b => b.id === id);
    if (!b) return;
    showModal('Booking Details', `
        <div class="detail-grid">
            <p><strong>ID:</strong> #${b.id}</p>
            <p><strong>Customer:</strong> ${b.customer}</p>
            <p><strong>Email:</strong> ${b.email}</p>
            <p><strong>Phone:</strong> ${b.phone}</p>
            <p><strong>Destination:</strong> ${b.destination}</p>
            <p><strong>Package:</strong> ${b.package}</p>
            <p><strong>Dates:</strong> ${b.dates}</p>
            <p><strong>Travelers:</strong> ${b.travelers}</p>
            <p><strong>Amount:</strong> $${b.amount.toLocaleString()}</p>
            <p><strong>Status:</strong> <span class="status-badge ${b.status}">${b.status}</span></p>
            <p><strong>Created:</strong> ${b.createdAt}</p>
            <p><strong>Notes:</strong> ${b.notes || 'N/A'}</p>
        </div>
    `);
}

function editBooking(id) {
    const b = DB.bookings.find(b => b.id === id);
    if (!b) return;
    showModal('Edit Booking', `
        <form id="editBookingForm" class="settings-form">
            <div class="form-row"><div class="form-group"><label>Customer</label><input type="text" id="editCustomer" value="${b.customer}" required></div>
            <div class="form-group"><label>Email</label><input type="email" id="editEmail" value="${b.email}" required></div></div>
            <div class="form-row"><div class="form-group"><label>Phone</label><input type="tel" id="editPhone" value="${b.phone}"></div>
            <div class="form-group"><label>Destination</label><input type="text" id="editDestination" value="${b.destination}" required></div></div>
            <div class="form-row"><div class="form-group"><label>Package</label><select id="editPackage">${DB.packages.map(p => `<option ${b.package === p.name ? 'selected' : ''}>${p.name}</option>`).join('')}</select></div>
            <div class="form-group"><label>Amount ($)</label><input type="number" id="editAmount" value="${b.amount}" required></div></div>
            <div class="form-row"><div class="form-group"><label>Dates</label><input type="text" id="editDates" value="${b.dates}"></div>
            <div class="form-group"><label>Travelers</label><input type="number" id="editTravelers" value="${b.travelers}" min="1"></div></div>
            <div class="form-row"><div class="form-group"><label>Status</label><select id="editStatus"><option ${b.status === 'confirmed' ? 'selected' : ''}>confirmed</option><option ${b.status === 'pending' ? 'selected' : ''}>pending</option><option ${b.status === 'cancelled' ? 'selected' : ''}>cancelled</option></select></div>
            <div class="form-group"><label>Notes</label><textarea id="editNotes">${b.notes || ''}</textarea></div></div>
            <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
    `);
    
    document.getElementById('editBookingForm').addEventListener('submit', (e) => {
        e.preventDefault();
        Object.assign(b, {
            customer: document.getElementById('editCustomer').value,
            email: document.getElementById('editEmail').value,
            phone: document.getElementById('editPhone').value,
            destination: document.getElementById('editDestination').value,
            package: document.getElementById('editPackage').value,
            amount: parseInt(document.getElementById('editAmount').value),
            dates: document.getElementById('editDates').value,
            travelers: parseInt(document.getElementById('editTravelers').value),
            status: document.getElementById('editStatus').value,
            notes: document.getElementById('editNotes').value
        });
        DB.save();
        closeModal();
        refreshCurrentView();
        showToast('Booking updated successfully!', 'success');
    });
}

function addNewBooking() {
    showModal('New Booking', `
        <form id="newBookingForm" class="settings-form">
            <div class="form-row"><div class="form-group"><label>Customer *</label><input type="text" id="newCustomer" required></div>
            <div class="form-group"><label>Email *</label><input type="email" id="newEmail" required></div></div>
            <div class="form-row"><div class="form-group"><label>Phone</label><input type="tel" id="newPhone"></div>
            <div class="form-group"><label>Destination *</label><input type="text" id="newDestination" required></div></div>
            <div class="form-row"><div class="form-group"><label>Package</label><select id="newPackage">${DB.packages.map(p => `<option>${p.name}</option>`).join('')}</select></div>
            <div class="form-group"><label>Amount ($) *</label><input type="number" id="newAmount" required></div></div>
            <div class="form-row"><div class="form-group"><label>Dates</label><input type="text" id="newDates" value="TBD"></div>
            <div class="form-group"><label>Travelers</label><input type="number" id="newTravelers" value="1" min="1"></div></div>
            <div class="form-group"><label>Notes</label><textarea id="newNotes"></textarea></div>
            <button type="submit" class="btn btn-primary">Create Booking</button>
        </form>
    `);
    
    document.getElementById('newBookingForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const booking = {
            id: DB.generateId('WC-'),
            customer: document.getElementById('newCustomer').value,
            email: document.getElementById('newEmail').value,
            phone: document.getElementById('newPhone').value,
            destination: document.getElementById('newDestination').value,
            package: document.getElementById('newPackage').value,
            amount: parseInt(document.getElementById('newAmount').value),
            dates: document.getElementById('newDates').value,
            travelers: parseInt(document.getElementById('newTravelers').value),
            status: 'pending',
            notes: document.getElementById('newNotes').value,
            createdAt: new Date().toISOString().split('T')[0]
        };
        DB.bookings.unshift(booking);
        DB.notifications.unshift({
            id: DB.generateId(), type: 'booking', message: `New booking from ${booking.customer}`, time: 'Just now', read: false, icon: 'fa-calendar-check', color: 'gradient-1'
        });
        DB.save();
        closeModal();
        refreshCurrentView();
        showToast('Booking created successfully!', 'success');
    });
}

function deleteBooking(id) {
    showConfirm('Delete Booking', 'Are you sure you want to permanently delete this booking?', () => {
        DB.bookings = DB.bookings.filter(b => b.id !== id);
        DB.save();
        refreshCurrentView();
        showToast('Booking deleted!', 'success');
    });
}

function cycleBookingStatus(id) {
    const b = DB.bookings.find(b => b.id === id);
    if (!b) return;
    const statuses = ['confirmed', 'pending', 'cancelled'];
    b.status = statuses[(statuses.indexOf(b.status) + 1) % statuses.length];
    DB.save();
    refreshCurrentView();
    showToast(`Status changed to ${b.status}`, 'info');
}

// ==========================================
// USER MANAGEMENT (CRUD)
// ==========================================
function renderAllUsers(filter = 'all', search = '') {
    let users = DB.users;
    if (filter !== 'all') users = users.filter(u => u.status === filter);
    if (search) users = users.filter(u => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search));
    
    document.getElementById('allUsersTable').innerHTML = users.map(u => `
        <tr>
            <td><div class="user-cell"><div class="user-avatar">${u.initials}</div><span>${u.name}</span></div></td>
            <td>${u.email}</td>
            <td>${u.phone}</td>
            <td><span class="role-badge">${u.role}</span></td>
            <td>${u.bookings}</td>
            <td><span class="status-badge ${u.status} clickable" onclick="toggleUserStatus(${u.id})">${u.status}</span></td>
            <td>${u.joined}</td>
            <td>
                <button class="action-btn" onclick="editUser(${u.id})" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="action-btn danger" onclick="deleteUser(${u.id})" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function editUser(id) {
    const u = DB.users.find(u => u.id === id);
    if (!u) return;
    showModal('Edit User', `
        <form id="editUserForm" class="settings-form">
            <div class="form-row"><div class="form-group"><label>Name</label><input type="text" id="editUserName" value="${u.name}" required></div>
            <div class="form-group"><label>Email</label><input type="email" id="editUserEmail" value="${u.email}" required></div></div>
            <div class="form-row"><div class="form-group"><label>Phone</label><input type="tel" id="editUserPhone" value="${u.phone}"></div>
            <div class="form-group"><label>Role</label><select id="editUserRole"><option ${u.role === 'Traveler' ? 'selected' : ''}>Traveler</option><option ${u.role === 'Premium' ? 'selected' : ''}>Premium</option></select></div></div>
            <div class="form-row"><div class="form-group"><label>Status</label><select id="editUserStatus"><option ${u.status === 'active' ? 'selected' : ''}>active</option><option ${u.status === 'inactive' ? 'selected' : ''}>inactive</option></select></div>
            <div class="form-group"><label>Bookings</label><input type="number" id="editUserBookings" value="${u.bookings}"></div></div>
            <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
    `);
    
    document.getElementById('editUserForm').addEventListener('submit', (e) => {
        e.preventDefault();
        Object.assign(u, {
            name: document.getElementById('editUserName').value,
            email: document.getElementById('editUserEmail').value,
            phone: document.getElementById('editUserPhone').value,
            role: document.getElementById('editUserRole').value,
            status: document.getElementById('editUserStatus').value,
            bookings: parseInt(document.getElementById('editUserBookings').value),
            initials: document.getElementById('editUserName').value.split(' ').map(n => n[0]).join('')
        });
        DB.save();
        closeModal();
        refreshCurrentView();
        showToast('User updated!', 'success');
    });
}

function addNewUser() {
    showModal('Add New User', `
        <form id="newUserForm" class="settings-form">
            <div class="form-row"><div class="form-group"><label>Name *</label><input type="text" id="newUserName" required></div>
            <div class="form-group"><label>Email *</label><input type="email" id="newUserEmail" required></div></div>
            <div class="form-row"><div class="form-group"><label>Phone</label><input type="tel" id="newUserPhone"></div>
            <div class="form-group"><label>Role</label><select id="newUserRole"><option>Traveler</option><option>Premium</option></select></div></div>
            <button type="submit" class="btn btn-primary">Add User</button>
        </form>
    `);
    
    document.getElementById('newUserForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('newUserName').value;
        const user = {
            id: DB.users.length + 1,
            name,
            email: document.getElementById('newUserEmail').value,
            phone: document.getElementById('newUserPhone').value,
            role: document.getElementById('newUserRole').value,
            bookings: 0,
            status: 'active',
            joined: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }),
            initials: name.split(' ').map(n => n[0]).join('')
        };
        DB.users.unshift(user);
        DB.save();
        closeModal();
        refreshCurrentView();
        showToast('User added!', 'success');
    });
}

function toggleUserStatus(id) {
    const u = DB.users.find(u => u.id === id);
    if (!u) return;
    u.status = u.status === 'active' ? 'inactive' : 'active';
    DB.save();
    refreshCurrentView();
    showToast(`${u.name} is now ${u.status}`, 'info');
}

function deleteUser(id) {
    showConfirm('Delete User', 'Delete this user permanently?', () => {
        DB.users = DB.users.filter(u => u.id !== id);
        DB.save();
        refreshCurrentView();
        showToast('User deleted!', 'success');
    });
}

// ==========================================
// DESTINATION MANAGEMENT (CRUD)
// ==========================================
function renderDestinations(search = '') {
    let dests = DB.destinations;
    if (search) dests = dests.filter(d => d.name.toLowerCase().includes(search) || d.country.toLowerCase().includes(search));
    
    document.getElementById('destinationsGrid').innerHTML = dests.map(d => `
        <div class="dest-card glass-panel">
            <div class="dest-image ${d.gradient}"><i class="fas ${d.icon}"></i></div>
            <div class="dest-info">
                <h3>${d.name}</h3>
                <span class="dest-stats">${d.properties.toLocaleString()}+ Properties • ${d.tours}+ Tours • ${d.country}</span>
                <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:0.5rem;">${d.description}</p>
                <div style="margin-top:0.5rem;"><span class="status-badge ${d.active ? 'confirmed' : 'cancelled'}">${d.active ? 'Active' : 'Inactive'}</span> ⭐ ${d.rating}</div>
            </div>
            <div class="dest-actions">
                <button class="btn btn-ghost btn-sm" onclick="editDestination(${d.id})"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-ghost btn-sm" onclick="toggleDestination(${d.id})"><i class="fas fa-${d.active ? 'eye-slash' : 'eye'}"></i> ${d.active ? 'Deactivate' : 'Activate'}</button>
                <button class="btn btn-ghost btn-sm danger" onclick="deleteDestination(${d.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function editDestination(id) {
    const d = DB.destinations.find(d => d.id === id);
    if (!d) return;
    showModal('Edit Destination', `
        <form id="editDestForm" class="settings-form">
            <div class="form-group"><label>Name</label><input type="text" id="editDestName" value="${d.name}" required></div>
            <div class="form-row"><div class="form-group"><label>Country</label><input type="text" id="editDestCountry" value="${d.country}"></div>
            <div class="form-group"><label>Type</label><select id="editDestType"><option ${d.type === 'Tropical' ? 'selected' : ''}>Tropical</option><option ${d.type === 'Mountain' ? 'selected' : ''}>Mountain</option><option ${d.type === 'City' ? 'selected' : ''}>City</option><option ${d.type === 'Island' ? 'selected' : ''}>Island</option></select></div></div>
            <div class="form-row"><div class="form-group"><label>Properties</label><input type="number" id="editDestProps" value="${d.properties}"></div>
            <div class="form-group"><label>Tours</label><input type="number" id="editDestTours" value="${d.tours}"></div></div>
            <div class="form-row"><div class="form-group"><label>Rating</label><input type="number" id="editDestRating" value="${d.rating}" min="0" max="5" step="0.1"></div>
            <div class="form-group"><label>Icon Class</label><input type="text" id="editDestIcon" value="${d.icon}"></div></div>
            <div class="form-group"><label>Description</label><textarea id="editDestDesc">${d.description}</textarea></div>
            <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
    `);
    
    document.getElementById('editDestForm').addEventListener('submit', (e) => {
        e.preventDefault();
        Object.assign(d, {
            name: document.getElementById('editDestName').value,
            country: document.getElementById('editDestCountry').value,
            type: document.getElementById('editDestType').value,
            properties: parseInt(document.getElementById('editDestProps').value),
            tours: parseInt(document.getElementById('editDestTours').value),
            rating: parseFloat(document.getElementById('editDestRating').value),
            icon: document.getElementById('editDestIcon').value,
            description: document.getElementById('editDestDesc').value
        });
        DB.save();
        closeModal();
        renderDestinations();
        showToast('Destination updated!', 'success');
    });
}

function addNewDestination() {
    showModal('Add Destination', `
        <form id="newDestForm" class="settings-form">
            <div class="form-group"><label>Name *</label><input type="text" id="newDestName" required></div>
            <div class="form-row"><div class="form-group"><label>Country</label><input type="text" id="newDestCountry"></div>
            <div class="form-group"><label>Type</label><select id="newDestType"><option>Tropical</option><option>Mountain</option><option>City</option><option>Island</option></select></div></div>
            <div class="form-row"><div class="form-group"><label>Properties</label><input type="number" id="newDestProps" value="0"></div>
            <div class="form-group"><label>Tours</label><input type="number" id="newDestTours" value="0"></div></div>
            <div class="form-group"><label>Description</label><textarea id="newDestDesc"></textarea></div>
            <button type="submit" class="btn btn-primary">Add Destination</button>
        </form>
    `);
    
    document.getElementById('newDestForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const dest = {
            id: DB.destinations.length + 1,
            name: document.getElementById('newDestName').value,
            country: document.getElementById('newDestCountry').value,
            type: document.getElementById('newDestType').value,
            properties: parseInt(document.getElementById('newDestProps').value),
            tours: parseInt(document.getElementById('newDestTours').value),
            rating: 0,
            gradient: `gradient-${Math.ceil(Math.random() * 4)}`,
            icon: 'fa-map-marker-alt',
            active: true,
            description: document.getElementById('newDestDesc').value
        };
        DB.destinations.push(dest);
        DB.save();
        closeModal();
        renderDestinations();
        showToast('Destination added!', 'success');
    });
}

function toggleDestination(id) {
    const d = DB.destinations.find(d => d.id === id);
    if (!d) return;
    d.active = !d.active;
    DB.save();
    renderDestinations();
    showToast(`${d.name} ${d.active ? 'activated' : 'deactivated'}`, 'info');
}

function deleteDestination(id) {
    showConfirm('Delete Destination', 'Remove this destination?', () => {
        DB.destinations = DB.destinations.filter(d => d.id !== id);
        DB.save();
        renderDestinations();
        showToast('Destination deleted!', 'success');
    });
}

// ==========================================
// PACKAGE MANAGEMENT (CRUD)
// ==========================================
function renderPackages() {
    document.getElementById('packagesTable').innerHTML = DB.packages.map(p => `
        <tr>
            <td><strong>${p.name}</strong></td>
            <td><span class="role-badge">${p.type}</span></td>
            <td>${p.pricePerPerson ? '$' + p.pricePerPerson.toLocaleString() : 'Custom'}</td>
            <td>${p.groupPrice ? '$' + p.groupPrice.toLocaleString() : 'Custom'}</td>
            <td><small>${p.features.slice(0, 3).join(', ')}...</small></td>
            <td>${p.bookings}</td>
            <td><span class="status-badge ${p.active ? 'confirmed' : 'cancelled'}">${p.active ? 'Active' : 'Inactive'}</span></td>
            <td>
                <button class="action-btn" onclick="editPackage(${p.id})" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="action-btn" onclick="togglePackage(${p.id})" title="Toggle"><i class="fas fa-${p.active ? 'eye-slash' : 'eye'}"></i></button>
            </td>
        </tr>
    `).join('');
}

function editPackage(id) {
    const p = DB.packages.find(p => p.id === id);
    if (!p) return;
    showModal('Edit Package', `
        <form id="editPackageForm" class="settings-form">
            <div class="form-row"><div class="form-group"><label>Name</label><input type="text" id="editPkgName" value="${p.name}" required></div>
            <div class="form-group"><label>Type</label><select id="editPkgType"><option ${p.type === 'Basic' ? 'selected' : ''}>Basic</option><option ${p.type === 'Premium' ? 'selected' : ''}>Premium</option><option ${p.type === 'Luxury' ? 'selected' : ''}>Luxury</option></select></div></div>
            <div class="form-row"><div class="form-group"><label>Price/Person</label><input type="number" id="editPkgPrice" value="${p.pricePerPerson}"></div>
            <div class="form-group"><label>Group Price</label><input type="number" id="editPkgGroupPrice" value="${p.groupPrice}"></div></div>
            <div class="form-group"><label>Features (comma-separated)</label><textarea id="editPkgFeatures">${p.features.join(', ')}</textarea></div>
            <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
    `);
    
    document.getElementById('editPackageForm').addEventListener('submit', (e) => {
        e.preventDefault();
        Object.assign(p, {
            name: document.getElementById('editPkgName').value,
            type: document.getElementById('editPkgType').value,
            pricePerPerson: parseInt(document.getElementById('editPkgPrice').value),
            groupPrice: parseInt(document.getElementById('editPkgGroupPrice').value),
            features: document.getElementById('editPkgFeatures').value.split(',').map(f => f.trim())
        });
        DB.save();
        closeModal();
        renderPackages();
        showToast('Package updated!', 'success');
    });
}

function addNewPackage() {
    showModal('Add Package', `
        <form id="newPackageForm" class="settings-form">
            <div class="form-row"><div class="form-group"><label>Name *</label><input type="text" id="newPkgName" required></div>
            <div class="form-group"><label>Type</label><select id="newPkgType"><option>Basic</option><option>Premium</option><option>Luxury</option></select></div></div>
            <div class="form-row"><div class="form-group"><label>Price/Person</label><input type="number" id="newPkgPrice" value="0"></div>
            <div class="form-group"><label>Group Price</label><input type="number" id="newPkgGroupPrice" value="0"></div></div>
            <div class="form-group"><label>Features (comma-separated)</label><textarea id="newPkgFeatures"></textarea></div>
            <button type="submit" class="btn btn-primary">Add Package</button>
        </form>
    `);
    
    document.getElementById('newPackageForm').addEventListener('submit', (e) => {
        e.preventDefault();
        DB.packages.push({
            id: DB.packages.length + 1,
            name: document.getElementById('newPkgName').value,
            type: document.getElementById('newPkgType').value,
            pricePerPerson: parseInt(document.getElementById('newPkgPrice').value),
            groupPrice: parseInt(document.getElementById('newPkgGroupPrice').value),
            features: document.getElementById('newPkgFeatures').value.split(',').map(f => f.trim()),
            bookings: 0,
            active: true
        });
        DB.save();
        closeModal();
        renderPackages();
        showToast('Package added!', 'success');
    });
}

function togglePackage(id) {
    const p = DB.packages.find(p => p.id === id);
    if (!p) return;
    p.active = !p.active;
    DB.save();
    renderPackages();
    showToast(`${p.name} ${p.active ? 'activated' : 'deactivated'}`, 'info');
}

// ==========================================
// REVIEW MANAGEMENT (CRUD)
// ==========================================
function renderReviews(filter = 'all') {
    let reviews = DB.reviews;
    if (filter !== 'all') reviews = reviews.filter(r => r.status === filter);
    
    document.getElementById('reviewsList').innerHTML = reviews.map(r => `
        <div class="review-card glass-panel">
            <div class="review-header">
                <div class="review-user">
                    <div class="user-avatar">${r.initials}</div>
                    <div><strong>${r.user}</strong><span>${r.destination}</span></div>
                </div>
                <div class="review-rating">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
            </div>
            <p>${r.text}</p>
            <small style="color:var(--text-secondary);">${r.date}</small>
            <div class="review-actions">
                ${r.status === 'pending' ? `
                    <button class="btn btn-ghost btn-sm" onclick="approveReview(${r.id})"><i class="fas fa-check"></i> Approve</button>
                    <button class="btn btn-ghost btn-sm" onclick="rejectReview(${r.id})"><i class="fas fa-times"></i> Reject</button>
                ` : `<span class="status-badge ${r.status === 'approved' ? 'confirmed' : 'cancelled'}">${r.status}</span>`}
                <button class="btn btn-ghost btn-sm danger" onclick="deleteReview(${r.id})"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>
    `).join('');
}

function approveReview(id) {
    const r = DB.reviews.find(r => r.id === id);
    if (!r) return;
    r.status = 'approved';
    DB.save();
    renderReviews(document.getElementById('reviewStatusFilter').value);
    showToast('Review approved!', 'success');
}

function rejectReview(id) {
    const r = DB.reviews.find(r => r.id === id);
    if (!r) return;
    r.status = 'rejected';
    DB.save();
    renderReviews(document.getElementById('reviewStatusFilter').value);
    showToast('Review rejected!', 'info');
}

function deleteReview(id) {
    showConfirm('Delete Review', 'Permanently delete this review?', () => {
        DB.reviews = DB.reviews.filter(r => r.id !== id);
        DB.save();
        renderReviews(document.getElementById('reviewStatusFilter').value);
        showToast('Review deleted!', 'success');
    });
}

// ==========================================
// BLOG MANAGEMENT (CRUD)
// ==========================================
function renderBlogPosts(filter = 'all') {
    let posts = DB.blogPosts;
    if (filter !== 'all') posts = posts.filter(p => p.status === filter);
    
    document.getElementById('blogTable').innerHTML = posts.map(p => `
        <tr>
            <td><strong>${p.title}</strong></td>
            <td>${p.author}</td>
            <td><span class="role-badge">${p.category}</span></td>
            <td>${p.likes}</td>
            <td>${p.comments}</td>
            <td><span class="status-badge ${p.status === 'published' ? 'confirmed' : 'pending'} clickable" onclick="toggleBlogStatus(${p.id})">${p.status}</span></td>
            <td>${p.date}</td>
            <td>
                <button class="action-btn" onclick="editBlogPost(${p.id})" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="action-btn" onclick="viewBlogPost(${p.id})" title="View"><i class="fas fa-eye"></i></button>
                <button class="action-btn danger" onclick="deleteBlogPost(${p.id})" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function editBlogPost(id) {
    const p = DB.blogPosts.find(p => p.id === id);
    if (!p) return;
    showModal('Edit Blog Post', `
        <form id="editBlogForm" class="settings-form">
            <div class="form-group"><label>Title</label><input type="text" id="editBlogTitle" value="${p.title}" required></div>
            <div class="form-row"><div class="form-group"><label>Author</label><input type="text" id="editBlogAuthor" value="${p.author}"></div>
            <div class="form-group"><label>Category</label><input type="text" id="editBlogCategory" value="${p.category}"></div></div>
            <div class="form-row"><div class="form-group"><label>Likes</label><input type="number" id="editBlogLikes" value="${p.likes}"></div>
            <div class="form-group"><label>Comments</label><input type="number" id="editBlogComments" value="${p.comments}"></div></div>
            <div class="form-group"><label>Content</label><textarea id="editBlogContent" rows="5">${p.content || ''}</textarea></div>
            <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
    `);
    
    document.getElementById('editBlogForm').addEventListener('submit', (e) => {
        e.preventDefault();
        Object.assign(p, {
            title: document.getElementById('editBlogTitle').value,
            author: document.getElementById('editBlogAuthor').value,
            category: document.getElementById('editBlogCategory').value,
            likes: parseInt(document.getElementById('editBlogLikes').value),
            comments: parseInt(document.getElementById('editBlogComments').value),
            content: document.getElementById('editBlogContent').value
        });
        DB.save();
        closeModal();
        renderBlogPosts(document.getElementById('blogStatusFilter').value);
        showToast('Blog post updated!', 'success');
    });
}

function addNewBlogPost() {
    showModal('New Blog Post', `
        <form id="newBlogForm" class="settings-form">
            <div class="form-group"><label>Title *</label><input type="text" id="newBlogTitle" required></div>
            <div class="form-row"><div class="form-group"><label>Author</label><input type="text" id="newBlogAuthor"></div>
            <div class="form-group"><label>Category</label><input type="text" id="newBlogCategory"></div></div>
            <div class="form-group"><label>Content</label><textarea id="newBlogContent" rows="5"></textarea></div>
            <button type="submit" class="btn btn-primary">Publish Post</button>
        </form>
    `);
    
    document.getElementById('newBlogForm').addEventListener('submit', (e) => {
        e.preventDefault();
        DB.blogPosts.unshift({
            id: DB.blogPosts.length + 1,
            title: document.getElementById('newBlogTitle').value,
            author: document.getElementById('newBlogAuthor').value,
            category: document.getElementById('newBlogCategory').value,
            likes: 0,
            comments: 0,
            status: 'draft',
            date: new Date().toISOString().split('T')[0],
            gradient: `gradient-${Math.ceil(Math.random() * 4)}`,
            icon: 'fa-newspaper',
            content: document.getElementById('newBlogContent').value
        });
        DB.save();
        closeModal();
        renderBlogPosts(document.getElementById('blogStatusFilter').value);
        showToast('Blog post created!', 'success');
    });
}

function toggleBlogStatus(id) {
    const p = DB.blogPosts.find(p => p.id === id);
    if (!p) return;
    p.status = p.status === 'published' ? 'draft' : 'published';
    DB.save();
    renderBlogPosts(document.getElementById('blogStatusFilter').value);
    showToast(`Post ${p.status}`, 'info');
}

function deleteBlogPost(id) {
    showConfirm('Delete Post', 'Delete this blog post?', () => {
        DB.blogPosts = DB.blogPosts.filter(p => p.id !== id);
        DB.save();
        renderBlogPosts(document.getElementById('blogStatusFilter').value);
        showToast('Blog post deleted!', 'success');
    });
}

function viewBlogPost(id) {
    const p = DB.blogPosts.find(p => p.id === id);
    if (!p) return;
    showModal(p.title, `
        <div class="detail-grid">
            <p><strong>Author:</strong> ${p.author}</p>
            <p><strong>Category:</strong> ${p.category}</p>
            <p><strong>Date:</strong> ${p.date}</p>
            <p><strong>Status:</strong> ${p.status}</p>
            <p><strong>Likes:</strong> ${p.likes} | <strong>Comments:</strong> ${p.comments}</p>
            <div style="margin-top:1rem;"><strong>Content:</strong><p style="margin-top:0.5rem;line-height:1.8;">${p.content || 'No content available.'}</p></div>
        </div>
    `);
}

// ==========================================
// ANALYTICS CHARTS
// ==========================================
let charts = {};

function initDashboardCharts() {
    Object.values(charts).forEach(c => c?.destroy());
    charts = {};
    
    const revenueCtx = document.getElementById('revenueCanvas');
    if (revenueCtx) {
        charts.revenue = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue',
                    data: [120000, 135000, 148000, 162000, 175000, 190000],
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    fill: true, tension: 0.4, borderWidth: 2
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
    }
    
    const bookingCtx = document.getElementById('bookingCanvas');
    if (bookingCtx) {
        charts.bookings = new Chart(bookingCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Bookings',
                    data: [145, 178, 165, 192, 210, 245, 228],
                    backgroundColor: 'rgba(6, 182, 212, 0.7)',
                    borderRadius: 8
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
    }
}

function initAnalyticsCharts() {
    Object.values(charts).forEach(c => c?.destroy());
    charts = {};
    
    const destCtx = document.getElementById('destinationChart');
    if (destCtx) {
        charts.dest = new Chart(destCtx, {
            type: 'doughnut',
            data: {
                labels: ['Bali', 'Tokyo', 'Santorini', 'Swiss Alps', 'Maldives'],
                datasets: [{ data: [35, 25, 20, 12, 8], backgroundColor: ['#06b6d4', '#14b8a6', '#8b5cf6', '#f59e0b', '#ec4899'] }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
    
    const packageCtx = document.getElementById('packageChart');
    if (packageCtx) {
        charts.package = new Chart(packageCtx, {
            type: 'polarArea',
            data: {
                labels: ['Explorer', 'Adventurer', 'Concierge'],
                datasets: [{ data: [30, 50, 20], backgroundColor: ['rgba(6,182,212,0.6)', 'rgba(20,184,166,0.6)', 'rgba(139,92,246,0.6)'] }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
    
    const userCtx = document.getElementById('userGrowthChart');
    if (userCtx) {
        charts.user = new Chart(userCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{ label: 'Users', data: [1200, 1850, 2400, 3100, 4200, 5234], borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.1)', fill: true, tension: 0.4, borderWidth: 2 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
    }
    
    const revDestCtx = document.getElementById('revenueByDestChart');
    if (revDestCtx) {
        charts.revDest = new Chart(revDestCtx, {
            type: 'bar',
            data: {
                labels: ['Bali', 'Tokyo', 'Santorini', 'Swiss Alps', 'Maldives'],
                datasets: [{ label: 'Revenue', data: [280000, 195000, 160000, 95000, 120000], backgroundColor: ['#06b6d4', '#14b8a6', '#8b5cf6', '#f59e0b', '#ec4899'], borderRadius: 8 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
    }
}

// ==========================================
// MODAL SYSTEM
// ==========================================
function showModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('quickActionModal').classList.add('show');
}

function closeModal() {
    document.getElementById('quickActionModal').classList.remove('show');
}

function showConfirm(title, message, onConfirm) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmModal').classList.add('show');
    document.getElementById('confirmActionBtn').onclick = () => {
        closeConfirmModal();
        onConfirm();
    };
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('show');
}

// ==========================================
// TOAST SYSTEM
// ==========================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ==========================================
// NOTIFICATIONS
// ==========================================
function renderNotifications() {
    document.getElementById('notificationsList').innerHTML = DB.notifications.map(n => `
        <div class="notification-item ${n.read ? 'read' : 'unread'}" onclick="markNotificationRead(${n.id})">
            <div class="notification-icon ${n.color}"><i class="fas ${n.icon}"></i></div>
            <div class="notification-content"><p>${n.message}</p><small>${n.time}</small></div>
        </div>
    `).join('');
}

function markNotificationRead(id) {
    const n = DB.notifications.find(n => n.id === id);
    if (n) n.read = true;
    DB.save();
    renderNotifications();
    updateBadges();
}

function markAllNotificationsRead() {
    DB.notifications.forEach(n => n.read = true);
    DB.save();
    renderNotifications();
    updateBadges();
    showToast('All notifications marked as read', 'success');
}

function updateBadges() {
    document.getElementById('messageCount').textContent = DB.notifications.filter(n => !n.read).length;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function refreshCurrentView() {
    const activeSection = document.querySelector('.admin-section.active');
    if (activeSection) {
        const sectionId = activeSection.id.replace('-section', '');
        loadSectionData(sectionId);
    }
    updateDashboardStats();
    updateBadges();
}

function exportDashboardData() {
    const data = { bookings: DB.bookings, users: DB.users, exportDate: new Date().toISOString() };
    downloadJSON(data, `wandercloud-report-${new Date().toISOString().split('T')[0]}.json`);
    showToast('Report exported!', 'success');
}

function exportAnalyticsReport() {
    const data = {
        destinations: DB.destinations,
        packages: DB.packages,
        reviews: DB.reviews,
        stats: {
            totalRevenue: DB.bookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + b.amount, 0),
            totalBookings: DB.bookings.length,
            totalUsers: DB.users.length,
            avgRating: DB.reviews.filter(r => r.status === 'approved').reduce((s, r) => s + r.rating, 0) / DB.reviews.filter(r => r.status === 'approved').length || 0
        },
        exportDate: new Date().toISOString()
    };
    downloadJSON(data, `wandercloud-analytics-${new Date().toISOString().split('T')[0]}.json`);
    showToast('Analytics exported!', 'success');
}

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
}

// ==========================================
// EVENT LISTENERS
// ==========================================
document.getElementById('logoutBtn').addEventListener('click', logout);

document.getElementById('globalSearch').addEventListener('input', function(e) {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.admin-table tbody tr, .dest-card, .review-card').forEach(el => {
        el.style.display = el.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
});

document.getElementById('bookingStatusFilter')?.addEventListener('change', function() {
    renderAllBookings(this.value, document.getElementById('bookingSearch')?.value || '');
});

document.getElementById('bookingSearch')?.addEventListener('input', function() {
    renderAllBookings(document.getElementById('bookingStatusFilter')?.value || 'all', this.value.toLowerCase());
});

document.getElementById('userStatusFilter')?.addEventListener('change', function() {
    renderAllUsers(this.value, document.getElementById('userSearch')?.value || '');
});

document.getElementById('userSearch')?.addEventListener('input', function() {
    renderAllUsers(document.getElementById('userStatusFilter')?.value || 'all', this.value.toLowerCase());
});

document.getElementById('destinationSearch')?.addEventListener('input', function() {
    renderDestinations(this.value.toLowerCase());
});

document.getElementById('reviewStatusFilter')?.addEventListener('change', function() {
    renderReviews(this.value);
});

document.getElementById('blogStatusFilter')?.addEventListener('change', function() {
    renderBlogPosts(this.value);
});

document.getElementById('revenuePeriod')?.addEventListener('change', initDashboardCharts);
document.getElementById('bookingPeriod')?.addEventListener('change', initDashboardCharts);

document.getElementById('quickActionModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

document.getElementById('confirmModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeConfirmModal();
});

document.querySelector('.notification-btn')?.addEventListener('click', function(e) {
    e.stopPropagation();
    const dropdown = document.getElementById('notificationsDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    renderNotifications();
});

document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('notificationsDropdown');
    if (dropdown && !e.target.closest('.notification-btn') && !e.target.closest('.notifications-dropdown')) {
        dropdown.style.display = 'none';
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
        closeConfirmModal();
    }
});

// Settings forms
document.getElementById('generalSettingsForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    showToast('Settings saved!', 'success');
});

document.getElementById('securitySettingsForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    showToast('Security settings updated!', 'success');
});

document.getElementById('notificationSettingsForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    showToast('Notification preferences saved!', 'success');
});

function toggle2FA() {
    const el = document.getElementById('twoFAStatus');
    el.textContent = el.textContent === 'Enable 2FA' ? 'Disable 2FA' : 'Enable 2FA';
    showToast(`2FA ${el.textContent === 'Disable 2FA' ? 'enabled' : 'disabled'}`, 'info');
}

function regenerateAPIKey() {
    document.getElementById('apiKey').value = 'wc_api_' + Math.random().toString(36).substr(2, 15);
    showToast('API key regenerated!', 'success');
}

// ==========================================
// INITIALIZATION
// ==========================================
function initAdmin() {
    if (!checkAuth()) {
        login('admin', 'admin123', true); // Auto-login for demo
    }
    
    DB.init();
    
    document.getElementById('adminName').textContent = currentAdmin?.name || 'Admin';
    document.getElementById('adminRole').textContent = currentAdmin?.role || 'Administrator';
    document.getElementById('adminInitials').textContent = currentAdmin?.initials || 'AD';
    document.getElementById('welcomeName').textContent = currentAdmin?.name?.split(' ')[0] || 'Admin';
    
    updateDashboardStats();
    renderRecentBookings();
    renderNotifications();
    updateBadges();
    initDashboardCharts();
    
    setTimeout(() => {
        document.getElementById('adminLoading').style.display = 'none';
    }, 800);
    
    console.log('%c🚀 WanderCloud Admin v2.0', 'font-size:20px;font-weight:bold;color:#06b6d4;');
    console.log('%cAll systems operational', 'color:#10b981;');
}

window.addEventListener('DOMContentLoaded', initAdmin);
window.addEventListener('beforeunload', () => DB.save());