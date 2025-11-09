// ===== GLOBAL STATE =====
const state = {
    sidebarActive: false,
    theme: 'dark',
    currentPage: 'dashboard',
    notifications: [],
    orders: [],
    products: [],
    customers: [],
    screenings: []
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

const mockCustomers = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: '0901234567', orders: 15, spent: 18750000, type: 'vip', joinDate: '15/01/2024' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', phone: '0912345678', orders: 8, spent: 6800000, type: 'regular', joinDate: '20/03/2024' },
    { id: 3, name: 'Lê Minh C', email: 'leminhc@email.com', phone: '0923456789', orders: 22, spent: 27500000, type: 'vip', joinDate: '10/12/2023' },
    { id: 4, name: 'Phạm Anh D', email: 'phamanhd@email.com', phone: '0934567890', orders: 3, spent: 2040000, type: 'new', joinDate: '05/10/2025' },
    { id: 5, name: 'Hoàng Thị E', email: 'hoangthie@email.com', phone: '0945678901', orders: 12, spent: 16200000, type: 'vip', joinDate: '22/06/2024' },
    { id: 6, name: 'Đặng Văn F', email: 'dangvanf@email.com', phone: '0956789012', orders: 5, spent: 10500000, type: 'regular', joinDate: '18/08/2024' },
];

const mockScreenings = [
    { id: 1, movie: 'The Godfather (1972)', room: 'Phòng 1', time: '08/11/2025 19:00', booked: 75, watching: 12, status: 'playing' },
    { id: 2, movie: 'Pulp Fiction (1994)', room: 'Phòng 2', time: '08/11/2025 20:30', booked: 60, watching: 8, status: 'scheduled' },
    { id: 3, movie: 'Casablanca (1942)', room: 'Phòng 1', time: '09/11/2025 18:00', booked: 85, watching: 0, status: 'scheduled' },
    { id: 4, movie: 'Star Wars (1977)', room: 'Phòng 3', time: '09/11/2025 19:30', booked: 120, watching: 45, status: 'playing' },
    { id: 5, movie: 'Back to the Future (1985)', room: 'Phòng 2', time: '10/11/2025 17:00', booked: 20, watching: 0, status: 'scheduled' },
    { id: 6, movie: 'The Shawshank Redemption (1994)', room: 'Phòng 1', time: '10/11/2025 21:00', booked: 95, watching: 24, status: 'playing' },
];

// ===== UTILITY FUNCTIONS =====
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function animateValue(element, start, end, duration) {
    const isCurrency = element.classList.contains('currency');
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }

        if (isCurrency) {
            element.textContent = formatCurrency(Math.floor(current));
        } else {
            element.textContent = Math.floor(current).toLocaleString('vi-VN');
        }
    }, 16);
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease forwards';
    }, 10);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
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
            populateProductsTable();
            break;
        case 'orders':
            populateOrdersTableFull();
            break;
        case 'customers':
            populateCustomersTable();
            break;
        case 'screenings':
            populateScreeningsTable();
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

    setTimeout(() => {
        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            if (target) {
                animateValue(stat, 0, target, 2000);
            }
        });
    }, 300);

    populateOrdersTable();
    populateTopProducts();

    setTimeout(() => {
        initCharts();
    }, 500);
}

function updateWelcomeMessage() {
    const welcomeText = document.getElementById('welcomeText');
    if (!welcomeText) return;

    const hour = new Date().getHours();
    let greeting = 'Chào buổi sáng';

    if (hour >= 12 && hour < 18) {
        greeting = 'Chào buổi chiều';
    } else if (hour >= 18) {
        greeting = 'Chào buổi tối';
    }

    welcomeText.textContent = `${greeting}, Long! 👋`;
}

function populateOrdersTable() {
    const tbody = document.querySelector('#ordersTable tbody');
    if (!tbody) return;

    tbody.innerHTML = mockOrders.slice(0, 6).map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td>${order.product}</td>
            <td><strong>${formatCurrency(order.amount)}</strong></td>
            <td><span class="status-badge ${order.status}">${
                order.status === 'completed' ? 'Hoàn thành' :
                order.status === 'pending' ? 'Đang xử lý' :
                'Đã hủy'
            }</span></td>
            <td>${order.date}</td>
        </tr>
    `).join('');
}

function populateTopProducts() {
    const container = document.getElementById('topProductsList');
    if (!container) return;

    const topProducts = mockProducts.slice(0, 5).map((product, index) => ({
        rank: index + 1,
        ...product,
        sales: product.price * product.sold
    }));

    container.innerHTML = topProducts.map(product => `
        <div class="product-item">
            <div class="product-rank">${product.rank}</div>
            <img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.src='assets/images/logo.png'">
            <div class="product-info">
                <strong>${product.name}</strong>
                <span>${product.category} • ${product.sold} đã bán</span>
            </div>
            <div class="product-sales">
                <strong>${formatCurrency(product.sales)}</strong>
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

    let filteredProducts = [...mockProducts];

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
                    <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" onerror="this.src='assets/images/logo.png'">
                    <strong>${product.name}</strong>
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
}

function editProduct(id) {
    const product = mockProducts.find(p => p.id === id);
    if (product) {
        showToast(`Đang chỉnh sửa sản phẩm: ${product.name}`, 'info');
        // Here you would open a modal to edit the product
    }
}

function deleteProduct(id) {
    const product = mockProducts.find(p => p.id === id);
    if (product && confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
        const index = mockProducts.findIndex(p => p.id === id);
        mockProducts.splice(index, 1);
        populateProductsTable();
        showToast('Đã xóa sản phẩm thành công!');
    }
}

// ===== ORDERS PAGE =====
function populateOrdersTableFull(filters = {}) {
    const tbody = document.getElementById('ordersTableFullBody');
    if (!tbody) return;

    let filteredOrders = [...mockOrders];

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

    tbody.innerHTML = filteredOrders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td>${order.product}</td>
            <td>${order.quantity}</td>
            <td><strong>${formatCurrency(order.amount)}</strong></td>
            <td>
                <select class="status-select" onchange="updateOrderStatus('${order.id}', this.value)">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Đang xử lý</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Hoàn thành</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Đã hủy</option>
                </select>
            </td>
            <td>${order.date}</td>
            <td>
                <button class="icon-btn" onclick="viewOrderDetail('${order.id}')" title="Xem chi tiết">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="icon-btn" onclick="printOrder('${order.id}')" title="In hóa đơn">
                    <i class="fas fa-print"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function updateOrderStatus(orderId, newStatus) {
    const order = mockOrders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        showToast(`Đã cập nhật trạng thái đơn hàng ${orderId}`);
    }
}

function viewOrderDetail(orderId) {
    const order = mockOrders.find(o => o.id === orderId);
    if (order) {
        showToast(`Xem chi tiết đơn hàng ${orderId}`, 'info');
        // Here you would open a modal with order details
    }
}

function printOrder(orderId) {
    showToast(`Đang in hóa đơn ${orderId}...`, 'info');
}

// ===== CUSTOMERS PAGE =====
function populateCustomersTable(filters = {}) {
    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;

    let filteredCustomers = [...mockCustomers];

    // Apply filters
    if (filters.search) {
        filteredCustomers = filteredCustomers.filter(c =>
            c.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            c.email.toLowerCase().includes(filters.search.toLowerCase()) ||
            c.phone.includes(filters.search)
        );
    }
    if (filters.type && filters.type !== 'all') {
        filteredCustomers = filteredCustomers.filter(c => c.type === filters.type);
    }

    tbody.innerHTML = filteredCustomers.map(customer => `
        <tr>
            <td><strong>${customer.name}</strong></td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.orders}</td>
            <td><strong>${formatCurrency(customer.spent)}</strong></td>
            <td>
                <span class="badge ${customer.type === 'vip' ? 'badge-warning' : customer.type === 'new' ? 'badge-info' : ''}">
                    ${customer.type === 'vip' ? 'VIP' : customer.type === 'new' ? 'Mới' : 'Thường'}
                </span>
            </td>
            <td>${customer.joinDate}</td>
            <td>
                <button class="icon-btn" onclick="viewCustomerDetail(${customer.id})" title="Xem chi tiết">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="icon-btn" onclick="editCustomer(${customer.id})" title="Sửa">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewCustomerDetail(id) {
    const customer = mockCustomers.find(c => c.id === id);
    if (customer) {
        showToast(`Xem chi tiết khách hàng: ${customer.name}`, 'info');
    }
}

function editCustomer(id) {
    const customer = mockCustomers.find(c => c.id === id);
    if (customer) {
        showToast(`Đang chỉnh sửa khách hàng: ${customer.name}`, 'info');
    }
}

// ===== SCREENINGS PAGE =====
function populateScreeningsTable(filters = {}) {
    const tbody = document.getElementById('screeningsTableBody');
    if (!tbody) return;

    let filteredScreenings = [...mockScreenings];

    // Apply filters
    if (filters.search) {
        filteredScreenings = filteredScreenings.filter(s =>
            s.movie.toLowerCase().includes(filters.search.toLowerCase())
        );
    }
    if (filters.room && filters.room !== 'all') {
        filteredScreenings = filteredScreenings.filter(s =>
            s.room.toLowerCase().includes(filters.room.toLowerCase())
        );
    }

    tbody.innerHTML = filteredScreenings.map(screening => `
        <tr>
            <td><strong>${screening.movie}</strong></td>
            <td>${screening.room}</td>
            <td>${screening.time}</td>
            <td>${screening.booked}</td>
            <td>
                <span style="color: ${screening.watching > 0 ? '#4ade80' : '#94a3b8'}; font-weight: 600;">
                    ${screening.watching}
                </span>
            </td>
            <td>
                <span class="status-badge ${screening.status === 'playing' ? 'completed' : screening.status === 'scheduled' ? 'pending' : 'cancelled'}">
                    ${screening.status === 'playing' ? 'Đang chiếu' : screening.status === 'scheduled' ? 'Chưa chiếu' : 'Đã hủy'}
                </span>
            </td>
            <td>
                <button class="icon-btn" onclick="viewScreeningDetail(${screening.id})" title="Xem chi tiết">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="icon-btn" onclick="editScreening(${screening.id})" title="Sửa">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="icon-btn" onclick="deleteScreening(${screening.id})" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewScreeningDetail(id) {
    const screening = mockScreenings.find(s => s.id === id);
    if (screening) {
        showToast(`Xem chi tiết lịch chiếu: ${screening.movie}`, 'info');
    }
}

function editScreening(id) {
    const screening = mockScreenings.find(s => s.id === id);
    if (screening) {
        showToast(`Đang chỉnh sửa lịch chiếu: ${screening.movie}`, 'info');
    }
}

function deleteScreening(id) {
    const screening = mockScreenings.find(s => s.id === id);
    if (screening && confirm(`Bạn có chắc muốn xóa lịch chiếu "${screening.movie}"?`)) {
        const index = mockScreenings.findIndex(s => s.id === id);
        mockScreenings.splice(index, 1);
        populateScreeningsTable();
        showToast('Đã xóa lịch chiếu thành công!');
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
                        label: 'Doanh thu',
                        data: [28000000, 32000000, 30000000, 38000000, 35000000, 42000000, 39000000, 45000000, 43000000, 48000000, 46000000, 52000000],
                        borderColor: '#6c8fc7',
                        backgroundColor: 'rgba(108, 143, 199, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Đơn hàng',
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
                labels: mockProducts.slice(0, 5).map(p => p.name.substring(0, 20) + '...'),
                datasets: [{
                    label: 'Số lượng bán',
                    data: mockProducts.slice(0, 5).map(p => p.sold),
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
                labels: ['TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Khác'],
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

// ===== PRODUCTS PAGE =====
function populateProductsTable(filters = {}) {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    let filteredProducts = [...mockProducts];

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
                    <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" onerror="this.src='assets/images/logo.png'">
                    <strong>${product.name}</strong>
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
}

function editProduct(id) {
    const product = mockProducts.find(p => p.id === id);
    if (product) {
        showToast(`Đang chỉnh sửa sản phẩm: ${product.name}`, 'info');
        // Here you would open a modal to edit the product
    }
}

function deleteProduct(id) {
    const product = mockProducts.find(p => p.id === id);
    if (product && confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
        const index = mockProducts.findIndex(p => p.id === id);
        mockProducts.splice(index, 1);
        populateProductsTable();
        showToast('Đã xóa sản phẩm thành công!');
    }
}

// ===== ORDERS PAGE =====
function populateOrdersTableFull(filters = {}) {
    const tbody = document.getElementById('ordersTableFullBody');
    if (!tbody) return;

    let filteredOrders = [...mockOrders];

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

    tbody.innerHTML = filteredOrders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td>${order.product}</td>
            <td>${order.quantity}</td>
            <td><strong>${formatCurrency(order.amount)}</strong></td>
            <td>
                <select class="status-select" onchange="updateOrderStatus('${order.id}', this.value)">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Đang xử lý</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Hoàn thành</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Đã hủy</option>
                </select>
            </td>
            <td>${order.date}</td>
            <td>
                <button class="icon-btn" onclick="viewOrderDetail('${order.id}')" title="Xem chi tiết">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="icon-btn" onclick="printOrder('${order.id}')" title="In hóa đơn">
                    <i class="fas fa-print"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function updateOrderStatus(orderId, newStatus) {
    const order = mockOrders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        showToast(`Đã cập nhật trạng thái đơn hàng ${orderId}`);
    }
}

function viewOrderDetail(orderId) {
    const order = mockOrders.find(o => o.id === orderId);
    if (order) {
        showToast(`Xem chi tiết đơn hàng ${orderId}`, 'info');
        // Here you would open a modal with order details
    }
}

function printOrder(orderId) {
    showToast(`Đang in hóa đơn ${orderId}...`, 'info');
}

// ===== CUSTOMERS PAGE =====
function populateCustomersTable(filters = {}) {
    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;

    let filteredCustomers = [...mockCustomers];

    // Apply filters
    if (filters.search) {
        filteredCustomers = filteredCustomers.filter(c =>
            c.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            c.email.toLowerCase().includes(filters.search.toLowerCase()) ||
            c.phone.includes(filters.search)
        );
    }
    if (filters.type && filters.type !== 'all') {
        filteredCustomers = filteredCustomers.filter(c => c.type === filters.type);
    }

    tbody.innerHTML = filteredCustomers.map(customer => `
        <tr>
            <td><strong>${customer.name}</strong></td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.orders}</td>
            <td><strong>${formatCurrency(customer.spent)}</strong></td>
            <td>
                <span class="badge ${customer.type === 'vip' ? 'badge-warning' : customer.type === 'new' ? 'badge-info' : ''}">
                    ${customer.type === 'vip' ? 'VIP' : customer.type === 'new' ? 'Mới' : 'Thường'}
                </span>
            </td>
            <td>${customer.joinDate}</td>
            <td>
                <button class="icon-btn" onclick="viewCustomerDetail(${customer.id})" title="Xem chi tiết">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="icon-btn" onclick="editCustomer(${customer.id})" title="Sửa">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewCustomerDetail(id) {
    const customer = mockCustomers.find(c => c.id === id);
    if (customer) {
        showToast(`Xem chi tiết khách hàng: ${customer.name}`, 'info');
    }
}

function editCustomer(id) {
    const customer = mockCustomers.find(c => c.id === id);
    if (customer) {
        showToast(`Đang chỉnh sửa khách hàng: ${customer.name}`, 'info');
    }
}

// ===== SCREENINGS PAGE =====
function populateScreeningsTable(filters = {}) {
    const tbody = document.getElementById('screeningsTableBody');
    if (!tbody) return;

    let filteredScreenings = [...mockScreenings];

    // Apply filters
    if (filters.search) {
        filteredScreenings = filteredScreenings.filter(s =>
            s.movie.toLowerCase().includes(filters.search.toLowerCase())
        );
    }
    if (filters.room && filters.room !== 'all') {
        filteredScreenings = filteredScreenings.filter(s =>
            s.room.toLowerCase().includes(filters.room.toLowerCase())
        );
    }

    tbody.innerHTML = filteredScreenings.map(screening => `
        <tr>
            <td><strong>${screening.movie}</strong></td>
            <td>${screening.room}</td>
            <td>${screening.time}</td>
            <td>${screening.booked}</td>
            <td>
                <span style="color: ${screening.watching > 0 ? '#4ade80' : '#94a3b8'}; font-weight: 600;">
                    ${screening.watching}
                </span>
            </td>
            <td>
                <span class="status-badge ${screening.status === 'playing' ? 'completed' : screening.status === 'scheduled' ? 'pending' : 'cancelled'}">
                    ${screening.status === 'playing' ? 'Đang chiếu' : screening.status === 'scheduled' ? 'Chưa chiếu' : 'Đã hủy'}
                </span>
            </td>
            <td>
                <button class="icon-btn" onclick="viewScreeningDetail(${screening.id})" title="Xem chi tiết">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="icon-btn" onclick="editScreening(${screening.id})" title="Sửa">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="icon-btn" onclick="deleteScreening(${screening.id})" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewScreeningDetail(id) {
    const screening = mockScreenings.find(s => s.id === id);
    if (screening) {
        showToast(`Xem chi tiết lịch chiếu: ${screening.movie}`, 'info');
    }
}

function editScreening(id) {
    const screening = mockScreenings.find(s => s.id === id);
    if (screening) {
        showToast(`Đang chỉnh sửa lịch chiếu: ${screening.movie}`, 'info');
    }
}

function deleteScreening(id) {
    const screening = mockScreenings.find(s => s.id === id);
    if (screening && confirm(`Bạn có chắc muốn xóa lịch chiếu "${screening.movie}"?`)) {
        const index = mockScreenings.findIndex(s => s.id === id);
        mockScreenings.splice(index, 1);
        populateScreeningsTable();
        showToast('Đã xóa lịch chiếu thành công!');
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
                        label: 'Doanh thu',
                        data: [28000000, 32000000, 30000000, 38000000, 35000000, 42000000, 39000000, 45000000, 43000000, 48000000, 46000000, 52000000],
                        borderColor: '#6c8fc7',
                        backgroundColor: 'rgba(108, 143, 199, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Đơn hàng',
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
                labels: mockProducts.slice(0, 5).map(p => p.name.substring(0, 20) + '...'),
                datasets: [{
                    label: 'Số lượng bán',
                    data: mockProducts.slice(0, 5).map(p => p.sold),
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
                labels: ['TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Khác'],
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
    showToast(`Đang tạo báo cáo ${type}...`, 'info');

    setTimeout(() => {
        showToast(`Báo cáo đã được tải xuống!`, 'success');
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
        showToast('Chế độ sáng đang được phát triển!', 'info');
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
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        showToast('Đang đăng xuất...', 'info');
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
    showToast('Đã đánh dấu tất cả thông báo là đã đọc');
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

// Add New Product Button
document.getElementById('addNewProductBtn')?.addEventListener('click', () => {
    showToast('Chức năng thêm sản phẩm mới đang được phát triển!', 'info');
});

// Orders Page Filters
document.getElementById('orderSearch')?.addEventListener('input', (e) => {
    populateOrdersTableFull({ search: e.target.value });
});

document.getElementById('orderStatusFilter')?.addEventListener('change', (e) => {
    populateOrdersTableFull({ status: e.target.value });
});

document.getElementById('exportOrdersBtn')?.addEventListener('click', () => {
    showToast('Đang xuất dữ liệu đơn hàng...', 'info');
    setTimeout(() => showToast('Dữ liệu đã được xuất!', 'success'), 2000);
});

// Customers Page Filters
document.getElementById('customerSearch')?.addEventListener('input', (e) => {
    populateCustomersTable({ search: e.target.value });
});

document.getElementById('customerTypeFilter')?.addEventListener('change', (e) => {
    populateCustomersTable({ type: e.target.value });
});

document.getElementById('addCustomerBtn')?.addEventListener('click', () => {
    showToast('Chức năng thêm khách hàng đang được phát triển!', 'info');
});

// Screenings Page Filters
document.getElementById('screeningSearch')?.addEventListener('input', (e) => {
    populateScreeningsTable({ search: e.target.value });
});

document.getElementById('roomFilter')?.addEventListener('change', (e) => {
    populateScreeningsTable({ room: e.target.value });
});

document.getElementById('addScreeningBtn')?.addEventListener('click', () => {
    showToast('Chức năng thêm lịch chiếu đang được phát triển!', 'info');
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

// ===== START APP =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initDashboard();
        setTimeout(() => {
            showToast('Chào mừng trở lại, Long! 🎉', 'success');
        }, 1000);
    });
} else {
    initDashboard();
    setTimeout(() => {
        showToast('Chào mừng trở lại, Long! 🎉', 'success');
    }, 1000);
}
