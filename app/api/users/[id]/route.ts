import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '@/controllers/AuthController';
import { withAuth, createUnauthorizedResponse } from '@/utils/middleware';

const authController = new AuthController();

// PUT update user profile
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
    const userId = id;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updateData = body;

    const updatedUser = await authController.updateUser(auth.userId, userId, updateData);

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'User updated successfully',
        user: {
          id: updatedUser._id,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          phone: updatedUser.phone,
          team: updatedUser.team,
          isFundManager: updatedUser.isFundManager,
          isFoodManager: updatedUser.isFoodManager,
          isActive: updatedUser.isActive,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while updating user' },
      { status: 400 }
    );
  }
}
