sed -i '250,273d' server.ts
sed -i '249a\
      const ai = getAiClient();\n\
      const prompt = `Please analyze the following training and compliance statistics for Wee Hur Construction:\\n\\n${JSON.stringify(statsData)}\\n\\nProvide an actionable, data-driven "AI Executive Briefing". Highlight:\\n1. Top performing areas.\\n2. Areas that need urgent managerial attention (e.g., low compliance or incomplete modules).\\n3. Two actionable recommendations to improve site safety and training completion rates.\\n\\nFormat beautifully in markdown, using bullet points and keeping it concise. Respond in the language: "${currentLanguage || "en"}".`;\n\
      const response = await ai.models.generateContent({\n\
        model: "gemini-3.5-flash",\n\
        contents: prompt,\n\
        config: {\n\
          systemInstruction: "You are a professional Data Analyst and Safety Manager for Wee Hur Construction. Provide direct, highly professional, and encouraging insights based on training statistics.",\n\
          temperature: 0.4,\n\
        }\n\
      });\n\
      res.json({ text: response.text });\n\
    } catch (error: any) {\n\
      console.error("Gemini Analytics API Error:", error);\n\
      res.status(500).json({\n\
        error: error.message || "Failed to generate analytics insights.",\n\
        code: "GEMINI_ERROR"\n\
      });\n\
    }\n\
  });' server.ts
