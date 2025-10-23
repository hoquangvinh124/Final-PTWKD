const cartState = [];

const selectors = {
  grid: document.getElementById('productGrid'),
  cartButton: document.getElementById('cartButton'),
  cartBadge: document.getElementById('cartBadge'),
  overlay: document.getElementById('miniCartOverlay'),
  panel: document.getElementById('miniCart'),
  items: document.getElementById('miniCartItems'),
  empty: document.getElementById('miniCartEmpty'),
  total: document.getElementById('miniCartTotal'),
  close: document.getElementById('miniCartClose'),
  continue: document.getElementById('miniCartContinue'),
  checkout: document.getElementById('miniCartCheckout')
};

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

function parsePrice(value) {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  const cleaned = value.replace(/[^0-9.,-]/g, '').replace(/,/g, '');
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function findItemIndex(id) {
  return cartState.findIndex((item) => item.id === id);
}

function updateBadge() {
  const count = cartState.reduce((sum, item) => sum + item.quantity, 0);
  if (!selectors.cartBadge) return;
  selectors.cartBadge.textContent = count > 0 ? String(count) : '';
  selectors.cartBadge.classList.toggle('show', count > 0);
}

function renderCart() {
  const totalValue = cartState.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (selectors.total) selectors.total.textContent = currency.format(totalValue);

  if (!selectors.items || !selectors.empty) return;
  selectors.items.innerHTML = '';

  if (cartState.length === 0) {
    selectors.empty.hidden = false;
    return;
  }

  selectors.empty.hidden = true;

  cartState.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'mini-cart__item';
    li.dataset.id = item.id;
    li.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="mini-cart__thumb" loading="lazy">
      <div class="mini-cart__info">
        <h3 class="mini-cart__name">${item.name}</h3>
        <div class="mini-cart__meta">${currency.format(item.price)}</div>
        <div class="mini-cart__controls" role="group" aria-label="Điều chỉnh số lượng">
          <button type="button" class="mini-cart__qty-btn" data-action="decrease" aria-label="Giảm số lượng">−</button>
          <input type="number" min="1" inputmode="numeric" class="mini-cart__qty-input" value="${item.quantity}" aria-label="Số lượng">
          <button type="button" class="mini-cart__qty-btn" data-action="increase" aria-label="Tăng số lượng">+</button>
          <button type="button" class="mini-cart__remove" data-action="remove">Xóa</button>
        </div>
      </div>
      <div class="mini-cart__line-total">${currency.format(item.price * item.quantity)}</div>
    `;
    selectors.items.appendChild(li);
  });
}

function openCart() {
  selectors.panel?.removeAttribute('hidden');
  selectors.panel?.setAttribute('aria-hidden', 'false');
  selectors.overlay?.removeAttribute('hidden');
  selectors.cartButton?.setAttribute('aria-expanded', 'true');
}

function closeCart() {
  selectors.panel?.setAttribute('hidden', '');
  selectors.panel?.setAttribute('aria-hidden', 'true');
  selectors.overlay?.setAttribute('hidden', '');
  selectors.cartButton?.setAttribute('aria-expanded', 'false');
}

function addToCart(product) {
  if (!product?.id) return;
  const index = findItemIndex(product.id);
  if (index > -1) {
    cartState[index].quantity += 1;
  } else {
    cartState.push({
      ...product,
      quantity: 1
    });
  }
  updateBadge();
  renderCart();
  openCart();
}

function setQuantity(id, quantity) {
  const index = findItemIndex(id);
  if (index === -1) return;
  const safeValue = Number.isFinite(quantity) ? Math.max(1, Math.round(quantity)) : 1;
  cartState[index].quantity = safeValue;
  updateBadge();
  renderCart();
}

function removeItem(id) {
  const index = findItemIndex(id);
  if (index === -1) return;
  cartState.splice(index, 1);
  updateBadge();
  renderCart();
  if (cartState.length === 0) closeCart();
}

selectors.grid?.addEventListener('click', (event) => {
  const button = event.target.closest('.add');
  if (!button) return;
  const card = button.closest('.item');
  if (!card) return;
  const id = card.dataset.id || card.id || card.dataset.name || `sku-${Date.now()}`;
  const name = card.dataset.name || card.querySelector('h4')?.textContent?.trim() || 'Sản phẩm Retro';
  const img = card.dataset.img || card.querySelector('img.main-image')?.getAttribute('src') || '';
  const priceValue = parsePrice(card.dataset.price);

  addToCart({
    id: String(id),
    name,
    img,
    price: priceValue
  });
});

selectors.cartButton?.addEventListener('click', () => {
  const isHidden = selectors.panel?.hasAttribute('hidden');
  if (isHidden) openCart();
  else closeCart();
});

selectors.overlay?.addEventListener('click', closeCart);
selectors.close?.addEventListener('click', closeCart);
selectors.continue?.addEventListener('click', closeCart);

selectors.checkout?.addEventListener('click', () => {
  if (cartState.length === 0) {
    alert('Bạn chưa có sản phẩm nào trong giỏ.');
    return;
  }
  alert('Chức năng thanh toán đang được phát triển.');
});

selectors.items?.addEventListener('click', (event) => {
  const target = event.target;
  const itemElement = target.closest('.mini-cart__item');
  if (!itemElement) return;
  const id = itemElement.dataset.id;
  if (!id) return;

  const action = target.dataset.action;
  if (action === 'remove') {
    removeItem(id);
    return;
  }

  if (action === 'increase') {
    const index = findItemIndex(id);
    if (index > -1) setQuantity(id, cartState[index].quantity + 1);
    return;
  }

  if (action === 'decrease') {
    const index = findItemIndex(id);
    if (index > -1) setQuantity(id, cartState[index].quantity - 1);
  }
});

selectors.items?.addEventListener('input', (event) => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  if (!input.classList.contains('mini-cart__qty-input')) return;
  const itemElement = input.closest('.mini-cart__item');
  if (!itemElement) return;
  const id = itemElement.dataset.id;
  if (!id) return;
  const value = Number.parseInt(input.value, 10);
  setQuantity(id, Number.isFinite(value) ? value : 1);
});

updateBadge();
renderCart();
