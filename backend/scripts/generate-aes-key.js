const crypto = require('crypto');

// Generate a 32-byte (256-bit) AES key and encode as base64
const key = crypto.randomBytes(32).toString('base64');
console.log('AES_MASTER_KEY=' + key);
console.log('');
console.log('Add the above line to your .env.local or .env file');
