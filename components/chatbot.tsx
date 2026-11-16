"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

const FAQ_PROMPTS = [
  "How to create a meeting?",
  "How to find study peers?",
  "What is the Live Session?",
  "How do NFT badges work?",
];

function getBotReply(userPrompt: string): string {
  const query = userPrompt.toLowerCase().trim();

  if (
    query.includes("what is intellex") ||
    query.includes("about") ||
    query.includes("who are you")
  ) {
    return "Intellex is a decentralized P2P skill-sharing platform where you can connect with peers, exchange skills 1-on-1, collaborate in live sessions, and earn verifiable on-chain NFT badges! 🚀";
  }

  if (
    query.includes("meeting") ||
    query.includes("create") ||
    query.includes("schedule") ||
    query.includes("room code")
  ) {
    return "To create a meeting, head over to the Dashboard and click 'New Meeting' (or navigate to /dashboard/create). You'll receive a unique shareable room code (INTX-XXXX-XXXX) that your peer can use to join! 📋";
  }

  if (
    query.includes("peer") ||
    query.includes("match") ||
    query.includes("partner") ||
    query.includes("find")
  ) {
    return "Explore the 'Find Peers' page (/match)! Filter by domains like ML, Next.js, Solidity, UI/UX, and Rust, then tap 'Instant Match' to quickly start a study session with other learners. 🤝";
  }

  if (
    query.includes("session") ||
    query.includes("whiteboard") ||
    query.includes("code") ||
    query.includes("editor") ||
    query.includes("collaborate")
  ) {
    return "The Live Session workspace (/session) includes 3 main tabs:\n1. 🎨 Interactive Whiteboard with drawing, eraser & export.\n2. 💻 Multi-language Code Playground (JS, Python, Solidity).\n3. 📝 Live Session Notes & Pomodoro Timer.\nYou can also share your screen and join via room links!";
  }

  if (
    query.includes("leaderboard") ||
    query.includes("rank") ||
    query.includes("score") ||
    query.includes("duel") ||
    query.includes("compete") ||
    query.includes("challenge")
  ) {
    return "The Leaderboard (/leaderboard) features live weekly peer rankings, 1v1 Peer Duels, and League Divisions! You can click 'Challenge' on any peer to launch a 15-min speed coding duel, algorithm battle, or UI race in a private room. ⚔️";
  }

  if (
    query.includes("badge") ||
    query.includes("award") ||
    query.includes("reward") ||
    query.includes("claim") ||
    query.includes("certificate")
  ) {
    return "Top performers unlock the prestigious Intellex Gold Award and verifiable digital certificates! Head to /leaderboard and click 'Claim Award & Certificate' to unlock your distinction and credentials directly to your profile with zero wallet hassle. 🏆";
  }

  if (
    query.includes("course") ||
    query.includes("roadmap") ||
    query.includes("learn") ||
    query.includes("study")
  ) {
    return "Visit the 'Courses & Roadmaps' page (/courses)! We feature structured roadmaps in Web Dev, AI/ML, Web3, UI/UX, DevOps, and Data Science with links to top free learning resources. You can track your completion progress with checkboxes! 📚";
  }

  if (
    query.includes("calendar") ||
    query.includes("event") ||
    query.includes("deadline")
  ) {
    return "Check out our interactive Calendar (/calendar)! Click any date to schedule study sessions, add deadlines, or plan peer meetups. You can also view upcoming events for the next 7 days in the sidebar. 📅";
  }

  if (
    query.includes("hello") ||
    query.includes("hi") ||
    query.includes("hey") ||
    query.includes("greetings")
  ) {
    return "Hello there! 👋 I'm your Intellex Assistant. How can I help your learning journey today? Feel free to ask about meetings, courses, live sessions, or finding peers!";
  }

  if (query.includes("help") || query.includes("commands")) {
    return "Here are things you can ask me:\n• 'How to create a meeting?'\n• 'Where can I find study peers?'\n• 'Tell me about the live session whiteboard'\n• 'How do roadmaps and courses work?'\n• 'How to claim my NFT badge?'\n• 'How to use the calendar?'";
  }

  return "I'm here to help you get the most out of Intellex! You can ask about creating meetings, finding peers, using the live session whiteboard & code editor, learning roadmaps, or scheduling sessions in the calendar. Type 'help' anytime to see common topics. 💡";
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-welcome",
      sender: "bot",
      text: "Welcome to Intellex! 👋 I'm your AI study assistant. Ask me anything about finding peers, setting up meetings, following roadmaps, or using the collaborative workspace!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [isOpen, messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend ?? inputVal).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = getBotReply(text);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const resetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "bot",
        text: "Chat cleared! Ask me anything about Intellex meetings, roadmaps, or peer collaborations. 🚀",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="relative h-14 w-14 rounded-full shadow-2xl bg-primary text-primary-foreground flex items-center justify-center p-0 hover:bg-primary/90"
              aria-label="Open Intellex AI Assistant"
            >
              <MessageCircle className="w-7 h-7" />
              {hasUnread && (
                <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-background"></span>
                </span>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[92vw] sm:w-[390px] h-[540px] max-h-[85vh] bg-card border border-border/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-md"
          >
            {/* Header */}
            <div className="bg-primary px-4 py-3.5 text-primary-foreground flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/15 flex items-center justify-center border border-primary-foreground/20">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-1.5 leading-none">
                    Intellex Assistant
                  </h3>
                  <span className="text-[11px] opacity-80 flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Always online
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={resetChat}
                  title="Clear conversation"
                  className="p-1.5 rounded-md hover:bg-primary-foreground/10 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 rounded-md hover:bg-primary-foreground/10 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="px-3 py-2 bg-muted/40 border-b border-border/40 overflow-x-auto scrollbar-none flex gap-1.5">
              {FAQ_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="text-[11px] font-medium bg-background hover:bg-muted text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-full border border-border/60 shrink-0 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-sm">
              {messages.map((m) => {
                const isBot = m.sender === "bot";
                return (
                  <div
                    key={m.id}
                    className={`flex items-end gap-2 ${
                      isBot ? "justify-start" : "justify-end"
                    }`}
                  >
                    {isBot && (
                      <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mb-1">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 shadow-sm text-xs sm:text-sm whitespace-pre-line leading-relaxed ${
                        isBot
                          ? "bg-muted/80 text-foreground rounded-bl-none border border-border/50"
                          : "bg-primary text-primary-foreground rounded-br-none"
                      }`}
                    >
                      {m.text}
                      <span
                        className={`block text-[9px] mt-1 text-right ${
                          isBot ? "text-muted-foreground" : "text-primary-foreground/75"
                        }`}
                      >
                        {m.timestamp}
                      </span>
                    </div>

                    {!isBot && (
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mb-1">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 text-muted-foreground text-xs py-1">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex gap-1 items-center bg-muted/60 px-3 py-2 rounded-2xl rounded-bl-none">
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-border/80 bg-background/50 flex gap-2 items-center"
            >
              <Input
                placeholder="Ask about meetings, courses, sessions..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="text-xs sm:text-sm h-9 bg-card"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!inputVal.trim()}
                className="h-9 w-9 p-0 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
