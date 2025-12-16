import { NextRequest, NextResponse } from 'next/server';
import { SnacksController } from '@/controllers/SnacksController';
import { withAuth, createUnauthorizedResponse } from '@/utils/middleware';

const snacksController = new SnacksController();

// GET all snacks
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await withAuth(request);
    if (auth.error) {
      return createUnauthorizedResponse(auth.message);
    }

    const snacks = await snacksController.getAllSnacks();

    return NextResponse.json(
      {
        message: 'Snacks retrieved successfully',
        snacks,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get snacks error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while retrieving snacks' },
      { status: 400 }
    );
  }
}

// POST add new snack
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await withAuth(request);
    if (auth.error) {
      return createUnauthorizedResponse(auth.message);
    }

    const body = await request.json();
    const { foodItem, expense, contributions, date, note } = body;

    // Validate required fields
    if (!foodItem || expense === undefined || !contributions || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: foodItem, expense, contributions, date' },
        { status: 400 }
      );
    }

    const newSnack = await snacksController.addSnacks(
      auth.userId,
      foodItem,
      expense,
      contributions,
      new Date(date),
      note
    );

    return NextResponse.json(
      {
        message: 'Snack added successfully',
        snack: newSnack,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Add snack error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while adding snack' },
      { status: 400 }
    );
  }
}
