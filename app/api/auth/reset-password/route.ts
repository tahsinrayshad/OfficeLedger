import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '@/controllers/AuthController';

const authController = new AuthController();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, resetToken, newPassword } = body;

    if (!email || !resetToken || !newPassword) {
      return NextResponse.json(
        { message: 'Email, reset token, and new password are required' },
        { status: 400 }
      );
    }

    const result = await authController.resetPassword(email, resetToken, newPassword);
    return NextResponse.json(result, { status: result.statusCode });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
