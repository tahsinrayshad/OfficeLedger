import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/utils/middleware';
import { getExpensesByUser } from '@/controllers/ExpenseController';

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
    const { userId } = await params;
    const result = await getExpensesByUser(userId);
    return NextResponse.json(result, { status: result.statusCode });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
