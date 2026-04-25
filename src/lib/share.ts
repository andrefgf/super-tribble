import { randomBytes } from 'crypto';

/** Generate a URL-safe base64 hash (16 bytes → 22 chars) */
export function generateHash(): string {
  return randomBytes(16).toString('base64url');
}

export const SHARE_TTL_DAYS = 30;
