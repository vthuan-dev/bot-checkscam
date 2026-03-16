import { findAdminByFacebookUrl } from './facebook-admin-lookup.js';
import { findAdminByContact } from './contact-lookup.js';

/**
 * Tạo response message chuẩn cho bot (giống trong bot.js)
 */
const createStandardResponse = (admin) => {
  if (admin) {
    return `🕵️ FB Real của: "${admin.name}"
🎖 GDV này có bảo hiểm tại Checkscam.vn
🔗 ${admin.adminUrl}`;
  } else {
    return `🕵️ Chưa xác định.
❌ Không phải GDV của Checkscam.vn`;
  }
};

// Test cases với format chuẩn
const testCases = [
    {
        type: 'Facebook URL - Found',
        input: 'https://www.facebook.com/profile.php?id=100013965611470',
        lookup: (input) => findAdminByFacebookUrl(input)
    },
    {
        type: 'Facebook URL - Not Found',
        input: 'https://www.facebook.com/profile.php?id=999999999999',
        lookup: (input) => findAdminByFacebookUrl(input)
    },
    {
        type: 'Phone - Found',
        input: '0763666222',
        lookup: (input) => findAdminByContact(input)
    },
    {
        type: 'Phone - Not Found',
        input: '0987654321',
        lookup: (input) => findAdminByContact(input)
    },
    {
        type: 'Bank Account - Found',
        input: '0491000133345',
        lookup: (input) => findAdminByContact(input)
    },
    {
        type: 'Bank Account - Not Found',
        input: '1234567890123',
        lookup: (input) => findAdminByContact(input)
    }
];

console.log('🧪 Test Standard Response Format\n');

testCases.forEach((testCase, index) => {
    console.log(`${index + 1}. ${testCase.type}`);
    console.log(`Input: ${testCase.input}`);
    
    const admin = testCase.lookup(testCase.input);
    const response = createStandardResponse(admin);
    
    console.log('Bot Response:');
    console.log(response);
    console.log('---\n');
});

console.log('🎉 Test hoàn thành!');