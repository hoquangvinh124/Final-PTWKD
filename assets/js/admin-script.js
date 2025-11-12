// ===== INITIALIZE USERS FROM JSON =====
async function initializeUsersForAdmin() {
    const existingUsers = localStorage.getItem('demo.users');
    
    if (!existingUsers) {
        console.log('⚠️ No demo.users found, loading from users.json...');
        try {
            const response = await fetch('users.json');
            if (response.ok) {
                const users = await response.json();
                localStorage.setItem('demo.users', JSON.stringify(users));
                console.log(`✅ Initialized ${users.length} users in demo.users`);
            }
        } catch (error) {
            console.error('Error loading users.json:', error);
        }
    } else {
        console.log('✅ demo.users already exists in localStorage');
    }
}

// ===== REFRESH DATA FROM LOCALSTORAGE =====
function refreshDashboardData() {
    console.log('🔄 Refreshing dashboard data...');
    
    // Refresh current page based on state
    switch(state.currentPage) {
        case 'dashboard':
            updateDashboardStats();
            populateOrdersTable();
            populateTopProducts();
            break;
        case 'orders':
            populateOrdersTableFull();
            break;
        case 'customers':
            populateCustomersTable();
            break;
        case 'products':
            populateProductsTable();
            break;
        case 'screenings':
            populateScreeningsTable();
            break;
    }
    
    // Update sidebar badges
    updateSidebarBadges();
    
    console.log('✅ Dashboard data refreshed');
}

// Auto-refresh every 30 seconds
let autoRefreshInterval;
function startAutoRefresh() {
    // Clear existing interval if any
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    // Refresh every 30 seconds
    autoRefreshInterval = setInterval(() => {
        refreshDashboardData();
        console.log('⏰ Auto-refresh triggered');
    }, 30000); // 30 seconds
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

// ===== GLOBAL STATE =====
const state = {
    sidebarActive: false,
    theme: 'dark',
    currentPage: 'dashboard',
    notifications: [],
    orders: [],
    products: [],
    customers: [],
    screenings: [],
    movies: [],
    productsLoaded: false,
    moviesLoaded: false
};

// ===== DOM ELEMENTS =====
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const notificationBtn = document.getElementById('notificationBtn');
const notificationDropdown = document.getElementById('notificationDropdown');
const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');
const logoutBtn = document.getElementById('logoutBtn');

// ===== MOCK DATA =====
const mockOrders = [
    { id: 'ORD001', customer: 'Nguyễn Văn A', product: 'Vinyl The Beatles - Abbey Road', quantity: 1, amount: 1250000, status: 'completed', date: '05/11/2025' },
    { id: 'ORD002', customer: 'Trần Thị B', product: 'Cassette Player Sony Walkman', quantity: 1, amount: 850000, status: 'pending', date: '05/11/2025' },
    { id: 'ORD003', customer: 'Lê Minh C', product: 'CD Pink Floyd - The Wall', quantity: 2, amount: 840000, status: 'completed', date: '04/11/2025' },
    { id: 'ORD004', customer: 'Phạm Anh D', product: 'VHS Star Wars Original', quantity: 1, amount: 680000, status: 'pending', date: '04/11/2025' },
    { id: 'ORD005', customer: 'Hoàng Thị E', product: 'Vinyl Queen - Greatest Hits', quantity: 1, amount: 1350000, status: 'cancelled', date: '03/11/2025' },
    { id: 'ORD006', customer: 'Đặng Văn F', product: 'Polaroid Camera Vintage', quantity: 1, amount: 2100000, status: 'completed', date: '03/11/2025' },
    { id: 'ORD007', customer: 'Vũ Thị G', product: 'Cassette The Weeknd', quantity: 3, amount: 450000, status: 'pending', date: '02/11/2025' },
    { id: 'ORD008', customer: 'Bùi Văn H', product: 'VHS Pulp Fiction', quantity: 2, amount: 680000, status: 'completed', date: '02/11/2025' },
];

const mockProducts = [
    {
        id: 1,
        name: 'Vinyl The Beatles - Abbey Road',
        category: 'Vinyl',
        price: 1250000,
        stock: 45,
        sold: 125,
        status: 'in-stock',
        image: 'assets/images/Audio/Vinyl/vinyl-1.jpeg'
    },
    {
        id: 2,
        name: 'Cassette Player Sony Walkman',
        category: 'Accessories',
        price: 850000,
        stock: 12,
        sold: 34,
        status: 'low-stock',
        image: 'assets/images/Accessories/Cassette Player/cassette-player-1.jpeg'
    },
    {
        id: 3,
        name: 'CD Pink Floyd - The Wall',
        category: 'CD',
        price: 420000,
        stock: 78,
        sold: 28,
        status: 'in-stock',
        image: 'assets/images/Audio/CD/cd-1.jpeg'
    },
    {
        id: 4,
        name: 'VHS Pulp Fiction',
        category: 'VHS',
        price: 340000,
        stock: 0,
        sold: 22,
        status: 'out-stock',
        image: 'assets/images/film VHS/vhs-1.jpeg'
    },
    {
        id: 5,
        name: 'Polaroid Camera SX-70',
        category: 'Camera',
        price: 2100000,
        stock: 8,
        sold: 18,
        status: 'low-stock',
        image: 'assets/images/Pola Camera/camera-1.jpeg'
    },
    {
        id: 6,
        name: 'Vinyl Queen - Greatest Hits',
        category: 'Vinyl',
        price: 1350000,
        stock: 32,
        sold: 95,
        status: 'in-stock',
        image: 'assets/images/Audio/Vinyl/vinyl-2.jpeg'
    },
    {
        id: 7,
        name: 'Cassette Michael Jackson - Thriller',
        category: 'Cassette',
        price: 180000,
        stock: 56,
        sold: 142,
        status: 'in-stock',
        image: 'assets/images/Audio/Cassette/cassette-1.jpeg'
    },
    {
        id: 8,
        name: 'VHS Star Wars Original Trilogy',
        category: 'VHS',
        price: 680000,
        stock: 15,
        sold: 43,
        status: 'in-stock',
        image: 'assets/images/film VHS/vhs-2.jpeg'
    },
];

// ===== UTILITY FUNCTIONS =====
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function formatCurrencyShort(amount) {
    if (amount >= 1000000000) {
        return (amount / 1000000000).toFixed(1) + 'B₫';
    } else if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + 'M₫';
    } else if (amount >= 1000) {
        return (amount / 1000).toFixed(0) + 'K₫';
    }
    return amount.toLocaleString('vi-VN') + '₫';
}

function animateValue(element, start, end, duration) {
    const isCurrency = element.classList.contains('currency');
    const isShort = element.classList.contains('currency-short');
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }

        if (isShort) {
            element.textContent = formatCurrencyShort(Math.floor(current));
        } else if (isCurrency) {
            element.textContent = formatCurrency(Math.floor(current));
        } else {
            element.textContent = Math.floor(current).toLocaleString('vi-VN');
        }
    }, 16);
}

// ===== LOAD PRODUCTS FROM JSON =====
async function loadProducts() {
    if (state.productsLoaded) {
        return state.products;
    }

    try {
        const response = await fetch('product.json');
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        
        const data = await response.json();
        
        // Transform product.json structure to admin format
        state.products = data.map((product, index) => {
            // Parse price (remove ₫ and . then convert to number)
            // "375.000₫" -> "375000" (already correct, no need to multiply)
            const priceStr = product.price.replace(/[.₫\s]/g, '');
            const price = parseFloat(priceStr);
            
            // Determine stock status
            let status = 'in-stock';
            if (product.stock_quantity === 0) {
                status = 'out-stock';
            } else if (product.stock_quantity < 20) {
                status = 'low-stock';
            }
            
            return {
                id: product.id || (index + 1),
                name: product.name,
                category: product.subcategory || product.category,
                price: price,
                stock: product.stock_quantity,
                sold: Math.floor(Math.random() * 100) + 10, // Random sold count
                status: status,
                image: product.image_front,
                description: product.description,
                available: product.is_available
            };
        });
        
        state.productsLoaded = true;
        console.log(`Loaded ${state.products.length} products from product.json`);
        return state.products;
        
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Failed to load product list', 'error');
        // Fallback to mock products if JSON fails
        state.products = mockProducts;
        state.productsLoaded = true;
        return state.products;
    }
}

// ===== PAGE NAVIGATION =====
function navigateToPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.style.display = 'none';
    });

    // Show selected page
    const selectedPage = document.getElementById(`${pageName}-page`);
    if (selectedPage) {
        selectedPage.style.display = 'block';
        state.currentPage = pageName;

        // Initialize page-specific content
        initializePage(pageName);
    }
}

function initializePage(pageName) {
    switch(pageName) {
        case 'dashboard':
            initDashboard();
            break;
        case 'products':
            loadProducts().then(() => {
                populateProductsTable();
            });
            break;
        case 'orders':
            populateOrdersTableFull();
            break;
        case 'customers':
            populateCustomersTable();
            break;
        case 'screenings':
            loadMovies().then(() => {
                populateScreeningsTable();
            });
            break;
        case 'analytics':
            initAnalyticsCharts();
            break;
        case 'reports':
            // Reports page is static
            break;
        case 'settings':
            // Settings page is static
            break;
    }
}

// ===== DASHBOARD FUNCTIONS =====
function initDashboard() {
    updateWelcomeMessage();
    updateDashboardStats();
    updateSidebarBadges();

    populateOrdersTable();
    
    // Load products first, then populate top products
    loadProducts().then(() => {
        populateTopProducts();
        updateSidebarBadges();
    });

    setTimeout(() => {
        initCharts();
    }, 500);
}

function updateSidebarBadges() {
    // Update badges in sidebar
    const productsBadge = document.getElementById('productsBadge');
    const ordersBadge = document.getElementById('ordersBadge');
    const customersBadge = document.getElementById('customersBadge');
    const moviesBadge = document.getElementById('moviesBadge');
    
    if (productsBadge) productsBadge.textContent = state.products.length;
    if (ordersBadge) ordersBadge.textContent = loadOrdersFromLocalStorage().length;
    if (customersBadge) customersBadge.textContent = loadCustomersFromLocalStorage().length;
    if (moviesBadge) moviesBadge.textContent = state.movies.length;
}

function updateDashboardStats() {
    // Get real data
    const customers = loadCustomersFromLocalStorage();
    const orders = loadOrdersFromLocalStorage();
    
    // Load products if not loaded
    if (!state.productsLoaded) {
        loadProducts().then(() => {
            updateStatsWithData(customers, orders);
        });
    } else {
        updateStatsWithData(customers, orders);
    }
}

function updateStatsWithData(customers, orders) {
    const products = state.products;
    
    // Calculate total revenue from orders
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    
    // Update stat cards
    setTimeout(() => {
        const stats = {
            orders: orders.length,
            revenue: totalRevenue,
            customers: customers.length,
            products: products.length
        };
        
        console.log('Dashboard Stats:', stats);
        
        // Animate values
        const ordersStat = document.querySelector('.stat-value[data-target="1247"]');
        if (ordersStat) {
            ordersStat.dataset.target = stats.orders;
            animateValue(ordersStat, 0, stats.orders, 2000);
        }
        
        const revenueStat = document.querySelector('.stat-value.currency-short[data-target="45820000"]');
        if (revenueStat) {
            revenueStat.dataset.target = stats.revenue;
            animateValue(revenueStat, 0, stats.revenue, 2000);
        }
        
        const customersStat = document.querySelector('.stat-value[data-target="892"]');
        if (customersStat) {
            customersStat.dataset.target = stats.customers;
            animateValue(customersStat, 0, stats.customers, 2000);
        }
        
        const productsStat = document.querySelector('.stat-value[data-target="142"]');
        if (productsStat) {
            productsStat.dataset.target = stats.products;
            animateValue(productsStat, 0, stats.products, 2000);
        }
    }, 300);
}

function updateWelcomeMessage() {
    const welcomeText = document.getElementById('welcomeText');
    if (!welcomeText) return;

    const hour = new Date().getHours();
    let greeting = 'Good morning';

    if (hour >= 12 && hour < 18) {
        greeting = 'Good afternoon';
    } else if (hour >= 18) {
        greeting = 'Good evening';
    }

    welcomeText.textContent = `${greeting}, Long!`;
}

function populateOrdersTable() {
    const tbody = document.querySelector('#ordersTable tbody');
    if (!tbody) return;

    const orders = loadOrdersFromLocalStorage();
    const recentOrders = orders.slice(0, 6);
    
    if (recentOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: #94a3b8;">No orders yet</td></tr>';
        return;
    }

    tbody.innerHTML = recentOrders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td><strong>${formatCurrency(order.amount)}</strong></td>
            <td><span class="status-badge ${order.status}">${
                order.status === 'completed' ? 'Completed' :
                order.status === 'pending' ? 'Processing' :
                'Cancelled'
            }</span></td>
            <td>${order.date}</td>
        </tr>
    `).join('');
}

function populateTopProducts() {
    const container = document.getElementById('topProductsList');
    if (!container) return;

    const topProducts = state.products.slice(0, 5).map((product, index) => ({
        rank: index + 1,
        ...product,
        sales: product.price * product.sold
    }));

    container.innerHTML = topProducts.map(product => `
        <div class="product-item">
            <div class="product-rank">${product.rank}</div>
            <img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.src='assets/images/logo.png'">
            <div class="product-info">
                <strong style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${product.name}</strong>
                <span>${product.category} • ${product.sold} đã bán</span>
            </div>
            <div class="product-sales">
                <strong>${formatCurrencyShort(product.sales)}</strong>
            </div>
        </div>
    `).join('');
}

function initCharts() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        return;
    }

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        const gradient = revenueCtx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(108, 143, 199, 0.4)');
        gradient.addColorStop(1, 'rgba(108, 143, 199, 0.05)');

        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['T6', 'T7', 'T8', 'T9', 'T10', 'T11'],
                datasets: [{
                    label: 'Doanh thu',
                    data: [32000000, 38000000, 35000000, 42000000, 39000000, 45820000],
                    borderColor: '#6c8fc7',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointBackgroundColor: '#6c8fc7',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 8,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        callbacks: {
                            label: (context) => formatCurrency(context.parsed.y)
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#94a3b8',
                            callback: (value) => formatCurrency(value)
                        },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // Category Chart
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Vinyl', 'CD', 'VHS', 'Cassette', 'Accessories'],
                datasets: [{
                    data: [35, 25, 20, 12, 8],
                    backgroundColor: ['#6c8fc7', '#8b7fc9', '#5b9bd5', '#4ade80', '#ff9966'],
                    borderWidth: 0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#cbd5e1', padding: 15 }
                    }
                },
                cutout: '70%'
            }
        });
    }
}

// ===== PRODUCTS PAGE =====
function populateProductsTable(filters = {}) {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    // Use state.products (loaded from JSON) instead of mockProducts
    let filteredProducts = [...state.products];

    // Apply filters
    if (filters.search) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(filters.search.toLowerCase())
        );
    }
    if (filters.category && filters.category !== 'all') {
        filteredProducts = filteredProducts.filter(p =>
            p.category.toLowerCase() === filters.category.toLowerCase()
        );
    }
    if (filters.stock && filters.stock !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.status === filters.stock);
    }

    tbody.innerHTML = filteredProducts.map(product => `
        <tr>
            <td><input type="checkbox" class="product-checkbox" data-id="${product.id}"></td>
            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);" onerror="this.src='assets/images/logo.png'">
                    <strong style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${product.name}</strong>
                </div>
            </td>
            <td>${product.category}</td>
            <td><strong>${formatCurrency(product.price)}</strong></td>
            <td>${product.stock}</td>
            <td>${product.sold}</td>
            <td>
                <span class="status-badge ${product.status}">
                    ${product.status === 'in-stock' ? 'In Stock' : product.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                </span>
            </td>
            <td>
                <button class="icon-btn" onclick="editProduct(${product.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="icon-btn" onclick="deleteProduct(${product.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function editProduct(id) {
    const product = state.products.find(p => p.id == id);
    if (product) {
        showNotification(`Editing product: ${product.name}`, 'info');
        // Here you would open a modal to edit the product
    }
}

function deleteProduct(id) {
    const product = state.products.find(p => p.id == id);
    if (product) {
        // Create custom confirm using notification
        const confirmed = window.confirm(`Are you sure you want to delete "${product.name}"?`);
        if (confirmed) {
            const index = state.products.findIndex(p => p.id == id);
            state.products.splice(index, 1);
            populateProductsTable();
            showNotification('Product deleted successfully!', 'success');
        }
    }
}

// ===== ORDERS PAGE =====
function loadOrdersFromLocalStorage() {
    const orders = [];
    
    console.log('=== Loading Orders from demo.users ===');
    
    try {
        // Load from demo.users instead of iterating through all keys
        const usersData = localStorage.getItem('demo.users');
        
        if (!usersData) {
            console.warn('⚠️ No demo.users found in localStorage');
            return orders;
        }

        const users = JSON.parse(usersData);
        
        if (!Array.isArray(users)) {
            console.warn('⚠️ demo.users is not an array');
            return orders;
        }

        console.log(`Found ${users.length} users in demo.users`);

        // Process each user's orders
        users.forEach(userData => {
            const customerName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username || 'Unknown';
            
            console.log('Checking orders for user:', customerName);
            
            // Get purchasedOrders from user
            if (userData.purchasedOrders && Array.isArray(userData.purchasedOrders)) {
                console.log('Found', userData.purchasedOrders.length, 'orders for', customerName);
                
                userData.purchasedOrders.forEach(order => {
                    // Get product names
                    const productNames = order.products?.map(p => p.name).join(', ') || 
                                       order.items?.map(item => item.name).join(', ') || 'N/A';
                    
                    // Get total quantity
                    const totalQty = order.products?.reduce((sum, p) => sum + (p.quantity || 0), 0) ||
                                   order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
                    
                    // Format date
                    let formattedDate = 'N/A';
                    if (order.orderDate) {
                        const dateObj = new Date(order.orderDate);
                        formattedDate = dateObj.toLocaleDateString('vi-VN');
                    } else if (order.date) {
                        const dateObj = new Date(order.date);
                        formattedDate = dateObj.toLocaleDateString('vi-VN');
                    }
                    
                    // Create order entry
                    orders.push({
                        id: order.orderId || `ORD${Date.now()}`,
                        customer: customerName,
                        product: productNames,
                        quantity: totalQty,
                        amount: order.total || 0,
                        status: order.status?.toLowerCase() || 'completed',
                        date: formattedDate,
                        userId: userData.username, // Use username as ID
                        rawDate: order.orderDate || order.date
                    });
                });
            }
        });

    } catch (error) {
        console.error('Error loading orders from demo.users:', error);
    }
    
    // Sort by date (newest first)
    orders.sort((a, b) => {
        if (a.rawDate && b.rawDate) {
            return new Date(b.rawDate) - new Date(a.rawDate);
        }
        return 0;
    });
    
    console.log('Total orders loaded:', orders.length);
    console.log('Orders:', orders);

    return orders;
}

function updateOrdersPageStats(orders) {
    const totalEl = document.getElementById('ordersTotal');
    const pendingEl = document.getElementById('ordersPending');
    const completedEl = document.getElementById('ordersCompleted');
    const cancelledEl = document.getElementById('ordersCancelled');
    
    if (!totalEl) return;
    
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending' || o.status === 'shipped').length,
        completed: orders.filter(o => o.status === 'completed' || o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
    };
    
    totalEl.textContent = stats.total;
    if (pendingEl) pendingEl.textContent = stats.pending;
    if (completedEl) completedEl.textContent = stats.completed;
    if (cancelledEl) cancelledEl.textContent = stats.cancelled;
}

function populateOrdersTableFull(filters = {}) {
    const tbody = document.getElementById('ordersTableFullBody');
    if (!tbody) return;

    let filteredOrders = loadOrdersFromLocalStorage();
    
    // Update Orders page stats
    updateOrdersPageStats(filteredOrders);

    // Apply filters
    if (filters.search) {
        filteredOrders = filteredOrders.filter(o =>
            o.id.toLowerCase().includes(filters.search.toLowerCase()) ||
            o.customer.toLowerCase().includes(filters.search.toLowerCase())
        );
    }
    if (filters.status && filters.status !== 'all') {
        filteredOrders = filteredOrders.filter(o => o.status === filters.status);
    }

    if (filteredOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem; color: #94a3b8;">No orders yet</td></tr>';
        return;
    }

    tbody.innerHTML = filteredOrders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td>${order.product}</td>
            <td>${order.quantity}</td>
            <td><strong>${formatCurrency(order.amount)}</strong></td>
            <td>
                <select class="status-select" onchange="updateOrderStatus('${order.id}', '${order.userId}', this.value)">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Processing</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td>${order.date}</td>
            <td>
                <button class="icon-btn" onclick="viewOrderDetail('${order.id}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="icon-btn" onclick="printOrder('${order.id}')" title="Print Invoice">
                    <i class="fas fa-print"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function updateOrderStatus(orderId, userId, newStatus) {
    try {
        // Load demo.users
        const usersData = localStorage.getItem('demo.users');
        if (!usersData) {
            showNotification('No demo.users found', 'error');
            return;
        }

        const users = JSON.parse(usersData);
        
        // Find user by username (userId)
        const userIndex = users.findIndex(u => u.username === userId);
        
        if (userIndex === -1) {
            showNotification('User not found', 'error');
            return;
        }

        // Find and update order
        if (users[userIndex].purchasedOrders) {
            const order = users[userIndex].purchasedOrders.find(o => o.orderId === orderId);
            if (order) {
                order.status = newStatus;
                
                // Save back to demo.users
                localStorage.setItem('demo.users', JSON.stringify(users));
                
                showNotification(`Order ${orderId} status updated`, 'success');
                
                // Refresh orders table
                populateOrdersTableFull();
            }
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        showNotification('Failed to update order status', 'error');
    }
}

function viewOrderDetail(orderId) {
    const orders = loadOrdersFromLocalStorage();
    const order = orders.find(o => o.id === orderId);
    if (order) {
        showNotification(`Viewing order ${orderId} details`, 'info');
        // Here you would open a modal with order details
    }
}

function printOrder(orderId) {
    showNotification(`Printing invoice ${orderId}...`, 'info');
}

// ===== CUSTOMERS PAGE =====

// Calculate member rank based on total spending
function calculateMemberRank(totalSpent) {
    if (totalSpent > 100000000) return 'vip';          // > 100M
    if (totalSpent > 50000000) return 'elite';          // 50M - 100M
    if (totalSpent > 20000000) return 'diamond';        // 20M - 50M
    if (totalSpent > 10000000) return 'platinum';       // 10M - 20M
    if (totalSpent > 5000000) return 'gold';            // 5M - 10M
    if (totalSpent > 1000000) return 'silver';          // 1M - 5M
    return 'bronze';                                     // 0 - 1M
}

// Get rank display name
function getRankDisplayName(rank) {
    const rankNames = {
        'bronze': 'Bronze',
        'silver': 'Silver',
        'gold': 'Gold',
        'platinum': 'Platinum',
        'diamond': 'Diamond',
        'elite': 'Elite',
        'vip': 'VIP'
    };
    return rankNames[rank] || 'Member';
}

// Load customers from localStorage
function loadCustomersFromLocalStorage() {
    const customers = [];
    
    console.log('=== Loading Customers from demo.users ===');

    try {
        // Load from demo.users instead of iterating through all keys
        const usersData = localStorage.getItem('demo.users');
        
        if (!usersData) {
            console.warn('⚠️ No demo.users found in localStorage');
            return customers;
        }

        const users = JSON.parse(usersData);
        
        if (!Array.isArray(users)) {
            console.warn('⚠️ demo.users is not an array');
            return customers;
        }

        console.log(`Found ${users.length} users in demo.users`);

        // Process each user
        users.forEach((userData, index) => {
            console.log(`Processing user ${index + 1}:`, userData.username);

            // Calculate total spent from purchasedOrders
            let totalSpent = 0;
            if (userData.purchasedOrders && Array.isArray(userData.purchasedOrders)) {
                totalSpent = userData.purchasedOrders.reduce((sum, order) => {
                    return sum + (order.total || 0);
                }, 0);
            }

            // Calculate rank
            const rank = calculateMemberRank(totalSpent);

            // Create customer object
            const customer = {
                id: userData.username, // Use username as unique ID
                name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username || 'Unknown',
                email: userData.email || 'N/A',
                phone: userData.shippingAddress?.phone || userData.phone || 'N/A',
                orders: userData.purchasedOrders?.length || 0,
                spent: totalSpent,
                rank: rank,
                avatar: userData.avatar || 'assets/images/default-avatar.jpg',
                joinDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('vi-VN') : 'N/A'
            };

            customers.push(customer);
            console.log('✅ Added customer:', customer.name, '- Rank:', rank);
        });

    } catch (error) {
        console.error('Error loading customers from demo.users:', error);
    }

    // Sort by spent (highest first)
    customers.sort((a, b) => b.spent - a.spent);
    
    console.log('Total customers loaded:', customers.length);
    console.log('Customers:', customers);

    return customers;
}

function updateCustomersPageStats(customers) {
    const totalEl = document.getElementById('customersTotal');
    const regularEl = document.getElementById('customersRegular');
    const vipEl = document.getElementById('customersVIP');
    
    if (!totalEl) return;
    
    const vipRanks = ['diamond', 'elite', 'vip', 'platinum', 'gold'];
    const stats = {
        total: customers.length,
        vip: customers.filter(c => vipRanks.includes(c.rank)).length,
        regular: customers.filter(c => !vipRanks.includes(c.rank)).length
    };
    
    totalEl.textContent = stats.total;
    if (regularEl) regularEl.textContent = stats.regular;
    if (vipEl) vipEl.textContent = stats.vip;
}

function updateScreeningsPageStats() {
    const screeningsTotalEl = document.getElementById('screeningsTotal');
    
    if (!screeningsTotalEl) return;
    
    // Update total screenings to match number of movies available
    const totalScreenings = state.movies ? state.movies.length : 0;
    screeningsTotalEl.textContent = totalScreenings;
    
    console.log('Screenings stats updated - Total:', totalScreenings);
}

function populateCustomersTable(filters = {}) {
    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;

    // Load customers from localStorage
    let filteredCustomers = loadCustomersFromLocalStorage();
    
    console.log('Total customers loaded:', filteredCustomers.length);
    
    // Update Customers page stats
    updateCustomersPageStats(filteredCustomers);

    // Apply filters
    if (filters.search) {
        filteredCustomers = filteredCustomers.filter(c =>
            c.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            c.email.toLowerCase().includes(filters.search.toLowerCase()) ||
            c.phone.includes(filters.search)
        );
    }
    if (filters.type && filters.type !== 'all') {
        filteredCustomers = filteredCustomers.filter(c => c.rank === filters.type);
    }

    if (filteredCustomers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem; color: #94a3b8;">No customers yet</td></tr>';
        return;
    }

    tbody.innerHTML = filteredCustomers.map(customer => `
        <tr>
            <td>
                <img src="${customer.avatar}" alt="${customer.name}" class="customer-avatar"
                     onerror="this.src='assets/images/default-avatar.jpg'">
            </td>
            <td><strong>${customer.name}</strong></td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.orders}</td>
            <td><strong>${formatCurrency(customer.spent)}</strong></td>
            <td>
                <span class="member-rank" data-rank="${customer.rank}">
                    ${getRankDisplayName(customer.rank)}
                </span>
            </td>
            <td>${customer.joinDate}</td>
            <td>
                <button class="icon-btn" onclick="viewCustomerDetail('${customer.id}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="icon-btn" onclick="editCustomer('${customer.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewCustomerDetail(id) {
    // Load from demo.users using username as id
    const usersData = localStorage.getItem('demo.users');
    if (usersData) {
        const users = JSON.parse(usersData);
        const user = users.find(u => u.username === id);
        
        if (user) {
            showNotification(`Viewing customer: ${user.firstName} ${user.lastName}`, 'info');
        }
    }
}

function editCustomer(id) {
    openCustomerModal(id);
}

// ===== SCREENINGS PAGE =====
function populateScreeningsTable(filters = {}) {
    const tbody = document.getElementById('screeningsTableBody');
    if (!tbody) return;

    // Use state.movies loaded from movies.json
    if (!state.movies || state.movies.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #94a3b8;">Loading movies...</td></tr>';
        return;
    }

    // Update screenings page stats
    updateScreeningsPageStats();

    let filteredMovies = [...state.movies];

    // Apply filters
    if (filters.search) {
        filteredMovies = filteredMovies.filter(m =>
            m.title.toLowerCase().includes(filters.search.toLowerCase())
        );
    }

    if (filteredMovies.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #94a3b8;">No movies found</td></tr>';
        return;
    }

    tbody.innerHTML = filteredMovies.map((movie, index) => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${movie.poster}" alt="${movie.title}" 
                         style="width: 50px; height: 70px; object-fit: cover; border-radius: 4px;"
                         onerror="this.src='assets/images/logo.png'">
                    <div>
                        <strong>${movie.title}</strong>
                        <div style="font-size: 12px; color: #94a3b8;">${movie.year} • ${movie.genre}</div>
                    </div>
                </div>
            </td>
            <td>${movie.director}</td>
            <td>${movie.duration} phút</td>
            <td>${movie.rating}</td>
            <td>
                <span class="status-badge pending">
                    On Air
                </span>
            </td>
            <td>
                <button class="icon-btn" onclick="viewMovieDetail(${movie.id})" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="icon-btn" onclick="editMovie(${movie.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="icon-btn" onclick="deleteMovie(${movie.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewMovieDetail(id) {
    const movie = state.movies.find(m => m.id === id);
    if (movie) {
        showNotification(`Viewing movie: ${movie.title}`, 'info');
    }
}

function editMovie(id) {
    openMovieModal(id);
}

function deleteMovie(id) {
    const movie = state.movies.find(m => m.id === id);
    if (movie) {
        const confirmed = window.confirm(`Are you sure you want to delete "${movie.title}"?`);
        if (confirmed) {
            const index = state.movies.findIndex(m => m.id === id);
            state.movies.splice(index, 1);
            populateScreeningsTable();
            showNotification('Movie deleted successfully!', 'success');
        }
    }
}

// ===== ANALYTICS PAGE =====
function initAnalyticsCharts() {
    if (typeof Chart === 'undefined') return;

    // Trend Chart
    const trendCtx = document.getElementById('trendChart');
    if (trendCtx && !Chart.getChart(trendCtx)) {
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
                datasets: [
                    {
                        label: 'Revenue',
                        data: [28000000, 32000000, 30000000, 38000000, 35000000, 42000000, 39000000, 45000000, 43000000, 48000000, 46000000, 52000000],
                        borderColor: '#6c8fc7',
                        backgroundColor: 'rgba(108, 143, 199, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Orders',
                        data: [85, 92, 88, 105, 98, 112, 108, 125, 118, 132, 128, 145],
                        borderColor: '#e8b86d',
                        backgroundColor: 'rgba(232, 184, 109, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'top', labels: { color: '#cbd5e1' } }
                },
                scales: {
                    y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
                    x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
                }
            }
        });
    }

    // Top Products Chart
    const topProductsCtx = document.getElementById('topProductsChart');
    if (topProductsCtx && !Chart.getChart(topProductsCtx)) {
        new Chart(topProductsCtx, {
            type: 'bar',
            data: {
                labels: state.products.slice(0, 5).map(p => p.name.substring(0, 20) + '...'),
                datasets: [{
                    label: 'Quantity Sold',
                    data: state.products.slice(0, 5).map(p => p.sold),
                    backgroundColor: ['#6c8fc7', '#8b7fc9', '#5b9bd5', '#4ade80', '#ff9966']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
                    x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
                }
            }
        });
    }

    // Region Chart
    const regionCtx = document.getElementById('regionChart');
    if (regionCtx && !Chart.getChart(regionCtx)) {
        new Chart(regionCtx, {
            type: 'pie',
            data: {
                labels: ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Can Tho', 'Others'],
                datasets: [{
                    data: [45, 25, 15, 10, 5],
                    backgroundColor: ['#6c8fc7', '#8b7fc9', '#5b9bd5', '#4ade80', '#ff9966']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#cbd5e1' } }
                }
            }
        });
    }
}

// ===== REPORTS FUNCTIONS =====
window.generateReport = function(type) {
    showNotification(`Generating ${type} report...`, 'info');

    setTimeout(() => {
        showNotification('Report downloaded successfully!', 'success');
    }, 2000);
}

// ===== EVENT LISTENERS =====

// Menu Toggle
menuToggle?.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    state.sidebarActive = !state.sidebarActive;
});

// Navigation Links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

        // Add active class to clicked link
        link.classList.add('active');

        const page = link.dataset.page;
        navigateToPage(page);

        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
        }
    });
});

// Notification Toggle
notificationBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationDropdown.classList.toggle('show');
});

// Close notification dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!notificationDropdown.contains(e.target) && e.target !== notificationBtn) {
        notificationDropdown.classList.remove('show');
    }
});

// Theme Toggle
themeToggle?.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    const icon = themeToggle.querySelector('i');

    if (state.theme === 'light') {
        icon.classList.replace('fa-moon', 'fa-sun');
        showNotification('Light mode is under development!', 'info');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
});

// Search
searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length >= 2) {
        console.log(`Searching for: ${query}`);
    }
});

// Logout
logoutBtn?.addEventListener('click', () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
        showNotification('Logging out...', 'info');
        setTimeout(() => {
            window.location.href = 'login-admin.html';
        }, 1500);
    }
});

// Mark all notifications as read
document.querySelector('.mark-all-read')?.addEventListener('click', () => {
    document.querySelectorAll('.notification-item.unread').forEach(item => {
        item.classList.remove('unread');
    });
    showNotification('All notifications marked as read', 'success');
});

// View All Orders Button
document.getElementById('viewAllOrders')?.addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector('[data-page="orders"]').classList.add('active');
    navigateToPage('orders');
});

// View All Products Button
document.getElementById('viewAllProducts')?.addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector('[data-page="products"]').classList.add('active');
    navigateToPage('products');
});

// Products Page Filters
document.getElementById('productSearch')?.addEventListener('input', (e) => {
    populateProductsTable({ search: e.target.value });
});

document.getElementById('categoryFilter')?.addEventListener('change', (e) => {
    populateProductsTable({ category: e.target.value });
});

document.getElementById('stockFilter')?.addEventListener('change', (e) => {
    populateProductsTable({ stock: e.target.value });
});

// Orders Page Filters
document.getElementById('orderSearch')?.addEventListener('input', (e) => {
    populateOrdersTableFull({ search: e.target.value });
});

document.getElementById('orderStatusFilter')?.addEventListener('change', (e) => {
    populateOrdersTableFull({ status: e.target.value });
});

document.getElementById('exportOrdersBtn')?.addEventListener('click', () => {
    // Change to refresh button functionality
    refreshDashboardData();
    showNotification('Data refreshed successfully!', 'success');
});

// Customers Page Filters
document.getElementById('customerSearch')?.addEventListener('input', (e) => {
    populateCustomersTable({ search: e.target.value });
});

document.getElementById('customerTypeFilter')?.addEventListener('change', (e) => {
    populateCustomersTable({ type: e.target.value });
});

// Screenings Page Filters
document.getElementById('screeningSearch')?.addEventListener('input', (e) => {
    populateScreeningsTable({ search: e.target.value });
});

document.getElementById('roomFilter')?.addEventListener('change', (e) => {
    populateScreeningsTable({ room: e.target.value });
});

// ===== ADD TOAST STYLES =====
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    .toast {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: var(--bg-card, #1e293b);
        border: 1px solid var(--border-color, #334155);
        border-radius: 12px;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        min-width: 300px;
    }

    .toast-success { border-left: 4px solid #4ade80; }
    .toast-info { border-left: 4px solid #6c8fc7; }
    .toast-error { border-left: 4px solid #ef4444; }

    .toast i { font-size: 20px; }
    .toast-success i { color: #4ade80; }
    .toast-info i { color: #6c8fc7; }
    .toast-error i { color: #ef4444; }

    .toast span {
        color: #f1f5f9;
        font-size: 14px;
        font-weight: 500;
    }

    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }

    .status-select {
        padding: 6px 12px;
        border-radius: 8px;
        border: 1px solid #334155;
        background: #1e293b;
        color: #f1f5f9;
        font-size: 14px;
    }

    .icon-btn {
        background: transparent;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        padding: 8px;
        border-radius: 6px;
        transition: all 0.2s;
    }

    .icon-btn:hover {
        background: #334155;
        color: #f1f5f9;
    }

    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .page-header h1 {
        font-size: 2rem;
        margin: 0;
        color: #f1f5f9;
    }

    .page-header p {
        color: #94a3b8;
        margin: 0.5rem 0 0 0;
    }

    .filters-bar {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
    }

    .search-filter {
        position: relative;
        flex: 1;
        min-width: 250px;
    }

    .search-filter i {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #94a3b8;
    }

    .search-filter input {
        width: 100%;
        padding: 10px 12px 10px 40px;
        border-radius: 8px;
        border: 1px solid #334155;
        background: #1e293b;
        color: #f1f5f9;
        font-size: 14px;
    }

    .filter-select {
        padding: 10px 12px;
        border-radius: 8px;
        border: 1px solid #334155;
        background: #1e293b;
        color: #f1f5f9;
        font-size: 14px;
    }

    .reports-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .report-card {
        background: var(--bg-card, #1e293b);
        border: 1px solid var(--border-color, #334155);
        border-radius: 12px;
        padding: 1.5rem;
        text-align: center;
    }

    .report-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
        font-size: 24px;
    }

    .report-icon.blue { background: rgba(108, 143, 199, 0.2); color: #6c8fc7; }
    .report-icon.green { background: rgba(74, 222, 128, 0.2); color: #4ade80; }
    .report-icon.purple { background: rgba(139, 127, 201, 0.2); color: #8b7fc9; }
    .report-icon.orange { background: rgba(255, 153, 102, 0.2); color: #ff9966; }
    .report-icon.red { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
    .report-icon.teal { background: rgba(20, 184, 166, 0.2); color: #14b8a6; }

    .report-card h3 {
        color: #f1f5f9;
        margin: 0 0 0.5rem 0;
    }

    .report-card p {
        color: #94a3b8;
        font-size: 14px;
        margin: 0 0 1rem 0;
    }

    .settings-container {
        display: grid;
        gap: 1.5rem;
    }

    .settings-card {
        background: var(--bg-card, #1e293b);
        border: 1px solid var(--border-color, #334155);
        border-radius: 12px;
        padding: 1.5rem;
    }

    .settings-card h3 {
        color: #f1f5f9;
        margin: 0 0 1.5rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .settings-form {
        display: grid;
        gap: 1rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .form-group label {
        color: #cbd5e1;
        font-size: 14px;
        font-weight: 500;
    }

    .form-control {
        padding: 10px 12px;
        border-radius: 8px;
        border: 1px solid #334155;
        background: #0f172a;
        color: #f1f5f9;
        font-size: 14px;
    }

    .switch-label {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
    }

    .switch-label input[type="checkbox"] {
        width: 20px;
        height: 20px;
        cursor: pointer;
    }

    .switch-label span {
        color: #cbd5e1;
        font-size: 14px;
    }

    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        padding: 1rem;
    }

    .metric-item {
        text-align: center;
    }

    .metric-label {
        color: #94a3b8;
        font-size: 14px;
        margin-bottom: 0.5rem;
    }

    .metric-value {
        color: #f1f5f9;
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 0.25rem;
    }

    .metric-change {
        font-size: 14px;
        font-weight: 600;
    }

    .metric-change.positive { color: #4ade80; }
    .metric-change.negative { color: #ef4444; }
`;
document.head.appendChild(toastStyles);

// ===== PRODUCT MODAL FUNCTIONS =====
let currentEditingProductId = null;

function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('productModalTitle');
    const form = document.getElementById('productForm');
    const previewImg = document.getElementById('productPreviewImg');
    const placeholder = document.querySelector('#productImagePreview .preview-placeholder');

    // Reset product image
    productImageBase64 = null;

    if (productId) {
        // Edit mode
        currentEditingProductId = productId;
        const product = state.products.find(p => p.id == productId);

        if (product) {
            modalTitle.textContent = 'Edit Product';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productDescription').value = product.description || '';

            // Load existing image
            if (product.image) {
                productImageBase64 = product.image;
                previewImg.src = product.image;
                previewImg.style.display = 'block';
                if (placeholder) placeholder.style.display = 'none';
            }
        }
    } else {
        // Add mode
        currentEditingProductId = null;
        modalTitle.textContent = 'Add New Product';
        form.reset();

        // Reset preview
        previewImg.style.display = 'none';
        previewImg.src = '';
        if (placeholder) placeholder.style.display = 'block';
    }

    modal.classList.add('show');
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('show');
    currentEditingProductId = null;
}

// Handle product form submission
document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate image
            if (!productImageBase64) {
                showNotification('Please select a product image', 'error');
                return;
            }

            const productData = {
                id: currentEditingProductId || Date.now().toString(),
                name: document.getElementById('productName').value,
                category: document.getElementById('productCategory').value,
                price: parseFloat(document.getElementById('productPrice').value),
                stock: parseInt(document.getElementById('productStock').value),
                image: productImageBase64,
                description: document.getElementById('productDescription').value,
                sold: 0
            };

            // Determine status
            if (productData.stock === 0) {
                productData.status = 'out-stock';
            } else if (productData.stock < 20) {
                productData.status = 'low-stock';
            } else {
                productData.status = 'in-stock';
            }

            if (currentEditingProductId) {
                // Update existing product
                const index = state.products.findIndex(p => p.id == currentEditingProductId);
                if (index !== -1) {
                    state.products[index] = { ...state.products[index], ...productData };
                    showNotification('Product updated successfully!', 'success');
                }
            } else {
                // Add new product
                state.products.unshift(productData);
                showNotification('New product added successfully!', 'success');
            }

            populateProductsTable();
            closeProductModal();
        });
    }

    // Product image file upload handler
    const productImageInput = document.getElementById('productImageFile');
    if (productImageInput) {
        productImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                convertImageToBase64(file, (base64) => {
                    productImageBase64 = base64;
                    const previewImg = document.getElementById('productPreviewImg');
                    const placeholder = document.querySelector('#productImagePreview .preview-placeholder');

                    previewImg.src = base64;
                    previewImg.style.display = 'block';
                    if (placeholder) placeholder.style.display = 'none';
                });
            }
        });
    }
});

// Update editProduct function
function editProduct(id) {
    openProductModal(id);
}

// Update Add New Product button
document.getElementById('addNewProductBtn')?.addEventListener('click', () => {
    openProductModal();
});

// ===== SCREENING MODAL FUNCTIONS =====
let currentEditingScreeningId = null;

// Load movies from movies.json
async function loadMovies() {
    if (state.moviesLoaded) {
        return state.movies;
    }
    
    try {
        const response = await fetch('movies.json');
        if (response.ok) {
            state.movies = await response.json();
            state.moviesLoaded = true;
            populateMovieDropdown();
            console.log(`Loaded ${state.movies.length} movies from movies.json`);
            return state.movies;
        }
    } catch (error) {
        console.error('Error loading movies:', error);
        state.movies = [];
    }
    return state.movies;
}

function populateMovieDropdown() {
    const select = document.getElementById('screeningMovie');
    if (select && state.movies.length > 0) {
        select.innerHTML = '<option value="">Select Movie</option>' +
            state.movies.map(movie => 
                `<option value="${movie.title}">${movie.title} (${movie.year})</option>`
            ).join('');
    }
}

function openScreeningModal(screeningId = null) {
    const modal = document.getElementById('screeningModal');
    const modalTitle = document.getElementById('screeningModalTitle');
    const form = document.getElementById('screeningForm');

    if (screeningId) {
        // Edit mode
        currentEditingScreeningId = screeningId;
        const screening = mockScreenings.find(s => s.id == screeningId);

        if (screening) {
            modalTitle.textContent = 'Edit Screening';
            document.getElementById('screeningId').value = screening.id;
            document.getElementById('screeningMovie').value = screening.movie.split(' (')[0]; // Get movie name without year
            document.getElementById('screeningStreamUrl').value = screening.streamUrl || '';

            // Parse datetime
            const [date, time] = screening.time.split(' ');
            const [day, month, year] = date.split('/');
            document.getElementById('screeningDate').value = `${year}-${month}-${day}`;
            document.getElementById('screeningTime').value = time;
            document.getElementById('screeningStatus').value = screening.status;
        }
    } else {
        // Add mode
        currentEditingScreeningId = null;
        modalTitle.textContent = 'Add New Screening';
        form.reset();
        // Set default date to today
        document.getElementById('screeningDate').value = new Date().toISOString().split('T')[0];
    }

    modal.classList.add('show');
}

function closeScreeningModal() {
    const modal = document.getElementById('screeningModal');
    modal.classList.remove('show');
    currentEditingScreeningId = null;
}

// Handle screening form submission
document.addEventListener('DOMContentLoaded', () => {
    const screeningForm = document.getElementById('screeningForm');
    if (screeningForm) {
        screeningForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const date = document.getElementById('screeningDate').value;
            const time = document.getElementById('screeningTime').value;
            const [year, month, day] = date.split('-');
            const formattedDateTime = `${day}/${month}/${year} ${time}`;

            const screeningData = {
                id: currentEditingScreeningId || mockScreenings.length + 1,
                movie: document.getElementById('screeningMovie').value,
                streamUrl: document.getElementById('screeningStreamUrl').value,
                time: formattedDateTime,
                booked: 0,
                watching: 0,
                status: document.getElementById('screeningStatus').value
            };

            if (currentEditingScreeningId) {
                // Update existing screening
                const index = mockScreenings.findIndex(s => s.id == currentEditingScreeningId);
                if (index !== -1) {
                    mockScreenings[index] = { ...mockScreenings[index], ...screeningData };
                    showNotification('Screening updated successfully!', 'success');
                }
            } else {
                // Add new screening
                mockScreenings.push(screeningData);
                showNotification('New screening added successfully!', 'success');
            }

            populateScreeningsTable();
            closeScreeningModal();
        });
    }

    // Load movies when page loads
    loadMovies();
});

// Update editScreening function
function editScreening(id) {
    openScreeningModal(id);
}

// Update Add Screening button
document.getElementById('addScreeningBtn')?.addEventListener('click', () => {
    openScreeningModal();
});

// ===== CUSTOMER MODAL FUNCTIONS =====
let currentEditingCustomerId = null;

function openCustomerModal(customerId = null) {
    const modal = document.getElementById('customerModal');
    const modalTitle = document.getElementById('customerModalTitle');
    const form = document.getElementById('customerForm');
    
    if (customerId) {
        // Edit mode
        currentEditingCustomerId = customerId;
        const customer = mockCustomers.find(c => c.id == customerId);
        
        if (customer) {
            modalTitle.textContent = 'Chỉnh sửa khách hàng';
            document.getElementById('customerId').value = customer.id;
            document.getElementById('customerName').value = customer.name;
            document.getElementById('customerEmail').value = customer.email;
            document.getElementById('customerPhone').value = customer.phone;
            document.getElementById('customerType').value = customer.type;
        }
    } else {
        // Add mode
        currentEditingCustomerId = null;
        modalTitle.textContent = 'Thêm khách hàng mới';
        form.reset();
        document.getElementById('customerType').value = 'new';
    }
    
    modal.classList.add('show');
}

function closeCustomerModal() {
    const modal = document.getElementById('customerModal');
    modal.classList.remove('show');
    currentEditingCustomerId = null;
}

// Handle customer form submission
document.addEventListener('DOMContentLoaded', () => {
    const customerForm = document.getElementById('customerForm');
    if (customerForm) {
        customerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const customerData = {
                id: currentEditingCustomerId || mockCustomers.length + 1,
                name: document.getElementById('customerName').value,
                email: document.getElementById('customerEmail').value,
                phone: document.getElementById('customerPhone').value,
                type: document.getElementById('customerType').value,
                orders: 0,
                spent: 0,
                joinDate: new Date().toLocaleDateString('vi-VN')
            };
            
            if (currentEditingCustomerId) {
                // Update existing customer
                const index = mockCustomers.findIndex(c => c.id == currentEditingCustomerId);
                if (index !== -1) {
                    mockCustomers[index] = { ...mockCustomers[index], ...customerData };
                    showNotification('Customer updated successfully!', 'success');
                }
            } else {
                // Add new customer
                mockCustomers.push(customerData);
                showNotification('New customer added successfully!', 'success');
            }
            
            populateCustomersTable();
            closeCustomerModal();
        });
    }
});

// Update editCustomer function
function editCustomer(id) {
    openCustomerModal(id);
}

// Update Add Customer button
document.getElementById('addCustomerBtn')?.addEventListener('click', () => {
    openCustomerModal();
});

// ===== IMAGE UPLOAD HELPERS =====
let moviePosterBase64 = null;
let productImageBase64 = null;

function convertImageToBase64(file, callback) {
    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
        showNotification('Image too large! Please select an image smaller than 2MB', 'error');
        return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        showNotification('Only image files are supported (JPG, PNG, WEBP)', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        callback(e.target.result);
    };
    reader.onerror = function() {
        showNotification('Error reading image file', 'error');
    };
    reader.readAsDataURL(file);
}

// ===== MOVIE MODAL FUNCTIONS =====
let currentEditingMovieId = null;

function openMovieModal(movieId = null) {
    const modal = document.getElementById('movieModal');
    const modalTitle = document.getElementById('movieModalTitle');
    const form = document.getElementById('movieForm');
    const previewImg = document.getElementById('moviePosterPreviewImg');
    const placeholder = document.querySelector('#moviePosterPreview .preview-placeholder');

    // Reset poster
    moviePosterBase64 = null;

    if (movieId) {
        // Edit mode
        currentEditingMovieId = movieId;
        const movie = state.movies.find(m => m.id == movieId);

        if (movie) {
            modalTitle.textContent = 'Chỉnh sửa phim';
            document.getElementById('movieId').value = movie.id;
            document.getElementById('movieTitle').value = movie.title;
            document.getElementById('movieYear').value = movie.year;
            document.getElementById('movieDirector').value = movie.director;
            document.getElementById('movieDuration').value = movie.duration;
            document.getElementById('movieGenre').value = movie.genre;
            document.getElementById('movieStreamUrl').value = movie.streamUrl || '';
            document.getElementById('movieDescription').value = movie.description || '';
            document.getElementById('movieRating').value = movie.rating || 7.0;

            // Load existing poster
            if (movie.poster) {
                moviePosterBase64 = movie.poster;
                previewImg.src = movie.poster;
                previewImg.style.display = 'block';
                if (placeholder) placeholder.style.display = 'none';
            }
        }
    } else {
        // Add mode
        currentEditingMovieId = null;
        modalTitle.textContent = 'Thêm phim mới';
        form.reset();
        document.getElementById('movieRating').value = 7.0;

        // Reset preview
        previewImg.style.display = 'none';
        previewImg.src = '';
        if (placeholder) placeholder.style.display = 'block';
    }

    modal.classList.add('show');
}

function closeMovieModal() {
    const modal = document.getElementById('movieModal');
    modal.classList.remove('show');
    currentEditingMovieId = null;
}

// Handle movie form submission
document.addEventListener('DOMContentLoaded', () => {
    const movieForm = document.getElementById('movieForm');
    if (movieForm) {
        movieForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate poster
            if (!moviePosterBase64) {
                showNotification('Please select a movie poster', 'error');
                return;
            }

            const movieData = {
                id: currentEditingMovieId || `movie_${Date.now()}`,
                title: document.getElementById('movieTitle').value,
                year: parseInt(document.getElementById('movieYear').value),
                director: document.getElementById('movieDirector').value,
                duration: parseInt(document.getElementById('movieDuration').value),
                genre: document.getElementById('movieGenre').value,
                poster: moviePosterBase64,
                streamUrl: document.getElementById('movieStreamUrl').value,
                description: document.getElementById('movieDescription').value,
                rating: parseFloat(document.getElementById('movieRating').value)
            };

            if (currentEditingMovieId) {
                // Update existing movie
                const index = state.movies.findIndex(m => m.id == currentEditingMovieId);
                if (index !== -1) {
                    state.movies[index] = { ...state.movies[index], ...movieData };
                    showNotification('Movie updated successfully!', 'success');
                }
            } else {
                // Add new movie
                state.movies.push(movieData);
                showNotification('New movie added successfully!', 'success');
            }

            populateMovieDropdown();
            closeMovieModal();
        });
    }

    // Movie poster file upload handler
    const moviePosterInput = document.getElementById('moviePosterFile');
    if (moviePosterInput) {
        moviePosterInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                convertImageToBase64(file, (base64) => {
                    moviePosterBase64 = base64;
                    const previewImg = document.getElementById('moviePosterPreviewImg');
                    const placeholder = document.querySelector('#moviePosterPreview .preview-placeholder');

                    previewImg.src = base64;
                    previewImg.style.display = 'block';
                    if (placeholder) placeholder.style.display = 'none';
                });
            }
        });
    }
});

// Add Movie button
document.getElementById('addMovieBtn')?.addEventListener('click', () => {
    openMovieModal();
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const productModal = document.getElementById('productModal');
    const screeningModal = document.getElementById('screeningModal');
    const customerModal = document.getElementById('customerModal');
    const movieModal = document.getElementById('movieModal');
    
    if (e.target === productModal) {
        closeProductModal();
    }
    if (e.target === screeningModal) {
        closeScreeningModal();
    }
    if (e.target === customerModal) {
        closeCustomerModal();
    }
    if (e.target === movieModal) {
        closeMovieModal();
    }
});

// ===== AI ANALYTICS FUNCTIONALITY =====

// AI Analytics State
const aiState = {
    conversationStarted: false,
    insights: {
        'revenue': {
            title: 'Revenue Analysis',
            content: `<strong>Revenue Trends Analysis (Last 30 Days)</strong>

Based on your sales data, here are the key insights:

<ul>
<li><strong>Total Revenue:</strong> 45,820,000 VND (+8.5% from previous period)</li>
<li><strong>Peak Day:</strong> Friday typically shows 35% higher revenue than weekdays</li>
<li><strong>Best Performing Category:</strong> Vinyl records account for 42% of total revenue</li>
<li><strong>Growth Rate:</strong> Steady 12% month-over-month growth</li>
<li><strong>Average Order Value:</strong> 1,250,000 VND (up 15% from last month)</li>
</ul>

<strong>Recommendations:</strong>
<ul>
<li>Focus marketing efforts on Thursday-Saturday for maximum impact</li>
<li>Consider bundle deals for vinyl products to increase AOV further</li>
<li>Stock up on popular vinyl titles before weekend rushes</li>
</ul>`,
        },
        'customer': {
            title: 'Customer Behavior Insights',
            content: `<strong>Customer Behavior Analysis</strong>

Your customer data reveals interesting patterns:

<ul>
<li><strong>Total Active Customers:</strong> 892 (15% growth this month)</li>
<li><strong>Customer Retention Rate:</strong> 68% - Good, but improvable</li>
<li><strong>VIP Customers:</strong> Generate 45% of total revenue while being only 12% of customer base</li>
<li><strong>Average Purchase Frequency:</strong> 2.3 times per month for regular customers</li>
<li><strong>Most Popular Product Type:</strong> Vintage vinyl from 70s-80s era</li>
</ul>

<strong>Key Findings:</strong>
<ul>
<li>Customers aged 25-35 are your primary demographic (58%)</li>
<li>Weekend shoppers spend 40% more on average</li>
<li>Customers who attend Retro Cine events are 3x more likely to make purchases</li>
</ul>

<strong>Action Items:</strong>
<ul>
<li>Create a loyalty program to improve retention from 68% to 75%</li>
<li>Host more Retro Cine events to drive engagement and sales</li>
<li>Send personalized recommendations based on past purchases</li>
</ul>`,
        },
        'product': {
            title: 'Product Performance Analysis',
            content: `<strong>Product Performance Overview</strong>

Detailed analysis of your product inventory:

<ul>
<li><strong>Total Products:</strong> 142 SKUs</li>
<li><strong>Top Performer:</strong> The Beatles - Abbey Road Vinyl (87 units sold)</li>
<li><strong>Underperforming:</strong> 23 products with less than 2 sales in 30 days</li>
<li><strong>Out of Stock:</strong> 6 products need immediate restocking</li>
<li><strong>Best Category:</strong> Vinyl (42% of revenue)</li>
</ul>

<strong>Sales by Category:</strong>
<ul>
<li>Vinyl: 42% of revenue</li>
<li>CD: 28% of revenue</li>
<li>Cameras: 15% of revenue</li>
<li>VHS: 10% of revenue</li>
<li>Accessories: 5% of revenue</li>
</ul>

<strong>Recommendations:</strong>
<ul>
<li>Discontinue or discount the 23 slow-moving products</li>
<li>Restock popular vinyl records immediately to prevent lost sales</li>
<li>Expand vinyl collection based on customer preferences</li>
<li>Bundle slow-moving items with bestsellers</li>
</ul>`,
        },
        'inventory': {
            title: 'Inventory & Stock Analysis',
            content: `<strong>Inventory Management Insights</strong>

Current inventory status and optimization opportunities:

<ul>
<li><strong>Total Inventory Value:</strong> 127,500,000 VND</li>
<li><strong>Low Stock Items:</strong> 18 products below safety threshold</li>
<li><strong>Overstock Items:</strong> 12 products with >6 months of supply</li>
<li><strong>Stock Turnover Rate:</strong> 4.2x per year (Industry avg: 3.8x)</li>
<li><strong>Out of Stock Rate:</strong> 2.4% (Target: <2%)</li>
</ul>

<strong>Critical Actions Needed:</strong>
<ul>
<li>Reorder immediately: Beatles vinyl, Pink Floyd vinyl, Polaroid cameras</li>
<li>Reduce orders: Generic cassettes, blank VHS tapes</li>
<li>Phase out: Outdated accessories with no sales in 90 days</li>
</ul>

<strong>Optimization Tips:</strong>
<ul>
<li>Implement just-in-time ordering for fast-moving vinyl</li>
<li>Create clearance bundles for overstock items</li>
<li>Set up automated reorder alerts at 20% stock level</li>
</ul>`,
        },
        'forecast': {
            title: 'Sales Forecast',
            content: `<strong>Sales Forecast - Next 30 Days</strong>

Based on historical data and current trends:

<ul>
<li><strong>Projected Revenue:</strong> 52,400,000 VND (+14% from this month)</li>
<li><strong>Expected Orders:</strong> 1,385 orders (avg: 46 orders/day)</li>
<li><strong>Peak Days:</strong> Weekends and paydays (1st, 15th of month)</li>
<li><strong>Confidence Level:</strong> 87% accuracy based on historical patterns</li>
</ul>

<strong>Growth Drivers:</strong>
<ul>
<li>Upcoming holidays and payday cycles</li>
<li>Successful email marketing campaigns</li>
<li>New vintage vinyl arrivals attracting collectors</li>
<li>Retro Cine events driving foot traffic</li>
</ul>

<strong>Risk Factors:</strong>
<ul>
<li>Stock shortages on popular items could limit growth</li>
<li>Competition from online marketplaces</li>
<li>Seasonal variations in customer spending</li>
</ul>

<strong>Strategic Actions:</strong>
<ul>
<li>Ensure adequate stock for forecasted demand</li>
<li>Prepare promotional campaigns for peak days</li>
<li>Staff accordingly for expected order volume</li>
</ul>`,
        },
        'retrocine': {
            title: 'Retro Cine Performance',
            content: `<strong>Retro Cine Screening Analysis</strong>

Performance metrics for your free movie screening program:

<ul>
<li><strong>Total Screenings:</strong> 24 events this month</li>
<li><strong>Total Bookings:</strong> 1,247 attendees</li>
<li><strong>Average Attendance:</strong> 52 people per screening (capacity: 75)</li>
<li><strong>Most Popular Genre:</strong> Classic Drama (78% full)</li>
<li><strong>Conversion to Sales:</strong> 34% of attendees make purchases</li>
</ul>

<strong>Top Performing Movies:</strong>
<ul>
<li>The Godfather (1972) - 72 attendees, 95% satisfaction</li>
<li>Casablanca (1942) - 68 attendees, 92% satisfaction</li>
<li>Breakfast at Tiffany's (1961) - 65 attendees, 89% satisfaction</li>
</ul>

<strong>Business Impact:</strong>
<ul>
<li>Events generate an average of 2,850,000 VND in product sales per screening</li>
<li>Customers who attend screenings spend 3x more than average</li>
<li>45% of event attendees become repeat customers</li>
</ul>

<strong>Recommendations:</strong>
<ul>
<li>Schedule more classic drama screenings (highest attendance)</li>
<li>Offer exclusive product bundles for event attendees</li>
<li>Create a movie club membership for regular attendees</li>
<li>Partner with local film societies for special events</li>
</ul>`,
        }
    }
};

// Initialize AI Analytics when page loads
function initAIAnalytics() {
    const aiChatInput = document.getElementById('aiChatInput');
    const aiSendBtn = document.getElementById('aiSendBtn');
    const suggestionCards = document.querySelectorAll('.ai-suggestion-card');

    // Handle suggestion card clicks
    suggestionCards.forEach(card => {
        card.addEventListener('click', () => {
            const prompt = card.getAttribute('data-prompt');
            handleAIMessage(prompt);
        });
    });

    // Handle send button click
    if (aiSendBtn) {
        aiSendBtn.addEventListener('click', () => {
            const message = aiChatInput.value.trim();
            if (message) {
                handleAIMessage(message);
                aiChatInput.value = '';
            }
        });
    }

    // Handle Enter key press
    if (aiChatInput) {
        aiChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const message = aiChatInput.value.trim();
                if (message) {
                    handleAIMessage(message);
                    aiChatInput.value = '';
                }
            }
        });
    }
}

// Handle AI message
function handleAIMessage(userMessage) {
    const messagesContainer = document.getElementById('aiChatMessages');

    // If first message, hide welcome and suggestions, enable scrolling
    if (!aiState.conversationStarted) {
        const welcomeMsg = messagesContainer.querySelector('.ai-welcome-message');
        const suggestions = messagesContainer.querySelector('.ai-suggestions');
        if (welcomeMsg) welcomeMsg.style.display = 'none';
        if (suggestions) suggestions.style.display = 'none';

        // Enable scrolling when chat starts
        messagesContainer.style.overflowY = 'auto';

        aiState.conversationStarted = true;
    }

    // Add user message
    addMessage('user', userMessage);

    // Show typing indicator
    showTypingIndicator();

    // Simulate AI response delay
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateAIResponse(userMessage);
        addMessage('assistant', response);

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1500);
}

// Add message to chat
function addMessage(type, content) {
    const messagesContainer = document.getElementById('aiChatMessages');

    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${type}`;

    const avatar = document.createElement('div');
    avatar.className = 'ai-message-avatar';
    avatar.innerHTML = type === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-brain"></i>';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'ai-message-content';
    contentDiv.innerHTML = content;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const messagesContainer = document.getElementById('aiChatMessages');

    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message assistant ai-typing-indicator';
    typingDiv.id = 'typingIndicator';

    typingDiv.innerHTML = `
        <div class="ai-message-avatar">
            <i class="fas fa-brain"></i>
        </div>
        <div class="ai-message-content">
            <div class="ai-typing-dots">
                <span class="ai-typing-dot"></span>
                <span class="ai-typing-dot"></span>
                <span class="ai-typing-dot"></span>
            </div>
        </div>
    `;

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// Generate AI response based on user input
function generateAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();

    // Detect intent from message
    if (lowerMessage.includes('revenue') || lowerMessage.includes('sales') || lowerMessage.includes('earning')) {
        return aiState.insights.revenue.content;
    } else if (lowerMessage.includes('customer') || lowerMessage.includes('behavior') || lowerMessage.includes('buyer')) {
        return aiState.insights.customer.content;
    } else if (lowerMessage.includes('product') || lowerMessage.includes('perform') || lowerMessage.includes('selling')) {
        return aiState.insights.product.content;
    } else if (lowerMessage.includes('inventory') || lowerMessage.includes('stock') || lowerMessage.includes('warehouse')) {
        return aiState.insights.inventory.content;
    } else if (lowerMessage.includes('forecast') || lowerMessage.includes('predict') || lowerMessage.includes('future')) {
        return aiState.insights.forecast.content;
    } else if (lowerMessage.includes('retro cine') || lowerMessage.includes('screening') || lowerMessage.includes('movie')) {
        return aiState.insights.retrocine.content;
    } else {
        // Default response with options
        return `<strong>I can help you with various analytics!</strong>

I specialize in analyzing your business data. Here are some areas I can help with:

<ul>
<li><strong>Revenue Analysis:</strong> Trends, growth patterns, and revenue optimization</li>
<li><strong>Customer Insights:</strong> Behavior patterns, retention, and demographics</li>
<li><strong>Product Performance:</strong> Best sellers, underperformers, and inventory turnover</li>
<li><strong>Inventory Management:</strong> Stock levels, reorder points, and optimization</li>
<li><strong>Sales Forecasting:</strong> Future projections and trend predictions</li>
<li><strong>Retro Cine Analytics:</strong> Screening performance and customer engagement</li>
</ul>

What would you like to know more about?`;
    }
}

// Initialize AI Analytics when on AI Analytics page
document.addEventListener('DOMContentLoaded', () => {
    initAIAnalytics();
});

// ===== START APP =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        // Initialize users first
        await initializeUsersForAdmin();
        
        // Then init dashboard
        initDashboard();
        
        // Start auto-refresh
        startAutoRefresh();
        
        setTimeout(() => {
            showNotification('Welcome back, Long! 🎉', 'success');
        }, 1000);
    });
} else {
    // Initialize users first, then dashboard
    initializeUsersForAdmin().then(() => {
        initDashboard();
        
        // Start auto-refresh
        startAutoRefresh();
        
        setTimeout(() => {
            showNotification('Welcome back, Long! 🎉', 'success');
        }, 1000);
    });
}

// ===== EXPOSE REFRESH FUNCTION TO GLOBAL SCOPE =====
// Admin can call refreshDashboard() from browser console to manually refresh
window.refreshDashboard = refreshDashboardData;

// Log info for admin
console.log('📊 Admin Dashboard loaded');
console.log('💡 Tip: Call refreshDashboard() in console to manually refresh data');
console.log('⏰ Auto-refresh: Every 30 seconds');

// ===== PAGINATION FOR PRODUCTS AND SCREENINGS =====
const paginationState = {
    products: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0,
        filteredData: []
    },
    screenings: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0,
        filteredData: []
    }
};

// Update populateProductsTable to support pagination
const originalPopulateProductsTable = populateProductsTable;
populateProductsTable = function(filters = {}) {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    // Use state.products (loaded from JSON) instead of mockProducts
    let filteredProducts = [...state.products];

    // Apply filters
    if (filters.search) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(filters.search.toLowerCase())
        );
    }
    if (filters.category && filters.category !== 'all') {
        filteredProducts = filteredProducts.filter(p =>
            p.category.toLowerCase() === filters.category.toLowerCase()
        );
    }
    if (filters.stock && filters.stock !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.status === filters.stock);
    }

    // Update pagination state
    paginationState.products.filteredData = filteredProducts;
    paginationState.products.totalItems = filteredProducts.length;
    paginationState.products.totalPages = Math.ceil(filteredProducts.length / paginationState.products.itemsPerPage);

    // Get paginated data
    const startIndex = (paginationState.products.currentPage - 1) * paginationState.products.itemsPerPage;
    const endIndex = startIndex + paginationState.products.itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Render table
    tbody.innerHTML = paginatedProducts.map(product => `
        <tr>
            <td><input type="checkbox" class="product-checkbox" data-id="${product.id}"></td>
            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);" onerror="this.src='assets/images/logo.png'">
                    <strong style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${product.name}</strong>
                </div>
            </td>
            <td>${product.category}</td>
            <td><strong>${formatCurrency(product.price)}</strong></td>
            <td>${product.stock}</td>
            <td>${product.sold}</td>
            <td>
                <span class="status-badge ${product.status}">
                    ${product.status === 'in-stock' ? 'Còn hàng' : product.status === 'low-stock' ? 'Sắp hết' : 'Hết hàng'}
                </span>
            </td>
            <td>
                <button class="icon-btn" onclick="editProduct(${product.id})" title="Sửa">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="icon-btn" onclick="deleteProduct(${product.id})" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    // Update pagination UI
    updateProductsPagination();
};

function updateProductsPagination() {
    const pagination = document.getElementById('productsPagination');
    const pageButtons = document.getElementById('productsPageButtons');
    
    if (!pagination || !pageButtons) return;

    const { currentPage, totalPages } = paginationState.products;

    // Show/hide pagination
    if (totalPages <= 1) {
        pagination.classList.remove('show');
        return;
    }
    pagination.classList.add('show');

    // Generate page buttons
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }

    let buttonsHTML = '';
    for (let i = startPage; i <= endPage; i++) {
        buttonsHTML += `
            <button class="page-btn ${i === currentPage ? 'is-active' : ''}" 
                    onclick="goToProductsPage(${i})">
                ${i}
            </button>
        `;
    }
    pageButtons.innerHTML = buttonsHTML;

    // Update control buttons
    document.getElementById('productsFirstPage').disabled = currentPage === 1;
    document.getElementById('productsPrevPage').disabled = currentPage === 1;
    document.getElementById('productsNextPage').disabled = currentPage === totalPages;
    document.getElementById('productsLastPage').disabled = currentPage === totalPages;
}

function goToProductsPage(page) {
    paginationState.products.currentPage = page;
    populateProductsTable();
    
    // Scroll to top of table
    const tableCard = document.querySelector('#products-page .table-card');
    if (tableCard) {
        tableCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Control button handlers for products
document.addEventListener('DOMContentLoaded', () => {
    const firstBtn = document.getElementById('productsFirstPage');
    const prevBtn = document.getElementById('productsPrevPage');
    const nextBtn = document.getElementById('productsNextPage');
    const lastBtn = document.getElementById('productsLastPage');

    if (firstBtn) firstBtn.addEventListener('click', () => goToProductsPage(1));
    if (prevBtn) prevBtn.addEventListener('click', () => {
        if (paginationState.products.currentPage > 1) {
            goToProductsPage(paginationState.products.currentPage - 1);
        }
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
        if (paginationState.products.currentPage < paginationState.products.totalPages) {
            goToProductsPage(paginationState.products.currentPage + 1);
        }
    });
    if (lastBtn) lastBtn.addEventListener('click', () => {
        goToProductsPage(paginationState.products.totalPages);
    });
});

// Update populateScreeningsTable to support pagination
const originalPopulateScreeningsTable = populateScreeningsTable;
populateScreeningsTable = function(filters = {}) {
    const tbody = document.getElementById('screeningsTableBody');
    if (!tbody) return;

    let filteredMovies = [...state.movies];

    // Apply filters
    if (filters.search) {
        filteredMovies = filteredMovies.filter(m =>
            m.title.toLowerCase().includes(filters.search.toLowerCase())
        );
    }
    if (filters.room && filters.room !== 'all') {
        // Room filter logic if needed
    }

    // Update pagination state
    paginationState.screenings.filteredData = filteredMovies;
    paginationState.screenings.totalItems = filteredMovies.length;
    paginationState.screenings.totalPages = Math.ceil(filteredMovies.length / paginationState.screenings.itemsPerPage);

    // Get paginated data
    const startIndex = (paginationState.screenings.currentPage - 1) * paginationState.screenings.itemsPerPage;
    const endIndex = startIndex + paginationState.screenings.itemsPerPage;
    const paginatedMovies = filteredMovies.slice(startIndex, endIndex);

    // Render table
    tbody.innerHTML = paginatedMovies.map(movie => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${movie.posterUrl}" alt="${movie.title}" 
                         style="width: 50px; height: 70px; object-fit: cover; border-radius: 6px;"
                         onerror="this.src='assets/images/logo.png'">
                    <div>
                        <strong style="display: block; margin-bottom: 4px;">${movie.title}</strong>
                        <span style="color: rgba(255,255,255,0.6); font-size: 0.9em;">${movie.year}</span>
                    </div>
                </div>
            </td>
            <td>${movie.director}</td>
            <td>${movie.duration} phút</td>
            <td>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <i class="fas fa-star" style="color: #ffc107;"></i>
                    <span>${movie.rating}/10</span>
                </div>
            </td>
            <td>
                <span class="status-badge ${movie.status || 'in-stock'}">
                    ${movie.status === 'playing' ? 'Đang chiếu' : movie.status === 'scheduled' ? 'Sắp chiếu' : 'Kết thúc'}
                </span>
            </td>
            <td>
                <button class="icon-btn" onclick="viewMovie(${movie.id})" title="Xem">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="icon-btn" onclick="editMovie(${movie.id})" title="Sửa">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="icon-btn" onclick="deleteMovie(${movie.id})" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    // Update pagination UI
    updateScreeningsPagination();
};

function updateScreeningsPagination() {
    const pagination = document.getElementById('screeningsPagination');
    const pageButtons = document.getElementById('screeningsPageButtons');
    
    if (!pagination || !pageButtons) return;

    const { currentPage, totalPages } = paginationState.screenings;

    // Show/hide pagination
    if (totalPages <= 1) {
        pagination.classList.remove('show');
        return;
    }
    pagination.classList.add('show');

    // Generate page buttons
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }

    let buttonsHTML = '';
    for (let i = startPage; i <= endPage; i++) {
        buttonsHTML += `
            <button class="page-btn ${i === currentPage ? 'is-active' : ''}" 
                    onclick="goToScreeningsPage(${i})">
                ${i}
            </button>
        `;
    }
    pageButtons.innerHTML = buttonsHTML;

    // Update control buttons
    document.getElementById('screeningsFirstPage').disabled = currentPage === 1;
    document.getElementById('screeningsPrevPage').disabled = currentPage === 1;
    document.getElementById('screeningsNextPage').disabled = currentPage === totalPages;
    document.getElementById('screeningsLastPage').disabled = currentPage === totalPages;
}

function goToScreeningsPage(page) {
    paginationState.screenings.currentPage = page;
    populateScreeningsTable();
    
    // Scroll to top of table
    const tableCard = document.querySelector('#screenings-page .table-card');
    if (tableCard) {
        tableCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Control button handlers for screenings
document.addEventListener('DOMContentLoaded', () => {
    const firstBtn = document.getElementById('screeningsFirstPage');
    const prevBtn = document.getElementById('screeningsPrevPage');
    const nextBtn = document.getElementById('screeningsNextPage');
    const lastBtn = document.getElementById('screeningsLastPage');

    if (firstBtn) firstBtn.addEventListener('click', () => goToScreeningsPage(1));
    if (prevBtn) prevBtn.addEventListener('click', () => {
        if (paginationState.screenings.currentPage > 1) {
            goToScreeningsPage(paginationState.screenings.currentPage - 1);
        }
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
        if (paginationState.screenings.currentPage < paginationState.screenings.totalPages) {
            goToScreeningsPage(paginationState.screenings.currentPage + 1);
        }
    });
    if (lastBtn) lastBtn.addEventListener('click', () => {
        goToScreeningsPage(paginationState.screenings.totalPages);
    });
});
