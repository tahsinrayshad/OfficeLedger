import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/utils/middleware';
import { TeamController } from '@/controllers/TeamController';

const teamController = new TeamController();

export async function POST(req: NextRequest) {
  const auth = await withAuth(req);
  if (auth.error) {
    return NextResponse.json(
      { message: auth.message },
      { status: auth.status }
    );
  }

  try {
    const body = await req.json();
    const { teamName, description } = body;

    if (!teamName) {
      return NextResponse.json(
        { message: 'Team name is required' },
        { status: 400 }
      );
    }

    const result = await teamController.createTeam(teamName, auth.userId, description);
    return NextResponse.json(result, { status: result.statusCode });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const auth = await withAuth(req);
  if (auth.error) {
    return NextResponse.json(
      { message: auth.message },
      { status: auth.status }
    );
  }

  try {
    const result = await teamController.getUserTeams(auth.userId);
    return NextResponse.json(result, { status: result.statusCode });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
