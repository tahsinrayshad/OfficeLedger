import bcrypt from 'bcrypt';
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const JWT_SECRET: string = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRY: string = process.env.JWT_EXPIRY || '7d';

/**
 * Hash a password using bcrypt
 * 
 * @param password - Plain text password
 * @returns Promise<string> - Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain text password with a hashed password
 * 
 * @param password - Plain text password
 * @param hashedPassword - Hashed password to compare with
 * @returns Promise<boolean> - True if passwords match
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Generate JWT token for a user
 * 
 * @param userId - User's ID
 * @param email - User's email
 * @returns string - JWT token
 */
export function generateToken(userId: string, email: string): string {
  const signOptions: SignOptions = {
    expiresIn: JWT_EXPIRY as any,
  };
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    signOptions
  );
}

/**
 * Verify JWT token
 * 
 * @param token - JWT token to verify
 * @returns object - Decoded token payload
 * @throws Error if token is invalid or expired
 */
export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * Decode JWT token without verification
 * 
 * @param token - JWT token to decode
 * @returns object - Decoded token payload
 */
export function decodeToken(token: string): any {
  return jwt.decode(token);
}
