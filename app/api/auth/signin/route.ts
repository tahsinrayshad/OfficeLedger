import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '@/controllers/AuthController';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const authController = new AuthController();
    const result = await authController.signin(email, password);

    return NextResponse.json(
      {
        message: 'User logged in successfully',
        user: {
          id: result.user._id,
          fullName: result.user.fullName,
          email: result.user.email,
          phone: result.user.phone,
          isFundManager: result.user.isFundManager,
          isFoodManager: result.user.isFoodManager,
          isTeamLead: result.user.isTeamLead,
          isActive: result.user.isActive,
          team: result.user.team,
        },
        token: result.token,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during signin' },
      { status: 400 }
    );
  }
}
