import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/utils/middleware';
import {
  addPayment,
  getAllPayments,
} from '@/controllers/PaymentController';

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
    const { payedBy, amount, date, note } = body;

    if (!payedBy || !amount) {
      return NextResponse.json(
        { message: 'payedBy and amount are required' },
        { status: 400 }
      );
    }

    const result = await addPayment(payedBy, amount, date, note);
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
    const result = await getAllPayments();
    return NextResponse.json(result, { status: result.statusCode });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
