// Debug test logic

const test1 = {
    input: 'https://www.facebook.com/profile.php?id=100025047793351adsdahj',
    shouldMatch: false
};

const facebookLinkRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/profile\.php\?id=\d+(?![a-zA-Z0-9])/gi;

const matches = test1.input.match(facebookLinkRegex);
console.log('matches:', matches);
console.log('matches type:', typeof matches);
console.log('matches === null:', matches === null);

const hasMatch = matches && matches.length > 0;
console.log('hasMatch:', hasMatch);
console.log('hasMatch type:', typeof hasMatch);

console.log('shouldMatch:', test1.shouldMatch);
console.log('shouldMatch type:', typeof test1.shouldMatch);

console.log('hasMatch === test1.shouldMatch:', hasMatch === test1.shouldMatch);

// Test với boolean conversion
console.log('Boolean(matches):', Boolean(matches));
console.log('!!matches:', !!matches);