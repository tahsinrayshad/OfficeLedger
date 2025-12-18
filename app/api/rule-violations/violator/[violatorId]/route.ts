import { NextRequest, NextResponse } from 'next/server';
import { RuleViolationController } from '@/controllers/RuleViolationController';
import { withAuth, createUnauthorizedResponse, getUserTeamId } from '@/utils/middleware';
import User from '@/models/Users';
import Rules from '@/models/Rules';
import { connectDB } from '@/utils/db';

const ruleViolationController = new RuleViolationController();

// GET violations by violator ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ violatorId: string }> }
) {
  try {
    // Verify authentication
    const auth = await withAuth(request);
    if (auth.error) {
      return createUnauthorizedResponse(auth.message);
    }

    // Get user's current team
    const teamId = await getUserTeamId(auth.userId);
    if (!teamId) {
      return NextResponse.json(
        { error: 'No active team found' },
        { status: 400 }
      );
    }

    const { violatorId } = await params;

    if (!violatorId) {
      return NextResponse.json(
        { error: 'Violator ID is required' },
        { status: 400 }
      );
    }

    const violations = await ruleViolationController.getViolationsByViolator(violatorId, teamId);

    // Fetch violator data
    await connectDB();
    const violator = await User.findById(violatorId);

    // Fetch rule data for each violation
    const violationsWithRuleData = await Promise.all(
      violations.map(async (violation) => {
        const rule = await Rules.findById(violation.ruleId);
        return {
          violation,
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
        violatorData: violator ? {
          id: violator._id,
          fullName: violator.fullName,
          email: violator.email,
          phone: violator.phone,
          team: violator.team,
        } : null,
        violations: violationsWithRuleData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get violations by violator error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while retrieving violations' },
      { status: 400 }
    );
  }
}
