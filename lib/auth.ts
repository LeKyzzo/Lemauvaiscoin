import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Warn but don't throw during build
if (!JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not set - using development fallback');
}

const SECRET = JWT_SECRET || 'dev-secret-change-in-production-12345';

export function signToken(payload: { userId: number; email: string }): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: number; email: string } {
  return jwt.verify(token, SECRET) as { userId: number; email: string };
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation (min 8 chars)
export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

// Sanitize user input
export function sanitizeString(str: string, maxLength: number = 500): string {
  return str.trim().slice(0, maxLength);
}
