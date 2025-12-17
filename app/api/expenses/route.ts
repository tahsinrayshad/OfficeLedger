import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/utils/middleware';
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
    const body = await req.json();
    const { userId, amount, reason, date } = body;

    if (!userId || amount === undefined || !reason) {
      return NextResponse.json(
        { message: 'userId, amount, and reason are required' },
        { status: 400 }
      );
    }

    const result = await addExpense(userId, amount, reason, date);
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
    const result = await getAllExpenses();
    return NextResponse.json(result, { status: result.statusCode });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
