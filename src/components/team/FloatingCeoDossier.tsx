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
  GraduationCap,
  Building2,
  Layers,
  ShieldCheck,
  FolderOpen,
  X
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const PRESET_GROUPS = [
  {
    group: 'Leadership & Academics',
    icon: GraduationCap,
    items: [
      { label: '🎓 Chalmers MSc (Sweden)', query: "What are Eng. Habtamu's postgraduate degrees from Chalmers University in Sweden?" },
      { label: '🏛️ Messina Seismic Safety (Italy)', query: "What specialized seismic certification did he obtain in Messina, Italy?" },
      { label: '🔬 AAiT Steel Web Thesis', query: "What was Eng. Habtamu's Master's research at Addis Ababa Institute of Technology (AAiT)?" },
      { label: '📜 Bahir Dar Civil BSc', query: "Where did Eng. Habtamu complete his undergraduate civil engineering training?" },
      { label: '💼 Career & Fasil Giorghis', query: "What historic landmark restorations did Eng. Habtamu engineer with Fasil Giorghis Consult?" },
    ]
  },
  {
    group: 'Landmark Projects',
    icon: Building2,
    items: [
      { label: '🏆 4B+G+M+23 KK Tower', query: "What are the engineering details of the 1st-Prize 4B+G+M+23 Tower for KK PLC?" },
      { label: '🏢 3B+G+22 Bullaleas Tower', query: "How did MENEN engineer the 3B+G+22 Bullaleas Luxury Apartment Tower?" },
      { label: '🌊 8 Towers Lakeside Masterplan', query: "What is the scale of the 8 Towers Lakeside Masterplan in Bahir Dar?" },
      { label: '🏛️ National Palace Visitors Pavilion', query: "What is MENEN's role in the National Palace Visitors Reception Pavilion?" },
      { label: '🛂 37 Border Clearance Stations', query: "What is the 37 Modular Border Clearance Stations project across Ethiopia?" },
      { label: '🌉 HELVETAS Trail Bridges', query: "How did he train regional road bureaus and HELVETAS in trail bridge construction?" },
    ]
  },
  {
    group: 'Technical Modeling & FEA',
    icon: Layers,
    items: [
      { label: '💻 ETABS, Abaqus & Software', query: "What finite element and structural analysis software does Eng. Habtamu use?" },
      { label: '🏗️ Deep Basement Shoring', query: "How does MENEN handle deep subterranean basements and neighbor protection?" },
      { label: '🔧 Building Retrofit & NDT', query: "Can MENEN assess cracked, damaged, or unpermitted existing buildings for retrofitting?" },
      { label: '🌲 Mass Timber & Carbon', query: "What is Eng. Habtamu's background in Mass Timber and low-carbon engineering?" },
    ]
  },
  {
    group: 'Operations, Legal & Contact',
    icon: ShieldCheck,
    items: [
      { label: '🛡️ Category 1 Legal Scope', query: "What does MENEN Engineering’s Category 1 designation legally authorize?" },
      { label: '🏛️ Municipal Permit Approvals', query: "Does MENEN handle Addis Ababa City Hall building permit approvals?" },
      { label: '📋 Bank-Grade BOQ & Tenders', query: "What is included in MENEN’s Technical Specifications and BOQ packages?" },
      { label: '👷 Resident Site Supervision', query: "Does MENEN provide resident site supervision during construction?" },
      { label: '💰 Engineering Fees & Pricing', query: "How are consulting fees structured and how fast are proposals prepared?" },
      { label: '🎓 Student Internship Program', query: "How does MENEN select and mentor university engineering interns?" },
      { label: '📞 Direct Contact & Booking', query: "What are all verified telephone numbers, emails, and physical office coordinates?" },
    ]
  }
];

export default function FloatingCeoDossier() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Welcome! I am the verified Executive Intelligence Dossier for Eng. Habtamu Getu Mihret, Co-founder and CEO of MENEN Engineering PLC.\n\nInquire regarding his postgraduate structural research at Chalmers University (Sweden), seismic design dynamics in Italy, high-rise structural engineering, or Category 1 commission schedules.',
    },
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

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
    <aside 
      aria-label="Executive Intelligence Dossier"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-auto font-mono selection:bg-neutral-900 selection:text-white"
    >
      {/* Pop-up Luxury Dossier Modal (Explicit rounded-2xl with overflow-hidden) */}
      {isOpen && (
        <div className="w-[94vw] sm:w-[500px] md:w-[540px] max-h-[85vh] bg-white border border-neutral-200 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.18)] flex flex-col mb-3 rounded-2xl overflow-hidden">
          
          {/* Header Banner */}
          <header className="bg-white text-neutral-950 p-5 sm:p-6 flex flex-col gap-3.5 border-b border-neutral-200 shrink-0">
            <div className="flex justify-between items-start gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-800 text-[10px] font-bold uppercase tracking-[0.16em] border border-neutral-200 rounded-full">
                    <Sparkles className="w-3 h-3 text-neutral-900" /> Executive Dossier
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> 24 Verified Domains
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-serif font-black tracking-[-0.015em] text-neutral-950 mt-2 leading-tight">
                  Eng. Habtamu Getu Mihret
                </h2>
                <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-[0.2em] mt-0.5">
                  General Manager &bull; Lead Structural Engineer &bull; Cat 1
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 border border-neutral-200 bg-neutral-50 text-neutral-600 hover:text-neutral-950 hover:border-neutral-400 transition-colors cursor-pointer rounded-xl"
                aria-label="Close Dossier"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Social & Booking Actions */}
            <nav className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-200">
              <a
                href="https://www.linkedin.com/in/habtamu-mihret"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-50 border border-neutral-200 text-[10px] font-mono text-neutral-700 hover:text-neutral-950 hover:border-neutral-400 transition-colors rounded-xl"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#0a66c2]" /> LinkedIn
              </a>
              <a
                href="https://www.facebook.com/habtamu.getu.984"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-50 border border-neutral-200 text-[10px] font-mono text-neutral-700 hover:text-neutral-950 hover:border-neutral-400 transition-colors rounded-xl"
              >
                <Facebook className="w-3.5 h-3.5 text-[#1877f2]" /> Facebook
              </a>
              <Link
                href="/submit-project"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-neutral-950 text-white text-[10px] font-mono font-bold uppercase tracking-[0.15em] hover:bg-neutral-800 transition-colors ml-auto rounded-xl shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Book Consultation
              </Link>
            </nav>
          </header>

          {/* Categorized Question Selector */}
          <section className="p-4 bg-neutral-50 border-b border-neutral-200 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-mono uppercase text-neutral-500 tracking-[0.2em] font-semibold flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5 text-neutral-950" /> Explore Domains (22 Verified Queries):
              </p>
              <span className="text-[10px] font-mono text-neutral-500 font-bold">
                {activeGroupIndex + 1}/{PRESET_GROUPS.length}
              </span>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-neutral-200 pb-2.5">
              {PRESET_GROUPS.map((grp, idx) => {
                const Icon = grp.icon;
                const isSelected = activeGroupIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveGroupIndex(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono transition-colors cursor-pointer rounded-xl border ${
                      isSelected
                        ? 'bg-neutral-950 text-white border-neutral-950 font-semibold'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100 hover:text-neutral-950'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{grp.group}</span>
                  </button>
                );
              })}
            </div>

            {/* Chips for Active Group */}
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar pt-0.5">
              {PRESET_GROUPS[activeGroupIndex].items.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(preset.query)}
                  className="text-[10px] font-mono px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-950 transition-colors cursor-pointer text-left rounded-xl shadow-xs"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </section>

          {/* Chat History Stream */}
          <div className="p-4 sm:p-5 space-y-4 flex-1 overflow-y-auto max-h-[300px] text-xs bg-white no-scrollbar">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 bg-neutral-900 text-white flex items-center justify-center shrink-0 mt-0.5 rounded-xl">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-4 leading-relaxed font-serif text-left ${
                    m.role === 'user'
                      ? 'bg-neutral-950 text-white font-medium rounded-2xl shadow-sm'
                      : 'bg-neutral-50 text-neutral-900 border border-neutral-200 rounded-2xl shadow-xs'
                  }`}
                >
                  <p className="m-0 whitespace-pre-line text-[12px] sm:text-[13px]">{m.content}</p>
                </div>

                {m.role === 'user' && (
                  <div className="w-8 h-8 bg-neutral-200 text-neutral-700 flex items-center justify-center shrink-0 mt-0.5 rounded-xl">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3.5 bg-neutral-50 border-t border-neutral-200 flex items-center gap-2.5 shrink-0"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inquire regarding projects, structural codes, or credentials..."
              className="flex-1 bg-white border border-neutral-300 px-4 py-2.5 text-xs text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-950 font-sans rounded-xl transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-5 py-2.5 bg-neutral-950 text-white font-bold font-mono text-xs uppercase tracking-[0.14em] hover:bg-neutral-800 transition-colors disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shrink-0 rounded-xl border-none shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button (Pure White, rounded-full) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3.5 px-5 py-3.5 bg-white text-neutral-950 border border-neutral-300 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)] hover:bg-neutral-50 hover:border-neutral-400 transition-all cursor-pointer rounded-full"
        aria-label="Eng. Habtamu Executive AI Dossier"
      >
        <div className="relative flex items-center justify-center">
          <Bot className="w-5 h-5 text-neutral-950" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
        </div>
        <div className="flex flex-col text-left leading-tight font-mono">
          <span className="text-[12px] uppercase tracking-[0.18em] font-serif font-black text-neutral-950">
            Eng. Habtamu Getu
          </span>
          <span className="text-[9px] uppercase tracking-[0.14em] text-neutral-500">
            Executive AI Dossier
          </span>
        </div>
      </button>
    </aside>
  );
}