export async function sendToZapier(data: any) {
  // The client will now send requests to our own API route
  const webhookUrl = '/api/zapier';

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API route failed with status ${response.status}: ${errorText}`);
    }

    // Return the JSON response from the API route
    return await response.json();
  } catch (error) {
    console.error('Error sending data to Zapier via API route:', error);
    throw error;
  }
}
