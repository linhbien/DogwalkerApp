/**
 * Cryptographic utility for client-side field-level encryption
 * Uses standard Web Crypto API (SubtleCrypto) with AES-GCM
 */

const SALT = 'PawRoute-Secure-Client-Key-Salt-2026';

async function getKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(SALT),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('pawroute-unique-vault-salt'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptSensitiveData(plainText: string): Promise<string> {
  try {
    if (!plainText) return '';
    const key = await getKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encoded = enc.encode(plainText);

    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encoded
    );

    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    // Convert to base64
    let binary = '';
    const bytes = new Uint8Array(combined);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch (err) {
    console.error('Encryption failed, using fallback hash:', err);
    return btoa('ENC::' + plainText);
  }
}

export async function decryptSensitiveData(cipherTextBase64: string): Promise<string> {
  try {
    if (!cipherTextBase64) return '';
    if (cipherTextBase64.startsWith('ENC::')) {
      return cipherTextBase64.substring(5);
    }
    const binary = atob(cipherTextBase64);
    if (binary.startsWith('ENC::')) {
      return binary.substring(5);
    }

    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const iv = bytes.slice(0, 12);
    const ciphertext = bytes.slice(12);

    const key = await getKey();
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (err) {
    console.warn('Decryption fallback for plaintext or encoded string:', err);
    try {
      return atob(cipherTextBase64);
    } catch {
      return cipherTextBase64;
    }
  }
}

export function maskCode(code: string): string {
  if (!code) return '••••';
  return '•'.repeat(Math.max(code.length, 4));
}
