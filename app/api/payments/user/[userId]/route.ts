import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getUserTeamId } from '@/utils/middleware';
import { getPaymentsByUser } from '@/controllers/PaymentController';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const auth = await withAuth(req);
  if (auth.error) {
    return NextResponse.json(
      { message: auth.message },
      { status: auth.status }
    );
  }

  try {
    // Get user's current team
    const teamId = await getUserTeamId(auth.userId);
    if (!teamId) {
      return NextResponse.json(
        { message: 'No active team found' },
        { status: 400 }
      );
    }

    const { userId } = await params;
    const result = await getPaymentsByUser(userId, teamId);
    return NextResponse.json(result, { status: result.statusCode });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
