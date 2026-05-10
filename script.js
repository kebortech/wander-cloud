// ==========================================
// THEME TOGGLE FUNCTIONALITY
// ==========================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

const savedTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.classList.remove('fa-sun', 'fa-moon');
    themeIcon.classList.add(theme === 'dark' ? 'fa-moon' : 'fa-sun');
}

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileIcon = mobileToggle.querySelector('i');

mobileToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('show');
    mobileIcon.classList.toggle('fa-bars');
    mobileIcon.classList.toggle('fa-times');
});

mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('show');
        mobileIcon.classList.remove('fa-times');
        mobileIcon.classList.add('fa-bars');
    });
});

document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target) && mobileMenu.classList.contains('show')) {
        mobileMenu.classList.remove('show');
        mobileIcon.classList.remove('fa-times');
        mobileIcon.classList.add('fa-bars');
    }
});

// ==========================================
// BOOKING SUBMIT HANDLER - PAYMENT REDIRECT
// ==========================================
function handleBookingSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = document.getElementById('fullName')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const destination = document.getElementById('destination')?.value || '';
    const travelersSelect = document.getElementById('travelers');
    const travelers = travelersSelect?.value || '2';
    const phone = document.getElementById('phone')?.value || '';
    const notes = document.getElementById('notes')?.value || '';
    const budget = document.getElementById('budget')?.value || '';
    const contactMethod = document.getElementById('contactMethod')?.value || 'Email';
    
    // Determine package based on budget
    let packageName = 'Adventurer';
    let amount = 1699;
    if (budget.includes('Budget')) { packageName = 'Explorer'; amount = 899; }
    else if (budget.includes('Premium')) { packageName = 'Adventurer'; amount = 1699; }
    else if (budget.includes('Luxury')) { packageName = 'Concierge'; amount = 3499; }
    
    // Parse number of travelers
    let travelerCount = 2;
    if (travelers.includes('Solo')) travelerCount = 1;
    else if (travelers.includes('Couple')) travelerCount = 2;
    else if (travelers.includes('Family')) travelerCount = 4;
    else if (travelers.includes('Group')) travelerCount = 8;
    
    // Calculate total amount
    const totalAmount = amount * travelerCount;
    
    // Create booking object
    const booking = {
        id: 'WC-' + Date.now().toString(36).toUpperCase(),
        customer: name,
        email: email,
        destination: destination || 'Not specified',
        package: packageName,
        dates: 'TBD - To be confirmed by travel expert',
        amount: totalAmount,
        baseAmount: amount,
        status: 'pending',
        travelers: travelerCount,
        travelerType: travelers,
        createdAt: new Date().toISOString().split('T')[0],
        phone: phone,
        notes: notes,
        budget: budget,
        contactMethod: contactMethod
    };
    
    // Save to database
    const db = JSON.parse(localStorage.getItem('wandercloud_db') || '{}');
    db.bookings = db.bookings || [];
    db.bookings.unshift(booking);
    localStorage.setItem('wandercloud_db', JSON.stringify(db));
    
    // Update user booking count if logged in
    if (currentUser) {
        currentUser.bookings = (currentUser.bookings || 0) + 1;
        UserDB.users = UserDB.users.map(u => u.id === currentUser.id ? currentUser : u);
        UserDB.save();
    }
    
    // Save to session for payment page
    sessionStorage.setItem('wandercloud_pending_booking', JSON.stringify(booking));
    
    // Update hidden field
    document.getElementById('bookingDestination').value = destination;
    
    // Show success message
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Redirecting to Payment...';
        submitBtn.style.background = '#10b981';
    }, 800);
    
    // Redirect to payment page
    setTimeout(() => {
        window.location.href = `payment.html?booking=${booking.id}`;
    }, 2000);
    
    return false;
}

// ==========================================
// USER DATABASE & REGISTRATION SYSTEM
// ==========================================
const UserDB = {
    users: [],
    
    init() {
        const saved = localStorage.getItem('wandercloud_users');
        if (saved) {
            this.users = JSON.parse(saved);
        } else {
            this.users = [
                {
                    id: 1, name: 'John Doe', email: 'john@email.com', password: btoa('password123'),
                    phone: '+1 (555) 123-4567', role: 'Traveler', bookings: 12, status: 'active',
                    joined: 'Jan 2026', createdAt: new Date('2026-01-15').toISOString()
                },
                {
                    id: 2, name: 'Maria Chen', email: 'maria@email.com', password: btoa('password123'),
                    phone: '+1 (555) 234-5678', role: 'Traveler', bookings: 8, status: 'active',
                    joined: 'Feb 2026', createdAt: new Date('2026-02-20').toISOString()
                }
            ];
            this.save();
        }
    },
    
    save() { localStorage.setItem('wandercloud_users', JSON.stringify(this.users)); },
    findByEmail(email) { return this.users.find(u => u.email.toLowerCase() === email.toLowerCase()); },
    findById(id) { return this.users.find(u => u.id === id); },
    
    register(userData) {
        if (this.findByEmail(userData.email)) {
            return { success: false, message: 'Email already registered. Please use a different email or login.' };
        }
        const newUser = {
            id: this.users.length + 1,
            name: userData.name,
            email: userData.email.toLowerCase(),
            password: btoa(userData.password),
            phone: userData.phone || '',
            role: 'Traveler',
            bookings: 0,
            status: 'active',
            joined: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }),
            createdAt: new Date().toISOString()
        };
        this.users.push(newUser);
        this.save();
        return { success: true, user: newUser, message: 'Registration successful! Welcome to WanderCloud.' };
    },
    
    login(email, password) {
        const user = this.findByEmail(email);
        if (!user) return { success: false, message: 'No account found with this email. Please register first.' };
        if (user.password !== btoa(password)) return { success: false, message: 'Incorrect password. Please try again.' };
        if (user.status === 'inactive') return { success: false, message: 'Your account has been deactivated. Please contact support.' };
        return { success: true, user, message: 'Login successful!' };
    },
    
    updateProfile(id, data) {
        const user = this.findById(id);
        if (!user) return { success: false, message: 'User not found.' };
        if (data.name) user.name = data.name;
        if (data.phone) user.phone = data.phone;
        if (data.password) user.password = btoa(data.password);
        this.save();
        return { success: true, user, message: 'Profile updated successfully!' };
    }
};

UserDB.init();

// ==========================================
// AUTHENTICATION SYSTEM
// ==========================================
let currentUser = null;

function checkUserAuth() {
    const session = localStorage.getItem('wandercloud_user_session') || sessionStorage.getItem('wandercloud_user_session');
    if (session) {
        const data = JSON.parse(session);
        const user = UserDB.findById(data.userId);
        if (user) { currentUser = user; updateUIForLoggedInUser(); return true; }
    }
    return false;
}

function loginUser(email, password, remember = false) {
    const result = UserDB.login(email, password);
    if (result.success) {
        currentUser = result.user;
        const session = { userId: result.user.id, timestamp: Date.now() };
        if (remember) localStorage.setItem('wandercloud_user_session', JSON.stringify(session));
        else sessionStorage.setItem('wandercloud_user_session', JSON.stringify(session));
        updateUIForLoggedInUser();
    }
    return result;
}

function registerUser(userData) {
    const result = UserDB.register(userData);
    if (result.success) {
        currentUser = result.user;
        localStorage.setItem('wandercloud_user_session', JSON.stringify({ userId: result.user.id, timestamp: Date.now() }));
        updateUIForLoggedInUser();
    }
    return result;
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('wandercloud_user_session');
    sessionStorage.removeItem('wandercloud_user_session');
    updateUIForLoggedOutUser();
    showToast('You have been logged out.', 'info');
}

function updateUIForLoggedInUser() {
    if (!currentUser) return;
    const signInBtn = document.getElementById('signInBtn');
    const registerBtn = document.getElementById('registerBtn');
    const mobileSignInBtn = document.getElementById('mobileSignInBtn');
    const mobileRegisterBtn = document.getElementById('mobileRegisterBtn');
    
    if (signInBtn) { signInBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${currentUser.name.split(' ')[0]}`; signInBtn.href = '#'; signInBtn.onclick = (e) => { e.preventDefault(); showUserMenu(); }; }
    if (registerBtn) { registerBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout'; registerBtn.href = '#'; registerBtn.onclick = (e) => { e.preventDefault(); logoutUser(); }; }
    if (mobileSignInBtn) { mobileSignInBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${currentUser.name.split(' ')[0]}`; mobileSignInBtn.onclick = (e) => { e.preventDefault(); showUserMenu(); }; }
    if (mobileRegisterBtn) { mobileRegisterBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout'; mobileRegisterBtn.onclick = (e) => { e.preventDefault(); logoutUser(); }; }
}

function updateUIForLoggedOutUser() {
    const signInBtn = document.getElementById('signInBtn');
    const registerBtn = document.getElementById('registerBtn');
    const mobileSignInBtn = document.getElementById('mobileSignInBtn');
    const mobileRegisterBtn = document.getElementById('mobileRegisterBtn');
    
    if (signInBtn) { signInBtn.innerHTML = 'Sign In'; signInBtn.onclick = (e) => { e.preventDefault(); showLoginModal(); }; }
    if (registerBtn) { registerBtn.innerHTML = 'Register'; registerBtn.onclick = (e) => { e.preventDefault(); showRegisterModal(); }; }
    if (mobileSignInBtn) { mobileSignInBtn.innerHTML = 'Sign In'; mobileSignInBtn.onclick = (e) => { e.preventDefault(); showLoginModal(); }; }
    if (mobileRegisterBtn) { mobileRegisterBtn.innerHTML = 'Register'; mobileRegisterBtn.onclick = (e) => { e.preventDefault(); showRegisterModal(); }; }
}

function showUserMenu() {
    const existingMenu = document.getElementById('userDropdownMenu');
    if (existingMenu) { existingMenu.remove(); return; }
    
    const menu = document.createElement('div');
    menu.id = 'userDropdownMenu';
    menu.style.cssText = 'position:absolute;top:60px;right:20px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);backdrop-filter:blur(20px);padding:0.5rem;z-index:1001;min-width:200px;box-shadow:var(--shadow-lg);';
    menu.innerHTML = `
        <div style="padding:1rem;border-bottom:1px solid var(--border);"><strong style="display:block;">${currentUser.name}</strong><small style="color:var(--text-secondary);">${currentUser.email}</small></div>
        <a href="#" onclick="event.preventDefault();showProfileModal();document.getElementById('userDropdownMenu').remove();" style="display:flex;align-items:center;gap:10px;padding:0.75rem 1rem;color:var(--text-primary);text-decoration:none;border-radius:8px;" onmouseover="this.style.background='rgba(6,182,212,0.1)'" onmouseout="this.style.background='transparent'"><i class="fas fa-user-edit"></i> My Profile</a>
        <a href="#" onclick="event.preventDefault();showMyBookings();document.getElementById('userDropdownMenu').remove();" style="display:flex;align-items:center;gap:10px;padding:0.75rem 1rem;color:var(--text-primary);text-decoration:none;border-radius:8px;" onmouseover="this.style.background='rgba(6,182,212,0.1)'" onmouseout="this.style.background='transparent'"><i class="fas fa-suitcase"></i> My Bookings</a>
        <hr style="border-color:var(--border);margin:0.5rem 0;">
        <a href="#" onclick="event.preventDefault();logoutUser();document.getElementById('userDropdownMenu').remove();" style="display:flex;align-items:center;gap:10px;padding:0.75rem 1rem;color:#ef4444;text-decoration:none;border-radius:8px;" onmouseover="this.style.background='rgba(239,68,68,0.1)'" onmouseout="this.style.background='transparent'"><i class="fas fa-sign-out-alt"></i> Logout</a>
    `;
    document.body.appendChild(menu);
    setTimeout(() => { document.addEventListener('click', function closeMenu(e) { if (!menu.contains(e.target)) { menu.remove(); document.removeEventListener('click', closeMenu); } }); }, 100);
}

// ==========================================
// LOGIN MODAL
// ==========================================
let authTab = 'user';

function showLoginModal() {
    const existingModal = document.getElementById('authModal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'authModal';
    modal.className = 'blog-article-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="blog-article-container glass-panel" style="max-width:450px;animation:slideUp 0.4s ease;">
            <button class="blog-article-close" onclick="closeAuthModal()"><i class="fas fa-times"></i></button>
            <div style="padding:2rem;">
                <div style="text-align:center;margin-bottom:2rem;">
                    <div class="logo-icon" style="margin:0 auto 1rem;width:48px;height:48px;font-size:1.2rem;"><i class="fas fa-globe-americas"></i></div>
                    <h2 style="font-size:1.5rem;margin-bottom:0.5rem;">Welcome Back to <span class="gradient-text">WanderCloud</span></h2>
                    <p style="color:var(--text-secondary);font-size:0.9rem;">Sign in to access your account</p>
                </div>
                <div id="loginTabs" style="display:flex;gap:0.5rem;margin-bottom:1.5rem;border-bottom:1px solid var(--border);">
                    <button class="auth-tab active" onclick="switchAuthTab('user')" style="flex:1;padding:0.75rem;background:none;border:none;color:var(--primary);border-bottom:2px solid var(--primary);cursor:pointer;font-family:inherit;font-weight:600;transition:all 0.3s;"><i class="fas fa-user"></i> Traveler</button>
                    <button class="auth-tab" onclick="switchAuthTab('admin')" style="flex:1;padding:0.75rem;background:none;border:none;color:var(--text-secondary);cursor:pointer;font-family:inherit;font-weight:600;transition:all 0.3s;"><i class="fas fa-shield-alt"></i> Admin</button>
                </div>
                <form id="loginForm" onsubmit="handleLogin(event)" style="display:flex;flex-direction:column;gap:1rem;">
                    <div class="form-group"><label style="display:block;margin-bottom:0.5rem;font-weight:600;font-size:0.9rem;">Email Address</label><input type="email" id="loginEmail" placeholder="Enter your email" required style="width:100%;padding:10px 14px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);font-family:inherit;font-size:0.9rem;"></div>
                    <div class="form-group"><label style="display:block;margin-bottom:0.5rem;font-weight:600;font-size:0.9rem;">Password</label><div style="position:relative;"><input type="password" id="loginPassword" placeholder="Enter your password" required style="width:100%;padding:10px 40px 10px 14px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);font-family:inherit;font-size:0.9rem;"><button type="button" onclick="togglePasswordVisibility('loginPassword','loginPasswordIcon')" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text-secondary);cursor:pointer;"><i class="fas fa-eye" id="loginPasswordIcon"></i></button></div></div>
                    <div style="display:flex;justify-content:space-between;align-items:center;"><label style="display:flex;align-items:center;gap:8px;font-size:0.85rem;color:var(--text-secondary);cursor:pointer;"><input type="checkbox" id="rememberMe"> Remember me</label><a href="#" style="font-size:0.85rem;color:var(--primary);text-decoration:none;">Forgot password?</a></div>
                    <button type="submit" class="btn btn-gradient" style="margin-top:0.5rem;width:100%;"><i class="fas fa-sign-in-alt"></i> Sign In</button>
                </form>
                <div id="loginError" style="display:none;margin-top:1rem;padding:0.75rem;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:var(--radius-sm);color:#ef4444;font-size:0.85rem;text-align:center;"><i class="fas fa-exclamation-circle"></i> <span id="loginErrorMessage"></span></div>
                <div style="text-align:center;margin-top:1.5rem;"><p style="color:var(--text-secondary);font-size:0.85rem;">Don't have an account? <a href="#" style="color:var(--primary);" onclick="event.preventDefault();closeAuthModal();showRegisterModal();">Register here</a></p></div>
                <div id="adminCreds" style="display:none;text-align:center;margin-top:0.5rem;padding:0.75rem;background:rgba(6,182,212,0.05);border-radius:var(--radius-sm);"><p style="font-size:0.75rem;color:var(--text-secondary);"><strong>Demo Admin:</strong> admin@wandercloud.com / admin123</p></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.classList.add('no-scroll');
    modal.addEventListener('click', function(e) { if (e.target === modal) closeAuthModal(); });
}

function showRegisterModal() {
    const existingModal = document.getElementById('authModal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'authModal';
    modal.className = 'blog-article-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="blog-article-container glass-panel" style="max-width:500px;animation:slideUp 0.4s ease;">
            <button class="blog-article-close" onclick="closeAuthModal()"><i class="fas fa-times"></i></button>
            <div style="padding:2rem;">
                <div style="text-align:center;margin-bottom:2rem;"><div class="logo-icon" style="margin:0 auto 1rem;width:48px;height:48px;font-size:1.2rem;"><i class="fas fa-globe-americas"></i></div><h2 style="font-size:1.5rem;margin-bottom:0.5rem;">Join <span class="gradient-text">WanderCloud</span></h2><p style="color:var(--text-secondary);font-size:0.9rem;">Create your account and start exploring</p></div>
                <form id="registerForm" onsubmit="handleRegister(event)" style="display:flex;flex-direction:column;gap:1rem;">
                    <div class="form-group"><label style="display:block;margin-bottom:0.5rem;font-weight:600;font-size:0.9rem;">Full Name *</label><input type="text" id="regName" placeholder="Enter your full name" required style="width:100%;padding:10px 14px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);font-family:inherit;font-size:0.9rem;"></div>
                    <div class="form-group"><label style="display:block;margin-bottom:0.5rem;font-weight:600;font-size:0.9rem;">Email Address *</label><input type="email" id="regEmail" placeholder="Enter your email" required style="width:100%;padding:10px 14px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);font-family:inherit;font-size:0.9rem;"></div>
                    <div class="form-group"><label style="display:block;margin-bottom:0.5rem;font-weight:600;font-size:0.9rem;">Phone Number</label><input type="tel" id="regPhone" placeholder="+1 (555) 000-0000" style="width:100%;padding:10px 14px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);font-family:inherit;font-size:0.9rem;"></div>
                    <div class="form-group"><label style="display:block;margin-bottom:0.5rem;font-weight:600;font-size:0.9rem;">Password *</label><div style="position:relative;"><input type="password" id="regPassword" placeholder="Create a password (min. 6 characters)" required minlength="6" style="width:100%;padding:10px 40px 10px 14px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);font-family:inherit;font-size:0.9rem;"><button type="button" onclick="togglePasswordVisibility('regPassword','regPasswordIcon')" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text-secondary);cursor:pointer;"><i class="fas fa-eye" id="regPasswordIcon"></i></button></div><div id="passwordStrength" style="margin-top:0.5rem;height:4px;border-radius:2px;background:var(--border);overflow:hidden;"><div id="passwordStrengthBar" style="height:100%;width:0%;transition:all 0.3s;background:#ef4444;"></div></div><small id="passwordStrengthText" style="color:var(--text-secondary);font-size:0.75rem;"></small></div>
                    <div class="form-group"><label style="display:flex;align-items:flex-start;gap:8px;font-size:0.85rem;color:var(--text-secondary);cursor:pointer;"><input type="checkbox" id="regTerms" required style="margin-top:3px;"><span>I agree to the <a href="#" style="color:var(--primary);">Terms of Service</a> and <a href="#" style="color:var(--primary);">Privacy Policy</a></span></label></div>
                    <button type="submit" class="btn btn-gradient" style="margin-top:0.5rem;width:100%;"><i class="fas fa-user-plus"></i> Create Account</button>
                </form>
                <div id="registerError" style="display:none;margin-top:1rem;padding:0.75rem;border-radius:var(--radius-sm);font-size:0.85rem;text-align:center;"></div>
                <div style="text-align:center;margin-top:1.5rem;"><p style="color:var(--text-secondary);font-size:0.85rem;">Already have an account? <a href="#" style="color:var(--primary);" onclick="event.preventDefault();closeAuthModal();showLoginModal();">Sign in</a></p></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.classList.add('no-scroll');
    document.getElementById('regPassword').addEventListener('input', function() { checkPasswordStrength(this.value); });
    modal.addEventListener('click', function(e) { if (e.target === modal) closeAuthModal(); });
}

function showProfileModal() {
    if (!currentUser) return;
    const modal = document.createElement('div');
    modal.id = 'profileModal';
    modal.className = 'blog-article-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="blog-article-container glass-panel" style="max-width:500px;animation:slideUp 0.4s ease;">
            <button class="blog-article-close" onclick="document.getElementById('profileModal').remove();document.body.classList.remove('no-scroll');"><i class="fas fa-times"></i></button>
            <div style="padding:2rem;">
                <div style="text-align:center;margin-bottom:2rem;"><div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#06b6d4,#8b5cf6);display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;font-weight:700;margin:0 auto 1rem;">${currentUser.name.split(' ').map(n=>n[0]).join('')}</div><h2 style="font-size:1.5rem;">${currentUser.name}</h2><p style="color:var(--text-secondary);">${currentUser.email}</p><span class="role-badge">${currentUser.role}</span></div>
                <form id="profileForm" onsubmit="handleProfileUpdate(event)" style="display:flex;flex-direction:column;gap:1rem;">
                    <div class="form-group"><label style="display:block;margin-bottom:0.5rem;font-weight:600;">Full Name</label><input type="text" id="profileName" value="${currentUser.name}" required style="width:100%;padding:10px 14px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);font-family:inherit;"></div>
                    <div class="form-group"><label style="display:block;margin-bottom:0.5rem;font-weight:600;">Phone Number</label><input type="tel" id="profilePhone" value="${currentUser.phone||''}" style="width:100%;padding:10px 14px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);font-family:inherit;"></div>
                    <div class="form-group"><label style="display:block;margin-bottom:0.5rem;font-weight:600;">New Password (leave blank to keep current)</label><input type="password" id="profilePassword" placeholder="Enter new password" minlength="6" style="width:100%;padding:10px 14px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-primary);font-family:inherit;"></div>
                    <div style="background:rgba(6,182,212,0.05);padding:1rem;border-radius:var(--radius-sm);"><p style="font-size:0.85rem;color:var(--text-secondary);"><strong>Member since:</strong> ${currentUser.joined}<br><strong>Total Bookings:</strong> ${currentUser.bookings}</p></div>
                    <button type="submit" class="btn btn-gradient" style="width:100%;"><i class="fas fa-save"></i> Update Profile</button>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.classList.add('no-scroll');
    modal.addEventListener('click', function(e) { if (e.target === modal) { modal.remove(); document.body.classList.remove('no-scroll'); } });
}

function showMyBookings() {
    if (!currentUser) return;
    const bookingsDB = JSON.parse(localStorage.getItem('wandercloud_db') || '{}');
    const userBookings = (bookingsDB.bookings || []).filter(b => b.email?.toLowerCase() === currentUser.email.toLowerCase());
    
    const modal = document.createElement('div');
    modal.id = 'bookingsModal';
    modal.className = 'blog-article-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="blog-article-container glass-panel" style="max-width:700px;max-height:80vh;animation:slideUp 0.4s ease;">
            <button class="blog-article-close" onclick="document.getElementById('bookingsModal').remove();document.body.classList.remove('no-scroll');"><i class="fas fa-times"></i></button>
            <div style="padding:2rem;overflow-y:auto;max-height:80vh;">
                <h2 style="margin-bottom:1.5rem;">My Bookings</h2>
                ${userBookings.length === 0 ? `<div style="text-align:center;padding:3rem 1rem;"><i class="fas fa-suitcase" style="font-size:3rem;color:var(--text-secondary);margin-bottom:1rem;"></i><p style="color:var(--text-secondary);">No bookings yet. Start exploring destinations!</p><a href="#destinations" class="btn btn-primary" style="margin-top:1rem;" onclick="document.getElementById('bookingsModal').remove();document.body.classList.remove('no-scroll');">Explore Destinations</a></div>` : 
                `<div style="display:flex;flex-direction:column;gap:1rem;">${userBookings.map(b => `<div class="glass-panel" style="padding:1.25rem;"><div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:1rem;"><div><h3 style="font-size:1.1rem;">${b.destination}</h3><p style="color:var(--text-secondary);font-size:0.85rem;">${b.package} Package • ${b.dates}</p><p style="color:var(--text-secondary);font-size:0.85rem;">${b.travelers} traveler(s)</p></div><div style="text-align:right;"><strong style="font-size:1.2rem;color:var(--primary);">$${b.amount.toLocaleString()}</strong><br><span class="status-badge ${b.status}">${b.status.charAt(0).toUpperCase()+b.status.slice(1)}</span></div></div></div>`).join('')}</div>`}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.classList.add('no-scroll');
    modal.addEventListener('click', function(e) { if (e.target === modal) { modal.remove(); document.body.classList.remove('no-scroll'); } });
}

// ==========================================
// AUTH HANDLERS
// ==========================================
function switchAuthTab(type) {
    authTab = type;
    const tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(tab => { tab.classList.remove('active'); tab.style.color = 'var(--text-secondary)'; tab.style.borderBottom = 'none'; });
    const activeTab = type === 'user' ? tabs[0] : tabs[1];
    activeTab.classList.add('active'); activeTab.style.color = 'var(--primary)'; activeTab.style.borderBottom = '2px solid var(--primary)';
    const adminCreds = document.getElementById('adminCreds'); if (adminCreds) adminCreds.style.display = type === 'admin' ? 'block' : 'none';
    const loginEmail = document.getElementById('loginEmail'); if (loginEmail) loginEmail.placeholder = type === 'admin' ? 'Enter admin email' : 'Enter your email';
    const loginError = document.getElementById('loginError'); if (loginError) loginError.style.display = 'none';
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe')?.checked || false;
    const errorDiv = document.getElementById('loginError');
    const errorMsg = document.getElementById('loginErrorMessage');
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...'; submitBtn.disabled = true;
    
    setTimeout(() => {
        if (authTab === 'admin') {
            if (email === 'admin@wandercloud.com' && password === 'admin123') {
                const admin = { id: 1, username: 'admin', email: 'admin@wandercloud.com', name: 'Sarah Admin', role: 'Super Admin', initials: 'SA', permissions: ['all'] };
                const session = { user: admin, timestamp: Date.now() };
                if (rememberMe) localStorage.setItem('wandercloud_admin_session', JSON.stringify(session));
                else sessionStorage.setItem('wandercloud_admin_session', JSON.stringify(session));
                showAuthMessage('success', 'Login successful! Redirecting to admin dashboard...');
                setTimeout(() => { window.location.href = 'admin.html'; }, 1000);
            } else {
                showAuthError('Invalid admin credentials. Use admin@wandercloud.com / admin123');
                submitBtn.innerHTML = originalHTML; submitBtn.disabled = false;
            }
        } else {
            const result = loginUser(email, password, rememberMe);
            if (result.success) {
                showAuthMessage('success', 'Welcome back, ' + result.user.name.split(' ')[0] + '!');
                setTimeout(() => { closeAuthModal(); }, 1000);
            } else {
                showAuthError(result.message);
                submitBtn.innerHTML = originalHTML; submitBtn.disabled = false;
            }
        }
    }, 800);
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const terms = document.getElementById('regTerms').checked;
    const submitBtn = document.querySelector('#registerForm button[type="submit"]');
    
    if (!terms) { showRegisterError('Please agree to the Terms of Service and Privacy Policy.'); return; }
    if (password.length < 6) { showRegisterError('Password must be at least 6 characters long.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showRegisterError('Please enter a valid email address.'); return; }
    
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...'; submitBtn.disabled = true;
    
    setTimeout(() => {
        const result = registerUser({ name, email, phone, password });
        if (result.success) {
            showRegisterSuccess('Account created! Welcome, ' + name.split(' ')[0] + '!');
            setTimeout(() => { closeAuthModal(); }, 1500);
        } else {
            showRegisterError(result.message);
            submitBtn.innerHTML = originalHTML; submitBtn.disabled = false;
        }
    }, 800);
}

function handleProfileUpdate(event) {
    event.preventDefault();
    const name = document.getElementById('profileName').value.trim();
    const phone = document.getElementById('profilePhone').value.trim();
    const password = document.getElementById('profilePassword').value;
    const result = UserDB.updateProfile(currentUser.id, { name, phone, password: password || undefined });
    if (result.success) {
        currentUser = result.user;
        updateUIForLoggedInUser();
        showToast('Profile updated successfully!', 'success');
        document.getElementById('profileModal').remove();
        document.body.classList.remove('no-scroll');
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (input.type === 'password') { input.type = 'text'; icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash'); }
    else { input.type = 'password'; icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye'); }
}

function checkPasswordStrength(password) {
    const bar = document.getElementById('passwordStrengthBar');
    const text = document.getElementById('passwordStrengthText');
    if (!bar || !text) return;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    const percentage = (strength / 5) * 100;
    bar.style.width = percentage + '%';
    if (strength <= 2) { bar.style.background = '#ef4444'; text.textContent = 'Weak password'; text.style.color = '#ef4444'; }
    else if (strength <= 3) { bar.style.background = '#f59e0b'; text.textContent = 'Fair password'; text.style.color = '#f59e0b'; }
    else if (strength <= 4) { bar.style.background = '#06b6d4'; text.textContent = 'Good password'; text.style.color = '#06b6d4'; }
    else { bar.style.background = '#10b981'; text.textContent = 'Strong password!'; text.style.color = '#10b981'; }
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) { modal.remove(); document.body.classList.remove('no-scroll'); }
}

function showAuthError(message) {
    const errorDiv = document.getElementById('loginError');
    const errorMsg = document.getElementById('loginErrorMessage');
    if (errorDiv && errorMsg) { errorDiv.style.display = 'block'; errorDiv.style.background = 'rgba(239,68,68,0.1)'; errorDiv.style.border = '1px solid rgba(239,68,68,0.3)'; errorDiv.style.color = '#ef4444'; errorMsg.textContent = message; }
}

function showAuthMessage(type, message) {
    const errorDiv = document.getElementById('loginError');
    const errorMsg = document.getElementById('loginErrorMessage');
    if (errorDiv && errorMsg) { errorDiv.style.display = 'block'; errorDiv.style.background = type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(6,182,212,0.1)'; errorDiv.style.border = type === 'success' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(6,182,212,0.3)'; errorDiv.style.color = type === 'success' ? '#10b981' : '#06b6d4'; errorMsg.innerHTML = `<i class="fas fa-${type==='success'?'check-circle':'info-circle'}"></i> ${message}`; }
}

function showRegisterError(message) {
    const errorDiv = document.getElementById('registerError');
    if (errorDiv) { errorDiv.style.display = 'block'; errorDiv.style.background = 'rgba(239,68,68,0.1)'; errorDiv.style.border = '1px solid rgba(239,68,68,0.3)'; errorDiv.style.color = '#ef4444'; errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`; }
}

function showRegisterSuccess(message) {
    const errorDiv = document.getElementById('registerError');
    if (errorDiv) { errorDiv.style.display = 'block'; errorDiv.style.background = 'rgba(16,185,129,0.1)'; errorDiv.style.border = '1px solid rgba(16,185,129,0.3)'; errorDiv.style.color = '#10b981'; errorDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`; }
}

function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.global-toast');
    if (existingToast) existingToast.remove();
    const toast = document.createElement('div');
    toast.className = `global-toast toast-${type}`;
    toast.style.cssText = `position:fixed;top:100px;right:20px;padding:1rem 1.5rem;background:${type==='success'?'rgba(16,185,129,0.9)':type==='error'?'rgba(239,68,68,0.9)':'rgba(6,182,212,0.9)'};color:white;border-radius:12px;z-index:9999;display:flex;align-items:center;gap:10px;font-size:0.9rem;font-weight:500;box-shadow:0 4px 20px rgba(0,0,0,0.3);animation:slideInRight 0.3s ease;max-width:400px;`;
    toast.innerHTML = `<i class="fas fa-${type==='success'?'check-circle':type==='error'?'times-circle':'info-circle'}"></i><span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'slideOutRight 0.3s ease'; setTimeout(() => toast.remove(), 300); }, 3500);
}

// ==========================================
// BLOG DATA
// ==========================================
const blogData = {
    1: { title: 'Top 10 Hiking Trails in Patagonia', category: 'Adventure', author: 'Maria Santos', authorInitials: 'MS', date: 'May 5, 2026', gradient: 'gradient-1', icon: 'fa-hiking', likes: 342, comments: [{ name: 'Alex Rivera', initials: 'AR', text: 'Amazing guide! I did trail #4 last summer and it was breathtaking.', time: '2 hours ago' }, { name: 'Emma Watson', initials: 'EW', text: 'Adding these to my bucket list. Thanks for the detailed tips!', time: '5 hours ago' }], content: `<p>Patagonia is a dream destination for hikers and nature lovers...</p><h3>1. Torres del Paine W Circuit</h3><p>The iconic W Circuit in Chile's Torres del Paine National Park is a 5-day trek...</p>` },
    2: { title: 'Street Food Guide: Bangkok', category: 'Food & Culture', author: 'Chef Andrew', authorInitials: 'CA', date: 'May 3, 2026', gradient: 'gradient-2', icon: 'fa-utensils', likes: 289, comments: [{ name: 'Lisa Chen', initials: 'LC', text: 'Visited Bangkok last month and the street food scene is incredible!', time: '1 day ago' }], content: `<p>Bangkok is widely considered the street food capital of the world...</p>` },
    3: { title: 'Capturing the Northern Lights', category: 'Photography', author: 'James Wilson', authorInitials: 'JW', date: 'April 28, 2026', gradient: 'gradient-3', icon: 'fa-camera', likes: 427, comments: [{ name: 'Sophie Turner', initials: 'ST', text: 'Your camera settings guide was a lifesaver!', time: '3 days ago' }, { name: 'Mike Brown', initials: 'MB', text: 'Going to Iceland in December. Bookmarking this!', time: '5 days ago' }], content: `<p>Photographing the Aurora Borealis is a bucket-list experience...</p>` }
};

const likedBlogs = {};
const blogCommentCounts = {};

// ==========================================
// BLOG ARTICLE OVERLAY
// ==========================================
const blogArticleOverlay = document.getElementById('blogArticleOverlay');
const blogArticleContent = document.getElementById('blogArticleContent');
const closeBlogArticle = document.getElementById('closeBlogArticle');

function openBlogArticle(blogId) {
    const blog = blogData[blogId];
    if (!blog) return;
    const likes = likedBlogs[blogId] ? blog.likes + 1 : blog.likes;
    const commentCount = blogCommentCounts[blogId] || blog.comments.length;
    blogArticleContent.innerHTML = `<div class="article-header"><div class="article-category"><i class="fas fa-tag"></i> ${blog.category}</div><h2 class="article-title">${blog.title}</h2><div class="article-author-row"><div class="article-author-avatar">${blog.authorInitials}</div><div class="article-author-info"><strong>${blog.author}</strong><span>${blog.date}</span></div></div></div><div class="article-hero-image ${blog.gradient}"><i class="fas ${blog.icon}"></i></div><div class="article-body">${blog.content}</div><div class="article-actions"><button class="article-action-btn like-btn ${likedBlogs[blogId] ? 'liked' : ''}" data-blog-id="${blogId}"><i class="fas fa-heart"></i><span class="like-count">${likes}</span> Likes</button><button class="article-action-btn share-article-btn" data-blog-id="${blogId}"><i class="fas fa-share-alt"></i> Share</button><button class="article-action-btn" onclick="document.querySelector('.comment-input').focus()"><i class="fas fa-comment"></i><span class="comment-count-display">${commentCount}</span> Comments</button></div><div class="comments-section"><h3><i class="fas fa-comments"></i> Comments (<span class="comment-count-display">${commentCount}</span>)</h3><div class="comments-list" id="commentsList">${blog.comments.map(c => `<div class="comment-item"><div class="comment-avatar">${c.initials}</div><div class="comment-body"><strong>${c.name}</strong><p>${c.text}</p><small>${c.time}</small></div></div>`).join('')}</div><div class="comment-form"><input type="text" class="comment-input" placeholder="Write a comment..." data-blog-id="${blogId}"><button class="btn btn-primary btn-sm submit-comment" data-blog-id="${blogId}"><i class="fas fa-paper-plane"></i></button></div></div>`;
    blogArticleOverlay.classList.add('show');
    body.classList.add('no-scroll');
    attachBlogArticleListeners(blogId);
}

function attachBlogArticleListeners(blogId) {
    blogArticleContent.querySelector('.like-btn').addEventListener('click', () => toggleLike(blogId));
    blogArticleContent.querySelector('.share-article-btn').addEventListener('click', () => shareBlogArticle(blogData[blogId]));
    const submitBtn = blogArticleContent.querySelector('.submit-comment');
    const commentInput = blogArticleContent.querySelector('.comment-input');
    submitBtn.addEventListener('click', () => submitComment(blogId));
    commentInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') submitComment(blogId); });
}

function toggleLike(blogId) {
    const blog = blogData[blogId];
    const likeBtn = blogArticleContent.querySelector('.like-btn');
    const likeCountSpan = likeBtn.querySelector('.like-count');
    const blogCardLikeCount = document.querySelector(`.blog-card[data-blog-id="${blogId}"] .like-count`);
    if (likedBlogs[blogId]) { likedBlogs[blogId] = false; likeBtn.classList.remove('liked'); likeCountSpan.textContent = blog.likes; if (blogCardLikeCount) blogCardLikeCount.textContent = blog.likes; }
    else { likedBlogs[blogId] = true; likeBtn.classList.add('liked'); likeCountSpan.textContent = blog.likes + 1; if (blogCardLikeCount) blogCardLikeCount.textContent = blog.likes + 1; }
}

function shareBlogArticle(blog) {
    const shareData = { title: blog.title, text: `Check out "${blog.title}" by ${blog.author} on WanderCloud!`, url: window.location.href };
    if (navigator.share) { navigator.share(shareData).catch(console.error); }
    else { const tempInput = document.createElement('input'); tempInput.value = shareData.url; document.body.appendChild(tempInput); tempInput.select(); document.execCommand('copy'); document.body.removeChild(tempInput); alert('📋 Link copied to clipboard!'); }
}

function submitComment(blogId) {
    const commentInput = blogArticleContent.querySelector('.comment-input');
    const text = commentInput.value.trim();
    if (!text) return;
    if (!blogCommentCounts[blogId]) blogCommentCounts[blogId] = blogData[blogId].comments.length;
    blogCommentCounts[blogId]++;
    const commentsList = document.getElementById('commentsList');
    commentsList.insertAdjacentHTML('beforeend', `<div class="comment-item" style="animation:fadeIn 0.3s ease;"><div class="comment-avatar">YO</div><div class="comment-body"><strong>You</strong><p>${text}</p><small>Just now</small></div></div>`);
    commentInput.value = '';
    commentsList.scrollTop = commentsList.scrollHeight;
    const newCount = blogCommentCounts[blogId];
    document.querySelectorAll('.comment-count-display').forEach(el => el.textContent = newCount);
    const blogCardCommentCount = document.querySelector(`.blog-card[data-blog-id="${blogId}"] .comment-count`);
    if (blogCardCommentCount) blogCardCommentCount.textContent = newCount;
}

function closeBlogArticleOverlay() { blogArticleOverlay.classList.remove('show'); body.classList.remove('no-scroll'); blogArticleContent.innerHTML = ''; }
closeBlogArticle.addEventListener('click', closeBlogArticleOverlay);
blogArticleOverlay.addEventListener('click', (e) => { if (e.target === blogArticleOverlay) closeBlogArticleOverlay(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && blogArticleOverlay.classList.contains('show')) closeBlogArticleOverlay(); });

document.querySelectorAll('.read-more-btn').forEach(btn => { btn.addEventListener('click', (e) => { e.preventDefault(); openBlogArticle(parseInt(btn.getAttribute('data-blog-id'))); }); });
document.querySelectorAll('.blog-card').forEach(card => { card.addEventListener('click', (e) => { if (!e.target.closest('.read-more-btn')) openBlogArticle(parseInt(card.getAttribute('data-blog-id'))); }); });

// ==========================================
// COOKIE CONSENT
// ==========================================
const cookieBanner = document.getElementById('cookieBanner');
const acceptCookies = document.getElementById('acceptCookies');
const cookieSettings = document.getElementById('cookieSettings');
if (!localStorage.getItem('cookiesAccepted')) cookieBanner.style.display = 'flex';
acceptCookies.addEventListener('click', () => { localStorage.setItem('cookiesAccepted', 'true'); cookieBanner.style.opacity = '0'; setTimeout(() => cookieBanner.style.display = 'none', 300); });
cookieSettings.addEventListener('click', () => { alert('Cookie Settings: Essential cookies are always enabled.'); });

// ==========================================
// LIVE CHAT WIDGET
// ==========================================
const chatToggle = document.getElementById('chatToggle');
const chatPanel = document.getElementById('chatPanel');
const closeChat = document.getElementById('closeChat');
const chatInput = document.getElementById('chatInput');
const sendMessage = document.getElementById('sendMessage');
const chatMessages = document.getElementById('chatMessages');
chatToggle.addEventListener('click', () => { chatPanel.classList.toggle('open'); if (chatPanel.classList.contains('open')) chatToggle.querySelector('.chat-badge').style.display = 'none'; });
closeChat.addEventListener('click', () => chatPanel.classList.remove('open'));
function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    const userMsg = document.createElement('div'); userMsg.className = 'chat-msg user'; userMsg.innerHTML = `<div class="chat-msg-bubble">${message}</div>`;
    chatMessages.appendChild(userMsg); chatInput.value = ''; chatMessages.scrollTop = chatMessages.scrollHeight;
    setTimeout(() => {
        const responses = ["Thanks for your message! Let me check the best options for you. ✈️", "Great choice! We have some amazing deals for that destination. 🌴", "I'd be happy to help you plan your dream vacation! 🗺️"];
        const agentMsg = document.createElement('div'); agentMsg.className = 'chat-msg agent';
        agentMsg.innerHTML = `<div class="chat-msg-avatar gradient-2"><i class="fas fa-headset"></i></div><div class="chat-msg-bubble">${responses[Math.floor(Math.random()*responses.length)]}</div>`;
        chatMessages.appendChild(agentMsg); chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1500);
}
sendMessage.addEventListener('click', sendChatMessage);
chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendChatMessage(); });

// ==========================================
// QUICK ACTIONS - SCROLL TO TOP
// ==========================================
const scrollTopBtn = document.getElementById('scrollTopBtn');
scrollTopBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
window.addEventListener('scroll', () => { scrollTopBtn.style.opacity = window.scrollY > 500 ? '1' : '0'; scrollTopBtn.style.visibility = window.scrollY > 500 ? 'visible' : 'hidden'; });

// ==========================================
// SEARCH TABS
// ==========================================
document.querySelectorAll('.search-tab').forEach(tab => { tab.addEventListener('click', () => { document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active')); tab.classList.add('active'); }); });

// ==========================================
// SCROLL PROGRESS BAR
// ==========================================
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => { const scrollTop = document.documentElement.scrollTop || document.body.scrollTop; const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight; scrollProgress.style.width = (scrollTop / scrollHeight) * 100 + '%'; });

// ==========================================
// BOTTOM NAVIGATION
// ==========================================
const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
const sections = document.querySelectorAll('section[id]');
function updateActiveNav() {
    const scrollPosition = window.scrollY + 150;
    let currentSection = 'home';
    sections.forEach(section => { if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.clientHeight) currentSection = section.getAttribute('id'); });
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) currentSection = 'booking';
    bottomNavItems.forEach(item => { item.classList.remove('active'); if (item.getAttribute('data-section') === currentSection) item.classList.add('active'); });
}
window.addEventListener('scroll', updateActiveNav);
bottomNavItems.forEach(item => { item.addEventListener('click', function(e) { e.preventDefault(); const target = document.querySelector(this.getAttribute('href')); if (target) { window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' }); bottomNavItems.forEach(n => n.classList.remove('active')); this.classList.add('active'); } }); });
document.querySelectorAll('a[href^="#"]').forEach(anchor => { anchor.addEventListener('click', function(e) { const href = this.getAttribute('href'); if (href !== '#' && href !== '#!' && !href.startsWith('#/') && !this.hasAttribute('onclick')) { e.preventDefault(); const target = document.querySelector(href); if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' }); } }); });

// ==========================================
// PRICING TOGGLE
// ==========================================
const pricingToggle = document.getElementById('pricingToggle');
if (pricingToggle) { pricingToggle.addEventListener('change', () => { document.querySelectorAll('.amount[data-monthly]').forEach(amount => { amount.textContent = pricingToggle.checked ? amount.getAttribute('data-yearly') : amount.getAttribute('data-monthly'); }); document.querySelectorAll('.toggle-label').forEach(l => l.classList.toggle('active')); }); }

// ==========================================
// COUNTDOWN TIMER
// ==========================================
function startCountdowns() { document.querySelectorAll('.countdown').forEach(countdown => { const hours = parseInt(countdown.getAttribute('data-hours')) || 0; let totalSeconds = hours * 3600; const update = () => { if (totalSeconds <= 0) { countdown.textContent = 'Expired!'; countdown.style.color = '#ef4444'; return; } const h = Math.floor(totalSeconds / 3600); const m = Math.floor((totalSeconds % 3600) / 60); const s = totalSeconds % 60; countdown.textContent = `${h}h ${m}m ${s}s`; totalSeconds--; }; update(); setInterval(update, 1000); }); }

// ==========================================
// COUNTER ANIMATION
// ==========================================
const counterObserver = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.querySelectorAll('.counter-number').forEach(counter => { const target = parseInt(counter.getAttribute('data-target')); const step = target / (2000 / 16); let current = 0; const update = () => { current += step; if (current < target) { counter.textContent = Math.floor(current).toLocaleString(); requestAnimationFrame(update); } else counter.textContent = target.toLocaleString() + '+'; }; update(); }); counterObserver.unobserve(entry.target); } }); }, { threshold: 0.3 });
const counterSection = document.querySelector('.stats-counter');
if (counterSection) counterObserver.observe(counterSection);

// ==========================================
// FAQ ACCORDION
// ==========================================
document.querySelectorAll('.faq-item').forEach(item => { item.querySelector('.faq-question').addEventListener('click', () => { const isActive = item.classList.contains('active'); document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('active')); if (!isActive) item.classList.add('active'); }); });

// ==========================================
// NEWSLETTER FORM
// ==========================================
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) { newsletterForm.addEventListener('submit', (e) => { e.preventDefault(); const emailInput = newsletterForm.querySelector('input[type="email"]'); const submitBtn = newsletterForm.querySelector('button[type="submit"]'); const originalText = submitBtn.textContent; submitBtn.textContent = 'Subscribing...'; submitBtn.disabled = true; setTimeout(() => { submitBtn.textContent = '✓ Subscribed!'; submitBtn.style.background = '#10b981'; emailInput.value = ''; setTimeout(() => { submitBtn.textContent = originalText; submitBtn.style.background = ''; submitBtn.disabled = false; }, 3000); }, 1500); }); }

// ==========================================
// SCROLL REVEAL
// ==========================================
const revealObserver = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } }); }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.section-reveal').forEach(s => revealObserver.observe(s));

// ==========================================
// NAVBAR SHADOW
// ==========================================
window.addEventListener('scroll', () => { document.querySelector('.navbar').style.boxShadow = window.scrollY > 50 ? '0 4px 20px rgba(0, 0, 0, 0.3)' : 'none'; });

// ==========================================
// TOUCH EVENTS
// ==========================================
document.querySelectorAll('.bento-item, .feature-card, .testimonial-card, .pricing-card, .deal-card, .blog-card').forEach(card => { card.addEventListener('touchstart', function() { this.style.transform = 'scale(0.98)'; }, {passive: true}); card.addEventListener('touchend', function() { this.style.transform = ''; }, {passive: true}); });

// ==========================================
// INITIALIZATION
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    updateActiveNav();
    startCountdowns();
    body.classList.add('loaded');
    
    if (!checkUserAuth()) {
        // Setup button handlers for logged-out state
        const signInBtn = document.getElementById('signInBtn');
        const registerBtn = document.getElementById('registerBtn');
        const mobileSignInBtn = document.getElementById('mobileSignInBtn');
        const mobileRegisterBtn = document.getElementById('mobileRegisterBtn');
        if (signInBtn) signInBtn.onclick = (e) => { e.preventDefault(); showLoginModal(); };
        if (registerBtn) registerBtn.onclick = (e) => { e.preventDefault(); showRegisterModal(); };
        if (mobileSignInBtn) mobileSignInBtn.onclick = (e) => { e.preventDefault(); showLoginModal(); };
        if (mobileRegisterBtn) mobileRegisterBtn.onclick = (e) => { e.preventDefault(); showRegisterModal(); };
    }
    
    document.querySelectorAll('.footer-bottom p').forEach(p => { p.innerHTML = p.innerHTML.replace('2026', new Date().getFullYear()); });
    if (typeof flatpickr !== 'undefined') { flatpickr(".date-picker", { dateFormat: "M d, Y", theme: "dark", minDate: "today" }); }
    Object.keys(blogData).forEach(id => { blogCommentCounts[id] = blogData[id].comments.length; });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAuthModal();
            const profileModal = document.getElementById('profileModal');
            const bookingsModal = document.getElementById('bookingsModal');
            if (profileModal) { profileModal.remove(); document.body.classList.remove('no-scroll'); }
            if (bookingsModal) { bookingsModal.remove(); document.body.classList.remove('no-scroll'); }
        }
    });
});

console.log('%c🌍 Welcome to WanderCloud!', 'font-size: 20px; font-weight: bold; color: #06b6d4;');
console.log('%c👤 Register or Login to start your journey!', 'color: #8b5cf6;');