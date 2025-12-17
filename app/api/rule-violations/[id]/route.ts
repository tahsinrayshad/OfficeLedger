import { NextRequest, NextResponse } from 'next/server';
import { RuleViolationController } from '@/controllers/RuleViolationController';
import { withAuth, createUnauthorizedResponse } from '@/utils/middleware';
import User from '@/models/Users';
import Rules from '@/models/Rules';
import { connectDB } from '@/utils/db';

const ruleViolationController = new RuleViolationController();

// GET violation by ID
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
    const violationId = id;

    if (!violationId) {
      return NextResponse.json(
        { error: 'Violation ID is required' },
        { status: 400 }
      );
    }

    const violation = await ruleViolationController.getViolationById(violationId);

    if (!violation) {
      return NextResponse.json(
        { error: 'Violation not found' },
        { status: 404 }
      );
    }

    // Fetch violator data and rule data
    await connectDB();
    const violator = await User.findById(violation.violatorId);
    const rule = await Rules.findById(violation.ruleId);

    return NextResponse.json(
      {
        message: 'Violation retrieved successfully',
        violation,
        violatorData: violator ? {
          id: violator._id,
          fullName: violator.fullName,
          email: violator.email,
          phone: violator.phone,
          team: violator.team,
        } : null,
        ruleData: rule ? {
          id: rule._id,
          title: rule.title,
          amount: rule.amount,
          description: rule.description,
        } : null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get violation error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while retrieving violation' },
      { status: 400 }
    );
  }
}

// PUT update violation
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
    const violationId = id;
    const body = await request.json();
    const updateData = body;

    if (!violationId) {
      return NextResponse.json(
        { error: 'Violation ID is required' },
        { status: 400 }
      );
    }

    const updatedViolation = await ruleViolationController.updateViolation(
      auth.userId,
      violationId,
      updateData
    );

    if (!updatedViolation) {
      return NextResponse.json(
        { error: 'Violation not found' },
        { status: 404 }
      );
    }

    // Fetch violator data and rule data
    await connectDB();
    const violator = await User.findById(updatedViolation.violatorId);
    const rule = await Rules.findById(updatedViolation.ruleId);

    return NextResponse.json(
      {
        message: 'Violation updated successfully',
        violation: updatedViolation,
        violatorData: violator ? {
          id: violator._id,
          fullName: violator.fullName,
          email: violator.email,
          phone: violator.phone,
          team: violator.team,
        } : null,
        ruleData: rule ? {
          id: rule._id,
          title: rule.title,
          amount: rule.amount,
          description: rule.description,
        } : null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update violation error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while updating violation' },
      { status: 400 }
    );
  }
}

// DELETE violation
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
    const violationId = id;

    if (!violationId) {
      return NextResponse.json(
        { error: 'Violation ID is required' },
        { status: 400 }
      );
    }

    const deletedViolation = await ruleViolationController.deleteViolation(
      auth.userId,
      violationId
    );

    if (!deletedViolation) {
      return NextResponse.json(
        { error: 'Violation not found' },
        { status: 404 }
      );
    }

    // Fetch violator data and rule data
    await connectDB();
    const violator = await User.findById(deletedViolation.violatorId);
    const rule = await Rules.findById(deletedViolation.ruleId);

    return NextResponse.json(
      {
        message: 'Violation deleted successfully',
        violation: deletedViolation,
        violatorData: violator ? {
          id: violator._id,
          fullName: violator.fullName,
          email: violator.email,
          phone: violator.phone,
          team: violator.team,
        } : null,
        ruleData: rule ? {
          id: rule._id,
          title: rule.title,
          amount: rule.amount,
          description: rule.description,
        } : null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete violation error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while deleting violation' },
      { status: 400 }
    );
  }
}
