import { AnimatePresence, motion } from "motion/react";
import { Bot, LifeBuoy, Send, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { MODE_THEMES } from "../theme/modeTheme";
import type {
  LanguageCode,
  LearnerProfile,
  WorkspaceTab,
} from "../types";

interface AgentChatItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface FloatingAiAgentProps {
  profile: LearnerProfile;
  language: LanguageCode;
  activeTab: WorkspaceTab;
}

const AGENT_STRINGS: Record<
  LanguageCode,
  {
    buttonLabel: string;
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    emptyPrompt: string;
    suggestions: string[];
  }
> = {
  en: {
    buttonLabel: "Ask AI Agent",
    title: "SkillMint AI Agent",
    subtitle: "Ask any question anytime · Instant answers & help",
    placeholder: "Ask anything about skills, code, studies, or career...",
    send: "Send",
    emptyPrompt: "Hi! Ask me any question—I can help with skills, coding, homework, company projects, or using SkillMint.",
    suggestions: [
      "Explain a tough concept in simple steps",
      "How do I reach Rank #1 faster?",
      "Give me a 15-minute practice plan today",
    ],
  },
  ta: {
    buttonLabel: "AI உதவியாளர்",
    title: "SkillMint AI முகவர்",
    subtitle: "எந்தக் கேள்வியையும் எப்போது வேண்டுமானாலும் கேளுங்கள்",
    placeholder: "திறன்கள், நிரலாக்கம், படிப்பு அல்லது தொழில் பற்றி கேளுங்கள்...",
    send: "அனுப்பு",
    emptyPrompt: "வணக்கம்! திறன் வளர்ச்சி, பள்ளி/கல்லூரிப் பாடங்கள், நிறுவனத் திட்டங்கள் அல்லது தரவரிசை உயர்வு குறித்து எதையும் கேட்கலாம்.",
    suggestions: [
      "என் தரவரிசையை விரைவாக உயர்த்துவது எப்படி?",
      "இன்று 15 நிமிட பயிற்சித் திட்டம் கொடுங்கள்",
      "என் இலக்குப் பதவிக்கு முக்கியமான திறன்கள் எவை?",
    ],
  },
  es: {
    buttonLabel: "Agente IA",
    title: "Agente IA SkillMint",
    subtitle: "Pregunta lo que quieras en cualquier momento",
    placeholder: "Pregunta sobre habilidades, código o estudios...",
    send: "Enviar",
    emptyPrompt: "¡Hola! Pregúntame cualquier duda sobre tus estudios, trabajo o habilidades.",
    suggestions: [
      "¿Cómo subo más rápido al rango #1?",
      "Dame un plan de práctica de 15 minutos",
    ],
  },
  fr: {
    buttonLabel: "Agent IA",
    title: "Agent IA SkillMint",
    subtitle: "Posez toutes vos questions à tout moment",
    placeholder: "Posez une question sur vos compétences ou études...",
    send: "Envoyer",
    emptyPrompt: "Bonjour ! Je réponds à toutes vos questions techniques, scolaires ou professionnelles.",
    suggestions: [
      "Comment atteindre le rang #1 plus vite ?",
      "Donne-moi un exercice pratique de 15 minutes",
    ],
  },
  de: {
    buttonLabel: "KI-Agent",
    title: "SkillMint KI-Agent",
    subtitle: "Stellen Sie jederzeit jede Frage",
    placeholder: "Fragen zu Skills, Code, Studium oder Beruf...",
    send: "Senden",
    emptyPrompt: "Hallo! Ich helfe Ihnen jederzeit bei Fragen zu Skills, Projekten oder Lernzielen.",
    suggestions: [
      "Wie erreiche ich schneller Rang #1?",
      "Gib mir eine 15-Minuten-Übung für heute",
    ],
  },
  hi: {
    buttonLabel: "AI एजेंट",
    title: "SkillMint AI एजेंट",
    subtitle: "कभी भी कोई भी सवाल पूछें",
    placeholder: "कौशल, कोडिंग या पढ़ाई के बारे में पूछें...",
    send: "भेजें",
    emptyPrompt: "नमस्ते! किसी भी विषय, प्रोजेक्ट या रैंक बढ़ाने के बारे में पूछें।",
    suggestions: [
      "रैंक #1 तक जल्दी कैसे पहुँचें?",
      "आज के लिए 15 मिनट का अभ्यास दें",
    ],
  },
  ja: {
    buttonLabel: "AIエージェント",
    title: "SkillMint AIエージェント",
    subtitle: "いつでもどんな質問にも回答します",
    placeholder: "スキル・学習・キャリアについて何でも質問...",
    send: "送信",
    emptyPrompt: "こんにちは！学習内容、コード、キャリアについて何でもお答えします。",
    suggestions: [
      "1位になるための最短ルートは？",
      "今日できる15分の練習メニューを教えて",
    ],
  },
};

export function FloatingAiAgent({
  profile,
  language,
  activeTab,
}: FloatingAiAgentProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AgentChatItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const theme = MODE_THEMES[profile.mode];
  const copy = AGENT_STRINGS[language] ?? AGENT_STRINGS.en;

  const sendQuestion = async (questionText: string, criticalSituation = false) => {
    const trimmed = questionText.trim();
    if (!trimmed || loading) return;

    const userItem: AgentChatItem = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userItem]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          mode: profile.mode,
          name: profile.name,
          skills: profile.skills,
          target_role: profile.target_role,
          currentPage: activeTab,
          language,
          criticalSituation,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Fallback");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content:
            data.reply ||
            `For ${profile.mode} (${profile.target_role}), break "${trimmed}" into one 20-minute hands-on step and verify it in Quiz & Brain Lab.`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: `SkillMint Quick Guide (${profile.mode} track): Break "${trimmed}" into smaller logical steps using your core skills (${profile.skills || profile.target_role}), practice one concrete example, and test yourself in the Quiz & Brain Lab to earn skill points.`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap ${theme.primaryBtn}`}
        >
          <Bot className="h-4 w-4 shrink-0" />
          <span>{copy.buttonLabel}</span>
        </button>
      </div>

      {/* Assistant Drawer */}
      <AnimatePresence>
        {open && (
          <motion.section
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            aria-label={copy.title}
            className="fixed bottom-20 right-4 sm:right-5 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[520px] max-h-[75vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-white shrink-0 ${theme.brandBadgeBg}`}
                >
                  <Sparkles className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {copy.title}
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {copy.subtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close AI Agent"
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-amber-50/70 dark:bg-amber-950/30 flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium text-amber-900 dark:text-amber-200 truncate">
                Stuck under pressure or deadline?
              </span>
              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  sendQuestion(
                    profile.mode === "Organization"
                      ? `Critical situation help: urgent team blocker or production issue in ${profile.target_role}`
                      : profile.mode === "Individual"
                      ? `Critical situation help: stuck on ${profile.target_role} project or interview prep`
                      : `Critical situation help: urgent exam, assignment, or code deadline for ${profile.target_role}`,
                    true
                  )
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-amber-600 hover:bg-amber-700 text-white whitespace-nowrap shrink-0 transition-colors"
              >
                <LifeBuoy className="h-3 w-3 shrink-0" />
                <span>Critical Help</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="space-y-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {copy.emptyPrompt}
                  </div>
                  <div className="space-y-2">
                    {copy.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => sendQuestion(suggestion)}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? theme.primaryBtn
                          : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="mt-1 text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      {msg.timestamp}
                    </span>
                  </div>
                ))
              )}

              {loading && (
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Thinking...
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendQuestion(input);
              }}
              className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={copy.placeholder}
                className="flex-1 min-w-0 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 ${theme.primaryBtn}`}
              >
                <Send className="h-3.5 w-3.5 shrink-0" />
                <span>{copy.send}</span>
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
