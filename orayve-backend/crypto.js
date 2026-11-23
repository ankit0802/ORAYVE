import crypto from 'crypto';

// 32-byte encryption key for AES-256-GCM (from env or deterministic fallback)
const ENCRYPTION_KEY = process.env.ENCRYPTION_SECRET_KEY
  ? Buffer.from(process.env.ENCRYPTION_SECRET_KEY, 'hex')
  : crypto.scryptSync('ORAYVE_MASTER_SECRET_SALT_2026', 'salt', 32);

/**
 * Encrypt sensitive government ID / PAN using AES-256-GCM
 * Output format: iv:authTag:ciphertext (hex)
 */
export function encryptAes256Gcm(plaintext) {
  if (!plaintext) return '';
  const iv = crypto.randomBytes(12); // standard 12-byte IV for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypt AES-256-GCM encrypted string
 */
export function decryptAes256Gcm(encryptedString) {
  if (!encryptedString || !encryptedString.includes(':')) return encryptedString;
  try {
    const [ivHex, authTagHex, cipherHex] = encryptedString.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(cipherHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    return '[ENCRYPTED_DATA]';
  }
}

/**
 * Verify Razorpay payment signature using HMAC-SHA256
 */
export function verifyRazorpaySignature(orderId, paymentId, signature, secret) {
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return generatedSignature === signature;
}
