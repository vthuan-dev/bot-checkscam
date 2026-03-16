// Final test for improved regex

const facebookLinkRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/profile\.php\?id=\d+(?![a-zA-Z0-9])/gi;

console.log('🧪 Final Regex Test\n');

const testCases = [
    {
        input: 'https://www.facebook.com/profile.php?id=100025047793351',
        shouldMatch: true,
        description: 'Clean FB URL'
    },
    {
        input: 'https://www.facebook.com/profile.php?id=100025047793351adsdahj',
        shouldMatch: false,
        description: 'FB URL with extra letters'
    },
    {
        input: 'Check: https://www.facebook.com/profile.php?id=100013965611470 này',
        shouldMatch: true,
        description: 'FB URL in sentence'
    },
    {
        input: 'https://www.facebook.com/profile.php?id=100013965611470xyz',
        shouldMatch: false,
        description: 'FB URL with suffix letters'
    }
];

testCases.forEach((test, index) => {
    console.log(`${index + 1}. ${test.description}`);
    console.log(`   Input: ${test.input}`);
    
    const matches = test.input.match(facebookLinkRegex);
    const hasMatch = !!(matches && matches.length > 0);
    
    console.log(`   Should match: ${test.shouldMatch}`);
    console.log(`   Actually matches: ${hasMatch}`);
    
    if (hasMatch) {
        console.log(`   Matched URL: ${matches[0]}`);
    } else {
        console.log(`   No match found`);
    }
    
    const isCorrect = hasMatch === test.shouldMatch;
    console.log(`   Result: ${isCorrect ? '✅ CORRECT' : '❌ WRONG'}`);
    console.log('');
});

// Test với example từ user
console.log('=== Test với example từ user ===');
const userExample = 'https://www.facebook.com/profile.php?id=100025047793351adsdahj';
const userMatches = userExample.match(facebookLinkRegex);

console.log(`Input: ${userExample}`);
console.log(`Matches: ${userMatches ? userMatches[0] : 'NO MATCH'}`);
console.log(`Expected: NO MATCH (vì có 'adsdahj' sau số)`);
console.log(`Result: ${!userMatches ? '✅ CORRECT - Bot sẽ KHÔNG phản hồi' : '❌ WRONG - Bot sẽ phản hồi nhầm'}`);