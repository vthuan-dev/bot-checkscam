import { findAdminByFacebookUrl } from './facebook-admin-lookup.js';
import { findAdminByContact } from './contact-lookup.js';

console.log('🧪 Test All Bot Features\n');

// Test data
const testCases = [
    {
        type: 'Facebook URL',
        message: 'https://www.facebook.com/profile.php?id=61588203634595',
        expected: 'Duy Nguyễn'
    },
    {
        type: 'Phone Number', 
        message: '0763666222',
        expected: 'Duy Nguyễn'
    },
    {
        type: 'Bank Account',
        message: '0491000133345',
        expected: 'Duy Nguyễn'
    },
    {
        type: 'Mixed Text',
        message: 'Check số này: 0763666222 và stk 16010000460071',
        expected: 'Duy Nguyễn'
    },
    {
        type: 'Unknown Facebook',
        message: 'https://www.facebook.com/profile.php?id=999999999',
        expected: null
    },
    {
        type: 'Unknown Phone',
        message: '0987654321',
        expected: null
    }
];

// Run tests
testCases.forEach((testCase, index) => {
    console.log(`${index + 1}. Testing ${testCase.type}`);
    console.log(`   Input: ${testCase.message}`);
    
    let result = null;
    
    // Test Facebook URL
    if (testCase.message.includes('facebook.com')) {
        result = findAdminByFacebookUrl(testCase.message);
    } else {
        // Test contact info
        result = findAdminByContact(testCase.message);
    }
    
    if (result && result.name === testCase.expected) {
        console.log(`   ✅ PASS - Found: ${result.name}`);
    } else if (!result && !testCase.expected) {
        console.log(`   ✅ PASS - Not found (expected)`);
    } else {
        console.log(`   ❌ FAIL - Expected: ${testCase.expected}, Got: ${result?.name || 'null'}`);
    }
    
    console.log('');
});

console.log('🎉 All tests completed!');