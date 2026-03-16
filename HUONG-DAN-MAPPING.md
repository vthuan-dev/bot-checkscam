# Hướng dẫn quản lý Facebook ID Mapping

## 🎯 Vấn đề

Bot hiện chỉ có **7 mapping đã verify** chính xác. Các mapping khác đã bị xóa vì không match đúng thực tế.

## ✅ Mapping hiện tại (đã verify)

1. `100052185460324` → Nguyễn Văn Tài (STT: 177)
2. `61588203634595` → Nguyễn Vân (STT: 159) 
3. `100045800718530` → Nguyễn Hoàng Dương (STT: 1)
4. `100039629906753` → Tống Hoàng Phương Dương (STT: 2)
5. `692606902` → Nguyễn Hồng Dương (STT: 3)
6. `100015075061788` → Phan Anh Quân (STT: 17) ✅ **Đã test**
7. `100139661479` → Khang Khang (STT: 22) ✅ **Đã test**

## 🔧 Cách thêm mapping mới (CHÍNH XÁC)

### Bước 1: Test trong Telegram
1. Gửi link Facebook vào bot
2. Nếu bot trả lời "🕵️ Chưa xác định" → Note lại Facebook ID

### Bước 2: Thêm mapping chính xác
```bash
node add-mapping.js
```

**Ví dụ:**
```
🔗 Nhập Facebook ID: 100015075061788
👤 Nhập tên admin: Phan Anh Quân
🔍 Kết quả tìm kiếm:
1. Phan Anh Quân (STT: 17)
Chọn admin: 1
✅ Đã thêm mapping!
```

### Bước 3: Restart bot
```bash
# Stop bot hiện tại
pm2 stop checkscam-bot

# Start lại
pm2 start bot-simple.js --name checkscam-bot
```

### Bước 4: Test lại
Gửi lại link Facebook để verify mapping đã đúng.

## 🧪 Tools có sẵn

### 1. `add-mapping.js` - Thêm mapping mới
- Interactive tool
- Tìm kiếm admin theo tên
- Verify trước khi save

### 2. `reset-to-verified-mapping.js` - Reset về mapping sạch
- Chỉ giữ mapping đã verify
- Xóa mapping sai/random

### 3. `check-and-fix-mapping.js` - Tool kiểm tra toàn diện
- Check mapping hiện tại
- Batch check unmapped IDs
- Fix mapping sai

## 📋 Workflow khuyến nghị

1. **Khi có link Facebook mới:**
   - Test trong Telegram bot
   - Nếu "Chưa xác định" → Dùng `add-mapping.js`
   - Verify bằng cách test lại

2. **Khi mapping sai:**
   - Dùng `add-mapping.js` để fix (ghi đè)
   - Restart bot
   - Test lại

3. **Khi cần clean up:**
   - Dùng `reset-to-verified-mapping.js`
   - Bắt đầu lại với mapping sạch

## 🎯 Mục tiêu

- **Chất lượng > Số lượng**: Chỉ giữ mapping chính xác
- **Verify từng mapping**: Test thực tế trước khi save
- **Dễ maintain**: Tools đơn giản, dễ sử dụng

## 📊 Thống kê hiện tại

- ✅ **7 mapping verified** (100% chính xác)
- 📱 **287 Facebook ID** trong database (chưa map)
- 🎯 **Coverage**: ~2.4% (7/287)

**Chiến lược**: Thêm mapping từ từ, chỉ khi cần thiết và đã verify chính xác! 🚀