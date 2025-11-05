// ===== GLOBAL STATE =====
const state = {
    sidebarActive: false,
    theme: 'dark',
    notifications: [],
    orders: [],
    products: []
};

// ===== DOM ELEMENTS =====
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const notificationBtn = document.getElementById('notificationBtn');
const notificationDropdown = document.getElementById('notificationDropdown');
const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');
const logoutBtn = document.getElementById('logoutBtn');
const addProductBtn = document.getElementById('addProductBtn');
const exportBtn = document.getElementById('exportBtn');

// ===== MOCK DATA =====
const mockOrders = [
    { id: 'ORD001', customer: 'Nguyễn Văn A', product: 'Vinyl The Beatles - Abbey Road', amount: 1250000, status: 'completed', date: '05/11/2025' },
    { id: 'ORD002', customer: 'Trần Thị B', product: 'Cassette Player Sony Walkman', amount: 850000, status: 'pending', date: '05/11/2025' },
    { id: 'ORD003', customer: 'Lê Minh C', product: 'CD Pink Floyd - The Wall', amount: 420000, status: 'completed', date: '04/11/2025' },
    { id: 'ORD004', customer: 'Phạm Anh D', product: 'VHS Star Wars Original', amount: 680000, status: 'pending', date: '04/11/2025' },
    { id: 'ORD005', customer: 'Hoàng Thị E', product: 'Vinyl Queen - Greatest Hits', amount: 1350000, status: 'cancelled', date: '03/11/2025' },
    { id: 'ORD006', customer: 'Đặng Văn F', product: 'Polaroid Camera Vintage', amount: 2100000, status: 'completed', date: '03/11/2025' },
];

const mockProducts = [
    { 
        rank: 1, 
        name: 'Vinyl The Beatles - Abbey Road', 
        category: 'Vinyl', 
        sales: 1250000, 
        sold: 45,
        image: 'assets/images/Audio/Vinyl/vinyl-1.jpeg'
    },
    { 
        rank: 2, 
        name: 'Cassette Player Sony Walkman', 
        category: 'Accessories', 
        sales: 3400000, 
        sold: 34,
        image: 'assets/images/Accessories/Cassette Player/cassette-player-1.jpeg'
    },
    { 
        rank: 3, 
        name: 'CD Pink Floyd - The Wall', 
        category: 'CD', 
        sales: 840000, 
        sold: 28,
        image: 'assets/images/Audio/CD/cd-1.jpeg'
    },
    { 
        rank: 4, 
        name: 'VHS Pulp Fiction', 
        category: 'VHS', 
        sales: 680000, 
        sold: 22,
        image: 'assets/images/film VHS/vhs-1.jpeg'
    },
    { 
        rank: 5, 
        name: 'Polaroid Camera SX-70', 
        category: 'Camera', 
        sales: 2100000, 
        sold: 18,
        image: 'assets/images/Pola Camera/camera-1.jpeg'
    }
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
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
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
        console.log(`Navigating to: ${page}`);
        showToast(`Đang chuyển đến ${link.querySelector('span').textContent}...`);
        
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
        // Implement search logic here
    }
});

// Logout
logoutBtn?.addEventListener('click', () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        showToast('Đang đăng xuất...', 'info');
        setTimeout(() => {
            window.location.href = '../login.html';
        }, 1500);
    }
});

// Add Product
addProductBtn?.addEventListener('click', () => {
    showToast('Chức năng thêm sản phẩm đang được phát triển!', 'info');
});

// Export Report
exportBtn?.addEventListener('click', () => {
    showToast('Đang xuất báo cáo...', 'info');
    
    // Simulate export
    setTimeout(() => {
        showToast('Báo cáo đã được tải xuống!', 'success');
    }, 2000);
});

// Mark all notifications as read
document.querySelector('.mark-all-read')?.addEventListener('click', () => {
    document.querySelectorAll('.notification-item.unread').forEach(item => {
        item.classList.remove('unread');
    });
    showToast('Đã đánh dấu tất cả thông báo là đã đọc');
});

// ===== INITIALIZE STATS ANIMATION =====
function initStatsAnimation() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        if (target) {
            animateValue(stat, 0, target, 2000);
        }
    });
}

// ===== POPULATE ORDERS TABLE =====
function populateOrdersTable() {
    const tbody = document.querySelector('#ordersTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = mockOrders.map(order => `
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

// ===== POPULATE TOP PRODUCTS =====
function populateTopProducts() {
    const container = document.getElementById('topProductsList');
    if (!container) return;
    
    container.innerHTML = mockProducts.map(product => `
        <div class="product-item">
            <div class="product-rank">${product.rank}</div>
            <img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.src='assets/images/logo.png'">
            <div class="product-info">
                <strong>${product.name}</strong>
                <span>${product.category} • ${product.sold} đã bán</span>
            </div>
            <div class="product-sales">
                <strong>${formatCurrency(product.sales)}</strong>
                <span>+${product.sold}%</span>
            </div>
        </div>
    `).join('');
}

// ===== INITIALIZE CHARTS =====
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
                    pointHoverBackgroundColor: '#e8b86d',
                    pointHoverBorderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleColor: '#f1f5f9',
                        bodyColor: '#cbd5e1',
                        borderColor: '#334155',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
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
                        grid: {
                            color: '#334155',
                            drawBorder: false
                        }
                    },
                    x: {
                        ticks: {
                            color: '#94a3b8'
                        },
                        grid: {
                            display: false
                        }
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
                    backgroundColor: [
                        '#6c8fc7',
                        '#8b7fc9',
                        '#5b9bd5',
                        '#4ade80',
                        '#ff9966'
                    ],
                    borderWidth: 0,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#cbd5e1',
                            padding: 15,
                            font: {
                                size: 12,
                                weight: '600'
                            },
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleColor: '#f1f5f9',
                        bodyColor: '#cbd5e1',
                        borderColor: '#334155',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return `${label}: ${value}%`;
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }
}

// ===== UPDATE WELCOME MESSAGE BASED ON TIME =====
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

// ===== INITIALIZE APP =====
function initApp() {
    console.log('Initializing Oldie Zone Admin Dashboard...');
    
    // Update welcome message
    updateWelcomeMessage();
    
    // Animate stats
    setTimeout(() => {
        initStatsAnimation();
    }, 300);
    
    // Populate data
    populateOrdersTable();
    populateTopProducts();
    
    // Initialize charts
    setTimeout(() => {
        initCharts();
    }, 500);
    
    // Show welcome toast
    setTimeout(() => {
        showToast('Chào mừng trở lại, Long! 🎉', 'success');
    }, 1000);
}

// ===== ADD TOAST STYLES =====
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    .toast {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: var(--shadow-xl);
        z-index: 10000;
        min-width: 300px;
    }
    
    .toast-success {
        border-left: 4px solid var(--success);
    }
    
    .toast-info {
        border-left: 4px solid var(--info);
    }
    
    .toast-error {
        border-left: 4px solid var(--danger);
    }
    
    .toast i {
        font-size: 20px;
    }
    
    .toast-success i {
        color: var(--success);
    }
    
    .toast-info i {
        color: var(--info);
    }
    
    .toast-error i {
        color: var(--danger);
    }
    
    .toast span {
        color: var(--text-primary);
        font-size: 14px;
        font-weight: 500;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(toastStyles);

// ===== START APP =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
