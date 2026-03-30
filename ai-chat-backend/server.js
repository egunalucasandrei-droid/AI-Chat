export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const { messages } = req.body;
    const prompt = messages[messages.length - 1].text;
    const apiKey = process.env.GEMINI_API_KEY;

    // Direct Google API Call
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const text = data.candidates[0].content.parts[0].text;
    res.status(200).json({ text });

  } catch (error) {
    console.error("Vercel API Error:", error);
    res.status(500).json({ error: "Server crashed" });
  }
}