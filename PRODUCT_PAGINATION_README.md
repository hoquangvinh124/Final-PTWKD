# Product Pagination System Documentation

## 📋 Tổng quan

Hệ thống phân trang tự động cho tất cả các trang sản phẩm (Audio CD, Vinyl, VHS, Cassette Tape, Pola Camera, Accessories, v.v.)

## 🎯 Yêu cầu đã thực hiện

### Layout
- ✅ **Grid 4×4**: Hiển thị 4 sản phẩm hàng ngang × 4 hàng dọc = **16 sản phẩm/trang**
- ✅ **Responsive**: 
  - Desktop (>1400px): 4 cột
  - Laptop (992-1400px): 3 cột  
  - Tablet (576-992px): 2 cột
  - Mobile (<576px): 1 cột

### Phân trang
- ✅ **Tự động ẩn/hiện**: Chỉ hiển thị khi số sản phẩm > 16
- ✅ **Định dạng giống User Profile**: 
  - Nút Previous (‹)
  - Hiển thị tối đa 3 số trang
  - Nút Next (›)
  - Active state với màu #ff6468

## 📦 Files đã tạo/cập nhật

### CSS Files
1. **`assets/css/product-grid.css`** - Grid layout 4×4
2. **`assets/css/product-pagination.css`** - Pagination styling

### JavaScript Files
1. **`assets/js/product-pagination.js`** - Pagination logic
2. **`learn.js`** - Thêm trigger pagination refresh
3. **`assets/js/filter-dropdown.js`** - Thêm trigger pagination khi filter

### HTML Files (đã cập nhật)
- ✅ `audio-cd-products.html`
- ✅ `audio-vinyl-products.html`
- ✅ `vhs-products.html`
- ✅ `cassette-tape-products.html`
- ✅ `camera-products.html`
- ✅ `accessory-products.html`
- ✅ `accessory-cassette-player-products.html`
- ✅ `accessory-ipod-products.html`
- ✅ `accessory-cd-player-products.html`
- ✅ `audio-products.html`

## 🔧 Cách hoạt động

### 1. ProductPagination Class

```javascript
class ProductPagination {
  currentPage: 0,
  itemsPerPage: 16, // 4×4
  totalItems: 0,
  // ... methods
}
```

### 2. Auto-initialization

```javascript
// Tự động khởi tạo khi DOM ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.productPagination.init();
  }, 1000);
});
```

### 3. Refresh triggers

**Khi load sản phẩm** (`learn.js`):
```javascript
setTimeout(() => {
  if (window.productPagination) {
    window.productPagination.refresh();
  }
}, 200);
```

**Khi filter sản phẩm** (`filter-dropdown.js`):
```javascript
setTimeout(() => {
  if (window.productPagination) {
    window.productPagination.refresh();
  }
}, 100);
```

## 🎨 Pagination UI

### Hiển thị
```
‹  1  2  3  ›
```

### States
- **Active page**: Background #ff6468, text #2b050b
- **Hover**: Background rgba(255,255,255,0.12)
- **Disabled**: Opacity 0.4

### Logic hiển thị số trang

```javascript
// Hiển thị tối đa 3 số trang
let startPage = Math.max(0, currentPage - 1);
let endPage = Math.min(totalPages - 1, startPage + 2);

// Adjust nếu gần cuối
if (endPage - startPage < 2) {
  startPage = Math.max(0, endPage - 2);
}
```

**Ví dụ:**
- Trang 1: `‹ 1 2 3 ›`
- Trang 2: `‹ 1 2 3 ›`
- Trang 3: `‹ 2 3 4 ›`
- Trang 5 (cuối): `‹ 3 4 5 ›`

## 🔄 Flow hoạt động

1. **Page Load**
   ```
   DOM Ready → Wait 1s → Init Pagination → Check products count
   ```

2. **Products Load** 
   ```
   loadProduct() → Insert HTML → Wait 200ms → Refresh Pagination
   ```

3. **Filter Applied**
   ```
   selectFilter() → renderProducts() → Wait 100ms → Refresh Pagination
   ```

4. **Pagination Click**
   ```
   Click page number → showPage(index) → Hide/show products → Update UI → Scroll to top
   ```

## 📊 Pagination Logic

### Show/Hide Products

```javascript
showPage(pageIndex) {
  const startIndex = pageIndex * 16; // 0, 16, 32, ...
  const endIndex = startIndex + 16;   // 16, 32, 48, ...
  
  allProducts.forEach((el, index) => {
    if (index >= startIndex && index < endIndex) {
      el.style.display = '';  // Show
    } else {
      el.style.display = 'none';  // Hide
    }
  });
}
```

### Auto Hide Pagination

```javascript
if (totalItems <= 16) {
  hidePagination();  // Ẩn nếu ≤16 sản phẩm
} else {
  showPagination();  // Hiện nếu >16 sản phẩm
}
```

## 🎯 Product Grid CSS

```css
.col-xl-8 .row.gx-5 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  row-gap: 30px;
}
```

### Responsive Breakpoints

| Screen Size | Columns | Products/Page |
|------------|---------|---------------|
| >1400px    | 4       | 16            |
| 992-1400px | 3       | 16            |
| 576-992px  | 2       | 16            |
| <576px     | 1       | 16            |

## 🐛 Debugging

### Check pagination state

```javascript
// In console
console.log(window.productPagination.currentPage);
console.log(window.productPagination.totalItems);
console.log(window.productPagination.allProductElements.length);
```

### Force refresh

```javascript
window.productPagination.refresh();
```

### Check if pagination showing

```javascript
document.querySelector('.product-pagination').classList.contains('show');
```

## 🔍 Troubleshooting

### Pagination không hiện?
1. Check số sản phẩm: `totalItems > 16`?
2. Check `.product-pagination.show` class
3. Check console errors

### Sản phẩm không ẩn?
1. Verify `allProductElements` array
2. Check `display` style của products
3. Check `currentPage` index

### Filter không trigger pagination?
1. Verify `renderProducts()` calls `refresh()`
2. Check setTimeout delay (100ms)
3. Check product elements after filter

## 📝 Testing Checklist

- [ ] Load trang có >16 sản phẩm → Pagination hiện
- [ ] Load trang có ≤16 sản phẩm → Pagination ẩn
- [ ] Click số trang → Chuyển trang đúng
- [ ] Click Previous/Next → Navigate đúng
- [ ] Filter sản phẩm → Pagination update
- [ ] Resize window → Grid responsive
- [ ] Scroll → Quay về đầu products section

## 🚀 Performance

- **Lazy initialization**: Wait 1s sau DOM ready
- **Debounced refresh**: setTimeout 100-200ms
- **CSS transitions**: 0.2s ease
- **No re-render**: Chỉ toggle display style

## 📱 Mobile Optimization

- Smaller buttons (32px min-width)
- Reduced gap (8px)
- Single column grid
- Touch-friendly targets

## 🎨 Customization

### Change items per page

```javascript
this.itemsPerPage = 20; // Thay đổi từ 16 sang 20
```

### Change grid layout

```css
grid-template-columns: repeat(5, 1fr); /* 5 cột */
```

### Change pagination style

```css
.page-btn.is-active {
  background: #your-color;
}
```

## ✅ Kết luận

Hệ thống phân trang đã được implement đầy đủ với:
- ✅ Grid 4×4 (16 products/page)
- ✅ Auto show/hide khi >16 products
- ✅ UI giống User Profile
- ✅ Tích hợp với filter system
- ✅ Responsive design
- ✅ Smooth transitions
