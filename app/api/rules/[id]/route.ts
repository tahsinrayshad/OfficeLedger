import { NextRequest, NextResponse } from 'next/server';
import { RulesController } from '@/controllers/RulesController';
import { withAuth, createUnauthorizedResponse } from '@/utils/middleware';

const rulesController = new RulesController();

// GET rule by ID
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
    const ruleId = id;

    if (!ruleId) {
      return NextResponse.json(
        { error: 'Rule ID is required' },
        { status: 400 }
      );
    }

    const rule = await rulesController.getRuleById(ruleId);

    if (!rule) {
      return NextResponse.json(
        { error: 'Rule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Rule retrieved successfully',
        rule,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get rule error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while retrieving rule' },
      { status: 400 }
    );
  }
}

// PUT update rule
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
    const ruleId = id;
    const body = await request.json();
    const updateData = body;

    if (!ruleId) {
      return NextResponse.json(
        { error: 'Rule ID is required' },
        { status: 400 }
      );
    }

    const updatedRule = await rulesController.updateRule(auth.userId, ruleId, updateData);

    if (!updatedRule) {
      return NextResponse.json(
        { error: 'Rule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Rule updated successfully',
        rule: updatedRule,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update rule error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while updating rule' },
      { status: 400 }
    );
  }
}

// DELETE rule
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
    const ruleId = id;

    if (!ruleId) {
      return NextResponse.json(
        { error: 'Rule ID is required' },
        { status: 400 }
      );
    }

    const deletedRule = await rulesController.deleteRule(auth.userId, ruleId);

    if (!deletedRule) {
      return NextResponse.json(
        { error: 'Rule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Rule deleted successfully',
        rule: deletedRule,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete rule error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while deleting rule' },
      { status: 400 }
    );
  }
}
