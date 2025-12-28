import * as OTPAuth from 'otpauth';

/**
 * Generates the current 6-digit TOTP code for a given secret.
 */
export const generateTOTPCode = (secret: string): string => {
  if (!secret) return '000000';
  try {
    // Sanitize: remove spaces, uppercase
    const cleanSecret = secret.replace(/\s+/g, '').toUpperCase();

    const totp = new OTPAuth.TOTP({
      issuer: 'RosaAuth',
      label: 'User',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: cleanSecret,
    });
    return totp.generate();
  } catch {
    // Log only a warning to avoid RedBox spam for invalid keys
    // console.warn("Invalid Secret Key:", error);
    return 'Invalid';
  }
};

/**
 * Calculates the remaining seconds in the current 30-second window.
 */
export const getRemainingSeconds = (): number => {
  return 30 - (Math.floor(Date.now() / 1000) % 30);
};

/**
 * Generates a simple UUID v4-like string.
 * TODO: Replace with crypto.randomUUID() when available.
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
