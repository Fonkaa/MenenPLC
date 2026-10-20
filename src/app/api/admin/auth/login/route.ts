export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcrypt';

const MASTER_EMAIL = 'habtamuengr@gmail.com';
const MASTER_PASS = 'MenenAdmin2026!';

// Helper to prevent connection pool exhaustion from hanging requests
function withTimeout<T>(promise: Promise<T>, ms = 4000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('DB_QUERY_TIMEOUT')), ms)
    ),
  ]);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const inputEmail = (body.email || '').trim().toLowerCase();
    const inputPassword = (body.password || '').trim();

    if (!inputEmail || !inputPassword) {
      return NextResponse.json({ error: 'Email and password required.' }, { status: 400 });
    }

    // 1. Direct Master Key check (Bypasses DB entirely if credentials match master)
    if (inputEmail === MASTER_EMAIL.toLowerCase() && inputPassword === MASTER_PASS) {
      return NextResponse.json({ success: true, email: MASTER_EMAIL, role: 'MASTER_ADMIN' });
    }

    // 2. Fetch admin from database with a 4-second timeout limit
    let admin = null;
    try {
      admin = await withTimeout(
        prisma.adminUser.findFirst({
          where: { email: { equals: inputEmail, mode: 'insensitive' } },
        }),
        4000
      );

      if (!admin) {
        admin = await withTimeout(prisma.adminUser.findFirst(), 4000);
      }
    } catch (dbErr: any) {
      console.warn('Database connection warning during auth:', dbErr.message);

      // If database is saturated or down, fallback to master credentials
      if (inputEmail === MASTER_EMAIL.toLowerCase() && inputPassword === MASTER_PASS) {
        return NextResponse.json({ success: true, email: MASTER_EMAIL });
      }

      return NextResponse.json(
        { error: 'Database connection busy. Please retry in a moment.' },
        { status: 503 }
      );
    }

    if (!admin) {
      return NextResponse.json({ error: 'Invalid administrative credentials.' }, { status: 401 });
    }

    // 3. Email & Password Verification
    if (admin.email.trim().toLowerCase() !== inputEmail) {
      return NextResponse.json({ error: 'Invalid administrative credentials.' }, { status: 401 });
    }

    const storedPass = admin.password;
    const isHashed = storedPass.startsWith('$2a$') || storedPass.startsWith('$2b$') || storedPass.startsWith('$2y$');
    let isValid = false;

    if (isHashed) {
      isValid = await bcrypt.compare(inputPassword, storedPass);
    } else {
      isValid = inputPassword === storedPass;
    }

    if (isValid) {
      return NextResponse.json({ success: true, email: admin.email });
    }

    return NextResponse.json({ error: 'Invalid administrative credentials.' }, { status: 401 });
  } catch (error: any) {
    console.error('Login route error:', error);
    return NextResponse.json({ error: error.message || 'Authentication error' }, { status: 500 });
  }
}