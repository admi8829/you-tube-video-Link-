import React, { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, Bot, User, Loader2, PlayCircle, HelpCircle } from "lucide-react";
import { ChatMessage } from "../types";

export const ArchitectConsultant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      role: "assistant",
      content: "Hello! I am your Senior Mobile Application Developer and DevOps Engineer consultant. I specialize in high-performance local video processing (FFmpeg), cross-platform MLKit trackers, and modular APK building pipelines in React Native. Ask me anything, or pick one of my architect preset queries below!",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const presets = [
    "How do I optimize local FFmpeg binary bundle size in React Native APKs?",
    "What are hardware acceleration parameters for crop filters in Android/iOS?",
    "Write an Expo Config Plugin example to configure custom Gradle builds with FFmpeg Kit dependencies.",
    "Draft a robust self-hosted Gradle builder script for private APK compilation.",
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const historyPayload = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/consult-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyPayload }),
      });

      if (!res.ok) {
        throw new Error("Local senior architect server was unable to generate a response thread.");
      }

      const resData = await res.json();
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: resData.answer || "Hello, I wasn't able to compile an answer.",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: `Consulting error: ${err.message || "Failed to make progress. Please verify Server and Secret API keys."}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="architect-consultant">
      {/* Discussion Room Bubble stream */}
      <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[620px] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-semibold text-slate-200">
                Senior Mobile Developer & DevOps AI Companion
              </h3>
              <p className="text-[10px] text-slate-500 font-mono">
                ACTOR MODEL STATUS: ACTIVE & STREAMING
              </p>
            </div>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse block shrink-0" />
        </div>

        {/* Bubble Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-950/50 custom-scrollbar" ref={scrollRef}>
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 max-w-[85%] ${
                m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`p-2.5 rounded-lg shrink-0 ${
                  m.role === "user"
                    ? "bg-slate-800 border border-slate-700/60"
                    : "bg-cyan-500/10 border border-cyan-500/20"
                }`}
              >
                {m.role === "user" ? (
                  <User className="h-4 w-4 text-slate-300" />
                ) : (
                  <Bot className="h-4 w-4 text-cyan-400" />
                )}
              </div>
              <div className="space-y-1">
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-blue-600/15 border border-blue-500/30 text-slate-200 rounded-tr-none"
                      : "bg-slate-900 border border-slate-800/80 text-slate-300 rounded-tl-none"
                  }`}
                >
                  {m.content}
                </div>
                <span className={`text-[9px] font-mono text-slate-500 block ${m.role === "user" ? "text-right" : "text-left"}`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2.5 max-w-[85%] mr-auto">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 shrink-0">
                <Bot className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="bg-slate-900 border border-slate-800/80 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                Architect model is processing your prompt...
              </div>
            </div>
          )}
        </div>

        {/* Input Text Form */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-850 shrink-0 flex gap-2">
          <input
            type="text"
            placeholder="Introduce custom technical queries (e.g. 'How do I handle MLKit async loops on Android?')"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage(inputValue);
            }}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/70"
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            className="p-2.5 bg-blue-600 hover:bg-blue-500 hover:scale-[1.03] text-white rounded-xl active:scale-95 transition"
          >
            <Send className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </div>

      {/* Selectable Presets Sidebar */}
      <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
          Developer Question Vault
        </h3>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          Quick-select preset queries centered around premium, multi-threaded mobile implementations, and automated Android Gradle compilers.
        </p>

        <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(preset)}
              className="w-full text-left p-3 rounded-xl border border-slate-800 bg-slate-950/40 text-xs text-slate-300 hover:bg-slate-800/50 hover:border-slate-700 hover:text-white transition group flex items-start gap-2 select-none active:scale-[0.98]"
            >
              <HelpCircle className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5 group-hover:scale-110 transition" />
              <span>{preset}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono text-center">
          Powered by Gemini 3.5-Flash
        </div>
      </div>
    </div>
  );
};
