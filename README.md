# 🎵 OLDIE ZONE - Retro Sound & Vintage Collection

<div align="center">

![OLDIE ZONE](assets/images/shopname.jpg)

**Nền tảng thương mại điện tử chuyên về các sản phẩm retro và vintage**

[![GitHub Stars](https://img.shields.io/github/stars/hoquangvinh124/Final-PTWKD?style=social)](https://github.com/hoquangvinh124/Final-PTWKD)
[![GitHub Forks](https://img.shields.io/github/forks/hoquangvinh124/Final-PTWKD?style=social)](https://github.com/hoquangvinh124/Final-PTWKD)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[🌐 Demo](#) | [📖 Tài liệu](#) | [🐛 Báo lỗi](https://github.com/hoquangvinh124/Final-PTWKD/issues) | [💡 Đề xuất tính năng](https://github.com/hoquangvinh124/Final-PTWKD/issues)

</div>

---

## 📑 Mục lục

- [🎵 OLDIE ZONE - Retro Sound \& Vintage Collection](#-oldie-zone---retro-sound--vintage-collection)
  - [📑 Mục lục](#-mục-lục)
  - [📖 Giới thiệu](#-giới-thiệu)
    - [🎯 Mục tiêu dự án](#-mục-tiêu-dự-án)
    - [👥 Đối tượng người dùng](#-đối-tượng-người-dùng)
  - [✨ Tính năng chính](#-tính-năng-chính)
    - [🛍️ Tính năng người dùng](#️-tính-năng-người-dùng)
    - [👨‍💼 Tính năng quản trị](#-tính-năng-quản-trị)
    - [🎨 Tính năng nổi bật](#-tính-năng-nổi-bật)
  - [🛠️ Công nghệ sử dụng](#️-công-nghệ-sử-dụng)
    - [Frontend](#frontend)
    - [Storage](#storage)
    - [External APIs \& Libraries](#external-apis--libraries)
  - [📁 Cấu trúc dự án](#-cấu-trúc-dự-án)
    - [Chi tiết thư mục](#chi-tiết-thư-mục)
  - [🚀 Hướng dẫn cài đặt](#-hướng-dẫn-cài-đặt)
    - [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
    - [Các bước cài đặt](#các-bước-cài-đặt)
  - [💻 Hướng dẫn sử dụng](#-hướng-dẫn-sử-dụng)
    - [Cho người dùng](#cho-người-dùng)
    - [Cho quản trị viên](#cho-quản-trị-viên)
  - [📊 Cấu trúc dữ liệu](#-cấu-trúc-dữ-liệu)
    - [1. Products (product.json)](#1-products-productjson)
    - [2. Users (users.json)](#2-users-usersjson)
    - [3. Movies (movies.json)](#3-movies-moviesjson)
  - [🎨 Danh mục sản phẩm](#-danh-mục-sản-phẩm)
    - [Audio](#audio)
    - [Video \& Film](#video--film)
    - [Photography](#photography)
    - [Accessories](#accessories)
  - [📄 Danh sách trang](#-danh-sách-trang)
    - [Trang công khai](#trang-công-khai)
    - [Trang người dùng](#trang-người-dùng)
    - [Trang quản trị](#trang-quản-trị)
  - [🎬 Chi tiết các chức năng](#-chi-tiết-các-chức-năng)
    - [1. Hệ thống xác thực (Authentication)](#1-hệ-thống-xác-thực-authentication)
    - [2. Quản lý giỏ hàng (Shopping Cart)](#2-quản-lý-giỏ-hàng-shopping-cart)
    - [3. Thanh toán (Checkout)](#3-thanh-toán-checkout)
    - [4. Tìm kiếm sản phẩm](#4-tìm-kiếm-sản-phẩm)
    - [5. Retro Cine Room](#5-retro-cine-room)
    - [6. Market Place (Thread)](#6-market-place-thread)
    - [7. Chatbot](#7-chatbot)
  - [📦 LocalStorage Data Structure](#-localstorage-data-structure)
  - [🎨 Theme \& Styling](#-theme--styling)
  - [🔐 Tài khoản demo](#-tài-khoản-demo)
  - [🐛 Xử lý lỗi và Debug](#-xử-lý-lỗi-và-debug)
  - [🚀 Triển khai (Deployment)](#-triển-khai-deployment)
    - [GitHub Pages](#github-pages)
    - [Netlify](#netlify)
    - [Vercel](#vercel)
  - [📈 Roadmap](#-roadmap)
    - [Version 1.0 (Current)](#version-10-current)
    - [Version 2.0 (Planned)](#version-20-planned)
    - [Version 3.0 (Future)](#version-30-future)
  - [🤝 Đóng góp](#-đóng-góp)
    - [Quy trình đóng góp](#quy-trình-đóng-góp)
    - [Code Style Guidelines](#code-style-guidelines)
  - [📝 License](#-license)
  - [👨‍💻 Tác giả](#-tác-giả)
  - [🙏 Cảm ơn](#-cảm-ơn)
  - [📞 Liên hệ \& Hỗ trợ](#-liên-hệ--hỗ-trợ)

---

## 📖 Giới thiệu

**OLDIE ZONE** là một nền tảng thương mại điện tử độc đáo, chuyên cung cấp các sản phẩm retro và vintage cho những người yêu thích văn hóa và công nghệ của thập niên 80-90. Website mang đến trải nghiệm mua sắm độc đáo với giao diện thân thiện, hiện đại nhưng vẫn giữ được nét hoài niệm của thời đại hoàng kim.

### 🎯 Mục tiêu dự án

- 🎵 Tạo ra một không gian mua sắm trực tuyến dành riêng cho các sản phẩm retro/vintage
- 🎨 Mang đến trải nghiệm người dùng mượt mà, thân thiện với giao diện đẹp mắt
- 🛒 Cung cấp hệ thống quản lý giỏ hàng và thanh toán hoàn chỉnh
- 🎬 Tích hợp không gian giải trí với Retro Cine Room
- 💬 Xây dựng cộng đồng người dùng qua Market Place và Chatbot
- 📱 Responsive design - tương thích với mọi thiết bị

### 👥 Đối tượng người dùng

- 🎵 Những người yêu thích âm nhạc analog (Vinyl, CD, Cassette)
- 📹 Collectors - người sưu tầm các sản phẩm retro
- 📷 Nhiếp ảnh viên analog/film photography enthusiasts
- 🎬 Những người đam mê điện ảnh cổ điển
- 🕰️ Bất kỳ ai muốn tìm kiếm sản phẩm vintage độc đáo

---

## ✨ Tính năng chính

### 🛍️ Tính năng người dùng

#### Quản lý tài khoản
- ✅ Đăng ký tài khoản mới với xác thực email
- ✅ Đăng nhập/Đăng xuất an toàn
- ✅ Quên mật khẩu và khôi phục tài khoản
- ✅ Quản lý thông tin cá nhân
- ✅ Lịch sử đơn hàng và theo dõi đơn hàng

#### Mua sắm
- 🛒 Duyệt sản phẩm theo danh mục và bộ lọc
- 🔍 Tìm kiếm thông minh với gợi ý real-time
- 📦 Chi tiết sản phẩm với hình ảnh front/back
- ⭐ Đánh giá và review sản phẩm
- 🛍️ Thêm vào giỏ hàng với quản lý số lượng
- 💳 Checkout với nhiều phương thức thanh toán
- 📍 Quản lý địa chỉ giao hàng

#### Tính năng giải trí
- 🎬 **Retro Cine Room** - Xem phim cổ điển
- 🎵 Spotify integration cho âm nhạc
- 🌤️ Weather widget
- 💬 Chatbot hỗ trợ 24/7

#### Cộng đồng
- 📝 **Market Place (Thread)** - Diễn đàn thảo luận
- 💬 Đăng bài, bình luận, tương tác
- 👥 Kết nối với cộng đồng người yêu retro

### 👨‍💼 Tính năng quản trị

- 📊 Dashboard quản trị với thống kê tổng quan
- 📦 Quản lý sản phẩm (CRUD operations)
- 👥 Quản lý người dùng
- 📈 Quản lý đơn hàng
- 💰 Thống kê doanh thu
- 🎬 Quản lý phim trong Cine Room
- 📰 Quản lý tin tức và bài viết

### 🎨 Tính năng nổi bật

- ⚡ **Preloader** với animation đẹp mắt
- 🎯 **Lazy loading** cho hình ảnh
- 📱 **Responsive Design** - tương thích mobile, tablet, desktop
- 🎨 **Smooth animations** và transitions
- 🔔 **Notification system** thông báo real-time
- 🌐 **Geolocation** - xác định vị trí người dùng
- 💾 **LocalStorage** - lưu trữ dữ liệu local
- 🎭 **Modal system** - confirm dialogs, popups

---

## 🛠️ Công nghệ sử dụng

### Frontend
- **HTML5** - Cấu trúc trang web semantic
- **CSS3** - Styling với Flexbox, Grid, Animations
- **JavaScript (ES6+)** - Logic và tương tác
- **Font Awesome 6.4.0** - Icon library
- **Google Fonts** - Typography (Barlow, Roboto)

### Storage
- **LocalStorage** - Lưu trữ giỏ hàng, user session
- **JSON Files** - Database tĩnh cho products, users, movies

### External APIs & Libraries
- 🎵 **Spotify Web API** - Music integration
- 🌤️ **Weather API** - Hiển thị thời tiết
- 🤖 **Chatbot API** - Hỗ trợ khách hàng tự động

---

## 📁 Cấu trúc dự án

```
Final-PTWKD/
│
├── 📄 index.html / homepage.html          # Trang chủ
├── 📄 login.html                          # Đăng nhập
├── 📄 signup.html                         # Đăng ký
├── 📄 forgot-password.html                # Quên mật khẩu
├── 📄 login-admin.html                    # Đăng nhập admin
│
├── 🛍️ PRODUCT PAGES
│   ├── audio-products.html                # Trang Audio chính
│   ├── audio-cd-products.html             # Sản phẩm CD
│   ├── audio-vinyl-products.html          # Sản phẩm Vinyl
│   ├── vhs-products.html                  # Sản phẩm VHS
│   ├── cassette-tape-products.html        # Sản phẩm Cassette
│   ├── camera-products.html               # Sản phẩm Camera
│   ├── accessory-products.html            # Phụ kiện chính
│   ├── accessory-cassette-player-products.html
│   ├── accessory-cd-player-products.html
│   ├── accessory-ipod-products.html
│   └── single-product.html                # Chi tiết sản phẩm
│
├── 🛒 SHOPPING PAGES
│   ├── checkout.html                      # Thanh toán
│   └── order-detail.html                  # Chi tiết đơn hàng
│
├── 👤 USER PAGES
│   ├── user-profile.html                  # Trang cá nhân
│   └── search-results.html                # Kết quả tìm kiếm
│
├── 🎬 ENTERTAINMENT PAGES
│   ├── retro-cine.html                    # Phòng chiếu phim
│   ├── movie.html                         # Chi tiết phim
│   └── room.html                          # Phòng giải trí
│
├── 💬 COMMUNITY PAGES
│   ├── market-place.html                  # Diễn đàn/Thread
│   └── news.html                          # Tin tức
│
├── 👨‍💼 ADMIN PAGES
│   └── admin-dashboard.html               # Dashboard quản trị
│
├── 🧪 TEST PAGES
│   └── test-auth.html                     # Test authentication
│
├── 📊 DATA FILES
│   ├── product.json                       # Database sản phẩm
│   ├── users.json                         # Database người dùng
│   └── movies.json                        # Database phim
│
└── 📂 assets/
    ├── 🎨 css/                            # Stylesheets
    │   ├── header-footer.css              # Header & Footer
    │   ├── homepage.css                   # Trang chủ
    │   ├── login.css                      # Đăng nhập/ký
    │   ├── products.css                   # Trang sản phẩm
    │   ├── single-product.css             # Chi tiết SP
    │   ├── checkout.css                   # Thanh toán
    │   ├── user-profile.css               # Profile
    │   ├── admin-style.css                # Admin
    │   ├── retro-cine.css                 # Cine room
    │   ├── market-place.css               # Market place
    │   ├── news.css                       # News
    │   ├── movie.css                      # Movie detail
    │   ├── room.css                       # Room
    │   ├── order-detail.css               # Order detail
    │   ├── preloader.css                  # Preloader
    │   ├── weather-spotify.css            # Weather/Spotify
    │   └── product-pagination.css         # Pagination
    │
    ├── 💻 js/                             # JavaScript files
    │   ├── auth.js                        # Authentication
    │   ├── cart.js                        # Shopping cart
    │   ├── checkout.js                    # Checkout logic
    │   ├── search.js                      # Search functionality
    │   ├── product-loader.js              # Load products
    │   ├── product-pagination.js          # Pagination
    │   ├── homepage-products.js           # Homepage products
    │   ├── user-profile-shipping.js       # User profile
    │   ├── admin-script.js                # Admin functions
    │   ├── chatbot.js                     # Chatbot
    │   ├── retro-cine.js                  # Cine room
    │   ├── market-place.js                # Market place
    │   ├── news.js                        # News
    │   ├── order-detail.js                # Order detail
    │   ├── quantity.js                    # Quantity handler
    │   ├── filter-dropdown.js             # Filter logic
    │   ├── category-image-map.js          # Category mapping
    │   ├── geolocation.js                 # Location services
    │   ├── notification.js                # Notifications
    │   ├── preloader.js                   # Preloader
    │   ├── room.js                        # Room features
    │   └── confirm-modal.js               # Modal dialogs
    │
    ├── 🖼️ images/                         # Image assets
    │   ├── Banner/                        # Banner images
    │   ├── Audio/
    │   │   ├── CD/                        # CD covers
    │   │   └── Vinyl/                     # Vinyl covers
    │   ├── VHS/                           # VHS covers
    │   ├── Cassette Tape/                 # Cassette images
    │   ├── Pola Camera/                   # Camera images
    │   ├── Accessories/
    │   │   ├── Cassette Player/
    │   │   ├── CD Player/
    │   │   └── IPod/
    │   ├── film VHS/                      # Film images
    │   ├── shopname.jpg                   # Logo
    │   └── video.mp4                      # Hero video
    │
    ├── 🎵 music/                          # Audio files
    │
    └── 🔤 fonts/                          # Custom fonts
```

### Chi tiết thư mục

#### `/assets/css/` - Stylesheets
Chứa tất cả file CSS được tổ chức theo từng trang/component riêng biệt để dễ quản lý và maintain.

#### `/assets/js/` - JavaScript Modules
- **Core modules**: auth.js, cart.js, search.js
- **Page-specific**: checkout.js, product-loader.js, admin-script.js
- **Features**: chatbot.js, notification.js, geolocation.js
- **UI/UX**: preloader.js, modal.js, pagination.js

#### `/assets/images/` - Media Assets
Cấu trúc thư mục images được tổ chức theo danh mục sản phẩm, giúp dễ dàng quản lý và tìm kiếm.

---

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống

- 🌐 Web Browser hiện đại (Chrome, Firefox, Safari, Edge)
- 🖥️ Web Server (Optional): Live Server, XAMPP, WAMP, hoặc Python HTTP Server
- 📝 Code Editor (Khuyên dùng): VS Code, Sublime Text

### Các bước cài đặt

1. **Clone repository**
   ```bash
   git clone https://github.com/hoquangvinh124/Final-PTWKD.git
   cd Final-PTWKD
   ```

2. **Mở với Live Server (VS Code)**
   - Cài đặt extension "Live Server" trong VS Code
   - Right-click vào `homepage.html`
   - Chọn "Open with Live Server"
   - Website sẽ mở tại `http://localhost:5500`

3. **Hoặc sử dụng Python HTTP Server**
   ```bash
   # Python 3
   python -m http.server 8000

   # Hoặc Python 2
   python -m SimpleHTTPServer 8000
   ```
   - Truy cập: `http://localhost:8000/homepage.html`

4. **Hoặc mở trực tiếp file HTML**
   - Double-click vào `homepage.html`
   - Tuy nhiên một số tính năng có thể không hoạt động do CORS policy

---

## 💻 Hướng dẫn sử dụng

### Cho người dùng

#### 1. Đăng ký tài khoản
1. Click vào icon User ở header
2. Chọn "Register"
3. Điền thông tin: Username, Email, Password
4. Click "Sign Up"

#### 2. Đăng nhập
1. Click vào icon User ở header
2. Chọn "Sign In"
3. Nhập Email và Password
4. Click "Login"

#### 3. Mua sắm
1. **Duyệt sản phẩm**: Chọn danh mục từ menu navigation
2. **Tìm kiếm**: Click icon search, nhập từ khóa
3. **Xem chi tiết**: Click vào sản phẩm
4. **Thêm vào giỏ**: Click "Add to Cart"
5. **Thanh toán**: Click icon giỏ hàng → "Proceed to Checkout"

#### 4. Sử dụng Retro Cine
1. Click menu "CINE ROOM"
2. Chọn phim muốn xem
3. Nhấn Play để thưởng thức

#### 5. Tham gia Market Place
1. Click menu "THREAD"
2. Đọc các bài viết
3. Comment hoặc tạo bài viết mới

### Cho quản trị viên

#### 1. Đăng nhập Admin
- Truy cập: `login-admin.html`
- Nhập credentials admin
- Sẽ redirect đến Admin Dashboard

#### 2. Quản lý sản phẩm
- View: Xem danh sách sản phẩm
- Add: Thêm sản phẩm mới
- Edit: Chỉnh sửa thông tin
- Delete: Xóa sản phẩm

#### 3. Quản lý đơn hàng
- Xem danh sách đơn hàng
- Cập nhật trạng thái đơn hàng
- Xem chi tiết đơn hàng

---

## 📊 Cấu trúc dữ liệu

### 1. Products (product.json)

```json
{
  "id": "1",
  "name": "Mac Demarco - This Old Dog CD",
  "description": "Tracklist:\n1. My Old Man\n2. This Old Dog...",
  "category": "Audio",
  "subcategory": "CD",
  "tags": [],
  "price": "375.000₫",
  "stock_quantity": 100,
  "is_available": true,
  "brand": {
    "id": null,
    "name": null
  },
  "image_front": "assets/images/Audio/CD/1.jpg",
  "image_back": "assets/images/Audio/CD/2.jpg",
  "album_info": {
    "tracklist": ["My Old Man", "This Old Dog", "..."]
  },
  "reviews": [
    {
      "user_id": "USER_sample",
      "comment": "Sample review.",
      "date": "2025-10-17T06:56:54.202984Z"
    }
  ]
}
```

**Các trường dữ liệu:**
- `id`: ID duy nhất của sản phẩm
- `name`: Tên sản phẩm
- `description`: Mô tả chi tiết
- `category`: Danh mục chính (Audio, VHS, Camera, Accessories)
- `subcategory`: Danh mục con (CD, Vinyl, Cassette Player, etc.)
- `price`: Giá sản phẩm (định dạng VND)
- `stock_quantity`: Số lượng tồn kho
- `is_available`: Trạng thái có sẵn
- `image_front/back`: Đường dẫn hình ảnh
- `album_info`: Thông tin album (cho sản phẩm âm nhạc)
- `reviews`: Mảng các đánh giá

### 2. Users (users.json)

```json
{
  "id": "user_1",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "full_name": "John Doe",
  "phone": "0123456789",
  "address": {
    "street": "123 Main St",
    "city": "Ho Chi Minh",
    "district": "District 1",
    "ward": "Ward 1"
  },
  "role": "customer",
  "created_at": "2024-01-01T00:00:00Z",
  "orders": []
}
```

**Roles:**
- `customer`: Khách hàng thông thường
- `admin`: Quản trị viên

### 3. Movies (movies.json)

```json
{
  "id": "movie_1",
  "title": "Movie Title",
  "description": "Movie description",
  "year": 1985,
  "genre": ["Action", "Drama"],
  "director": "Director Name",
  "poster": "assets/images/film VHS/poster.jpg",
  "video_url": "path/to/video.mp4",
  "rating": 8.5
}
```

---

## 🎨 Danh mục sản phẩm

### Audio
#### 📀 CD
- Albums từ các nghệ sĩ indie, rock, pop
- Reissue albums cổ điển
- Limited editions

#### 💿 Vinyl
- LP records (33 RPM)
- Single records (45 RPM)
- Picture discs
- Colored vinyl

### Video & Film
#### 📼 VHS
- Phim cổ điển thập niên 80-90
- Anime VHS
- Music concerts

#### 📼 Cassette Tape
- Music tapes
- Mix tapes
- Audio books

### Photography
#### 📷 Pola Camera
- Polaroid cameras
- Instant cameras
- Film packs

### Accessories
#### 🎧 Cassette Player
- Walkman-style players
- Portable cassette players
- Boombox

#### 💿 CD Player
- Portable CD players
- Discman
- Hi-Fi CD players

#### 🎵 iPod
- Classic iPods
- iPod Nano
- iPod Shuffle

---

## 📄 Danh sách trang

### Trang công khai

| Trang | File | Mô tả |
|-------|------|-------|
| Trang chủ | `homepage.html` | Landing page với hero video, featured products |
| Đăng nhập | `login.html` | Form đăng nhập cho users |
| Đăng ký | `signup.html` | Form đăng ký tài khoản mới |
| Quên mật khẩu | `forgot-password.html` | Khôi phục mật khẩu qua email |
| Sản phẩm Audio | `audio-products.html` | Danh sách sản phẩm Audio |
| Sản phẩm CD | `audio-cd-products.html` | Danh sách CD |
| Sản phẩm Vinyl | `audio-vinyl-products.html` | Danh sách Vinyl |
| Sản phẩm VHS | `vhs-products.html` | Danh sách VHS |
| Cassette Tape | `cassette-tape-products.html` | Danh sách Cassette |
| Camera | `camera-products.html` | Danh sách Camera Polaroid |
| Phụ kiện | `accessory-products.html` | Tất cả phụ kiện |
| Chi tiết SP | `single-product.html` | Trang chi tiết sản phẩm |
| Kết quả tìm kiếm | `search-results.html` | Hiển thị kết quả search |
| Retro Cine | `retro-cine.html` | Phòng chiếu phim retro |
| Chi tiết phim | `movie.html` | Xem phim |
| Market Place | `market-place.html` | Diễn đàn cộng đồng |
| Tin tức | `news.html` | Tin tức và blog |

### Trang người dùng

| Trang | File | Yêu cầu đăng nhập |
|-------|------|-------------------|
| Giỏ hàng | (Modal) | ❌ |
| Thanh toán | `checkout.html` | ✅ |
| Profile | `user-profile.html` | ✅ |
| Chi tiết đơn hàng | `order-detail.html` | ✅ |

### Trang quản trị

| Trang | File | Yêu cầu Admin |
|-------|------|---------------|
| Admin Login | `login-admin.html` | ❌ |
| Dashboard | `admin-dashboard.html` | ✅ |

---

## 🎬 Chi tiết các chức năng

### 1. Hệ thống xác thực (Authentication)

**File liên quan:** `assets/js/auth.js`

**Chức năng:**
- ✅ Đăng ký với validation
- ✅ Đăng nhập với session management
- ✅ Đăng xuất
- ✅ Remember me
- ✅ Password strength checker
- ✅ Email verification (simulated)

**LocalStorage Keys:**
- `currentUser`: Thông tin user hiện tại
- `users`: Database users local
- `isLoggedIn`: Trạng thái đăng nhập

### 2. Quản lý giỏ hàng (Shopping Cart)

**File liên quan:** `assets/js/cart.js`

**Chức năng:**
- 🛒 Thêm sản phẩm vào giỏ
- ➕➖ Tăng/giảm số lượng
- 🗑️ Xóa sản phẩm
- 💰 Tính tổng tiền tự động
- 🔔 Badge notification
- 💾 Lưu trữ persistent trong localStorage

**LocalStorage Keys:**
- `cart`: Mảng các items trong giỏ hàng

**Cart Item Structure:**
```javascript
{
  id: "product_id",
  name: "Product Name",
  price: "375.000₫",
  quantity: 2,
  image: "path/to/image.jpg"
}
```

### 3. Thanh toán (Checkout)

**File liên quan:** `assets/js/checkout.js`, `checkout.html`

**Bước thanh toán:**
1. **Cart Review**: Xem lại sản phẩm
2. **Shipping Info**: Nhập địa chỉ giao hàng
3. **Payment Method**: Chọn phương thức thanh toán
   - 💳 Credit/Debit Card
   - 🏦 Bank Transfer
   - 💵 Cash on Delivery (COD)
4. **Order Confirmation**: Xác nhận và đặt hàng

**Validation:**
- ✅ Required fields
- ✅ Email format
- ✅ Phone number format
- ✅ Address completeness

### 4. Tìm kiếm sản phẩm

**File liên quan:** `assets/js/search.js`

**Tính năng:**
- 🔍 Real-time search
- 💡 Auto-suggest
- 🎯 Search trong tên, mô tả, category
- ⚡ Debounce để tối ưu performance
- 📊 Hiển thị kết quả với thumbnail

**Search Algorithm:**
```javascript
// Tìm kiếm theo tên, category, subcategory
products.filter(product =>
  product.name.toLowerCase().includes(query) ||
  product.category.toLowerCase().includes(query) ||
  product.subcategory.toLowerCase().includes(query)
)
```

### 5. Retro Cine Room

**File liên quan:** `assets/js/retro-cine.js`, `retro-cine.html`

**Tính năng:**
- 🎬 Video player tùy chỉnh
- 🎵 Background music
- 🌤️ Weather widget
- 🎵 Spotify integration
- 📝 Movie information
- ⭐ Rating system

### 6. Market Place (Thread)

**File liên quan:** `assets/js/market-place.js`, `market-place.html`

**Tính năng:**
- 📝 Tạo bài viết mới
- 💬 Comment và reply
- 👍 Like/React
- 🖼️ Upload images
- 🏷️ Tags và categories
- 🔍 Search posts

### 7. Chatbot

**File liên quan:** `assets/js/chatbot.js`

**Tính năng:**
- 💬 24/7 support
- 🤖 Auto-responses
- 📦 Order tracking
- ❓ FAQs
- 👤 User info lookup

---

## 📦 LocalStorage Data Structure

```javascript
// Current User
localStorage.setItem('currentUser', JSON.stringify({
  id: "user_id",
  username: "username",
  email: "email@example.com",
  role: "customer"
}));

// Shopping Cart
localStorage.setItem('cart', JSON.stringify([
  {
    id: "1",
    name: "Product Name",
    price: "375.000₫",
    quantity: 2,
    image: "path/to/image.jpg"
  }
]));

// User Session
localStorage.setItem('isLoggedIn', 'true');

// Search History (Optional)
localStorage.setItem('searchHistory', JSON.stringify([
  "vinyl",
  "cassette",
  "polaroid"
]));
```

---

## 🎨 Theme & Styling

### Color Palette

```css
/* Primary Colors */
--primary: #ff6b6b;      /* Coral Red */
--secondary: #4ecdc4;    /* Turquoise */
--accent: #ffe66d;       /* Yellow */

/* Neutral Colors */
--dark: #2d3436;         /* Dark Gray */
--light: #f7f7f7;        /* Light Gray */
--white: #ffffff;

/* Status Colors */
--success: #00b894;      /* Green */
--warning: #fdcb6e;      /* Orange */
--danger: #d63031;       /* Red */
--info: #0984e3;         /* Blue */
```

### Typography

```css
/* Headings */
font-family: 'Barlow', sans-serif;
font-weight: 600-700;

/* Body Text */
font-family: 'Roboto', sans-serif;
font-weight: 300-400;

/* Font Sizes */
--fs-xs: 0.75rem;    /* 12px */
--fs-sm: 0.875rem;   /* 14px */
--fs-md: 1rem;       /* 16px */
--fs-lg: 1.25rem;    /* 20px */
--fs-xl: 1.5rem;     /* 24px */
--fs-2xl: 2rem;      /* 32px */
```

### Responsive Breakpoints

```css
/* Mobile First Approach */
--mobile: 320px;
--tablet: 768px;
--desktop: 1024px;
--wide: 1440px;
```

---

## 🔐 Tài khoản demo

### User Account
```
Email: user@example.com
Password: user123
```

### Admin Account
```
Email: admin@oldidezone.com
Password: admin123
```

**Lưu ý:** Đây là tài khoản demo, có thể không hoạt động nếu chưa setup data trong `users.json`

---

## 🐛 Xử lý lỗi và Debug

### Common Issues

#### 1. Products không load
**Nguyên nhân:** CORS policy khi mở file HTML trực tiếp
**Giải pháp:** Sử dụng web server (Live Server, Python HTTP Server)

#### 2. Images không hiển thị
**Nguyên nhân:** Đường dẫn tương đối không đúng
**Giải pháp:** Kiểm tra path trong `product.json` và file structure

#### 3. LocalStorage không hoạt động
**Nguyên nhân:** Browser privacy settings
**Giải pháp:** Enable cookies và local storage trong browser settings

#### 4. Checkout không hoạt động
**Nguyên nhân:** Chưa đăng nhập
**Giải pháp:** Đảm bảo user đã đăng nhập trước khi checkout

### Debug Mode

Thêm vào console để debug:
```javascript
// Check current user
console.log(localStorage.getItem('currentUser'));

// Check cart
console.log(JSON.parse(localStorage.getItem('cart')));

// Check all localStorage
console.log(localStorage);
```

---

## 🚀 Triển khai (Deployment)

### GitHub Pages

1. Push code lên GitHub repository
2. Vào Settings → Pages
3. Chọn branch `main` và folder `/` (root)
4. Save và đợi deployment
5. Truy cập: `https://username.github.io/Final-PTWKD/homepage.html`

### Netlify

1. Đăng ký tài khoản Netlify
2. New site from Git
3. Connect với GitHub repository
4. Build settings:
   - Build command: (để trống)
   - Publish directory: `/`
5. Deploy site

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd Final-PTWKD
vercel
```

---

## 📈 Roadmap

### Version 1.0 (Current)
- ✅ Basic e-commerce functionality
- ✅ User authentication
- ✅ Shopping cart & checkout
- ✅ Product catalog
- ✅ Retro Cine Room
- ✅ Market Place
- ✅ Admin dashboard

### Version 2.0 (Planned)
- 🔄 Backend integration (Node.js + Express)
- 🔄 Database migration (MongoDB/PostgreSQL)
- 🔄 Real payment gateway integration
- 🔄 Email notifications
- 🔄 Advanced search with filters
- 🔄 Wishlist functionality
- 🔄 Product comparison
- 🔄 Multi-language support

### Version 3.0 (Future)
- 🌟 Mobile app (React Native)
- 🌟 AI-powered recommendations
- 🌟 Social media integration
- 🌟 Live chat support
- 🌟 Virtual try-on (AR)
- 🌟 Subscription service
- 🌟 Loyalty program

---

## 🤝 Đóng góp

Chúng tôi rất hoan nghênh mọi đóng góp từ cộng đồng!

### Quy trình đóng góp

1. **Fork repository**
   ```bash
   # Click nút Fork trên GitHub
   ```

2. **Clone fork của bạn**
   ```bash
   git clone https://github.com/your-username/Final-PTWKD.git
   cd Final-PTWKD
   ```

3. **Tạo branch mới**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Commit changes**
   ```bash
   git add .
   git commit -m "Add: description of your changes"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Tạo Pull Request**
   - Vào GitHub repository
   - Click "New Pull Request"
   - Mô tả chi tiết changes của bạn

### Code Style Guidelines

- ✅ Sử dụng indentation 2 spaces
- ✅ Comment code rõ ràng (tiếng Việt hoặc tiếng Anh)
- ✅ Đặt tên biến/hàm có ý nghĩa
- ✅ Follow existing code structure
- ✅ Test trước khi commit

### Các loại đóng góp

- 🐛 **Bug fixes**: Sửa lỗi và cải thiện
- ✨ **New features**: Thêm tính năng mới
- 📝 **Documentation**: Cải thiện tài liệu
- 🎨 **UI/UX**: Cải thiện giao diện
- ⚡ **Performance**: Tối ưu hiệu năng
- ♻️ **Refactoring**: Cải thiện code quality

---

## 📝 License

Dự án này được phân phối dưới **MIT License**.

```
MIT License

Copyright (c) 2024 OLDIE ZONE

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Tác giả

**Team OLDIE ZONE**

- 👤 **Hồ Quang Vinh** - *Lead Developer*
  - GitHub: [@hoquangvinh124](https://github.com/hoquangvinh124)

- 👥 **Contributors**
  - Xem danh sách đầy đủ tại [Contributors](https://github.com/hoquangvinh124/Final-PTWKD/graphs/contributors)

---

## 🙏 Cảm ơn

Xin gửi lời cảm ơn đến:

- 🎨 **Font Awesome** - Icon library
- 🔤 **Google Fonts** - Typography
- 🎵 **Spotify** - Music API
- 🌤️ **OpenWeatherMap** - Weather API
- 📚 **MDN Web Docs** - Documentation
- 💡 **Stack Overflow** - Community support
- 🎓 **Trường Đại học...** - Hỗ trợ dự án

---

## 📞 Liên hệ & Hỗ trợ

### Support

- 📧 **Email**: support@oldidezone.com
- 💬 **Discord**: [Join our server](#)
- 🐦 **Twitter**: [@OldieZone](#)
- 📘 **Facebook**: [OLDIE ZONE](#)

### Báo lỗi

Nếu bạn tìm thấy bug hoặc có đề xuất, vui lòng:
1. Kiểm tra [Issues](https://github.com/hoquangvinh124/Final-PTWKD/issues) đã tồn tại
2. Tạo [New Issue](https://github.com/hoquangvinh124/Final-PTWKD/issues/new) với mô tả chi tiết

### FAQ

**Q: Website có phiên bản mobile app không?**
A: Hiện tại chưa có, nhưng website đã responsive và hoạt động tốt trên mobile browser.

**Q: Có thể thanh toán thật không?**
A: Version hiện tại chỉ là demo, chưa tích hợp payment gateway thật.

**Q: Source code có thể sử dụng cho dự án thương mại?**
A: Có, theo MIT License bạn có thể sử dụng tự do.

**Q: Làm sao để thêm sản phẩm mới?**
A: Chỉnh sửa file `product.json` và thêm hình ảnh vào thư mục tương ứng.

---

<div align="center">

### ⭐ Nếu bạn thấy dự án hữu ích, hãy cho chúng tôi một star!

**Made with ❤️ by OLDIE ZONE Team**

[⬆ Back to top](#-oldie-zone---retro-sound--vintage-collection)

</div>
