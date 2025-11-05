# AWS Identity Pool Setup Guide - Hướng Dẫn Tiếng Việt

Hướng dẫn cài đặt AWS Cognito Identity Pool để sử dụng AWS Location Service với GPS address detection.

## 📋 Tổng Quan

**AWS Identity Pool** cho phép ứng dụng browser (client-side) gọi AWS services một cách an toàn mà **KHÔNG CẦN** lưu API keys trong code.

### Ưu Điểm của Identity Pool:
- ✅ Không cần hardcode API keys trong JavaScript
- ✅ An toàn hơn cho ứng dụng public web
- ✅ Tự động tạo temporary credentials cho mỗi request
- ✅ Kiểm soát permissions chi tiết qua IAM roles
- ✅ Free tier: 50,000 requests/month cho 12 tháng đầu

---

## Bước 1: Tạo Place Index (Nếu Chưa Có)

### 1.1 Truy Cập AWS Location Service

1. Đăng nhập vào [AWS Console](https://console.aws.amazon.com/)
2. Chọn region: **Asia Pacific (Sydney) ap-southeast-2**
3. Tìm kiếm **"Location Service"** và click vào

### 1.2 Tạo Place Index

1. Click **Place indexes** ở menu bên trái
2. Click **Create place index**
3. Điền thông tin:
   - **Name**: `OldieZone-PlaceIndex` (hoặc tên bạn muốn)
   - **Data provider**: Chọn **Esri** hoặc **HERE**
   - **Data storage location**: Chọn region của bạn
4. Click **Create place index**
5. **Lưu lại tên Place Index** này (bạn sẽ cần sau)

**Ví dụ Place Index Name:** `OldieZone-PlaceIndex`

---

## Bước 2: Tạo Identity Pool

### 2.1 Truy Cập Amazon Cognito

1. Trong AWS Console, tìm kiếm **"Cognito"**
2. Click vào **Amazon Cognito**
3. Đảm bảo bạn đang ở đúng region: **ap-southeast-2**

### 2.2 Tạo Identity Pool Mới

1. Click **Identity pools** (hoặc **Federated Identities**)
2. Click **Create identity pool** (hoặc **Create new identity pool**)

3. **Điền thông tin:**

   **Identity pool name:**
   ```
   OldieZoneGPSPool
   ```

4. **Enable access to unauthenticated identities:**
   - ✅ **Tick vào** "Enable access to unauthenticated identities"
   - Điều này cho phép người dùng CHƯA ĐĂNG NHẬP cũng có thể dùng GPS

5. **Authentication providers:**
   - Không cần cấu hình gì (để trống)

6. Click **Create pool**

### 2.3 Cấu Hình IAM Roles

Sau khi tạo, AWS sẽ tự động tạo 2 IAM roles:
- **Authenticated role**: Cho user đã login
- **Unauthenticated role**: Cho user chưa login (anonymous)

AWS sẽ hỏi bạn có muốn tạo roles này không:

1. Click **Allow** để AWS tự tạo roles
2. Hoặc click **View Details** để xem và chỉnh sửa permissions

### 2.4 Lấy Identity Pool ID

Sau khi tạo xong, bạn sẽ thấy **Identity Pool ID**:

**Ví dụ:**
```
ap-southeast-2:12345678-1234-1234-1234-123456789abc
```

**📝 Lưu lại ID này - bạn sẽ cần nó để config ứng dụng!**

---

## Bước 3: Cấu Hình IAM Permissions cho Unauthenticated Role

### 3.1 Tìm Unauthenticated Role

1. Trong AWS Console, tìm kiếm **"IAM"**
2. Click **Roles** ở menu bên trái
3. Tìm role có tên dạng: `Cognito_OldieZoneGPSPoolUnauth_Role`
4. Click vào role đó

### 3.2 Thêm Policy cho AWS Location Service

1. Trong role page, click tab **Permissions**
2. Click **Add permissions** → **Create inline policy**

3. Chọn **JSON** tab và paste code sau:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "geo-places:ReverseGeocode"
            ],
            "Resource": "arn:aws:geo-places:ap-southeast-2::provider/default"
        },
        {
            "Effect": "Allow",
            "Action": [
                "geo:SearchPlaceIndexForPosition"
            ],
            "Resource": "arn:aws:geo:ap-southeast-2:*:place-index/OldieZone-PlaceIndex"
        }
    ]
}
```

**⚠️ QUAN TRỌNG:**
- Thay `ap-southeast-2` bằng region của bạn nếu khác
- Thay `OldieZone-PlaceIndex` bằng tên Place Index bạn tạo ở Bước 1

4. Click **Review policy**
5. Đặt tên policy: `OldieZoneLocationServicePolicy`
6. Click **Create policy**

---

## Bước 4: Cấu Hình Ứng Dụng

### 4.1 Mở File `geolocation.js`

Mở file `/assets/js/geolocation.js` và tìm dòng 9-14:

```javascript
const AWS_CONFIG = {
  identityPoolId: 'YOUR_IDENTITY_POOL_ID',
  region: 'ap-southeast-2',
  placeIndexName: 'YOUR_PLACE_INDEX_NAME',
  language: 'vi'
};
```

### 4.2 Điền Thông Tin Của Bạn

```javascript
const AWS_CONFIG = {
  identityPoolId: 'ap-southeast-2:12345678-1234-1234-1234-123456789abc', // Thay bằng Identity Pool ID của bạn
  region: 'ap-southeast-2', // Region của bạn
  placeIndexName: 'OldieZone-PlaceIndex', // Tên Place Index của bạn
  language: 'vi' // Tiếng Việt
};
```

### 4.3 Lưu File

Lưu file `geolocation.js` sau khi đã sửa.

---

## Bước 5: Test Chức Năng GPS

### 5.1 Mở Ứng Dụng Trong Browser

1. Mở ứng dụng của bạn trong browser
2. Vào **User Profile** → **Shipping Address** tab
3. Click nút **"Use My Current Location (GPS)"**

### 5.2 Kiểm Tra Console

Mở **Browser Console** (F12) và kiểm tra logs:

**✅ Thành công - bạn sẽ thấy:**
```
Loading AWS SDK v3 from CDN...
AWS Location Service SDK loaded successfully
Using Identity Pool: ap-southeast-2:xxxx-xxxx-xxxx
GPS Location: {latitude: 10.xxxx, longitude: 106.xxxx, accuracy: 15}
GPS Accuracy: 15m
AWS Reverse Geocoding Request: {IndexName: "OldieZone-PlaceIndex", Position: [106.xxxx, 10.xxxx], ...}
AWS Geocoding Response: {Results: [...]}
AWS Place Details: {AddressNumber: "123", Street: "Nguyễn Văn Linh", ...}
Detailed address filled: "123 Nguyễn Văn Linh, Phường Tân Phú, Quận 7"
```

**❌ Lỗi phổ biến:**

1. **"AWS Identity Pool not configured"**
   - Kiểm tra lại `identityPoolId` trong `geolocation.js`
   - Đảm bảo không còn là `YOUR_IDENTITY_POOL_ID`

2. **"NotAuthorizedException"**
   - IAM permissions chưa đúng
   - Quay lại Bước 3 và kiểm tra lại IAM policy

3. **"ResourceNotFoundException"**
   - Place Index name sai hoặc không tồn tại
   - Kiểm tra lại `placeIndexName` trong `geolocation.js`

---

## 💰 Chi Phí & Free Tier

### Free Tier (12 tháng đầu)
- **50,000 reverse geocoding requests/month** - FREE
- Áp dụng cho tài khoản AWS mới

### Sau Free Tier
- **$5.00 per 1,000 requests**
- Ví dụ chi phí:
  - 1,000 requests/tháng = $5.00
  - 10,000 requests/tháng = $50.00

### Tính Toán Chi Phí

Giả sử:
- 100 users/ngày click GPS
- 30 ngày/tháng
- = **3,000 requests/tháng** = **$15.00/tháng** (sau free tier)

---

## 🔒 Bảo Mật & Best Practices

### 1. Restrict Permissions
Chỉ cấp quyền **ReverseGeocode** - KHÔNG cấp toàn bộ Location Service permissions.

✅ **Đúng:**
```json
"Action": ["geo-places:ReverseGeocode"]
```

❌ **SAI (quá rộng):**
```json
"Action": ["geo:*"]
```

### 2. Enable CloudWatch Logging

1. Vào **AWS CloudWatch**
2. Tạo Log Group cho Location Service
3. Monitor số lượng requests để tránh vượt budget

### 3. Set Billing Alerts

1. Vào **AWS Billing** → **Budgets**
2. Tạo budget alerts:
   - Alert at $5
   - Alert at $10
   - Alert at $20
3. Nhận email khi gần đến ngưỡng

### 4. Rate Limiting (Optional)

Trong code, thêm rate limiting để tránh spam:

```javascript
let lastGPSRequest = 0;
const MIN_REQUEST_INTERVAL = 5000; // 5 seconds

async function getAddressWithRateLimit() {
  const now = Date.now();
  if (now - lastGPSRequest < MIN_REQUEST_INTERVAL) {
    throw new Error('Please wait 5 seconds between GPS requests');
  }
  lastGPSRequest = now;
  return await getAddressFromGPS(...);
}
```

---

## 🐛 Troubleshooting (Xử Lý Lỗi)

### Lỗi 1: "Cannot read property 'send' of null"
**Nguyên nhân:** AWS SDK chưa load xong
**Giải pháp:** Đảm bảo `await loadAWSSDK()` được gọi trước khi dùng client

### Lỗi 2: "Identity Pool not found"
**Nguyên nhân:** Identity Pool ID sai hoặc ở sai region
**Giải pháp:**
- Kiểm tra region trong AWS Console và `geolocation.js` phải giống nhau
- Verify Identity Pool ID format: `region:uuid`

### Lỗi 3: "AccessDeniedException"
**Nguyên nhân:** IAM role chưa có permissions
**Giải pháp:**
- Vào IAM → Roles → Tìm Cognito Unauth Role
- Kiểm tra policy có action `geo:SearchPlaceIndexForPosition`
- Kiểm tra Resource ARN đúng với Place Index name

### Lỗi 4: "CORS error loading from esm.sh"
**Nguyên nhân:** Browser block cross-origin module loading
**Giải pháp:**
- Thử mở page qua HTTP server (không phải `file://`)
- Hoặc thay CDN sang unpkg: `https://unpkg.com/@aws-sdk/client-location@3.621.0`

### Lỗi 5: "No address found for this location"
**Nguyên nhân:** GPS coordinates ở vùng không có dữ liệu
**Giải pháp:**
- Ứng dụng sẽ tự động fallback sang OpenStreetMap
- Hoặc người dùng nhập địa chỉ thủ công

---

## 📊 So Sánh: Identity Pool vs API Key

| Feature | Identity Pool | API Key |
|---------|---------------|---------|
| **Bảo mật** | ✅ Cao (temporary credentials) | ⚠️ Thấp hơn (static key in code) |
| **Setup** | Medium (nhiều bước) | Easy (1 key) |
| **Browser Support** | ✅ Tốt | ✅ Tốt |
| **Permissions** | Chi tiết (IAM roles) | Đơn giản (per key) |
| **Monitoring** | ✅ CloudWatch | ✅ CloudWatch |
| **Recommended for** | Production apps | Prototype, testing |

**🎯 Khuyến nghị:** Dùng **Identity Pool** cho production để bảo mật tốt hơn.

---

## 📚 Tài Liệu Tham Khảo

- **AWS Cognito Identity Pools**: https://docs.aws.amazon.com/cognito/latest/developerguide/identity-pools.html
- **AWS Location Service**: https://docs.aws.amazon.com/location/
- **IAM Policies**: https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html
- **Pricing**: https://aws.amazon.com/location/pricing/

---

## ✅ Checklist

Đánh dấu các bước bạn đã hoàn thành:

- [ ] Tạo Place Index trong AWS Location Service
- [ ] Tạo Cognito Identity Pool
- [ ] Enable "unauthenticated access" trong Identity Pool
- [ ] Lấy Identity Pool ID và lưu lại
- [ ] Tìm Unauthenticated IAM Role
- [ ] Thêm inline policy cho Location Service permissions
- [ ] Cấu hình `geolocation.js` với Identity Pool ID và Place Index Name
- [ ] Test GPS trong User Profile page
- [ ] Kiểm tra console logs xem có address data
- [ ] Set up billing alerts trong AWS
- [ ] Monitor usage trong CloudWatch

---

## 🆘 Cần Trợ Giúp?

Nếu gặp vấn đề:

1. **Kiểm tra Browser Console** (F12) xem error logs
2. **Kiểm tra AWS CloudWatch Logs** xem request logs
3. **Verify IAM Permissions** ở Cognito Unauth Role
4. **Test với OpenStreetMap** (comment out AWS config để test fallback)

---

**Phiên bản:** 1.0
**Cập nhật:** 2025-11-05
**Region mẫu:** ap-southeast-2 (Sydney)
