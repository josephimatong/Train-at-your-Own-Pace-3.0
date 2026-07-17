sed -i '173a\
      {/* AI Executive Briefing */}\n\
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-xl shadow-md p-6 relative overflow-hidden">\n\
        <div className="absolute top-0 right-0 p-4 opacity-10">\n\
          <Sparkles className="w-24 h-24 text-cyan-400" />\n\
        </div>\n\
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">\n\
          <div className="flex-1 space-y-4">\n\
            <div className="flex items-center gap-3">\n\
              <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg text-white shadow-lg shadow-cyan-500/20">\n\
                <Sparkles className="w-5 h-5" />\n\
              </div>\n\
              <h3 className="text-lg font-black text-slate-100 tracking-wide">AI Executive Briefing</h3>\n\
            </div>\n\
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">\n\
              Use Wee Hur AI to analyze the current training data across all sites. Get instant, data-driven recommendations to improve compliance and site safety.\n\
            </p>\n\
            {aiInsights && (\n\
              <div className="mt-4 p-5 bg-slate-950/80 border border-slate-800/80 rounded-xl shadow-inner prose prose-invert prose-sm max-w-none prose-headings:text-cyan-400 prose-a:text-blue-400">\n\
                <Markdown>{aiInsights}</Markdown>\n\
              </div>\n\
            )}\n\
          </div>\n\
          <div className="shrink-0 flex items-center justify-center">\n\
            <button\n\
              onClick={handleGenerateInsights}\n\
              disabled={isGeneratingInsights}\n\
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 text-cyan-400 font-bold rounded-lg shadow-lg flex items-center gap-2 transition-all"\n\
            >\n\
              {isGeneratingInsights ? (\n\
                <><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Data...</>\n\
              ) : (\n\
                <><Sparkles className="w-4 h-4" /> Generate AI Insights</>\n\
              )}\n\
            </button>\n\
          </div>\n\
        </div>\n\
      </div>\n' src/components/ManagerAnalytics.tsx
