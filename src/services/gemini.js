export const getGeminiResponse = async (messages) => {
  try {
    // Vercel handles the routing automatically!
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) throw new Error(`Server Error: ${response.status}`);
    
    const data = await response.json();
    return data.text;

  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error(error.message);
  }
};