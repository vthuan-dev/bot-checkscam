import { findAdminByFacebookUrl } from './facebook-admin-lookup.js';
import { findAdminByContact } from './contact-lookup.js';

/**
 * Tạo response message chuẩn cho bot dựa trên loại match (giống trong bot.js)
 */
const createStandardResponse = (admin, matchType = 'facebook') => {
  if (admin) {
    let prefix = '🕵️ FB Real của:';
    
    // Thay đổi prefix dựa trên loại match
    if (matchType === 'phone') {
      prefix = '🕵️ SĐT của:';
    } else if (matchType === 'bank') {
      prefix = '🕵️ STK của:';
    }
    
    return `${prefix} "${admin.name}"
🎖 GDV này có bảo hiểm tại Checkscam.vn
🔗 ${admin.adminUrl}`;
  } else {
    return `🕵️ Chưa xác định.
❌ Không phải GDV của Checkscam.vn`;
  }
};

console.log('🧪 Test Dynamic Format Response\n');

// Test cases
const testCases = [
    {
        type: 'Facebook URL',
        input: 'https://www.facebook.com/profile.php?id=61588203634595',
        lookup: (input) => findAdminByFacebookUrl(input),
        expectedPrefix: '🕵️ FB Real của:'
    },
    {
        type: 'Phone Number',
        input: '0763666222',
        lookup: (input) => findAdminByContact(input),
        expectedPrefix: '🕵️ SĐT của:'
    },
    {
        type: 'Bank Account - Vietcombank',
        input: '0491000133345',
        lookup: (input) => findAdminByContact(input),
        expectedPrefix: '🕵️ STK của:'
    },
    {
        type: 'Bank Account - Techcombank',
        input: '19034569153010',
        lookup: (input) => findAdminByContact(input),
        expectedPrefix: '🕵️ STK của:'
    }
];

testCases.forEach((testCase, index) => {
    console.log(`${index + 1}. ${testCase.type}`);
    console.log(`Input: ${testCase.input}`);
    
    const admin = testCase.lookup(testCase.input);
    
    if (admin) {
        let matchType = 'facebook';
        if (testCase.type.includes('Phone')) {
            matchType = 'phone';
        } else if (testCase.type.includes('Bank')) {
            matchType = 'bank';
        }
        
        const response = createStandardResponse(admin, matchType);
        
        console.log('✅ Bot Response:');
        console.log(response);
        
        // Verify prefix
        const hasCorrectPrefix = response.includes(testCase.expectedPrefix);
        console.log(`Prefix check: ${hasCorrectPrefix ? '✅ CORRECT' : '❌ WRONG'}`);
    } else {
        const response = createStandardResponse(null);
        console.log('❌ Bot Response:');
        console.log(response);
    }
    
    console.log('---\n');
});

console.log('🎉 Test hoàn thành!');