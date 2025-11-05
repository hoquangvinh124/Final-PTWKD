# Marketplace Authentication & Product Management

## 📋 Tổng quan

Hệ thống marketplace đã được nâng cấp với tính năng xác thực người dùng và quản lý sản phẩm cá nhân.

## 🔐 Tính năng chính

### 1. **Xác thực người dùng**
- Sử dụng hệ thống auth từ `auth.js`
- Kiểm tra `isAuthenticated()` và `getCurrentUser()` để xác định người dùng hiện tại
- Chỉ cho phép người dùng đã đăng nhập tạo và xóa sản phẩm

### 2. **Lưu trữ sản phẩm**
- **LocalStorage Key**: `marketplace.products`
- **Sản phẩm mặc định**: Không thể xóa (DEFAULT_PRODUCTS)
- **Sản phẩm người dùng**: Được lưu vào localStorage và có thể xóa

### 3. **Thông tin người đăng bán**

Mỗi sản phẩm do người dùng tạo sẽ có các trường:

```javascript
{
  id: "user-timestamp-random",
  category: "Audio",
  format: "CD",
  name: "Product name",
  price: "375.000₫",
  priceValue: 375000,
  image: "base64_image_data",
  
  // Thông tin người bán
  sellerUsername: "test",           // Username của người tạo
  sellerName: "Long Huynh",         // Tên đầy đủ
  sellerAvatar: "path/to/avatar",   // Avatar
  createdAt: "2025-11-05T10:30:00Z", // Thời gian tạo
  
  // Thông tin liên hệ
  contact: {
    phone: "+84 xxx xxx xxx",
    zalo: "zalo_id",
    messenger: "messenger_link",
    instagram: "@username",
    threads: "@username"
  }
}
```

### 4. **Phân quyền xóa sản phẩm**

```javascript
function canDeleteProduct(product) {
  if (!isAuthenticated()) return false;
  
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  
  // Chỉ cho phép xóa sản phẩm do chính mình tạo
  return product.sellerUsername === currentUser.username;
}
```

**Quy tắc:**
- ❌ Không thể xóa sản phẩm mặc định (không có `sellerUsername`)
- ❌ Không thể xóa sản phẩm của người khác
- ✅ Chỉ xóa được sản phẩm do chính mình tạo

## 🔄 Quy trình hoạt động

### Thêm sản phẩm mới:

1. Kiểm tra đăng nhập
2. Lấy thông tin người dùng từ `getCurrentUser()`
3. Tạo sản phẩm mới với thông tin người bán
4. Thêm vào mảng `products`
5. Lưu vào localStorage qua `saveProducts()`
6. Re-render danh sách

### Xóa sản phẩm:

1. Kiểm tra đăng nhập
2. Tìm sản phẩm cần xóa
3. Kiểm tra quyền với `canDeleteProduct()`
4. Nếu có quyền: xóa khỏi mảng
5. Cập nhật localStorage
6. Re-render danh sách

### Lọc "My Products":

```javascript
if (activeFilters.owner === "my") {
  return item.sellerUsername === currentUser.username;
}
```

## 📦 Cấu trúc dữ liệu trong localStorage

**Key**: `marketplace.products`

**Value**: Array of user-created products
```json
[
  {
    "id": "user-1730801234567-abc123",
    "sellerUsername": "test",
    "sellerName": "Long Huynh",
    "category": "Audio",
    "name": "Mac DeMarco - 2 CD",
    ...
  }
]
```

## 🚀 Cách sử dụng

### 1. Người dùng chưa đăng nhập:
- Xem tất cả sản phẩm (mặc định + người dùng khác)
- ❌ KHÔNG thể thêm sản phẩm
- ❌ KHÔNG thể xóa sản phẩm
- ❌ KHÔNG thấy nút delete

### 2. Người dùng đã đăng nhập:
- Xem tất cả sản phẩm
- ✅ Thêm sản phẩm mới
- ✅ Xóa sản phẩm của chính mình
- ✅ Thấy nút delete chỉ trên sản phẩm của mình
- ✅ Lọc "My Products" để xem sản phẩm đã tạo

## 🔧 Functions chính

### `loadProducts()`
Load sản phẩm từ localStorage và merge với default products

### `saveProducts(products)`
Lưu chỉ user-created products vào localStorage

### `canDeleteProduct(product)`
Kiểm tra quyền xóa sản phẩm

### `matchesOwner(item)`
Lọc sản phẩm theo owner (all/my/others)

## ⚠️ Lưu ý quan trọng

1. **Import module**: File `market_place.js` phải được import với `type="module"`
   ```html
   <script type="module" src="./assets/js/market_place.js"></script>
   ```

2. **Auth dependency**: Phải import `auth.js` functions:
   ```javascript
   import { getCurrentUser, isAuthenticated } from './auth.js';
   ```

3. **LocalStorage**: Dữ liệu sản phẩm được lưu riêng với key `marketplace.products`

4. **Default products**: Luôn hiển thị và không bao giờ bị xóa

## 🐛 Troubleshooting

### Sản phẩm không lưu?
- Kiểm tra localStorage có bật không
- Check console errors
- Verify user đã đăng nhập

### Không xóa được sản phẩm?
- Kiểm tra `sellerUsername` của sản phẩm
- Verify current user username
- Check `canDeleteProduct()` return value

### Filter "My Products" không hoạt động?
- Đảm bảo user đã đăng nhập
- Check `sellerUsername` field exists
- Verify `getCurrentUser()` returns valid data

## 📝 Testing

1. Login với tài khoản test (username: `test`, password: `test123`)
2. Thêm sản phẩm mới
3. Check localStorage: `marketplace.products`
4. Filter "My Products"
5. Thử xóa sản phẩm của mình
6. Logout và login với tài khoản khác
7. Verify không thể xóa sản phẩm của người khác
