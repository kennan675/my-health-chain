import { readFileSync } from 'fs';
import { join } from 'path';

const loadRsaKeys = () => {
  const keyDir = process.env.RSA_KEY_DIR || join(__dirname, '../../local/keys');
  try {
    const privateKey = readFileSync(join(keyDir, 'private.pem'), 'utf-8');
    const publicKey = readFileSync(join(keyDir, 'public.pem'), 'utf-8');
    return { privateKey, publicKey };
  } catch (e) {
    console.warn('RSA keys not found at', keyDir, '— some features may fail. Run: node local/generate_keys.js');
    return { privateKey: '', publicKey: '' };
  }
};

const rsaKeys = loadRsaKeys();

export const config = {
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mhc',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  aesMasterKey: process.env.AES_MASTER_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  rsaPrivateKey: rsaKeys.privateKey,
  rsaPublicKey: rsaKeys.publicKey,
};
