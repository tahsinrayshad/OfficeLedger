import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/utils/middleware';
import { AuthController } from '@/controllers/AuthController';

const authController = new AuthController();

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const auth = await withAuth(req);
    if (auth.error) {
      return NextResponse.json(
        { message: auth.message },
        { status: auth.status }
      );
    }

    const result = await authController.getCurrentUser(auth.userId);

    return NextResponse.json(result, { status: result.statusCode });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
