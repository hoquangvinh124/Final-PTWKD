# Wishlist Feature - User Profile

## Tổng quan
Tính năng Wishlist cho phép người dùng lưu các sản phẩm yêu thích từ các danh mục khác nhau (Audio CD/Vinyl/Cassette, VHS, Camera, Accessories) vào danh sách wishlist của họ trên trang user-profile.

## Cấu trúc Files

### JavaScript Files
1. **assets/js/user-wishlist.js**
   - Quản lý việc hiển thị wishlist trong user profile
   - Load dữ liệu sản phẩm từ product.json
   - Xử lý việc xóa sản phẩm khỏi wishlist
   - Hiển thị thông báo và trạng thái empty

2. **assets/js/wishlist-sample-data.js**
   - Thêm dữ liệu mẫu vào wishlist (cho mục đích demo)
   - Tự động populate wishlist nếu rỗng khi load trang
   - Có thể tắt trong production

3. **assets/js/user.js**
   - Chứa các hàm core: `addToWishlist()`, `removeFromWishlist()`, `getWishlist()`
   - Quản lý localStorage và user data

### HTML
- **user-profile.html**: Trang hiển thị profile và wishlist của user

### CSS
- **assets/css/user-profile.css**: Styles cho wishlist cards và layout

## Cách sử dụng

### 1. Thêm sản phẩm vào Wishlist
```javascript
import { addToWishlist } from './assets/js/user.js';

// Thêm sản phẩm
const result = addToWishlist({
    id: '1',
    productId: '1', 
    name: 'Mac Demarco - This Old Dog CD',
    price: '375.000₫',
    image: 'assets/images/Audio/CD/1.jpg',
    category: 'Audio',
    subcategory: 'CD'
});

if (result.success) {
    console.log('Added to wishlist!');
} else {
    console.log('Failed:', result.reason);
}
```

### 2. Xóa sản phẩm khỏi Wishlist
```javascript
import { removeFromWishlist } from './assets/js/user.js';

const result = removeFromWishlist('1');
if (result.success) {
    console.log('Removed from wishlist!');
}
```

### 3. Lấy danh sách Wishlist
```javascript
import { getWishlist } from './assets/js/user.js';

const wishlist = getWishlist();
console.log('Wishlist items:', wishlist);
```

### 4. Thêm dữ liệu mẫu (Testing)
Mở console trên trang user-profile.html và chạy:
```javascript
// Thêm sản phẩm mẫu
await populateWishlistWithSamples();
```

## Product Data Structure

Dữ liệu sản phẩm được load từ `product.json` với cấu trúc:
```json
{
  "id": "1",
  "name": "Product Name",
  "description": "Product description",
  "category": "Audio",
  "subcategory": "CD",
  "price": "375.000₫",
  "image_front": "assets/images/Audio/CD/1.jpg",
  "image_back": "assets/images/Audio/CD/2.jpg",
  "stock_quantity": 100,
  "is_available": true
}
```

## Sample Products in Wishlist

Danh sách mẫu hiện tại bao gồm **70+ sản phẩm** từ tất cả các danh mục:

### 📀 Audio - CD (10 sản phẩm)
- Mac Demarco albums
- Bright Eyes - Fevers and Mirrors
- Charli XCX - Brat
- Lorde - Virgin
- MF Doom - MM..Food
- Và nhiều hơn...

### 💿 Audio - Vinyl (10 sản phẩm)
- Japanese Breakfast - For Melancholy Brunettes
- The Head And The Heart - Aperture
- Lorde - Virgin LP
- Suki Waterhouse - Memoir of a Sparklemuffin
- Khruangbin albums
- Và nhiều hơn...

### 📼 VHS (13 sản phẩm)
- E.T. the Extra-Terrestrial
- Independence Day
- Titanic
- Forrest Gump
- Pulp Fiction
- Men in Black
- Top Gun
- The Lion King
- Beauty and the Beast
- Toy Story 2
- Và nhiều hơn...

### 📻 Audio - Cassette (10 sản phẩm)
- Chappell Roan - The Rise & Fall Of A Midwest Princess
- George Michael - Faith
- The Cure - Disintegration
- Nirvana - Nevermind
- Sabrina Carpenter - Short N' Sweet
- Billie Eilish - Happier Than Ever
- Và nhiều hơn...

### 📷 Camera - Polaroid (8 sản phẩm)
- Polaroid SX-70 Original Chrome
- Polaroid 600 Sun660 Autofocus
- Polaroid 600 Malibu Barbie
- Polaroid 600 Hello Kitty Strawberry Kawaii
- Polaroid 600 Peanuts Beagle Scouts
- Và nhiều hơn...

### 🎧 Accessory - Cassette Player (5 sản phẩm)
- Philips AQ6691 Dynamic Bass Boost
- Panasonic RX-S25A Portable Stereo
- Sony Sports Walkman WM-FS111
- Sony Walkman TPS-L2 (Original!)
- Và nhiều hơn...

### 💽 Accessory - CD Player (4 sản phẩm)
- Aiwa XP-V323YL Transparent Blue
- Philips AJ3977/37 CD Clock Radio
- Và nhiều hơn...

### 🎵 Accessory - iPod (4 sản phẩm)
- Apple iPod Shuffle Baby Blue (2nd Gen)
- Apple iPod Shuffle Blue (2nd Gen)
- Và nhiều hơn...

## Categories và Product Pages

Wishlist tự động link đến đúng trang sản phẩm dựa trên category:

| Category | Subcategory | Product Page |
|----------|-------------|--------------|
| Audio | CD | audio-cd-products.html |
| Audio | Vinyl | audio-vinyl-products.html |
| Audio | Cassette | cassette-tape-products.html |
| VHS | - | vhs-products.html |
| Camera | Polaroid | camera-products.html |
| Accessory | Cassette Player | accessory-cassette-player-products.html |
| Accessory | iPod | accessory-ipod-products.html |
| Accessory | CD Player | accessory-cd-player-products.html |

## Features

### ✓ Đã implement
- [x] Load sản phẩm từ product.json
- [x] Hiển thị wishlist với dữ liệu thực
- [x] Xóa sản phẩm khỏi wishlist
- [x] Empty state khi wishlist rỗng
- [x] Link đến đúng trang sản phẩm theo category
- [x] Hiển thị category badge
- [x] Format giá tiền
- [x] Hiển thị ngày thêm vào wishlist
- [x] Responsive layout (grid 4 columns)
- [x] Sample data generator cho testing
- [x] Auto-populate wishlist nếu rỗng

### Pagination
- Đã có step navigation buttons ở dưới wishlist grid
- Có thể implement logic phân trang nếu cần

## Customization

### Tắt auto-populate sample data
Trong file `user-profile.html`, comment hoặc xóa đoạn:
```html
<script type="module">
    import { initializeWishlistSamples } from './assets/js/wishlist-sample-data.js';
    initializeWishlistSamples();
</script>
```

### Thay đổi số lượng sản phẩm mẫu
Trong file `assets/js/wishlist-sample-data.js`, chỉnh sửa mảng `SAMPLE_PRODUCTS`:
```javascript
const SAMPLE_PRODUCTS = [
    { id: '1', category: 'Audio', subcategory: 'CD' },
    // Add more...
];
```

### Thay đổi số cột grid
Trong file `assets/css/user-profile.css`:
```css
.wishlist-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr); /* Đổi số 4 thành số khác */
  gap:18px;
}
```

## Browser Console Testing

Khi đang ở trang user-profile.html, bạn có thể test trong console:

```javascript
// Xem wishlist hiện tại
getWishlist()

// Thêm sản phẩm mẫu
await populateWishlistWithSamples()

// Reload wishlist display
location.reload()
```

## Notes
- User phải đăng nhập mới thấy được wishlist
- Dữ liệu wishlist được lưu trong localStorage
- Khi xóa sản phẩm, có animation fadeOut
- Ảnh sản phẩm tự động fallback nếu không load được
