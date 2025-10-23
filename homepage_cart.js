const currency = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
});

const cartState = {
    items: []
};

const els = {
    toggle: document.querySelector('.cart-toggle'),
    dropdown: document.getElementById('cartDropdown'),
    count: document.getElementById('cartCount'),
    list: document.getElementById('cartItems'),
    empty: document.getElementById('cartEmpty'),
    total: document.getElementById('cartTotal'),
    continue: document.getElementById('continueBtn'),
    checkout: document.getElementById('checkoutBtn'),
    productButtons: Array.from(document.querySelectorAll('.product-add'))
};

function toggleDropdown(force) {
    const isOpen = force !== undefined ? force : !els.dropdown.classList.contains('open');
    els.dropdown.classList.toggle('open', isOpen);
    els.toggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
        els.dropdown.focus?.();
        document.addEventListener('click', handleOutsideClick);
    } else {
        document.removeEventListener('click', handleOutsideClick);
    }
}

function handleOutsideClick(event) {
    if (!els.dropdown.contains(event.target) && !els.toggle.contains(event.target)) {
        toggleDropdown(false);
    }
}

function updateBadge() {
    const totalItems = cartState.items.reduce((sum, item) => sum + item.qty, 0);
    els.count.textContent = totalItems;
    els.count.classList.toggle('has-items', totalItems > 0);
}

function renderCart() {
    els.list.innerHTML = '';

    if (!cartState.items.length) {
        els.empty.style.display = 'block';
        els.total.textContent = currency.format(0);
        updateBadge();
        return;
    }

    els.empty.style.display = 'none';

    cartState.items.forEach((item) => {
        const row = document.createElement('article');
        row.className = 'cart-item';
        row.dataset.id = item.id;
        row.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="info">
                <span class="title">${item.name}</span>
                <span class="price">${currency.format(item.price)}</span>
                <div class="qty-control" role="group" aria-label="Chỉnh số lượng">
                    <button type="button" class="qty-btn" data-action="decrease" aria-label="Giảm số lượng">−</button>
                    <input type="number" min="1" max="99" value="${item.qty}" aria-label="Số lượng của ${item.name}">
                    <button type="button" class="qty-btn" data-action="increase" aria-label="Tăng số lượng">+</button>
                </div>
            </div>
            <button type="button" class="remove-btn" aria-label="Xóa ${item.name}" title="Xóa">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;
        els.list.appendChild(row);
    });

    const total = cartState.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    els.total.textContent = currency.format(total);

    updateBadge();
}

function addToCart({ id, name, price, img }) {
    const existing = cartState.items.find((item) => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cartState.items.push({ id, name, price, img, qty: 1 });
    }

    renderCart();
    toggleDropdown(true);
}

function changeQuantity(id, delta) {
    const item = cartState.items.find((entry) => entry.id === id);
    if (!item) return;
    item.qty = Math.min(99, Math.max(1, item.qty + delta));
    renderCart();
}

function setQuantity(id, value) {
    const item = cartState.items.find((entry) => entry.id === id);
    if (!item) return;
    const qty = Number(value);
    if (Number.isNaN(qty) || qty < 1) {
        item.qty = 1;
    } else {
        item.qty = Math.min(99, Math.round(qty));
    }
    renderCart();
}

function removeItem(id) {
    cartState.items = cartState.items.filter((item) => item.id !== id);
    renderCart();
}

els.productButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.product-card');
        if (!card) return;
        const price = Number(card.dataset.price) || 0;
        addToCart({
            id: card.dataset.id,
            name: card.dataset.name,
            price,
            img: card.dataset.img || card.querySelector('img')?.src || ''
        });
    });
});

els.toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleDropdown();
});

els.list.addEventListener('click', (event) => {
    const row = event.target.closest('.cart-item');
    if (!row) return;
    const id = row.dataset.id;

    if (event.target.closest('.remove-btn')) {
        removeItem(id);
        return;
    }

    if (event.target.closest('.qty-btn')) {
        const delta = event.target.dataset.action === 'increase' ? 1 : -1;
        changeQuantity(id, delta);
    }
});

els.list.addEventListener('input', (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    const row = input.closest('.cart-item');
    if (!row) return;
    setQuantity(row.dataset.id, input.value);
});

els.continue.addEventListener('click', () => toggleDropdown(false));
els.checkout.addEventListener('click', () => {
    if (!cartState.items.length) {
        alert('Bạn chưa có sản phẩm nào trong giỏ.');
        return;
    }
    alert('Tính năng thanh toán đang được hoàn thiện.');
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        toggleDropdown(false);
    }
});

renderCart();
