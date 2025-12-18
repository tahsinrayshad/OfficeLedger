import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/utils/middleware';
import { TeamController } from '@/controllers/TeamController';

const teamController = new TeamController();

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const auth = await withAuth(req);
  if (auth.error) {
    return NextResponse.json(
      { message: auth.message },
      { status: auth.status }
    );
  }

  try {
    const { teamId } = await params;
    const result = await teamController.switchTeam(auth.userId, teamId);
    return NextResponse.json(result, { status: result.statusCode });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
