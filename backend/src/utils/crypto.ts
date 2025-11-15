import crypto from 'crypto';
import { config } from '../config';

// AES-256-GCM helpers (uses a 32-byte key)
export function ensureKey() {
  if (!config.aesMasterKey) {
    // In production, use secure KMS and do not fallback silently.
    throw new Error('AES master key not set in environment');
  }
  // expect base64 key
  const buf = Buffer.from(config.aesMasterKey, 'base64');
  if (buf.length !== 32) throw new Error('AES master key must be 32 bytes (base64)');
  return buf;
}

// RSA sign/verify helpers
export function signData(data: any): string {
  if (!config.rsaPrivateKey) throw new Error('RSA private key not configured');
  const payload = JSON.stringify(data);
  const signature = crypto.createSign('RSA-SHA256').update(payload).sign(config.rsaPrivateKey, 'base64');
  return signature;
}

export function verifySignature(data: any, signature: string): boolean {
  if (!config.rsaPublicKey) throw new Error('RSA public key not configured');
  const payload = JSON.stringify(data);
  try {
    return crypto.createVerify('RSA-SHA256').update(payload).verify(config.rsaPublicKey, signature, 'base64');
  } catch (e) {
    return false;
  }
}

export function encryptJSON(obj: any): { iv: string; authTag: string; data: string } {
  const key = ensureKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const plaintext = Buffer.from(JSON.stringify(obj));
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return { iv: iv.toString('base64'), authTag: authTag.toString('base64'), data: encrypted.toString('base64') };
}

export function decryptJSON(payload: { iv: string; authTag: string; data: string }): any {
  const key = ensureKey();
  const iv = Buffer.from(payload.iv, 'base64');
  const authTag = Buffer.from(payload.authTag, 'base64');
  const encrypted = Buffer.from(payload.data, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return JSON.parse(decrypted.toString());
}

// RSA helpers (placeholder - use KMS or secure storage in prod)
export function generateRsaKeyPair(): { publicKey: string; privateKey: string } {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  return { publicKey, privateKey };
}
