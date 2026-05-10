// ==========================================
// PAYMENT SYSTEM WITH THEME SUPPORT
// ==========================================

// Theme initialization - Read from localStorage (same as main site)
(function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');
        updateThemeIcon(savedTheme, themeIcon);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme, themeIcon);
        });
    }
})();

function updateThemeIcon(theme, icon) {
    if (!icon) return;
    icon.classList.remove('fa-sun', 'fa-moon');
    icon.classList.add(theme === 'dark' ? 'fa-moon' : 'fa-sun');
}

// Payment account details
const paymentAccounts = {
    cbe: {
        name: 'Commercial Bank of Ethiopia (CBE)',
        icon: '🏦',
        accountName: 'WanderCloud Travel PLC',
        accountNumber: '1000234567890',
        branch: 'Bole Branch, Addis Ababa',
        swiftCode: 'CBETETAA',
        instructions: 'Transfer the exact amount to the account above and keep the transaction reference number from your receipt.'
    },
    telebirr: {
        name: 'Telebirr',
        icon: '📱',
        accountName: 'WanderCloud Travel',
        accountNumber: '251912345678',
        merchantId: 'WCLOUD001',
        instructions: 'Send payment to the Telebirr account above. Save the confirmation SMS message for the reference number.'
    },
    ebirr: {
        name: 'E-Birr',
        icon: '💳',
        accountName: 'WanderCloud Travel PLC',
        accountNumber: 'EBR000123456',
        shortCode: '*808*123456#',
        instructions: 'Dial the short code or use the E-Birr mobile app to send payment. Keep the transaction confirmation.'
    }
};

let selectedMethod = null;
let bookingData = null;
let paymentTimer = null;
let timerSeconds = 1800; // 30 minutes

// Get booking data
function getBookingData() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('booking');
    
    if (bookingId) {
        const db = JSON.parse(localStorage.getItem('wandercloud_db') || '{}');
        const bookings = db.bookings || [];
        return bookings.find(b => b.id === bookingId);
    }
    
    const sessionBooking = sessionStorage.getItem('wandercloud_pending_booking');
    if (sessionBooking) {
        return JSON.parse(sessionBooking);
    }
    
    return null;
}

// Generate booking ID if none exists
function generateBookingId() {
    return 'WC-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Select payment method
function selectPaymentMethod(method) {
    selectedMethod = method;
    
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.classList.remove('selected');
        if (card.getAttribute('data-method') === method) {
            card.classList.add('selected');
        }
    });
    
    const continueBtn = document.getElementById('continueToPayment');
    if (continueBtn) {
        continueBtn.disabled = false;
        continueBtn.style.opacity = '1';
    }
    
    updateSteps(1);
}

// Step navigation
function goToStep1() {
    updateSteps(1);
    showStep(1);
}

function goToStep2() {
    if (!selectedMethod) {
        showNotification('Please select a payment method first.', 'warning');
        return;
    }
    
    updateSteps(2);
    showStep(2);
    displayAccountDetails();
    startTimer();
}

function goToStep3() {
    updateSteps(3);
    showStep(3);
}

function updateSteps(activeStep) {
    for (let i = 1; i <= 4; i++) {
        const step = document.getElementById(`step${i}`);
        if (step) {
            step.classList.remove('active', 'completed');
            if (i < activeStep) step.classList.add('completed');
            if (i === activeStep) step.classList.add('active');
        }
    }
}

function showStep(step) {
    for (let i = 1; i <= 4; i++) {
        const stepDiv = document.getElementById(`paymentStep${i}`);
        if (stepDiv) {
            stepDiv.style.display = i === step ? 'block' : 'none';
        }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Display account details
function displayAccountDetails() {
    const account = paymentAccounts[selectedMethod];
    if (!account) return;
    
    const accountDetails = document.getElementById('accountDetails');
    accountDetails.innerHTML = `
        <div style="text-align:center;margin-bottom:1.5rem;">
            <span style="font-size:3rem;">${account.icon}</span>
            <h3 style="margin-top:0.5rem;color:var(--text-primary);">${account.name}</h3>
        </div>
        <div class="account-detail-row">
            <strong>Account Name:</strong>
            <span>${account.accountName}</span>
        </div>
        <div class="account-detail-row">
            <strong>${selectedMethod === 'cbe' ? 'Account Number:' : selectedMethod === 'telebirr' ? 'Phone Number:' : 'Account Number:'}</strong>
            <span>
                ${account.accountNumber}
                <button class="copy-btn" onclick="copyToClipboard('${account.accountNumber}')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </span>
        </div>
        ${account.branch ? `
        <div class="account-detail-row">
            <strong>Branch:</strong>
            <span>${account.branch}</span>
        </div>` : ''}
        ${account.swiftCode ? `
        <div class="account-detail-row">
            <strong>SWIFT Code:</strong>
            <span>${account.swiftCode}</span>
        </div>` : ''}
        ${account.merchantId ? `
        <div class="account-detail-row">
            <strong>Merchant ID:</strong>
            <span>${account.merchantId}</span>
        </div>` : ''}
        ${account.shortCode ? `
        <div class="account-detail-row">
            <strong>Short Code:</strong>
            <span>${account.shortCode}</span>
        </div>` : ''}
        <div class="account-detail-row">
            <strong>Amount to Pay:</strong>
            <span style="font-size:1.2rem;font-weight:700;color:var(--primary);">$${bookingData?.amount?.toLocaleString() || 'N/A'}</span>
        </div>
        <div style="margin-top:1rem;padding:0.75rem;background:rgba(6,182,212,0.1);border-radius:8px;font-size:0.85rem;color:var(--text-secondary);">
            <i class="fas fa-info-circle"></i> ${account.instructions}
        </div>
    `;
}

// Timer
function startTimer() {
    clearInterval(paymentTimer);
    timerSeconds = 1800;
    updateTimerDisplay();
    
    paymentTimer = setInterval(() => {
        timerSeconds--;
        updateTimerDisplay();
        
        if (timerSeconds <= 0) {
            clearInterval(paymentTimer);
            showNotification('Payment time has expired. Please start a new booking.', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    const timerEl = document.getElementById('paymentTimer');
    if (timerEl) {
        timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        if (timerSeconds < 300) {
            timerEl.style.color = '#ef4444';
        } else {
            timerEl.style.color = '#f59e0b';
        }
    }
}

// Copy to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyNotification();
        }).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const input = document.createElement('input');
    input.value = text;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showCopyNotification();
}

function showCopyNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 12px 20px;
        background: #10b981;
        color: white;
        border-radius: 8px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        font-size: 0.9rem;
        font-weight: 500;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    notification.innerHTML = '<i class="fas fa-check-circle"></i> Copied to clipboard!';
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Submit payment
function submitPayment() {
    const transactionNumber = document.getElementById('transactionNumber').value.trim();
    const payerPhone = document.getElementById('payerPhone').value.trim();
    const paymentNotes = document.getElementById('paymentNotes').value.trim();
    
    if (!transactionNumber) {
        showNotification('Please enter the transaction/reference number.', 'warning');
        document.getElementById('transactionNumber').focus();
        return;
    }
    
    if (!bookingData) {
        bookingData = getBookingData();
    }
    
    if (!bookingData) {
        // Create booking if not exists
        bookingData = {
            id: generateBookingId(),
            customer: 'Guest User',
            email: 'guest@email.com',
            destination: 'TBD',
            package: 'Adventurer',
            dates: 'TBD',
            amount: 1499,
            status: 'pending',
            travelers: 1,
            createdAt: new Date().toISOString().split('T')[0]
        };
    }
    
    const db = JSON.parse(localStorage.getItem('wandercloud_db') || '{}');
    db.bookings = db.bookings || [];
    
    const existingIndex = db.bookings.findIndex(b => b.id === bookingData.id);
    
    const paymentInfo = {
        paymentMethod: selectedMethod,
        paymentDetails: {
            transactionNumber: transactionNumber,
            payerPhone: payerPhone,
            notes: paymentNotes,
            submittedAt: new Date().toISOString(),
            accountPaidTo: paymentAccounts[selectedMethod].accountNumber
        },
        paymentStatus: 'pending',
        status: 'pending'
    };
    
    if (existingIndex !== -1) {
        db.bookings[existingIndex] = { ...db.bookings[existingIndex], ...paymentInfo };
    } else {
        db.bookings.unshift({ ...bookingData, ...paymentInfo });
    }
    
    localStorage.setItem('wandercloud_db', JSON.stringify(db));
    
    // Add notification
    const notifications = db.notifications || [];
    notifications.unshift({
        id: Date.now(),
        type: 'payment',
        message: `New payment from ${bookingData.customer} - ${transactionNumber} (${selectedMethod.toUpperCase()})`,
        time: 'Just now',
        read: false,
        icon: 'fa-credit-card',
        color: 'gradient-1',
        bookingId: bookingData.id,
        transactionNumber: transactionNumber,
        paymentMethod: selectedMethod
    });
    db.notifications = notifications;
    localStorage.setItem('wandercloud_db', JSON.stringify(db));
    
    // Clear session
    sessionStorage.removeItem('wandercloud_pending_booking');
    
    // Stop timer
    clearInterval(paymentTimer);
    
    // Show confirmation
    updateSteps(4);
    showStep(4);
    
    displayPaymentStatus('pending', bookingData, transactionNumber);
}

// Display payment status
function displayPaymentStatus(status, booking, transactionNumber) {
    const statusDiv = document.getElementById('paymentStatus');
    
    if (status === 'approved') {
        statusDiv.innerHTML = `
            <div class="status-icon status-approved">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2 style="color:#10b981;">Payment Verified & Approved! 🎉</h2>
            <p style="color:var(--text-secondary);margin:1rem 0;">
                Your payment has been verified and your booking is confirmed!
            </p>
            <div class="booking-details-card glass-panel">
                <div class="confirmation-code">
                    <i class="fas fa-check-circle"></i> CONFIRMED: #${booking.id}
                </div>
                <p><strong>Customer:</strong> ${booking.customer}</p>
                <p><strong>Destination:</strong> ${booking.destination}</p>
                <p><strong>Package:</strong> ${booking.package}</p>
                <p><strong>Dates:</strong> ${booking.dates || 'TBD'}</p>
                <p><strong>Amount:</strong> $${booking.amount?.toLocaleString()}</p>
                <p><strong>Payment Method:</strong> ${booking.paymentMethod?.toUpperCase() || selectedMethod?.toUpperCase()}</p>
                <p><strong>Transaction Ref:</strong> ${booking.paymentDetails?.transactionNumber || transactionNumber}</p>
                <p><strong>Verified By:</strong> ${booking.paymentVerifiedBy || 'Admin'}</p>
                <p><strong>Status:</strong> <span class="status-badge confirmed" style="background:rgba(16,185,129,0.15);color:#10b981;padding:4px 12px;border-radius:12px;font-size:0.85rem;">Confirmed</span></p>
            </div>
        `;
    } else if (status === 'rejected') {
        statusDiv.innerHTML = `
            <div class="status-icon status-rejected">
                <i class="fas fa-times-circle"></i>
            </div>
            <h2 style="color:#ef4444;">Payment Rejected</h2>
            <p style="color:var(--text-secondary);margin:1rem 0;">
                Unfortunately, your payment could not be verified.
            </p>
            <div class="booking-details-card glass-panel">
                <p><strong>Booking ID:</strong> #${booking.id}</p>
                <p><strong>Transaction Ref:</strong> ${booking.paymentDetails?.transactionNumber || transactionNumber}</p>
                <p><strong>Status:</strong> <span style="color:#ef4444;font-weight:600;">Rejected</span></p>
                ${booking.rejectionReason ? `
                <div style="margin-top:1rem;padding:1rem;background:rgba(239,68,68,0.1);border-radius:8px;border:1px solid rgba(239,68,68,0.3);">
                    <strong style="color:#ef4444;">Reason for Rejection:</strong>
                    <p style="color:var(--text-secondary);margin-top:0.5rem;">${booking.rejectionReason}</p>
                </div>` : ''}
                ${booking.rejectedBy ? `<p style="margin-top:0.5rem;"><strong>Rejected By:</strong> ${booking.rejectedBy}</p>` : ''}
            </div>
            <button class="btn btn-primary" style="margin-top:1rem;" onclick="window.location.href='index.html#booking'">
                <i class="fas fa-redo"></i> Try Again with New Booking
            </button>
        `;
    } else {
        statusDiv.innerHTML = `
            <div class="status-icon status-pending">
                <i class="fas fa-clock"></i>
            </div>
            <h2 style="color:#f59e0b;">Payment Submitted for Verification</h2>
            <p style="color:var(--text-secondary);margin:1rem 0;">
                Your payment is being verified by our team. This usually takes 1-4 hours.
            </p>
            <div class="booking-details-card glass-panel">
                <p><strong>Booking ID:</strong> #${booking.id}</p>
                <p><strong>Customer:</strong> ${booking.customer}</p>
                <p><strong>Destination:</strong> ${booking.destination}</p>
                <p><strong>Package:</strong> ${booking.package}</p>
                <p><strong>Amount:</strong> $${booking.amount?.toLocaleString()}</p>
                <p><strong>Payment Method:</strong> ${booking.paymentMethod?.toUpperCase() || selectedMethod?.toUpperCase()}</p>
                <p><strong>Transaction Ref:</strong> ${booking.paymentDetails?.transactionNumber || transactionNumber}</p>
                <p><strong>Status:</strong> <span style="color:#f59e0b;font-weight:600;">Pending Verification</span></p>
            </div>
            <div style="margin-top:1.5rem;padding:1rem;background:rgba(245,158,11,0.1);border-radius:8px;">
                <p style="font-size:0.9rem;color:var(--text-secondary);">
                    <i class="fas fa-info-circle"></i> 
                    You can check your booking status anytime using your Booking ID: <strong style="color:var(--text-primary);">#${booking.id}</strong>
                </p>
            </div>
        `;
    }
}

// Check booking status
function checkBookingStatus() {
    if (!bookingData) {
        bookingData = getBookingData();
    }
    
    if (!bookingData) {
        showNotification('No booking found. Please make a new booking.', 'warning');
        return;
    }
    
    const db = JSON.parse(localStorage.getItem('wandercloud_db') || '{}');
    const bookings = db.bookings || [];
    const booking = bookings.find(b => b.id === bookingData.id);
    
    if (!booking) {
        showNotification('Booking not found in database.', 'error');
        return;
    }
    
    // Update bookingData with latest info
    bookingData = booking;
    
    if (booking.paymentStatus === 'approved') {
        displayPaymentStatus('approved', booking);
    } else if (booking.paymentStatus === 'rejected') {
        displayPaymentStatus('rejected', booking);
    } else {
        displayPaymentStatus('pending', booking);
    }
    
    updateSteps(4);
    showStep(4);
}

// Notification
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.payment-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'payment-notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'rgba(16,185,129,0.9)' : type === 'warning' ? 'rgba(245,158,11,0.9)' : type === 'error' ? 'rgba(239,68,68,0.9)' : 'rgba(6,182,212,0.9)'};
        color: white;
        border-radius: 12px;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.9rem;
        font-weight: 500;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ==========================================
// INITIALIZE
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    bookingData = getBookingData();
    
    if (!bookingData) {
        // Create demo booking for testing
        bookingData = {
            id: generateBookingId(),
            customer: 'Guest User',
            email: 'guest@email.com',
            destination: 'Bali, Indonesia',
            package: 'Adventurer',
            dates: 'TBD',
            amount: 1699,
            status: 'pending',
            travelers: 2,
            createdAt: new Date().toISOString().split('T')[0]
        };
        sessionStorage.setItem('wandercloud_pending_booking', JSON.stringify(bookingData));
    }
    
    // Display booking summary
    const summaryDiv = document.getElementById('bookingSummary');
    if (summaryDiv) {
        summaryDiv.innerHTML = `
            <h3 style="margin-bottom:1rem;color:var(--text-primary);">📋 Booking Summary</h3>
            <div class="summary-row"><span>Booking ID:</span><strong>#${bookingData.id}</strong></div>
            <div class="summary-row"><span>Customer:</span><span>${bookingData.customer}</span></div>
            <div class="summary-row"><span>Email:</span><span>${bookingData.email}</span></div>
            <div class="summary-row"><span>Destination:</span><span>${bookingData.destination}</span></div>
            <div class="summary-row"><span>Package:</span><span>${bookingData.package}</span></div>
            <div class="summary-row"><span>Dates:</span><span>${bookingData.dates || 'TBD'}</span></div>
            <div class="summary-row"><span>Travelers:</span><span>${bookingData.travelers || 1}</span></div>
            <div class="summary-row total"><span>Total Amount:</span><span>$${bookingData.amount?.toLocaleString()}</span></div>
        `;
    }
    
    // Check if returning to check status
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('status') === 'check') {
        updateSteps(4);
        showStep(4);
        checkBookingStatus();
    }
    
    // Add animation styles if not already present
    if (!document.getElementById('payment-animations')) {
        const style = document.createElement('style');
        style.id = 'payment-animations';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
});

// Save theme before leaving
window.addEventListener('beforeunload', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    localStorage.setItem('theme', currentTheme);
});