// Debug regex matching

const facebookLinkRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/profile\.php\?id=\d+(?![a-zA-Z0-9])/gi;

const testCases = [
    'https://www.facebook.com/profile.php?id=100025047793351adsdahj',
    'https://www.facebook.com/profile.php?id=100013965611470xyz'
];

testCases.forEach((text, index) => {
    console.log(`\n${index + 1}. Testing: ${text}`);
    
    const matches = text.match(facebookLinkRegex);
    console.log(`   Matches: ${matches ? matches : 'null'}`);
    
    // Test từng phần
    const basePattern = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/profile\.php\?id=\d+/gi;
    const baseMatches = text.match(basePattern);
    console.log(`   Base pattern matches: ${baseMatches ? baseMatches : 'null'}`);
    
    // Test negative lookahead
    const afterId = text.match(/id=(\d+)(.*)$/);
    if (afterId) {
        console.log(`   ID: ${afterId[1]}`);
        console.log(`   After ID: "${afterId[2]}"`);
        console.log(`   Has alphanumeric after: ${/^[a-zA-Z0-9]/.test(afterId[2])}`);
    }
});

console.log('\n--- Testing corrected regex ---');

// Thử regex khác
const correctedRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/profile\.php\?id=\d+(?=\s|$|[^a-zA-Z0-9])/gi;

testCases.forEach((text, index) => {
    console.log(`\n${index + 1}. Testing corrected: ${text}`);
    const matches = text.match(correctedRegex);
    console.log(`   Matches: ${matches ? matches : 'null'}`);
});