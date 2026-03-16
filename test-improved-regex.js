// Test improved regex patterns

console.log('🧪 Test Improved Regex Patterns\n');

// Test Facebook URL regex
const facebookLinkRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/profile\.php\?id=\d+(?![a-zA-Z0-9])/gi;

const facebookTests = [
    {
        text: 'https://www.facebook.com/profile.php?id=100025047793351',
        expected: true,
        description: 'Valid FB URL'
    },
    {
        text: 'https://www.facebook.com/profile.php?id=100025047793351adsdahj',
        expected: false,
        description: 'Invalid FB URL with extra chars'
    },
    {
        text: 'Check link này: https://www.facebook.com/profile.php?id=100013965611470 nhé',
        expected: true,
        description: 'Valid FB URL in text'
    },
    {
        text: 'https://www.facebook.com/profile.php?id=100013965611470xyz',
        expected: false,
        description: 'Invalid FB URL with letters after'
    },
    {
        text: 'fb.com/profile.php?id=123456789',
        expected: true,
        description: 'Short FB URL'
    }
];

console.log('=== Facebook URL Tests ===');
facebookTests.forEach((test, index) => {
    const matches = test.text.match(facebookLinkRegex);
    const hasMatch = matches && matches.length > 0;
    
    console.log(`${index + 1}. ${test.description}`);
    console.log(`   Text: ${test.text}`);
    console.log(`   Expected: ${test.expected ? 'MATCH' : 'NO MATCH'}`);
    console.log(`   Result: ${hasMatch ? 'MATCH' : 'NO MATCH'}`);
    
    if (hasMatch) {
        console.log(`   Matched: ${matches[0]}`);
    }
    
    const status = (hasMatch === test.expected) ? '✅ PASS' : '❌ FAIL';
    console.log(`   Status: ${status}`);
    console.log('');
});

// Test Phone regex
const phonePattern = /(?:^|\s)((?:0|\+84)[0-9]{8,10})(?=\s|$)/g;

const phoneTests = [
    {
        text: '0763666222',
        expected: true,
        description: 'Valid phone alone'
    },
    {
        text: 'Check số này: 0763666222 nhé',
        expected: true,
        description: 'Valid phone in text'
    },
    {
        text: '0763666222abc',
        expected: false,
        description: 'Invalid phone with letters'
    },
    {
        text: 'abc0763666222',
        expected: false,
        description: 'Invalid phone with prefix letters'
    }
];

console.log('=== Phone Number Tests ===');
phoneTests.forEach((test, index) => {
    const matches = [...test.text.matchAll(phonePattern)];
    const hasMatch = matches.length > 0;
    
    console.log(`${index + 1}. ${test.description}`);
    console.log(`   Text: ${test.text}`);
    console.log(`   Expected: ${test.expected ? 'MATCH' : 'NO MATCH'}`);
    console.log(`   Result: ${hasMatch ? 'MATCH' : 'NO MATCH'}`);
    
    if (hasMatch) {
        console.log(`   Matched: ${matches[0][1]}`);
    }
    
    const status = (hasMatch === test.expected) ? '✅ PASS' : '❌ FAIL';
    console.log(`   Status: ${status}`);
    console.log('');
});

console.log('🎉 Regex tests completed!');