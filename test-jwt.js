const jwt = require('jsonwebtoken');

// Function to generate a test JWT token
function generateToken(userId, audience, issuer, expiresIn = '1h') {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    aud: audience,
    iss: issuer,
  };

  // In a real scenario, this would be signed by your identity provider
  // For testing, we're using a simple secret
  const secret = 'test-secret-key';
  
  return jwt.sign(payload, secret);
}

// Generate tokens for different test cases
const validToken = generateToken('1', 'your-api-audience', 'https://your-auth-server/');
const invalidUserToken = generateToken('999', 'your-api-audience', 'https://your-auth-server/');
const inactiveUserToken = generateToken('5', 'your-api-audience', 'https://your-auth-server/');

console.log('Valid User Token (ID: 1):');
console.log(validToken);
console.log('\nInvalid User Token (ID: 999):');
console.log(invalidUserToken);
console.log('\nInactive User Token (ID: 5):');
console.log(inactiveUserToken);
