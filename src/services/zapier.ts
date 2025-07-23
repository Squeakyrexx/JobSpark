export async function sendToZapier(data: any) {
  const webhookUrl = 'https://hooks.zapier.com/hooks/catch/22464835/25d8f6c689f3421e976a9c887f519386/';

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Zapier webhook failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending data to Zapier:', error);
    throw error;
  }
}
