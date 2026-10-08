import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    const apiKey = process.env.MAILCHIMP_API_KEY;
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
    const server = process.env.MAILCHIMP_API_SERVER || (apiKey ? apiKey.split('-')[1] : '');

    if (!apiKey || !audienceId || !server) {
      return NextResponse.json(
        { error: 'Mailchimp is not configured on the server' },
        { status: 500 }
      );
    }

    const response = await fetch(`https://${server}.api.mailchimp.com/3.0/lists/${audienceId}/members`, {
      method: 'POST',
      headers: {
        Authorization: `apikey ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.title === 'Member Exists') {
        return NextResponse.json({ message: "You're already subscribed!" }, { status: 200 });
      }
      return NextResponse.json(
        { error: data.detail || 'Failed to subscribe to newsletter' },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: 'Subscribed successfully!' }, { status: 200 });
  } catch (error: any) {
    console.error('Error in newsletter subscribe route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
