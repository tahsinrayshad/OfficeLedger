import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getUserTeamId } from '@/utils/middleware';
import {
  addBankAccount,
} from '@/controllers/BankAccountController';

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
    const { userId, bankName, branch, accountNo, accountTitle, routingNumber } = body;

    if (!userId || !bankName || !branch || !accountNo || !accountTitle || !routingNumber) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    const result = await addBankAccount(
      userId,
      teamId,
      auth.userId,
      bankName,
      branch,
      accountNo,
      accountTitle,
      routingNumber
    );
    return NextResponse.json(result, { status: result.statusCode });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
