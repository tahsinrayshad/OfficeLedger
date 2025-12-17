import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '@/controllers/AuthController';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, password, dob, isFundManager, isFoodManager, isTeamLead, team } = body;

    // Validate required fields
    if (!fullName || !email || !phone || !password || !dob) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const authController = new AuthController();
    const result = await authController.signup(
      fullName,
      email,
      phone,
      password,
      new Date(dob),
      isFundManager || false,
      isFoodManager || false,
      isTeamLead || false,
      team
    );

    return NextResponse.json(
      {
        message: 'User registered successfully',
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
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during signup' },
      { status: 400 }
    );
  }
}
