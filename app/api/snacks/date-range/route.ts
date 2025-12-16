import { NextRequest, NextResponse } from 'next/server';
import { SnacksController } from '@/controllers/SnacksController';
import { withAuth, createUnauthorizedResponse } from '@/utils/middleware';

const snacksController = new SnacksController();

// GET snacks by date range
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await withAuth(request);
    if (auth.error) {
      return createUnauthorizedResponse(auth.message);
    }

    const searchParams = request.nextUrl.searchParams;
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');

    if (!startDateStr || !endDateStr) {
      return NextResponse.json(
        { error: 'startDate and endDate query parameters are required' },
        { status: 400 }
      );
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format. Use ISO 8601 format (YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    const snacks = await snacksController.getSnacksByDateRange(startDate, endDate);

    return NextResponse.json(
      {
        message: 'Snacks retrieved successfully',
        snacks,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get snacks by date range error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while retrieving snacks' },
      { status: 400 }
    );
  }
}
