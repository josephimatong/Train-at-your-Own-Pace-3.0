sed -i '230a\
      });\n\
      res.json({ text: response.text });\n\
    } catch (error: any) {\n\
      console.error("Gemini Hint API Error:", error);\n\
      res.status(500).json({ \n\
        error: error.message || "Failed to generate quiz hints.",\n\
        code: "GEMINI_ERROR"\n\
      });\n\
    }\n\
  });\n' server.ts
