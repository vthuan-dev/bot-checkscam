console.log('🤖 Demo Bot Standard Responses\n');

console.log('=== CASE 1: Facebook URL - FOUND ===');
console.log('User: https://www.facebook.com/profile.php?id=100013965611470');
console.log('Bot:');
console.log(`🕵️ FB Real của: "Khang Khang"
🎖 GDV này có bảo hiểm tại Checkscam.vn
🔗 https://admin.checkscam.vn/khang-khang/`);

console.log('\n=== CASE 2: Facebook URL - NOT FOUND ===');
console.log('User: https://www.facebook.com/profile.php?id=999999999');
console.log('Bot:');
console.log(`🕵️ Chưa xác định.
❌ Không phải GDV của Checkscam.vn`);

console.log('\n=== CASE 3: Phone Number - FOUND ===');
console.log('User: Check số này: 0763666222');
console.log('Bot:');
console.log(`🕵️ FB Real của: "Duy Nguyễn"
🎖 GDV này có bảo hiểm tại Checkscam.vn
🔗 https://admin.checkscam.vn/duy-nguyen/`);

console.log('\n=== CASE 4: Phone Number - NOT FOUND ===');
console.log('User: 0987654321');
console.log('Bot:');
console.log(`🕵️ Chưa xác định.
❌ Không phải GDV của Checkscam.vn`);

console.log('\n=== CASE 5: Bank Account - FOUND ===');
console.log('User: STK này: 0491000133345');
console.log('Bot:');
console.log(`🕵️ FB Real của: "Duy Nguyễn"
🎖 GDV này có bảo hiểm tại Checkscam.vn
🔗 https://admin.checkscam.vn/duy-nguyen/`);

console.log('\n=== CASE 6: Bank Account - NOT FOUND ===');
console.log('User: 1234567890123456');
console.log('Bot:');
console.log(`🕵️ Chưa xác định.
❌ Không phải GDV của Checkscam.vn`);

console.log('\n🎯 Format chuẩn cho mọi trường hợp:');
console.log('✅ FOUND: 🕵️ FB Real của: "[Tên Admin]" + 🎖 + 🔗');
console.log('❌ NOT FOUND: 🕵️ Chưa xác định. + ❌ Không phải GDV');
console.log('\n🚀 Bot ready to deploy!');