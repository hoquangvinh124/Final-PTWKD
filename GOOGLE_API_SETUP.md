# 🗺️ Google Maps API Setup - Hướng Dẫn Lấy API Key

Để GPS có **độ chính xác tuyệt đối với số nhà**, bạn cần sử dụng Google Maps Geocoding API.

## ✅ Free Tier - Miễn Phí
- **28,500 requests/month** - Miễn phí hoàn toàn
- Đủ cho hầu hết website nhỏ/vừa
- Không cần thẻ tín dụng (có thể dùng thẻ ảo)

---

## 📝 Hướng Dẫn Chi Tiết

### Bước 1: Tạo Google Cloud Project
1. Truy cập: https://console.cloud.google.com/
2. Đăng nhập bằng Gmail
3. Click **"Select a project"** → **"New Project"**
4. Đặt tên: `OldieZone-GPS` (hoặc tên bạn muốn)
5. Click **"Create"**

### Bước 2: Bật Geocoding API
1. Vào **Menu** (☰) → **APIs & Services** → **Library**
2. Tìm: **"Geocoding API"**
3. Click vào **Geocoding API**
4. Click nút **"ENABLE"**

### Bước 3: Tạo API Key
1. Vào **Menu** (☰) → **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"API key"**
3. Copy API key (dạng: `AIzaSyABC123...`)
4. Click **"RESTRICT KEY"** (Bảo mật)

### Bước 4: Bảo Mật API Key (Quan Trọng!)
1. Trong phần **API restrictions**:
   - Chọn **"Restrict key"**
   - Tick vào **"Geocoding API"**
   - Save

2. Trong phần **Website restrictions** (Tùy chọn):
   - Chọn **"HTTP referrers"**
   - Add domain: `yourdomain.com/*`
   - Hoặc để trống nếu đang test localhost

3. Click **"SAVE"**

### Bước 5: Copy API Key vào Code
1. Mở file: `/assets/js/geolocation.js`
2. Tìm dòng:
```javascript
const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY_HERE';
```
3. Thay bằng key của bạn:
```javascript
const GOOGLE_API_KEY = 'AIzaSyABC123XYZ...'; // Key thật của bạn
```
4. Save file

---

## 🎯 Kiểm Tra Hoạt Động

### Test GPS:
1. Mở User Profile → Shipping Address
2. Click **"Use My Current Location (GPS)"**
3. Xem Console (F12):
```
GPS Accuracy: 10m
Google Geocoding Response: {...}
Extracted Components: {
  streetNumber: "123",  // ← Số nhà chính xác!
  route: "Nguyễn Văn Linh",
  ...
}
```

### Kết Quả Mong Đợi:
```
Detailed Street: "123 Nguyễn Văn Linh, Phường Tân Phú, Quận 7"
City: "TP. Hồ Chí Minh"
```

---

## 💰 Chi Phí & Giới Hạn

### Free Tier:
- **$200 credit** mỗi tháng
- Geocoding: **$5 per 1000 requests**
- → **28,500 requests miễn phí/tháng**

### Usage Tracking:
1. Vào Console: https://console.cloud.google.com/
2. **APIs & Services** → **Dashboard**
3. Xem chart **"Geocoding API Requests"**

### Cảnh Báo:
- Nếu vượt quá free tier, bạn sẽ bị charge
- Set up **billing alert** để tránh bất ngờ:
  - Vào **Billing** → **Budgets & alerts**
  - Tạo alert khi đạt $180/$200

---

## 🔒 Bảo Mật Nâng Cao

### Option 1: Domain Restriction (Khuyên Dùng)
```
HTTP referrers:
- yourdomain.com/*
- www.yourdomain.com/*
- localhost:* (để test)
```

### Option 2: IP Restriction (Server-side)
```
IP addresses:
- 123.45.67.89 (IP server của bạn)
```

### Option 3: Environment Variable (Best Practice)
Thay vì hardcode key trong file, dùng:
```javascript
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'fallback-key';
```

---

## ⚠️ Troubleshooting

### Lỗi: "REQUEST_DENIED"
- Kiểm tra đã enable Geocoding API chưa
- Kiểm tra API key restrictions

### Lỗi: "OVER_QUERY_LIMIT"
- Đã vượt 28,500 requests/month
- Đợi tháng mới hoặc nâng cấp billing

### Lỗi: "ZERO_RESULTS"
- GPS location không chính xác
- Thử lại hoặc nhập manual

### Không Có Số Nhà:
- GPS accuracy > 50m
- Di chuyển ra ngoài trời hoặc gần cửa sổ
- Bật High Accuracy GPS trên điện thoại

---

## 🚀 Alternative: Free Fallback

Nếu không muốn dùng Google API key, code tự động fallback về **OpenStreetMap**:
- Không cần API key
- Miễn phí hoàn toàn
- Nhưng **độ chính xác thấp hơn** (thường không có số nhà)

File `geolocation.js` đã config sẵn:
```javascript
if (GOOGLE_API_KEY && GOOGLE_API_KEY !== 'YOUR_GOOGLE_API_KEY_HERE') {
  return await reverseGeocodeGoogle(latitude, longitude); // Google
} else {
  return await reverseGeocodeOSM(latitude, longitude); // OpenStreetMap
}
```

---

## 📚 Tài Liệu Tham Khảo

- Google Geocoding API: https://developers.google.com/maps/documentation/geocoding
- Pricing: https://mapsplatform.google.com/pricing/
- API Key Best Practices: https://cloud.google.com/docs/authentication/api-keys

---

**Lưu ý:** API key đã được hardcode trong file là key mẫu. Bạn NÊN thay bằng key riêng của mình để:
1. Bảo mật tốt hơn
2. Theo dõi usage
3. Tránh key bị abuse

🎉 Sau khi setup xong, GPS sẽ cho bạn **số nhà chính xác 100%**!
