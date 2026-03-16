import { findAdminByFacebookUrl, findAdminByName, formatAdminInfo } from './facebook-admin-lookup.js';

console.log('🧪 Testing Facebook Admin Lookup...\n');

// Test cases
const testCases = [
    {
        name: 'Khang Khang',
        url: 'https://www.facebook.com/profile.php?id=100013965611470'
    },
    {
        name: 'Nguyễn Hoàng Dương', 
        url: 'https://www.facebook.com/profile.php?id=100005959991439'
    },
    {
        name: 'URL không tồn tại',
        url: 'https://www.facebook.com/profile.php?id=999999999999999'
    }
];

// Test tìm admin bằng Facebook URL
console.log('=== Test tìm admin bằng Facebook URL ===');
testCases.forEach((testCase, index) => {
    console.log(`\n${index + 1}. Test: ${testCase.name}`);
    console.log(`URL: ${testCase.url}`);
    
    const result = findAdminByFacebookUrl(testCase.url);
    if (result) {
        console.log('✅ Kết quả:');
        console.log(formatAdminInfo(result));
    } else {
        console.log('❌ Không tìm thấy admin');
    }
    console.log('---');
});

// Test tìm admin bằng tên
console.log('\n=== Test tìm admin bằng tên ===');
const nameTests = ['Khang', 'Nguyễn', 'Dương', 'xyz123'];

nameTests.forEach(name => {
    console.log(`\nTìm kiếm: "${name}"`);
    const results = findAdminByName(name);
    
    if (results.length > 0) {
        console.log(`✅ Tìm thấy ${results.length} kết quả:`);
        results.forEach((admin, index) => {
            console.log(`${index + 1}. ${admin.name}`);
        });
    } else {
        console.log('❌ Không tìm thấy');
    }
});

console.log('\n🎉 Test hoàn thành!');