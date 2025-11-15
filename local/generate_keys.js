const { generateKeyPairSync } = require('crypto');
const { writeFileSync, mkdirSync } = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, './keys');
try { mkdirSync(outDir, { recursive: true }); } catch (e) {}

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

writeFileSync(path.join(outDir, 'private.pem'), privateKey, { mode: 0o600 });
writeFileSync(path.join(outDir, 'public.pem'), publicKey);

console.log('RSA key pair generated at', outDir);
