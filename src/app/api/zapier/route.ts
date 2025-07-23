import { NextResponse } from 'next/server';

// This is the actual Zapier webhook URL, kept on the server-side.
const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/22464835/25d8f6c689f3421e976a9c887f519386/';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Forward the request to the real Zapier webhook
    const zapierResponse = await fetch(ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!zapierResponse.ok) {
      // If Zapier returned an error, forward that error to the client
      const errorText = await zapierResponse.text();
      return new NextResponse(
        `Error from Zapier: ${errorText}`,
        { status: zapierResponse.status }
      );
    }

    const responseData = await zapierResponse.json();

    // Send the response from Zapier back to our client
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error in Zapier API route:', error);
    if (error instanceof Error) {
        return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse('An unknown error occurred.', { status: 500 });
  }
}
