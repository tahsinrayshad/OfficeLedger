import { NextRequest, NextResponse } from 'next/server';
import { SnacksController } from '@/controllers/SnacksController';
import { withAuth, createUnauthorizedResponse } from '@/utils/middleware';

const snacksController = new SnacksController();

// GET snack by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const auth = await withAuth(request);
    if (auth.error) {
      return createUnauthorizedResponse(auth.message);
    }

    const { id } = await params;
    const snackId = id;

    if (!snackId) {
      return NextResponse.json(
        { error: 'Snack ID is required' },
        { status: 400 }
      );
    }

    const snack = await snacksController.getSnackById(snackId);

    if (!snack) {
      return NextResponse.json(
        { error: 'Snack not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Snack retrieved successfully',
        snack,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get snack error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while retrieving snack' },
      { status: 400 }
    );
  }
}

// PUT update snack
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const auth = await withAuth(request);
    if (auth.error) {
      return createUnauthorizedResponse(auth.message);
    }

    const { id } = await params;
    const snackId = id;
    const body = await request.json();
    const updateData = body;

    if (!snackId) {
      return NextResponse.json(
        { error: 'Snack ID is required' },
        { status: 400 }
      );
    }

    const updatedSnack = await snacksController.updateSnack(auth.userId, snackId, updateData);

    if (!updatedSnack) {
      return NextResponse.json(
        { error: 'Snack not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Snack updated successfully',
        snack: updatedSnack,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update snack error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while updating snack' },
      { status: 400 }
    );
  }
}

// DELETE snack
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const auth = await withAuth(request);
    if (auth.error) {
      return createUnauthorizedResponse(auth.message);
    }

    const { id } = await params;
    const snackId = id;

    if (!snackId) {
      return NextResponse.json(
        { error: 'Snack ID is required' },
        { status: 400 }
      );
    }

    const deletedSnack = await snacksController.deleteSnack(auth.userId, snackId);

    if (!deletedSnack) {
      return NextResponse.json(
        { error: 'Snack not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Snack deleted successfully',
        snack: deletedSnack,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete snack error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while deleting snack' },
      { status: 400 }
    );
  }
}
