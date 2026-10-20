'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
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
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const logoSrc = '/images/menen-logo-original-colors.png';

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 12);
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('classification-search', { detail: val }));
      }
    }, 150);
  };

  const clearSearch = () => {
    setSearchValue('');
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('classification-search', { detail: '' }));
    }
  };

  const handleCategoryNavigation = useCallback((categoryName: string) => {
    setSidebarOpen(false);
    const targetId = `classification-${categoryName.toLowerCase().trim()}`;

    if (pathname === '/') {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      window.dispatchEvent(new CustomEvent('classification-select', { detail: categoryName }));
    } else {
      router.push(`/#${targetId}`);
    }
  }, [pathname, router]);

  const handleArchiveNavigation = useCallback(() => {
    setSidebarOpen(false);
    if (pathname === '/') {
      const el = document.getElementById('projects-archive');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      router.push('/#projects-archive');
    }
  }, [pathname, router]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 w-full bg-white/95 backdrop-blur-md border-b transition-shadow duration-300 ${
          scrolled
            ? 'border-neutral-200 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.12)]'
            : 'border-neutral-200/60 shadow-none'
        }`}
      >
        <div className="max-w-[112rem] mx-auto px-4 sm:px-8 h-20 sm:h-24 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Left: Menu Button & Logo */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 sm:p-3 bg-neutral-900 hover:bg-neutral-800 text-white transition-colors duration-200 cursor-pointer flex items-center justify-center shrink-0 border-none rounded-2xl shadow-xs"
              aria-label="Open Sidebar Menu"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button 
              type="button"
              onClick={handleArchiveNavigation}
              className="flex items-center shrink-0 bg-transparent border-none p-0 cursor-pointer"
            >
              <div className="relative h-10 sm:h-12 w-auto flex items-center">
                <img
                  src={logoSrc}
                  alt="MENEN Logo"
                  className="h-full w-auto object-contain hover:opacity-80 transition-opacity duration-300"
                />
              </div>
            </button>
          </div>

          {/* Center Desktop Classifications */}
          <nav className="hidden lg:flex flex-col items-center justify-center gap-2 my-auto px-2 select-none">
            <div className="flex items-center gap-6 xl:gap-8 text-[11px] font-serif uppercase tracking-[0.14em]">
              {CLASSIFICATIONS_ROW_1.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleCategoryNavigation(item)}
                  className="text-neutral-500 hover:text-neutral-950 transition-colors duration-200 relative py-1 group bg-transparent border-none cursor-pointer p-0"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 h-px w-full bg-neutral-950 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-6 xl:gap-8 text-[11px] font-serif uppercase tracking-[0.14em] text-neutral-400">
              {CLASSIFICATIONS_ROW_2.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleCategoryNavigation(item)}
                  className="text-neutral-400 hover:text-neutral-950 transition-colors duration-200 relative py-1 group bg-transparent border-none cursor-pointer p-0"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 h-px w-full bg-neutral-950 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </button>
              ))}
            </div>
          </nav>

          {/* Right: Search Pill */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center gap-2.5 border border-neutral-300 hover:border-neutral-400 focus-within:border-neutral-950 px-4 py-2 bg-neutral-50 transition-colors duration-200 w-36 sm:w-60 md:w-68 rounded-full shadow-2xs">
              <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0 pointer-events-none" />
              <input
                type="text"
                name="classificationSearch"
                placeholder="Search..."
                value={searchValue}
                onChange={handleSearchChange}
                className="bg-transparent border-none outline-none text-xs font-mono uppercase tracking-wider w-full text-neutral-900 placeholder:text-neutral-400"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-neutral-400 hover:text-neutral-900 cursor-pointer p-0.5 border-none bg-transparent"
                  aria-label="Clear Search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="h-20 sm:h-24 w-full" aria-hidden="true" />

      {/* SIDEBAR DRAWER */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          sidebarOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
        }`}
      >
        <div 
          onClick={() => setSidebarOpen(false)}
          className={`absolute inset-0 bg-neutral-950/45 backdrop-blur-xs transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        <aside
          className={`relative w-full max-w-sm sm:max-w-md bg-white h-full shadow-[0_0_60px_rgba(0,0,0,0.15)] flex flex-col justify-between z-10 font-mono overflow-y-auto no-scrollbar transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-r-3xl overflow-hidden ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 flex items-center justify-between shrink-0 bg-white">
            <div className="flex items-center gap-3">
              <img
                src={logoSrc}
                alt="MENEN Logo"
                className="h-7 w-auto object-contain"
              />
              <span className="font-serif font-black text-sm uppercase tracking-[0.18em] text-neutral-950">
                Directory
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="p-2 border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer rounded-xl shadow-2xs"
              aria-label="Close Sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-8 flex-1 bg-white">
            {/* Primary Nav Links */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase text-neutral-400 tracking-[0.3em] block border-b border-neutral-100 pb-2">
                Navigation
              </span>
              <nav className="flex flex-col font-serif text-neutral-800 divide-y divide-neutral-100">
                <button
                  type="button"
                  onClick={handleArchiveNavigation}
                  className="group flex items-center justify-between py-3 text-neutral-950 font-bold font-mono text-xs uppercase tracking-[0.12em] cursor-pointer bg-transparent border-none text-left"
                >
                  <span className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-200">
                    <Home className="w-4 h-4 text-neutral-500" /> Archive Home
                  </span>
                  <span className="text-neutral-400 group-hover:text-neutral-950 transition-colors">&rarr;</span>
                </button>
                <Link
                  href="/team"
                  onClick={() => setSidebarOpen(false)}
                  className="group flex items-center justify-between py-3 text-neutral-600 hover:text-neutral-950 font-mono text-xs uppercase tracking-[0.12em] cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-200">
                    <Users className="w-4 h-4 text-neutral-500" /> Specialists &amp; Team
                  </span>
                  <span className="text-neutral-400 group-hover:text-neutral-950 transition-colors">&rarr;</span>
                </Link>
                <Link
                  href="/submit-project"
                  onClick={() => setSidebarOpen(false)}
                  className="group flex items-center justify-between py-3 text-neutral-600 hover:text-neutral-950 font-mono text-xs uppercase tracking-[0.12em] cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-200">
                    <Send className="w-4 h-4 text-neutral-500" /> Submit Project Brief
                  </span>
                  <span className="text-neutral-400 group-hover:text-neutral-950 transition-colors">&rarr;</span>
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setSidebarOpen(false)}
                  className="group flex items-center justify-between py-3 text-neutral-600 hover:text-neutral-950 font-mono text-xs uppercase tracking-[0.12em] cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-200">
                    <MessageSquare className="w-4 h-4 text-neutral-500" /> Contact Office
                  </span>
                  <span className="text-neutral-400 group-hover:text-neutral-950 transition-colors">&rarr;</span>
                </Link>
              </nav>
            </div>

            {/* Disciplines Grid with rounded-xl tiles */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase text-neutral-400 tracking-[0.3em] flex items-center gap-1.5 border-b border-neutral-100 pb-2">
                <Layers className="w-3.5 h-3.5" /> 14 Architectural Disciplines
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {ALL_CLASSIFICATIONS.map((cat, idx) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryNavigation(cat)}
                    className="p-3 text-left border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-colors duration-200 group cursor-pointer bg-white rounded-xl shadow-2xs"
                  >
                    <span className="text-[9px] tracking-[0.2em] text-neutral-400 group-hover:text-neutral-600 block">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <strong className="font-serif uppercase tracking-[0.12em] text-[11px] block truncate mt-0.5 text-neutral-900">
                      {cat}
                    </strong>
                  </button>
                ))}
              </div>
            </div>

            {/* Commission Card with rounded-2xl */}
            <div className="p-4 bg-neutral-50 border border-neutral-200 space-y-2.5 rounded-2xl shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-950 uppercase tracking-[0.15em] font-mono">
                <Sparkles className="w-3.5 h-3.5 text-neutral-800" /> Category One Firm
              </div>
              <p className="text-xs font-serif italic text-neutral-600 leading-relaxed m-0">
                Delivering high-performance architectural, structural, and masterplan solutions across Ethiopia.
              </p>
              <Link
                href="/submit-project"
                onClick={() => setSidebarOpen(false)}
                className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white transition-colors text-center text-xs font-bold uppercase tracking-[0.2em] block shadow-xs cursor-pointer mt-2 rounded-xl"
              >
                Commission Study &rarr;
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-200 space-y-2.5 text-xs font-mono bg-neutral-50 shrink-0">
            <a
              href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 text-neutral-900 font-bold hover:underline"
            >
              <Phone className="w-3.5 h-3.5" /> {primaryPhone}
            </a>
            <a
              href={`mailto:${primaryEmail}`}
              className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> {primaryEmail}
            </a>
            <div className="pt-2 border-t border-neutral-200/60">
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