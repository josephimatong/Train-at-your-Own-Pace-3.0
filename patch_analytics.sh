sed -i '39a\
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);\n\
  const [aiInsights, setAiInsights] = useState<string | null>(null);\n\
\n\
  const handleGenerateInsights = async () => {\n\
    setIsGeneratingInsights(true);\n\
    setAiInsights(null);\n\
    try {\n\
      const res = await fetch("/api/ai/analytics-insights", {\n\
        method: "POST",\n\
        headers: { "Content-Type": "application/json" },\n\
        body: JSON.stringify({ statsData: categoryStats, currentLanguage }),\n\
      });\n\
      const data = await res.json();\n\
      if (res.ok) {\n\
        setAiInsights(data.text);\n\
      } else {\n\
        setAiInsights("Failed to load insights. " + (data.error || ""));\n\
      }\n\
    } catch (err) {\n\
      setAiInsights("Network error while generating insights.");\n\
    } finally {\n\
      setIsGeneratingInsights(false);\n\
    }\n\
  };\n' src/components/ManagerAnalytics.tsx
