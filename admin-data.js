// ==========================================
// ADMIN DATA STORE
// ==========================================

// Admin Users Database (in production, this would be server-side)
const adminUsers = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@wandercloud.com',
        password: 'admin123', // In production, use hashed passwords
        name: 'Sarah Admin',
        role: 'Super Admin',
        initials: 'SA',
        permissions: ['all']
    },
    {
        id: 2,
        username: 'manager',
        email: 'manager@wandercloud.com',
        password: 'manager123',
        name: 'John Manager',
        role: 'Manager',
        initials: 'JM',
        permissions: ['bookings', 'users', 'reviews', 'blog']
    }
];

// Bookings Data
let bookingsData = [
    {
        id: 'WC-2026-001',
        customer: 'John Doe',
        email: 'john@email.com',
        destination: 'Bali, Indonesia',
        package: 'Adventurer',
        dates: 'Jun 15-23, 2026',
        amount: 1699,
        status: 'confirmed',
        travelers: 2,
        createdAt: '2026-05-10',
        phone: '+1 (555) 123-4567'
    },
    {
        id: 'WC-2026-002',
        customer: 'Maria Chen',
        email: 'maria@email.com',
        destination: 'Tokyo, Japan',
        package: 'Explorer',
        dates: 'Jun 18-23, 2026',
        amount: 1299,
        status: 'pending',
        travelers: 1,
        createdAt: '2026-05-08',
        phone: '+1 (555) 234-5678'
    },
    {
        id: 'WC-2026-003',
        customer: 'Robert Wilson',
        email: 'robert@email.com',
        destination: 'Santorini, Greece',
        package: 'Concierge',
        dates: 'Jun 20-26, 2026',
        amount: 2500,
        status: 'confirmed',
        travelers: 2,
        createdAt: '2026-05-07',
        phone: '+1 (555) 345-6789'
    },
    {
        id: 'WC-2026-004',
        customer: 'Emma Stone',
        email: 'emma@email.com',
        destination: 'Swiss Alps',
        package: 'Adventurer',
        dates: 'Jun 22-28, 2026',
        amount: 1499,
        status: 'cancelled',
        travelers: 4,
        createdAt: '2026-05-05',
        phone: '+1 (555) 456-7890'
    },
    {
        id: 'WC-2026-005',
        customer: 'David Brown',
        email: 'david@email.com',
        destination: 'Maldives',
        package: 'Concierge',
        dates: 'Jul 1-7, 2026',
        amount: 3200,
        status: 'confirmed',
        travelers: 2,
        createdAt: '2026-05-03',
        phone: '+1 (555) 567-8901'
    }
];

// Users Data
let usersData = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@email.com',
        role: 'Traveler',
        bookings: 12,
        status: 'active',
        joined: 'Jan 2026',
        initials: 'JD',
        phone: '+1 (555) 123-4567'
    },
    {
        id: 2,
        name: 'Maria Chen',
        email: 'maria@email.com',
        role: 'Traveler',
        bookings: 8,
        status: 'active',
        joined: 'Feb 2026',
        initials: 'MC',
        phone: '+1 (555) 234-5678'
    },
    {
        id: 3,
        name: 'Robert Wilson',
        email: 'robert@email.com',
        role: 'Premium',
        bookings: 5,
        status: 'active',
        joined: 'Mar 2026',
        initials: 'RW',
        phone: '+1 (555) 345-6789'
    },
    {
        id: 4,
        name: 'Emma Stone',
        email: 'emma@email.com',
        role: 'Traveler',
        bookings: 3,
        status: 'inactive',
        joined: 'Apr 2026',
        initials: 'ES',
        phone: '+1 (555) 456-7890'
    }
];

// Destinations Data
let destinationsData = [
    {
        id: 1,
        name: 'Bali, Indonesia',
        type: 'Tropical',
        properties: 2500,
        tours: 150,
        rating: 4.8,
        gradient: 'gradient-1',
        icon: 'fa-umbrella-beach',
        active: true
    },
    {
        id: 2,
        name: 'Swiss Alps',
        type: 'Mountain',
        properties: 1800,
        tours: 200,
        rating: 4.9,
        gradient: 'gradient-2',
        icon: 'fa-mountain',
        active: true
    },
    {
        id: 3,
        name: 'Tokyo, Japan',
        type: 'City',
        properties: 3200,
        tours: 180,
        rating: 4.7,
        gradient: 'gradient-3',
        icon: 'fa-city',
        active: true
    },
    {
        id: 4,
        name: 'Santorini, Greece',
        type: 'Island',
        properties: 1200,
        tours: 90,
        rating: 4.9,
        gradient: 'gradient-4',
        icon: 'fa-water',
        active: true
    }
];

// Packages Data
let packagesData = [
    {
        id: 1,
        name: 'Explorer',
        type: 'Basic',
        pricePerPerson: 899,
        groupPrice: 764,
        features: ['5-day itinerary', '3-star accommodations', 'Guided city tours', 'Travel insurance basic'],
        bookings: 450,
        active: true
    },
    {
        id: 2,
        name: 'Adventurer',
        type: 'Premium',
        pricePerPerson: 1499,
        groupPrice: 1274,
        features: ['Everything in Explorer', '4-star luxury stays', 'Custom itinerary design', 'Airport transfers', 'Premium travel insurance'],
        bookings: 820,
        active: true
    },
    {
        id: 3,
        name: 'Concierge',
        type: 'Luxury',
        pricePerPerson: 0, // Custom quote
        groupPrice: 0,
        features: ['Unlimited destinations', '5-star luxury resorts', 'Private jet & yacht options', 'Personal travel concierge', 'Exclusive experiences'],
        bookings: 125,
        active: true
    }
];

// Reviews Data
let reviewsData = [
    {
        id: 1,
        user: 'Emily & Robert Chen',
        initials: 'ER',
        destination: 'Honeymoon in Bali & Maldives',
        rating: 5,
        text: 'WanderCloud planned our entire honeymoon — flights, 5-star resorts, private tours. Saved us 40+ hours of research!',
        status: 'approved',
        date: '2026-04-15'
    },
    {
        id: 2,
        user: 'Maria Santos',
        initials: 'MC',
        destination: 'Solo Adventure, Southeast Asia',
        rating: 5,
        text: 'As a solo traveler, safety and local connections matter. WanderCloud connected me with amazing guides.',
        status: 'approved',
        date: '2026-04-10'
    },
    {
        id: 3,
        user: 'Sarah Johnson',
        initials: 'SA',
        destination: 'Corporate Retreat',
        rating: 5,
        text: 'Our corporate retreat planning used to take months. WanderCloud handled 200+ people across 4 destinations.',
        status: 'pending',
        date: '2026-04-05'
    }
];

// Blog Posts Data
let blogPostsData = [
    {
        id: 1,
        title: 'Top 10 Hiking Trails in Patagonia',
        author: 'Maria Santos',
        category: 'Adventure',
        likes: 342,
        comments: 56,
        status: 'published',
        date: '2026-05-05',
        gradient: 'gradient-1',
        icon: 'fa-hiking'
    },
    {
        id: 2,
        title: 'Street Food Guide: Bangkok',
        author: 'Chef Andrew',
        category: 'Food & Culture',
        likes: 289,
        comments: 43,
        status: 'published',
        date: '2026-05-03',
        gradient: 'gradient-2',
        icon: 'fa-utensils'
    },
    {
        id: 3,
        title: 'Capturing the Northern Lights',
        author: 'James Wilson',
        category: 'Photography',
        likes: 427,
        comments: 72,
        status: 'draft',
        date: '2026-04-28',
        gradient: 'gradient-3',
        icon: 'fa-camera'
    }
];

// Notifications Data
let notificationsData = [
    {
        id: 1,
        type: 'booking',
        message: 'New booking from John Doe - Bali, Indonesia',
        time: '5 minutes ago',
        read: false,
        icon: 'fa-calendar-check',
        color: 'gradient-1'
    },
    {
        id: 2,
        type: 'review',
        message: 'New 5-star review from Emily & Robert Chen',
        time: '1 hour ago',
        read: false,
        icon: 'fa-star',
        color: 'gradient-2'
    },
    {
        id: 3,
        type: 'user',
        message: 'New user registration: Maria Chen',
        time: '3 hours ago',
        read: true,
        icon: 'fa-user-plus',
        color: 'gradient-3'
    },
    {
        id: 4,
        type: 'system',
        message: 'System update completed successfully',
        time: '1 day ago',
        read: true,
        icon: 'fa-sync',
        color: 'gradient-4'
    }
];

// Analytics Data
const analyticsData = {
    revenue: {
        weekly: [25000, 32000, 28000, 35000, 42000, 38000, 45000],
        monthly: [120000, 135000, 148000, 162000, 175000, 190000],
        yearly: [1250000, 1380000, 1520000, 1680000, 1820000, 2100000]
    },
    bookings: {
        weekly: [145, 178, 165, 192, 210, 245, 228],
        monthly: [850, 920, 980, 1050, 1120, 1180]
    },
    destinations: {
        labels: ['Bali', 'Tokyo', 'Santorini', 'Swiss Alps', 'Maldives'],
        data: [35, 25, 20, 12, 8]
    },
    packages: {
        labels: ['Explorer', 'Adventurer', 'Concierge'],
        data: [30, 50, 20]
    },
    userGrowth: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [1200, 1850, 2400, 3100, 4200, 5234]
    }
};

// Statistics Data
let statisticsData = {
    totalRevenue: 847290,
    totalBookings: 2847,
    newUsers: 5234,
    avgRating: 4.8,
    revenueChange: 12.5,
    bookingsChange: 8.3,
    usersChange: 15.7,
    lastMonthRevenue: 753140,
    lastMonthBookings: 2628,
    lastMonthUsers: 4523
};

// Local Storage Management
function saveToLocalStorage() {
    const data = {
        bookings: bookingsData,
        users: usersData,
        destinations: destinationsData,
        packages: packagesData,
        reviews: reviewsData,
        blogPosts: blogPostsData,
        notifications: notificationsData,
        statistics: statisticsData
    };
    localStorage.setItem('wandercloud_admin_data', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('wandercloud_admin_data');
    if (saved) {
        const data = JSON.parse(saved);
        bookingsData = data.bookings || bookingsData;
        usersData = data.users || usersData;
        destinationsData = data.destinations || destinationsData;
        packagesData = data.packages || packagesData;
        reviewsData = data.reviews || reviewsData;
        blogPostsData = data.blogPosts || blogPostsData;
        notificationsData = data.notifications || notificationsData;
        statisticsData = data.statistics || statisticsData;
    }
}

// Generate unique ID
function generateId(prefix = 'WC') {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}-${timestamp}-${random}`;
}

// Update statistics
function updateStatistics() {
    statisticsData.totalBookings = bookingsData.length;
    statisticsData.totalRevenue = bookingsData
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.amount, 0);
    statisticsData.avgRating = reviewsData
        .filter(r => r.status === 'approved')
        .reduce((sum, r) => sum + r.rating, 0) / reviewsData.filter(r => r.status === 'approved').length || 0;
    statisticsData.newUsers = usersData.length;
    saveToLocalStorage();
}

// Initialize data
function initializeData() {
    loadFromLocalStorage();
    if (!localStorage.getItem('wandercloud_admin_data')) {
        saveToLocalStorage();
    }
    updateStatistics();
}

// Initialize on load
initializeData();