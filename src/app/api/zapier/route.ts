
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
      const errorText = await zapierResponse.text();
      console.error(`Error from Zapier webhook: ${errorText}`);
      return new NextResponse(
        JSON.stringify({ error: `Error from Zapier: ${errorText}` }),
        { status: zapierResponse.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const responseData = await zapierResponse.json();

    // **Crucial Check**: Ensure the response from Zapier has the expected structure.
    if (!responseData || !Array.isArray(responseData.jobs)) {
        console.error('Invalid or empty response from Zapier agent. Expected a "jobs" array. Received:', responseData);
        // Return a structured error that the frontend can handle.
        return new NextResponse(
            JSON.stringify({ error: 'The Zapier agent returned an invalid response. It must return a JSON object with a key "jobs" containing an array.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Send the valid response from Zapier back to our client
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error in Zapier API route:', error);
    if (error instanceof Error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    return new NextResponse(JSON.stringify({ error: 'An unknown error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
