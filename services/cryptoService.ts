/**
 * Crypto Service
 * Handles PBKDF2 key derivation and AES-GCM encryption/decryption.
 * Uses the native Web Crypto API (crypto.subtle).
 */

// Helper: Convert ArrayBuffer to Base64
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper: Convert Base64 to ArrayBuffer
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

// Helper: Convert Hex String to Unit8Array (for salt)
export function hexToUint8Array(hexString: string): Uint8Array {
  if (hexString.length % 2 !== 0) {
    throw new Error('Invalid hex string');
  }
  const arrayBuffer = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    const byteValue = parseInt(hexString.substr(i, 2), 16);
    arrayBuffer[i / 2] = byteValue;
  }
  return arrayBuffer;
}

/**
 * Derives a Master Key from the user's password and a salt.
 * Uses PBKDF2 with SHA-256, 100,000 iterations.
 */
export async function deriveMasterKey(password: string, saltHex: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );

  const salt = hexToUint8Array(saltHex);

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      salt: salt as any,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false, // Master Key is not exportable for security
    ['encrypt', 'decrypt'],
  );
}

/**
 * Encrypts data using AES-GCM.
 * Returns a Base64 string of a JSON payload containing the IV and Ciphertext (with Tag appended).
 * Payload Format: { "cipher_text": "...", "iv": "..." }
 */
export async function encryptData(data: string, key: CryptoKey): Promise<string> {
  const enc = new TextEncoder();
  const encodedData = enc.encode(data);

  // Generate 96-bit (12-byte) IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptedContent = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encodedData,
  );

  const payload = {
    cipher_text: arrayBufferToBase64(encryptedContent),
    iv: arrayBufferToBase64(iv.buffer),
  };

  return btoa(JSON.stringify(payload));
}

/**
 * Decrypts the specific JSON-in-Base64 format using the Master Key.
 */
export async function decryptData(encryptedBase64: string, key: CryptoKey): Promise<string | null> {
  try {
    const jsonStr = atob(encryptedBase64);
    const payload = JSON.parse(jsonStr);

    if (!payload.cipher_text || !payload.iv) {
      console.error('Invalid encrypted format');
      return null;
    }

    const iv = base64ToArrayBuffer(payload.iv);
    const encryptedBytes = base64ToArrayBuffer(payload.cipher_text);

    const decryptedContent = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encryptedBytes,
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedContent);
  } catch (e) {
    console.error('Decryption Failed:', e);
    return null;
  }
}
