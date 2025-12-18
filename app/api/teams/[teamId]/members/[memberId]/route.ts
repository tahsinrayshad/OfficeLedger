import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/utils/middleware';
import { TeamController } from '@/controllers/TeamController';

const teamController = new TeamController();

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string; memberId: string }> }
) {
  const auth = await withAuth(req);
  if (auth.error) {
    return NextResponse.json(
      { message: auth.message },
      { status: auth.status }
    );
  }

  try {
    const { teamId, memberId } = await params;
    const body = await req.json();
    const { action, roleData } = body;

    if (action === 'deactivate') {
      const result = await teamController.deactivateTeamMember(teamId, memberId, auth.userId);
      return NextResponse.json(result, { status: result.statusCode });
    }

    if (action === 'assignRole') {
      if (!roleData) {
        return NextResponse.json(
          { message: 'roleData is required' },
          { status: 400 }
        );
      }
      const result = await teamController.assignRole(teamId, memberId, auth.userId, roleData);
      return NextResponse.json(result, { status: result.statusCode });
    }

    return NextResponse.json(
      { message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
