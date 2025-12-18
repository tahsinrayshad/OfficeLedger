import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getUserTeamId } from '@/utils/middleware';
import {
  getPaymentById,
  updatePayment,
  deletePayment,
} from '@/controllers/PaymentController';

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
    const result = await getPaymentById(id, teamId);
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
    const { amount, date, note } = body;

    const result = await updatePayment(id, teamId, amount, date, note);
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
    const result = await deletePayment(id, teamId);
    return NextResponse.json(result, { status: result.statusCode });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
