'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { queryCeoKnowledge } from '@/lib/ceoKnowledgeEngine';
import { 
  Sparkles, 
  Send, 
  Linkedin, 
  Facebook, 
  PhoneCall, 
  Bot, 
  User, 
  Briefcase,
  GraduationCap,
  Building,
  Layers
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const PRESET_QUERIES = [
  {
    icon: GraduationCap,
    label: '🎓 Chalmers & European Degrees',
    query: 'What are Eng. Habtamu’s academic degrees from Chalmers University in Sweden, Italy, and AAiT?',
  },
  {
    icon: Layers,
    label: '🌉 Trail Bridges & HELVETAS',
    query: 'Tell me about his work with HELVETAS and regional road bureaus on trail bridge infrastructure.',
  },
  {
    icon: Building,
    label: '🏢 High-Rise & Seismic Modeling',
    query: 'What software (Tekla, Abaqus, ETABS) and seismic training from Italy does he apply to towers?',
  },
  {
    icon: Briefcase,
    label: '🏛️ Career & Heritage Conservation',
    query: 'Tell me about his past work with Fasil Giorghis Consult and Akademiska Hus in Sweden.',
  },
  {
    icon: PhoneCall,
    label: '📞 Book Meeting & Direct Contacts',
    query: 'How do I contact Eng. Habtamu directly or submit a project brief?',
  },
];

export default function CeoInteractiveDossier() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Welcome! I am the verified Executive Dossier Assistant for Eng. Habtamu Getu Mihret, Co-founder and CEO of MENEN Engineering PLC.\n\nAsk me anything regarding his postgraduate studies at Chalmers University (Sweden), seismic dynamics in Italy, rural trail bridge programs with HELVETAS, or ongoing landmark high-rise structures.',
    },
  ]);
  const [input, setInput] = useState('');
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handleSend(queryText: string) {
    const textToSend = queryText.trim();
    if (!textToSend) return;

    const answer = queryCeoKnowledge(textToSend);

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: textToSend },
      { role: 'assistant', content: answer },
    ]);

    setInput('');
  }

  return (
    <div className="bg-white border border-neutral-200/90 rounded-[20px] overflow-hidden shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] font-mono selection:bg-neutral-900 selection:text-white">
      
      {/* Header Banner (Pure White, rounded-[20px]) */}
      <header className="bg-white text-neutral-950 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[12px] bg-neutral-100 text-neutral-700 font-mono text-[10px] font-bold uppercase tracking-[0.16em] border border-neutral-200">
              <Sparkles className="w-3 h-3 text-neutral-900" /> Executive Intelligence Dossier
            </span>
            <span className="text-[10px] font-mono text-emerald-600 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Verified Record
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-[-0.015em] text-neutral-950 mt-2 leading-tight">
            Eng. Habtamu Getu Mihret
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-mono uppercase tracking-wider mt-1">
            General Manager &bull; Lead Structural Engineer &bull; Category 1 Engineering Practice
          </p>
        </div>

        {/* Clean Neutral Action Buttons */}
        <nav className="flex flex-wrap items-center gap-2.5">
          <a
            href="https://www.linkedin.com/in/habtamu-mihret"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-700 hover:text-neutral-950 hover:border-neutral-400 hover:bg-neutral-100 transition-colors shadow-xs"
          >
            <Linkedin className="w-4 h-4 text-[#0a66c2]" /> LinkedIn
          </a>
          <a
            href="https://www.facebook.com/habtamu.getu.984"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-700 hover:text-neutral-950 hover:border-neutral-400 hover:bg-neutral-100 transition-colors shadow-xs"
          >
            <Facebook className="w-4 h-4 text-[#1877f2]" /> Facebook
          </a>
          <Link
            href="/submit-project"
            className="flex items-center gap-1.5 px-4 py-2 rounded-[12px] bg-neutral-950 text-white text-xs font-mono font-bold uppercase tracking-[0.14em] hover:bg-neutral-800 transition-colors shadow-sm ml-auto sm:ml-0"
          >
            <PhoneCall className="w-4 h-4" /> Book Consultation
          </Link>
        </nav>
      </header>

      {/* Suggested Action Chips */}
      <section className="p-4 sm:p-5 bg-neutral-50 border-b border-neutral-200 space-y-2.5">
        <p className="text-[10px] font-mono uppercase text-neutral-500 tracking-[0.18em] font-semibold">
          Select a verified topic or ask any custom question:
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_QUERIES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(preset.query)}
              className="text-xs font-mono px-3.5 py-2 rounded-[12px] bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-950 transition-colors cursor-pointer text-left flex items-center gap-1.5 shadow-xs"
            >
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Chat History Panel */}
      <div 
        ref={chatScrollRef}
        className="p-5 sm:p-7 space-y-4 max-h-[460px] overflow-y-auto no-scrollbar bg-white"
      >
        {messages.map((m, idx) => (
          <article
            key={idx}
            className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-[12px] bg-neutral-900 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-[16px] p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-serif ${
                m.role === 'user'
                  ? 'bg-neutral-950 text-white font-medium shadow-sm'
                  : 'bg-neutral-50 text-neutral-900 border border-neutral-200 shadow-xs'
              }`}
            >
              {m.content}
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-[12px] bg-neutral-200 text-neutral-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-200 flex items-center gap-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about Eng. Habtamu (e.g. seismic safety, trail bridges, Chalmers MSc, high-rises)..."
          className="flex-1 bg-white border border-neutral-300 rounded-[12px] px-4 py-3 text-xs sm:text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-950 font-sans transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-5 py-3 rounded-[12px] bg-neutral-950 text-white font-bold font-mono text-xs uppercase tracking-[0.14em] hover:bg-neutral-800 transition-colors disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm border-none"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Ask</span>
        </button>
      </form>
    </div>
  );
}