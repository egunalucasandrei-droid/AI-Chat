export default async function handler(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({ text: "ERROR: Vercel cannot find the API Key." });
    }

    const { messages } = req.body;

    // Translate your frontend conversation history into Google's required format
    const geminiHistory = messages.map(msg => ({
      role: msg.sender === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-3-flash-preview:generateContent?key=${apiKey.trim()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: geminiHistory
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ text: `GOOGLE ERROR: ${data.error.message}` });
    }

    const text = data.candidates[0].content.parts[0].text;
    res.status(200).json({ text });

  } catch (error) {
    res.status(200).json({ text: `SERVER CRASHED: ${error.message}` });
  }
}