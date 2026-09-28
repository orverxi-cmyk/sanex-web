import { NextResponse } from 'next/server';
import { sendBookingStatusEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, customerEmail, customerName, serviceType, newStatus, appointmentDate, locationUrl, phone } = body;

    if (!bookingId || !newStatus || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required parameters: bookingId, newStatus, or customerEmail.' },
        { status: 400 }
      );
    }

    const result = await sendBookingStatusEmail({
      bookingId,
      customerEmail,
      customerName: customerName || 'Valued Customer',
      serviceType: serviceType || 'Liquid Waste Management',
      newStatus,
      appointmentDate,
      locationUrl,
      phone
    });

    return NextResponse.json({
      success: result.success,
      method: result.method,
      message: result.message || 'Notification processed successfully'
    });
  } catch (error: any) {
    console.error('Error in /api/bookings/notify-status route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error processing notification' },
      { status: 500 }
    );
  }
}
