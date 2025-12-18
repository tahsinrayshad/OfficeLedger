import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getUserTeamId } from '@/utils/middleware';
import {
  getExpenseById,
  updateExpense,
  deleteExpense,
} from '@/controllers/ExpenseController';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const result = await getExpenseById(id, teamId);
    return NextResponse.json(result, { status: result.statusCode });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const body = await req.json();
    const { amount, reason, date } = body;

    const result = await updateExpense(id, teamId, amount, reason, date);
    return NextResponse.json(result, { status: result.statusCode });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const result = await deleteExpense(id, teamId);
    return NextResponse.json(result, { status: result.statusCode });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
