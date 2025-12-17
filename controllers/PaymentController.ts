import { connectDB } from '@/utils/db';
import Payment from '@/models/Payment';
import User from '@/models/Users';

export async function addPayment(
  payedBy: string,
  amount: number,
  date?: Date,
  note?: string
) {
  try {
    await connectDB();

    // Validate payedBy user exists
    const user = await User.findById(payedBy);
    if (!user) {
      return {
        success: false,
        message: 'User not found',
        statusCode: 404,
      };
    }

    // Validate amount
    if (amount <= 0) {
      return {
        success: false,
        message: 'Amount must be greater than 0',
        statusCode: 400,
      };
    }

    const payment = new Payment({
      payedBy,
      amount,
      date: date || new Date(),
      note,
    });

    const savedPayment = await payment.save();

    // Get user info for response
    const payedByUser = await User.findById(savedPayment.payedBy).select('-password');

    return {
      success: true,
      message: 'Payment added successfully',
      statusCode: 201,
      data: {
        ...savedPayment.toObject(),
        payedByUser,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
      statusCode: 500,
    };
  }
}

export async function getAllPayments() {
  try {
    await connectDB();

    const payments = await Payment.find().lean();

    // Enrich with user data
    const enrichedPayments = await Promise.all(
      payments.map(async (payment: any) => {
        const payedByUser = await User.findById(payment.payedBy).select('-password').lean();
        return {
          ...payment,
          payedByUser,
        };
      })
    );

    return {
      success: true,
      message: 'Payments retrieved successfully',
      statusCode: 200,
      data: enrichedPayments,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
      statusCode: 500,
    };
  }
}

export async function getPaymentById(paymentId: string) {
  try {
    await connectDB();

    const payment = await Payment.findById(paymentId).lean();
    if (!payment) {
      return {
        success: false,
        message: 'Payment not found',
        statusCode: 404,
      };
    }

    // Get user info
    const payedByUser = await User.findById((payment as any).payedBy).select('-password').lean();

    return {
      success: true,
      message: 'Payment retrieved successfully',
      statusCode: 200,
      data: {
        ...payment,
        payedByUser,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
      statusCode: 500,
    };
  }
}

export async function getPaymentsByUser(userId: string) {
  try {
    await connectDB();

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        message: 'User not found',
        statusCode: 404,
      };
    }

    const payments = await Payment.find({ payedBy: userId });

    // Enrich with user data
    const enrichedPayments = await Promise.all(
      payments.map(async (payment: any) => {
        const payedByUser = await User.findById(payment.payedBy).select('-password').lean();
        return {
          ...payment,
          payedByUser,
        };
      })
    );

    return {
      success: true,
      message: 'Payments retrieved successfully',
      statusCode: 200,
      data: enrichedPayments,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
      statusCode: 500,
    };
  }
}

export async function updatePayment(
  paymentId: string,
  amount?: number,
  date?: Date,
  note?: string
) {
  try {
    await connectDB();

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return {
        success: false,
        message: 'Payment not found',
        statusCode: 404,
      };
    }

    if (amount !== undefined) {
      if (amount <= 0) {
        return {
          success: false,
          message: 'Amount must be greater than 0',
          statusCode: 400,
        };
      }
      payment.amount = amount;
    }

    if (date) payment.date = date;
    if (note !== undefined) payment.note = note;

    const updatedPayment = await payment.save();

    // Get user info for response
    const payedByUser = await User.findById((updatedPayment as any).payedBy).select('-password').lean();

    return {
      success: true,
      message: 'Payment updated successfully',
      statusCode: 200,
      data: {
        ...(updatedPayment as any).toObject(),
        payedByUser,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
      statusCode: 500,
    };
  }
}

export async function deletePayment(paymentId: string) {
  try {
    await connectDB();

    const payment = await Payment.findByIdAndDelete(paymentId).lean();
    if (!payment) {
      return {
        success: false,
        message: 'Payment not found',
        statusCode: 404,
      };
    }

    // Get user info for response
    const payedByUser = await User.findById((payment as any).payedBy).select('-password').lean();

    return {
      success: true,
      message: 'Payment deleted successfully',
      statusCode: 200,
      data: {
        ...payment,
        payedByUser,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
      statusCode: 500,
    };
  }
}
