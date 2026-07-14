/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { google } from 'googleapis';

// Load environment variables
dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Lazy-initialize Gemini SDK to prevent startup crashes when API key is missing
  let aiClient: GoogleGenAI | null = null;
  function getAiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured in the environment variables.');
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // 1. Gemini Safety Chatbot Proxy (Multi-turn chat)
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, userRole, currentLanguage, driveToken } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: 'Invalid or missing messages array in request body.' });
        return;
      }

      let driveContext = '';
      if (driveToken) {
        try {
          const authClient = new google.auth.OAuth2();
          authClient.setCredentials({ access_token: driveToken });
          const drive = google.drive({ version: 'v3', auth: authClient });

          const latestUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
          
          if (latestUserMessage.length > 2) {
             const searchResponse = await drive.files.list({
                q: "(mimeType='text/plain' or mimeType='application/vnd.google-apps.document') and 'corporateinfo.cons@weehur.com.sg' in owners",
                pageSize: 3,
                fields: 'files(id, name, mimeType)',
                orderBy: 'modifiedTime desc'
             });

             const files = searchResponse.data.files || [];
             for (const file of files) {
                try {
                   let content = '';
                   if (file.mimeType === 'application/vnd.google-apps.document') {
                       const exportRes = await drive.files.export({
                           fileId: file.id!,
                           mimeType: 'text/plain'
                       });
                       content = exportRes.data as string;
                   } else if (file.mimeType === 'text/plain') {
                       const getRes = await drive.files.get({
                           fileId: file.id!,
                           alt: 'media'
                       });
                       content = getRes.data as string;
                   }
                   if (content) {
                       driveContext += `\\n--- Document Name: ${file.name} ---\\n${content.substring(0, 3000)}\\n`;
                   }
                } catch (e) {
                   console.error(`Error reading file ${file.name}:`, e);
                }
             }
          }
        } catch (e) {
          console.error('Drive context error:', e);
        }
      }

      const ai = getAiClient();

      // System instruction for the assistant
      let systemInstruction = `
You are "WH Friendly Assistant", a highly positive, supportive, and friendly chatbot guide for the Wee Hur Training Hub application and Wee Hur Construction Pte Ltd, Singapore.
Your primary roles are:
1. Guide the user on how to use the applications (e.g. how to view tutorials, take interactive quizzes, request AI hints, write collaborative study notes, check the compliance leaderboard, view site certifications/badges, and sync their local progress with the cloud).
2. Guide them on the training content of Wee Hur Training Hub, which includes modules such as Work At Height Safety (WAH), Precast Concrete Installation Guide (PPVC), CONQUAS Quality Standards: Wet Trades, Excavation and Shoring Safety Measures, Tower Crane Operation, and on-site compliance.
3. Be an extremely positive, motivating companion! Always wrap your responses with positive, encouraging messages to boost employee morale and promote safe work practices.

You are fluent in English, Chinese (中文), Malay (Melayu), and Tamil (தமிழ்). Respond in the language that the user is communicating with.
Keep your answers highly practical, energetic, warm, structured (using clean markdown bullet points), and easy to understand for workers and site staff alike.
The user is logged in as a simulated role: "${userRole || 'employee'}" and language: "${currentLanguage || 'en'}". Give them welcoming, supportive, and uplifting advice!
`;
      if (driveContext) {
        systemInstruction += `\n\nCRITICAL: Base your technical, safety, HR, and operational responses strictly on the verified documents, manuals, and data found within the connected Google Drive repository provided below:\n${driveContext}\n`;
      }

      // Map client-side messages structure to Gemini content format
      // Expected input: messages = [ { role: 'user' | 'model', content: string } ]
      const contents = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Gemini Chat API Error:', error);
      res.status(500).json({ 
        error: error.message || 'An error occurred while communicating with Gemini AI.',
        code: 'GEMINI_ERROR'
      });
    }
  });

  // 2. Gemini Intelligence - Explain Safety Tutorial & Analyze Study Notes
  app.post('/api/ai/tutorial-explain', async (req, res) => {
    try {
      const { title, category, description, studyNotes, currentLanguage } = req.body;

      if (!title) {
        res.status(400).json({ error: 'Missing tutorial title in request.' });
        return;
      }

      const ai = getAiClient();

      const prompt = `
Please analyze the following construction training tutorial module and provide custom learning insights:

Topic Title: ${title}
Category: ${category || 'General Safety'}
Description: ${description || 'No description available'}
User's Personal Study Notes: "${studyNotes || 'None taken yet'}"

Please generate a professional response with:
1. **Summary**: A high-impact, 3-sentence executive summary of this topic.
2. **On-Site Hazard Warnings**: List 3 critical safety hazards/checkpoints relevant to this topic at a Singapore construction site.
3. **Study Notes Review**: Give constructive feedback on their study notes. If notes are empty, suggest what they should write down based on key safety practices for this topic.
4. **Interactive Safety Scenario**: Write a short 1-question "On-Site Scenario Challenge" (with a correct answer and brief explanation) to test their practical application of this safety concept.

Please output the response in standard, elegant markdown format using the language: "${currentLanguage || 'en'}".
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an elite expert trainer for Wee Hur Construction Pte Ltd. You explain complex site safety regulations clearly.',
          temperature: 0.6,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Gemini Explain API Error:', error);
      res.status(500).json({ 
        error: error.message || 'Failed to generate tutorial explanations.',
        code: 'GEMINI_ERROR'
      });
    }
  });

  // 3. Gemini Intelligence - Provide Quiz Hint
  app.post('/api/ai/quiz-hint', async (req, res) => {
    try {
      const { question, options, currentLanguage } = req.body;

      if (!question) {
        res.status(400).json({ error: 'Missing quiz question in request.' });
        return;
      }

      const ai = getAiClient();

      const prompt = `
The user is struggling with a safety training quiz question:
Question: "${question}"
Options: ${JSON.stringify(options || [])}

Provide a clever, helpful, educational HINT. 
**CRITICAL RULES**:
- Do NOT directly say which index is correct (e.g. do not say "Option B is correct" or "Choose number 2").
- Explain the underlying physical force, safety rule, or practical reason that points them to the correct logic.
- Encourage them to choose the safest option.
- Keep the response extremely brief (2-3 sentences max) and direct.
- Respond in the language: "${currentLanguage || 'en'}".
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are a supportive safety trainer. You give helpful clues to help construction workers solve safety quizzes without giving away the direct answers.',
          temperature: 0.5,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Gemini Hint API Error:', error);
      res.status(500).json({ 
        error: error.message || 'Failed to generate quiz hints.',
        code: 'GEMINI_ERROR'
      });
    }
  });


  // --- Vite Dev Server & Production serving configuration ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development middleware mounted.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production static assets from dist/.');
  }

  // Bind to 0.0.0.0 and PORT (3000) as required
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
