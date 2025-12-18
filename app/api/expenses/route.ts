import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getUserTeamId } from '@/utils/middleware';
import {
  addExpense,
  getAllExpenses,
} from '@/controllers/ExpenseController';

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { userId, amount, reason, date } = body;

    if (!userId || amount === undefined || !reason) {
      return NextResponse.json(
        { message: 'userId, amount, and reason are required' },
        { status: 400 }
      );
    }

    const result = await addExpense(userId, teamId, amount, reason, date);
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
    // Get user's current team
    const teamId = await getUserTeamId(auth.userId);
    if (!teamId) {
      return NextResponse.json(
        { message: 'No active team found' },
        { status: 400 }
      );
    }

    const result = await getAllExpenses(teamId);
    return NextResponse.json(result, { status: result.statusCode });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
