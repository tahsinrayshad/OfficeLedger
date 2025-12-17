import { NextRequest, NextResponse } from 'next/server';
import { RuleViolationController } from '@/controllers/RuleViolationController';
import { withAuth, createUnauthorizedResponse } from '@/utils/middleware';
import User from '@/models/Users';
import Rules from '@/models/Rules';
import { connectDB } from '@/utils/db';

const ruleViolationController = new RuleViolationController();

// GET all violations
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await withAuth(request);
    if (auth.error) {
      return createUnauthorizedResponse(auth.message);
    }

    const violations = await ruleViolationController.getAllViolations();

    // Fetch violator and rule data for each violation
    await connectDB();
    const violationsWithData = await Promise.all(
      violations.map(async (violation) => {
        const violator = await User.findById(violation.violatorId);
        const rule = await Rules.findById(violation.ruleId);
        return {
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
        };
      })
    );

    return NextResponse.json(
      {
        message: 'Violations retrieved successfully',
        violations: violationsWithData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get violations error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while retrieving violations' },
      { status: 400 }
    );
  }
}

// POST add new violation
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await withAuth(request);
    if (auth.error) {
      return createUnauthorizedResponse(auth.message);
    }

    const body = await request.json();
    const { violatorId, ruleId, additionalAmount, date, note } = body;

    // Validate required fields
    if (!violatorId || !ruleId || additionalAmount === undefined || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: violatorId, ruleId, additionalAmount, date' },
        { status: 400 }
      );
    }

    const newViolation = await ruleViolationController.addViolation(
      auth.userId,
      violatorId,
      ruleId,
      additionalAmount,
      new Date(date),
      note
    );

    // Fetch violator data and rule data
    await connectDB();
    const violator = await User.findById(violatorId);
    const rule = await Rules.findById(ruleId);

    return NextResponse.json(
      {
        message: 'Violation recorded successfully',
        violation: newViolation,
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
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Add violation error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while recording violation' },
      { status: 400 }
    );
  }
}
