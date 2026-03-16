import { findAdminByFacebookUrl, getAllAdminsWithFacebook } from './facebook-admin-lookup.js';

console.log('🧪 Test Bot Complete Functionality\n');

// Test 1: Kiểm tra database
console.log('=== Test 1: Database Stats ===');
const allAdmins = getAllAdminsWithFacebook();
console.log(`✅ Tổng admin có Facebook: ${allAdmins.length}`);

// Test 2: Random admin test
console.log('\n=== Test 2: Random Admin Test ===');
if (allAdmins.length > 0) {
    const randomAdmin = allAdmins[Math.floor(Math.random() * allAdmins.length)];
    console.log(`🎲 Random admin: ${randomAdmin.name}`);
    console.log(`📘 Facebook: ${randomAdmin.facebookUrl}`);
    
    // Test lookup
    const lookupResult = findAdminByFacebookUrl(randomAdmin.facebookUrl);
    if (lookupResult && lookupResult.name === randomAdmin.name) {
        console.log('✅ Lookup test PASSED');
    } else {
        console.log('❌ Lookup test FAILED');
    }
}

// Test 3: Bot response simulation
console.log('\n=== Test 3: Bot Response Simulation ===');
const testMessages = [
    'https://www.facebook.com/profile.php?id=100013965611470',
    'Check link này: https://www.facebook.com/profile.php?id=100005959991439',
    'https://www.facebook.com/profile.php?id=999999999999999',
    'Xin chào mọi người!'
];

testMessages.forEach((msg, index) => {
    console.log(`\n${index + 1}. Message: "${msg}"`);
    
    const facebookLinkRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/[^\s]+/gi;
    const facebookLinks = msg.match(facebookLinkRegex);
    
    if (facebookLinks) {
        const admin = findAdminByFacebookUrl(facebookLinks[0]);
        if (admin) {
            console.log(`   ✅ Found: ${admin.name}`);
        } else {
            console.log(`   ❌ Not found in database`);
        }
    } else {
        console.log(`   ℹ️  No Facebook link detected`);
    }
});

console.log('\n🎉 All tests completed!');