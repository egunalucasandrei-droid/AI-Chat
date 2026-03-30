export default async function handler(req, res) {
  // Always return 200 OK so the red error box never triggers
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    // Check 1: Did Vercel load the key?
    if (!apiKey) {
      return res.status(200).json({ text: "ERROR: Vercel cannot find the API Key. You must click 'Redeploy' in Vercel for it to load." });
    }

    const { messages } = req.body;
    const prompt = messages[messages.length - 1].text;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // Check 2: Did Google reject the key?
    if (data.error) {
      return res.status(200).json({ text: `GOOGLE REJECTED IT: ${data.error.message}` });
    }

    // Success: Send the real AI response
    const text = data.candidates[0].content.parts[0].text;
    res.status(200).json({ text });

  } catch (error) {
    // Check 3: Did the code crash?
    res.status(200).json({ text: `SERVER CRASHED: ${error.message}` });
  }
}