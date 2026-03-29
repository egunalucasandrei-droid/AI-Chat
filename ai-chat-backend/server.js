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

const PORT = 3001;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Server ready at http://127.0.0.1:${PORT}`);
});