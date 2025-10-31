"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Bot, Info, X } from "lucide-react";

type Sender = "user" | "flippy";
type Message = { id: string; sender: Sender; text: React.ReactNode; isTyping?: boolean };

type QA = {
  id: string;
  question: string;
  answer: React.ReactNode;
};

const PRESET_QA: QA[] = [
  {
    id: "q1",
    question: "How do I find my resources?",
    answer:
      (
        <>
          You can find all learning materials on the{" "}
          <Link to="/resources" className="font-bold underline hover:text-primary">
            Resources
          </Link>{" "}
          page. Use the filters to sort by module or resource type (video, PDF, etc.). Click on any resource card to view it.
        </>
      ),
  },
  {
    id: "q2",
    question: "How do I take a quiz?",
    answer:
      (
        <>
          Go to the{" "}
          <Link to="/assessments" className="font-bold underline hover:text-primary">
            Assessments
          </Link>{" "}
          page to see available quizzes. Click on a quiz to start. After you submit, you'll see your score and a review of your answers.
        </>
      ),
  },
  {
    id: "q3",
    question: "Where can I ask questions?",
    answer:
      (
        <>
          The{" "}
          <Link to="/forum" className="font-bold underline hover:text-primary">
            Forum
          </Link>{" "}
          is the best place to ask questions. You can browse existing discussion threads or create a new post to get help from instructors and peers.
        </>
      ),
  },
  {
    id: "q4",
    question: "How do I view my profile?",
    answer:
      (
        <>
          Click your name in the top-right of the navigation bar, then select 'Profile'. You can see your activity, including recent comments and completed resources. You can also visit the{" "}
          <Link to="/profile" className="font-bold underline hover:text-primary">
            Profile
          </Link>{" "}
          page directly.
        </>
      ),
  },
  {
    id: "q5",
    question: "How do I send a direct message?",
    answer:
      (
        <>
          Go to the{" "}
          <Link to="/messages" className="font-bold underline hover:text-primary">
            Messages
          </Link>{" "}
          page. From there, you can view your existing conversations or start a new one with your instructor or other students.
        </>
      ),
  },
];

// Utility for IDs
const uid = () => Math.random().toString(36).slice(2);

export function FloatingFlippyAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTypingTimeout = useCallback(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  }, []);

  // Welcome message appears when chat opens for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: uid(),
          sender: "flippy",
          text: "Hi! I’m Flippy. How can I help you today?",
        },
      ]);
    }
    if (!isOpen) {
      clearTypingTimeout();
    }
  }, [isOpen, messages.length, clearTypingTimeout]);

  // Close when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const clickingButton = btnRef.current?.contains(target);
      const clickingInsideChat = chatRef.current?.contains(target);
      if (!clickingButton && !clickingInsideChat) setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("mousedown", onClickOutside);
      return () => document.removeEventListener("mousedown", onClickOutside);
    }
  }, [isOpen]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearTypingTimeout();
    };
  }, [clearTypingTimeout]);

  const qaMap = useMemo(() => {
    const map = new Map<string, QA>();
    PRESET_QA.forEach((qa) => map.set(qa.id, qa));
    return map;
  }, []);

  const typeOutAnswer = useCallback((qa: QA) => {
    // If already typing, do nothing
    if (isTyping) return;

    const userMsg: Message = { id: uid(), sender: "user", text: qa.question };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate typing delay
    const typingDuration = 500 + Math.random() * 400;

    typingTimeoutRef.current = setTimeout(() => {
      const answerMsg: Message = {
        id: `ans-${qa.id}`,
        sender: "flippy",
        text: qa.answer,
      };
      setMessages((prev) => [...prev, answerMsg]);
      setIsTyping(false);
    }, typingDuration);
  }, [isTyping]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating button */}
      <button
        ref={btnRef}
        aria-label={isOpen ? "Close Flippy" : "Open Flippy"}
        className={`relative flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 outline-none focus:ring-2 focus:ring-indigo-400/60
          ${isOpen ? "rotate-90" : "rotate-0"}
          `}
        onClick={() => setIsOpen((s) => !s)}
        style={{
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.9) 0%, rgba(168,85,247,0.9) 100%)",
          boxShadow:
            "0 0 20px rgba(139,92,246,0.45), 0 0 40px rgba(124,58,237,0.35)",
          border: "2px solid rgba(255, 255, 255, 0.18)",
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/25 to-transparent opacity-30" />
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="relative z-10 text-white">
          {isOpen ? <X /> : <Bot className="h-7 w-7" />}
        </div>
        <div className="absolute inset-0 rounded-full animate-ping bg-indigo-500 opacity-15" />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          ref={chatRef}
          className="absolute bottom-20 right-0 w-[92vw] max-w-[460px]"
        >
          <div className="relative flex flex-col overflow-hidden rounded-3xl border border-zinc-700/50 bg-gradient-to-br from-zinc-800/90 to-zinc-900/95 shadow-2xl backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-zinc-100">
                    Flippy
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    FlipSpace AI Agent
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-300">
                  Simulation
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1.5 transition-colors hover:bg-zinc-700/50"
                  aria-label="Close Flippy chat"
                >
                  <X className="h-4 w-4 text-zinc-400" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="space-y-3 overflow-y-auto px-5 pt-2 pb-4 max-h-[56vh]"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                      m.sender === "user"
                        ? "bg-red-500/90 text-white"
                        : "border border-zinc-700/50 bg-zinc-800/80 text-zinc-100"
                    }`}
                    aria-live={m.sender === "flippy" ? "polite" : undefined}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div
                    className="max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed border border-zinc-700/50 bg-zinc-800/80 text-zinc-100"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400 delay-0" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400 delay-150" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400 delay-300" />
                    </div>
                  </div>
                </div>
              )}

              {/* Preset questions (always visible below the welcome) */}
              <div className="mt-2">
                <div className="mb-2 text-xs text-zinc-400">
                  Quick help topics
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_QA.map((qa) => (
                    <button
                      key={qa.id}
                      className="rounded-xl border border-zinc-700/50 bg-zinc-800/60 px-3 py-1.5 text-xs text-zinc-200 transition-colors hover:bg-zinc-700/60"
                      onClick={() => typeOutAnswer(qa)}
                    >
                      {qa.question}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer info */}
            <div className="flex items-center justify-between gap-4 border-t border-zinc-800/60 px-5 py-3 text-[11px] text-zinc-500">
              <div className="flex items-center gap-2">
                <Info className="h-3.5 w-3.5" />
                <span>Preset content • No data is sent to any API</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span>Ready</span>
              </div>
            </div>

            {/* Subtle overlay */}
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(239,68,68,0.05), transparent, rgba(147,51,234,0.06))",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
