import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();

// Required for GitHub Pages to talk to Render
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Use the variable name from your Environment Variables in Render
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Get the last message text
    const prompt = messages[messages.length - 1].text;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.json({ text: response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "AI failed to respond" });
  }
});

// MANDATORY FOR RENDER DEPLOYMENT
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is live on port ${PORT}`);
});