// Test bot đơn giản - chỉ xử lý link có số

// Simulate extractFacebookId function
const extractFacebookId = (url) => {
  console.log(`🔍 Extracting ID from: ${url}`);
  
  // Chỉ xử lý các pattern có số (Facebook ID)
  const patterns = [
    /(?:profile\.php\?id=)(\d+)/,           // profile.php?id=123456789
    /facebook\.com\/(\d+)/,                 // facebook.com/123456789
    /fb\.com\/(\d+)/,                       // fb.com/123456789
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const facebookId = match[1];
      console.log(`✅ Facebook ID found: ${facebookId}`);
      return facebookId;
    }
  }
  
  console.log(`❌ No Facebook ID found (link không có số)`);
  return null;
};

// Test cases
const testUrls = [
  // ✅ Supported (có số)
  'https://www.facebook.com/profile.php?id=100052185460324',
  'https://facebook.com/100052185460324',
  'https://fb.com/61588203634595',
  'facebook.com/692606902',
  
  // ❌ Not supported (không có số)
  'https://facebook.com/thanhnam120407',
  'https://www.facebook.com/bichtuyen',
  'https://fb.com/nguyenhoangduong',
  'facebook.com/zuck'
];

console.log('🧪 Testing Simple Bot - Chỉ xử lý link có số\n');

testUrls.forEach((url, index) => {
  console.log(`\n${index + 1}. Testing: ${url}`);
  const result = extractFacebookId(url);
  console.log(`   Result: ${result || 'IGNORED (không có số)'}`);
  console.log('   ' + '-'.repeat(50));
});

console.log('\n✅ Test completed!');
console.log('\n📋 Kết luận:');
console.log('✅ Bot chỉ xử lý link Facebook có số ID');
console.log('❌ Link dạng facebook.com/username sẽ bị bỏ qua');
console.log('🎯 Đơn giản, ổn định, không phức tạp!');