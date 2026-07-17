const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Find where quiz-hint ends
const quizHintEndIndex = content.indexOf('// --- Vite Dev Server & Production serving configuration ---');
if (quizHintEndIndex > -1) {
    let before = content.substring(0, quizHintEndIndex);
    const after = content.substring(quizHintEndIndex);
    
    // We want to replace everything between quiz-hint route end and Vite Dev Server
    // Let's find the end of quiz-hint route. It's the `});\n  });` before `// --- Vite Dev Server`
    const lines = before.split('\n');
    let lastValidLineIdx = lines.length - 1;
    for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].includes('// --- Vite Dev Server')) {
            lastValidLineIdx = i - 1;
            break;
        }
    }
    
    // Actually, I'll just recreate the whole AI sections properly
    // Let's just find the start of `app.post('/api/ai/quiz-hint'`
    const quizHintStartIdx = content.indexOf("app.post('/api/ai/quiz-hint'");
    if (quizHintStartIdx !== -1) {
        const top = content.substring(0, quizHintStartIdx);
        const bottom = content.substring(content.indexOf('// --- Vite Dev Server & Production serving configuration ---'));
        
        const newAI = `
  app.post('/api/ai/quiz-hint', async (req, res) => {
    try {
      const { question, options, currentLanguage } = req.body;
      if (!question) {
        res.status(400).json({ error: 'Missing quiz question in request.' });
        return;
      }

      const ai = getAiClient();
      const prompt = \`The user is struggling with a safety training quiz question:
Question: "\${question}"
Options: \${JSON.stringify(options || [])}

Provide a clever, helpful, educational HINT. **CRITICAL RULES**:
- Do NOT directly say which index is correct (e.g. do not say "Option B is correct" or "Choose number 2").
- Explain the underlying physical force, safety rule, or practical reason that points them to the correct logic.
- Encourage them to choose the safest option.
- Keep the response extremely brief (2-3 sentences max) and direct.
- Respond in the language: "\${currentLanguage || 'en'}".\`;

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

  // 4. Gemini Intelligence - Manager Analytics Insights
  app.post('/api/ai/analytics-insights', async (req, res) => {
    try {
      const { statsData, currentLanguage } = req.body;
      if (!statsData) {
        res.status(400).json({ error: 'Missing statsData in request.' });
        return;
      }

      const ai = getAiClient();
      const prompt = \`Please analyze the following training and compliance statistics for Wee Hur Construction:\\n\\n\${JSON.stringify(statsData)}\\n\\nProvide an actionable, data-driven "AI Executive Briefing". Highlight:\\n1. Top performing areas.\\n2. Areas that need urgent managerial attention (e.g., low compliance or incomplete modules).\\n3. Two actionable recommendations to improve site safety and training completion rates.\\n\\nFormat beautifully in markdown, using bullet points and keeping it concise. Respond in the language: "\${currentLanguage || "en"}".\`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are a professional Data Analyst and Safety Manager for Wee Hur Construction. Provide direct, highly professional, and encouraging insights based on training statistics.',
          temperature: 0.4,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Gemini Analytics API Error:', error);
      res.status(500).json({
        error: error.message || 'Failed to generate analytics insights.',
        code: 'GEMINI_ERROR'
      });
    }
  });
`;
        fs.writeFileSync('server.ts', top + newAI + '\n  ' + bottom);
        console.log('Fixed server.ts successfully');
    } else {
        console.log('Could not find quiz-hint start');
    }
} else {
    console.log('Could not find Vite Dev Server comment');
}
