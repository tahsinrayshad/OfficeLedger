import { NextRequest, NextResponse } from 'next/server';
import { RulesController } from '@/controllers/RulesController';
import { withAuth, createUnauthorizedResponse } from '@/utils/middleware';

const rulesController = new RulesController();

// GET all rules
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await withAuth(request);
    if (auth.error) {
      return createUnauthorizedResponse(auth.message);
    }

    const rules = await rulesController.getAllRules();

    return NextResponse.json(
      {
        message: 'Rules retrieved successfully',
        rules,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get rules error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while retrieving rules' },
      { status: 400 }
    );
  }
}

// POST add new rule
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await withAuth(request);
    if (auth.error) {
      return createUnauthorizedResponse(auth.message);
    }

    const body = await request.json();
    const { title, amount, description } = body;

    // Validate required fields
    if (!title || amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: title, amount' },
        { status: 400 }
      );
    }

    const newRule = await rulesController.addRule(
      auth.userId,
      title,
      amount,
      description
    );

    return NextResponse.json(
      {
        message: 'Rule added successfully',
        rule: newRule,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Add rule error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while adding rule' },
      { status: 400 }
    );
  }
}
