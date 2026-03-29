import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// 1. Initialize the NEW SDK correctly
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/chat', async (req, res) => {
  console.log("📩 Received message request...");
  try {
    const { messages } = req.body;
    const latestMessage = messages[messages.length - 1].text;
    
    // Format history: Google requires 'user' or 'model' (not 'bot')
    const history = messages.slice(0, -1)
      .filter((msg, index) => !(index === 0 && msg.role === 'bot'))
      .map(msg => ({
        role: msg.role === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

    // 2. Use the NEW SDK chat creation syntax
    const chat = ai.chats.create({
      model: "gemini-2.5-flash", 
      history: history,
    });

    // 3. Send the message and await the response
    const response = await chat.sendMessage({ message: latestMessage });
    
    console.log("✅ AI Responded successfully");
    res.json({ text: response.text });

  } catch (error) {
    console.error("❌ Gemini API Error:", error.message || error);
    res.status(500).json({ error: error.message || "Failed to get AI response" });
  }
});

// This tells the server to use Render's assigned port OR 3001
const PORT = process.env.PORT || 3001;

// Use '0.0.0.0' instead of '127.0.0.1' so the internet can talk to it
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server ready at http://0.0.0.0:${PORT}`);
});