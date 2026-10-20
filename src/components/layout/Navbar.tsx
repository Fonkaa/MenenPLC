'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Menu,
  X,
  Search,
  Phone, 
  Mail, 
  Key, 
  Home, 
  Users, 
  Send, 
  MessageSquare,
  Sparkles,
  Layers
} from 'lucide-react';

export const CLASSIFICATIONS_ROW_1 = [
  'Architecture',
  'Culture',
  'Education',
  'Work',
  'Hospitality',
  'Residential',
  'Infrastructure',
] as const;

export const CLASSIFICATIONS_ROW_2 = [
  'Space',
  'Sports',
  'Health',
  'Interiors',
  'Landscape',
  'Planning',
  'Product',
] as const;

export const ALL_CLASSIFICATIONS = [
  ...CLASSIFICATIONS_ROW_1,
  ...CLASSIFICATIONS_ROW_2,
];

interface NavbarProps {
  primaryPhone?: string;
  primaryEmail?: string;
}

export default function Navbar({
  primaryPhone = '+251 920 517 606',
  primaryEmail = 'habtamuengr@gmail.com',
}: NavbarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const logoSrc = '/images/menen-logo-original-colors.png';

  // Header gains a soft shadow once the page scrolls (state only flips at the threshold, so it is cheap)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sidebar: lock page scroll + close with Escape
  useEffect(() => {
    if (!sidebarOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [sidebarOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('classification-search', { detail: val }));
    }
  };

  const clearSearch = () => {
    setSearchValue('');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('classification-search', { detail: '' }));
    }
  };

  const handleCategoryJump = (categoryName: string) => {
    setSidebarOpen(false);
    setTimeout(() => {
      const element = document.getElementById(`classification-${categoryName.toLowerCase()}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 w-full bg-white/95 border-b transition-[border-color,box-shadow] duration-500 ${
          scrolled
            ? 'border-neutral-200 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.3)]'
            : 'border-neutral-200/60 shadow-none'
        }`}
      >
        <div className="max-w-[112rem] mx-auto px-4 sm:px-8 h-20 sm:h-24 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Left: Sidebar Toggle Button + Logo */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 sm:p-3 bg-neutral-950 hover:bg-neutral-700 active:scale-95 text-white rounded-full transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Open Sidebar Menu"
              aria-expanded={sidebarOpen}
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <Link 
              href="/#projects-archive" 
              onClick={() => setSidebarOpen(false)}
              className="flex items-center shrink-0"
            >
              <div className="relative h-10 sm:h-12 w-auto flex items-center">
                <img
                  src={logoSrc}
                  alt="MENEN Logo"
                  className="h-full w-auto object-contain hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
              </div>
            </Link>
          </div>

          {/* Desktop ONLY: 2-Tier Stacked Classifications (Completely hidden on mobile) */}
          <div className="hidden lg:flex flex-col items-center justify-center gap-2 my-auto px-2 select-none">
            {/* Row 1 */}
            <div className="flex items-center gap-7 text-[11px] font-serif uppercase tracking-[0.14em]">
              {CLASSIFICATIONS_ROW_1.map((item) => (
                <a
                  key={item}
                  href={`#classification-${item.toLowerCase()}`}
                  className="text-neutral-500 hover:text-neutral-950 transition-colors duration-300 relative py-1 group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 h-px w-full bg-neutral-950 origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                </a>
              ))}
            </div>

            {/* Row 2 */}
            <div className="flex items-center gap-7 text-[11px] font-serif uppercase tracking-[0.14em] text-neutral-400">
              {CLASSIFICATIONS_ROW_2.map((item) => (
                <a
                  key={item}
                  href={`#classification-${item.toLowerCase()}`}
                  className="text-neutral-400 hover:text-neutral-950 transition-colors duration-300 relative py-1 group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 h-px w-full bg-neutral-950 origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                </a>
              ))}
            </div>
          </div>

          {/* Right: Search Bar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center gap-2.5 border border-neutral-300 hover:border-neutral-400 focus-within:border-neutral-950 focus-within:shadow-[0_0_0_4px_rgba(10,10,10,0.06)] rounded-full px-4 py-2 sm:py-2.5 bg-neutral-50/80 transition-all duration-300 w-36 sm:w-60 md:w-68">
              <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0 pointer-events-none" />
              <input
                type="text"
                name="classificationSearch"
                placeholder="Search..."
                value={searchValue}
                onChange={handleSearchChange}
                className="bg-transparent border-none outline-none text-xs font-mono uppercase tracking-wider w-full text-neutral-900 placeholder:text-neutral-400 cursor-text"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-neutral-400 hover:text-neutral-900 cursor-pointer p-0.5 transition-colors"
                  aria-label="Clear Search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to protect layout below fixed header */}
      <div className="h-20 sm:h-24 w-full" aria-hidden="true" />

      {/* SIDEBAR DRAWER (PC & Mobile): always mounted, slides with GPU transforms for a smooth open AND close */}
      <div
        className="fixed inset-0 z-50 flex"
        aria-hidden={!sidebarOpen}
        style={{
          visibility: sidebarOpen ? 'visible' : 'hidden',
          transition: `visibility 0s linear ${sidebarOpen ? '0s' : '500ms'}`,
        }}
      >
        {/* Backdrop */}
        <div 
          onClick={() => setSidebarOpen(false)}
          className={`absolute inset-0 bg-neutral-950/50 transition-opacity duration-500 ease-out ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        {/* Sidebar Body */}
        <aside
          className={`relative w-full max-w-sm sm:max-w-md bg-white h-full shadow-[30px_0_80px_-30px_rgba(0,0,0,0.5)] flex flex-col justify-between z-10 font-mono overflow-y-auto no-scrollbar will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          
          {/* Sidebar Top: Logo + Close */}
          <div className="p-6 border-b border-neutral-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <img
                src={logoSrc}
                alt="MENEN Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="font-serif font-black text-sm uppercase tracking-[0.18em] text-neutral-950">
                MENEN Directory
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="p-2.5 rounded-full border border-neutral-200 hover:bg-neutral-950 hover:text-white hover:border-neutral-950 active:scale-95 text-neutral-700 transition-all duration-300 cursor-pointer"
              aria-label="Close Sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="p-6 space-y-9 flex-1">
            
            {/* Primary Navigation */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase text-neutral-400 tracking-[0.3em] block border-b border-neutral-100 pb-2">
                Navigation
              </span>
              <nav className="flex flex-col font-serif text-base text-neutral-800 divide-y divide-neutral-100">
                <a
                  href="#projects-archive"
                  onClick={() => setSidebarOpen(false)}
                  className="group flex items-center justify-between py-3.5 text-neutral-950 font-bold font-mono text-xs uppercase tracking-[0.12em] cursor-pointer"
                >
                  <span className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-300">
                    <Home className="w-4 h-4 text-neutral-500" /> Archive Home
                  </span>
                  <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">&rarr;</span>
                </a>
                <Link
                  href="/team"
                  onClick={() => setSidebarOpen(false)}
                  className="group flex items-center justify-between py-3.5 text-neutral-600 hover:text-neutral-950 font-mono text-xs uppercase tracking-[0.12em] cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-300">
                    <Users className="w-4 h-4 text-neutral-500" /> Specialists &amp; Team
                  </span>
                  <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">&rarr;</span>
                </Link>
                <Link
                  href="/submit-project"
                  onClick={() => setSidebarOpen(false)}
                  className="group flex items-center justify-between py-3.5 text-neutral-600 hover:text-neutral-950 font-mono text-xs uppercase tracking-[0.12em] cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-300">
                    <Send className="w-4 h-4 text-neutral-500" /> Submit Project Brief
                  </span>
                  <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">&rarr;</span>
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setSidebarOpen(false)}
                  className="group flex items-center justify-between py-3.5 text-neutral-600 hover:text-neutral-950 font-mono text-xs uppercase tracking-[0.12em] cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-300">
                    <MessageSquare className="w-4 h-4 text-neutral-500" /> Contact Office
                  </span>
                  <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">&rarr;</span>
                </Link>
              </nav>
            </div>

            {/* Classifications Grid (Visible on all screens in sidebar, essential for mobile) */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase text-neutral-400 tracking-[0.3em] flex items-center gap-1.5 border-b border-neutral-100 pb-2">
                <Layers className="w-3.5 h-3.5" /> 14 Architectural Classifications
              </span>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                {ALL_CLASSIFICATIONS.map((cat, idx) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryJump(cat)}
                    className="p-3 text-left rounded-xl border border-neutral-200/80 hover:border-neutral-950 hover:bg-neutral-950 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-16px_rgba(0,0,0,0.5)] active:scale-[0.98] transition-all duration-300 group cursor-pointer"
                  >
                    <span className="text-[9px] tracking-[0.2em] text-neutral-400 group-hover:text-neutral-300 block">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <strong className="font-serif uppercase tracking-[0.12em] text-[11px] block truncate mt-0.5">
                      {cat}
                    </strong>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Proposal Commission Card */}
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-950 uppercase tracking-[0.15em] font-mono">
                <Sparkles className="w-3.5 h-3.5 text-neutral-800" /> Category One Firm
              </div>
              <p className="text-xs font-serif italic text-neutral-600 leading-relaxed">
                Delivering high-performance architectural, structural, and masterplan solutions.
              </p>
              <Link
                href="/submit-project"
                onClick={() => setSidebarOpen(false)}
                className="w-full py-3 bg-neutral-950 hover:bg-neutral-700 active:scale-[0.99] text-white transition-all duration-300 text-center text-xs font-bold uppercase tracking-[0.2em] block rounded-xl shadow-md cursor-pointer mt-3"
              >
                Commission Study &rarr;
              </Link>
            </div>

          </div>

          {/* Sidebar Bottom: Direct Contact Details */}
          <div className="p-6 border-t border-neutral-200 space-y-2.5 text-xs font-mono bg-neutral-50/60 shrink-0">
            <a
              href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 text-neutral-900 font-bold hover:underline underline-offset-4"
            >
              <Phone className="w-3.5 h-3.5" /> {primaryPhone}
            </a>
            <a
              href={`mailto:${primaryEmail}`}
              className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> {primaryEmail}
            </a>
            <div className="pt-3 border-t border-neutral-200/70">
              <Link
                href="/admin/login"
                onClick={() => setSidebarOpen(false)}
                className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-neutral-400 hover:text-neutral-950 transition-colors font-mono"
              >
                <Key className="w-3 h-3" /> Secure Admin Access &rarr;
              </Link>
            </div>
          </div>

        </aside>
      </div>
    </>
  );
}