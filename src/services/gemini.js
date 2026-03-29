export const getGeminiResponse = async (messages) => {
  try {
    // YOU MUST USE THE FULL RENDER URL HERE
    const response = await fetch('https://ai-chat-backend-r8e8.onrender.com/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Server Error: ${response.status}`);
    }

    const data = await response.json();
    return data.text;

  } catch (error) {
    console.error("Frontend Fetch Error:", error);
    throw new Error(error.message);
  }
};