# Hướng dẫn tạo Facebook App để lấy API credentials

## Bước 1: Tạo Facebook App
1. Truy cập: https://developers.facebook.com/
2. Đăng nhập bằng tài khoản Facebook
3. Click "My Apps" → "Create App"
4. Chọn "Consumer" → "Next"
5. Nhập tên app (ví dụ: "CheckScam Bot")
6. Nhập email liên hệ
7. Click "Create App"

## Bước 2: Lấy App ID và App Secret
1. Trong dashboard app, vào "Settings" → "Basic"
2. Copy **App ID** 
3. Click "Show" để xem **App Secret** (cần nhập mật khẩu Facebook)
4. Copy **App Secret**

## Bước 3: Cấu hình trong bot
1. Mở file `.env`
2. Thêm 2 dòng:
```
FACEBOOK_APP_ID=your_app_id_here
FACEBOOK_APP_SECRET=your_app_secret_here
```

## Bước 4: Test API
- Bot sẽ tự động sử dụng API khi có Facebook username
- Nếu API fail, bot sẽ fallback về mapping cũ
- Rate limit: 200 requests/hour (đủ dùng)

## Lưu ý bảo mật
- Không share App Secret với ai
- Không commit App Secret lên Git
- Chỉ sử dụng App Token (App ID + App Secret)

## Kiểm tra hoạt động
Bot sẽ log khi sử dụng API:
```
🔄 Facebook API: "username" → "123456789"
❌ Facebook API failed for "username": error message
```