'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ShieldAlert, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const inputEmail = email.trim();
    const inputPassword = password;

    try {
      // 1. Attempt verification against server API
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inputEmail, password: inputPassword }),
      });

      if (res.ok) {
        localStorage.setItem('menen_admin_auth', 'authenticated');
        localStorage.setItem('menen_admin_email', inputEmail);
        router.push('/admin/dashboard');
        return;
      }

      // If server explicitly rejected with 401/403
      if (res.status === 401 || res.status === 403) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || 'Invalid administrative credentials. Access denied.');
        setLoading(false);
        return;
      }
    } catch {
      // 2. Client-side fallback if custom API endpoint is not set up
      const storedEmail = localStorage.getItem('menen_admin_email') || 'habtamuengr@gmail.com';
      const storedPassword = localStorage.getItem('menen_admin_password') || 'MenenAdmin2026!';

      if (inputEmail === storedEmail && inputPassword === storedPassword) {
        localStorage.setItem('menen_admin_auth', 'authenticated');
        router.push('/admin/dashboard');
        return;
      }
    }

    // 3. Fallback check for newly saved credentials stored locally
    const storedEmail = localStorage.getItem('menen_admin_email') || 'habtamuengr@gmail.com';
    const storedPassword = localStorage.getItem('menen_admin_password') || 'MenenAdmin2026!';

    if (inputEmail === storedEmail && inputPassword === storedPassword) {
      localStorage.setItem('menen_admin_auth', 'authenticated');
      router.push('/admin/dashboard');
      return;
    }

    setErrorMsg('Invalid administrative credentials. Access denied.');
    setLoading(false);
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md bg-white border border-neutral-300 p-8 rounded-2xl shadow-xl relative">
        <div className="mb-6">
          <Link
            href="/#projects-archive"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-neutral-600 hover:text-neutral-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects Archive
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full border border-neutral-300 bg-neutral-100 flex items-center justify-center mx-auto mb-3 text-neutral-900 shadow-sm">
            <Lock className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500 font-bold block">
            Executive Security Gateway
          </span>
          <h1 className="text-2xl font-serif font-black text-neutral-950 mt-1">
            MENEN Administration
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-mono">
            Direct Dynamic Content &amp; Masterplan Management
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 rounded-lg bg-rose-50 border border-rose-300 text-rose-700 text-xs font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1 font-bold">
              Authorized Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. habtamuengr@gmail.com"
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 font-mono transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1 font-bold">
              Secret Passkey
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 font-mono transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg bg-neutral-950 text-white font-bold font-mono text-xs uppercase tracking-wider hover:bg-neutral-800 active:scale-[0.99] transition-all duration-200 mt-2 flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
              </>
            ) : (
              <>
                Enter Console <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-200 text-center text-[10px] text-neutral-400 font-mono">
          Authorized Category 1 Engineering Console &bull; MENEN PLC
        </div>
      </div>
    </div>
  );
}