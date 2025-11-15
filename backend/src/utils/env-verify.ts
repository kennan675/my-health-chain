import { config } from '../config';

export function verifyEnvironment() {
  const issues: string[] = [];

  if (!config.databaseUrl) issues.push('DATABASE_URL not set');
  if (!config.redisUrl) issues.push('REDIS_URL not set');
  if (!config.jwtSecret || config.jwtSecret === 'dev-secret-change-me') {
    issues.push('JWT_SECRET not set or using dev default (change in production)');
  }
  if (!config.aesMasterKey) issues.push('AES_MASTER_KEY not set (run: node backend/scripts/generate-aes-key.js)');
  if (!config.rsaPrivateKey) issues.push('RSA private key not found (run: node local/generate_keys.js)');
  if (!config.rsaPublicKey) issues.push('RSA public key not found (run: node local/generate_keys.js)');

  return {
    valid: issues.length === 0,
    issues,
  };
}
