import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';

/**
 * Middleware to verify JWT token
 * Extracts token from Authorization header and verifies it
 */
export async function withAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        error: true,
        status: 401,
        message: 'Missing or invalid Authorization header. Expected format: Bearer <token>',
      };
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    const decoded = verifyToken(token);

    return {
      error: false,
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch (error: any) {
    return {
      error: true,
      status: 401,
      message: error.message || 'Invalid or expired token',
    };
  }
}

/**
 * Helper function to create protected API response
 */
export function createUnauthorizedResponse(message: string = 'Unauthorized') {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  );
}
