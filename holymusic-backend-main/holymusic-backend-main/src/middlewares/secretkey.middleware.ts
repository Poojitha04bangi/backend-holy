const crypto = require('crypto');

// Generate a secure secret key with a specified length (e.g., 32 bytes)
const generateSecretKey = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

const secretKey = generateSecretKey(32); // Change the length as needed
console.log('Generated Secret Key:', secretKey);

module.exports = secretKey;