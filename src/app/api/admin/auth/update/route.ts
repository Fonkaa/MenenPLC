import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcrypt';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { currentPassword, newEmail, newPassword } = body;

    // 1. Ensure at least one field is being updated
    if (!newEmail && !newPassword) {
      return NextResponse.json(
        { error: 'Please provide either a new email or a new password to update.' },
        { status: 400 }
      );
    }

    // 2. Locate the existing administrator record
    const admin = await prisma.adminUser.findFirst();

    if (!admin) {
      // If no admin exists yet, initialize one
      const initialPassword = newPassword ? await bcrypt.hash(newPassword.trim(), 10) : await bcrypt.hash('MenenAdmin2026!', 10);
      const initialEmail = newEmail ? newEmail.trim().toLowerCase() : 'habtamuengr@gmail.com';

      const newAdmin = await prisma.adminUser.create({
        data: {
          name: 'Primary Administrator',
          email: initialEmail,
          password: initialPassword,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Administrator created successfully.',
        email: newAdmin.email,
      });
    }

    // 3. Verify current password if provided
    if (currentPassword) {
      const isBcrypt = admin.password.startsWith('$2a$') || admin.password.startsWith('$2b$');
      let isMatch = false;

      if (isBcrypt) {
        isMatch = await bcrypt.compare(currentPassword.trim(), admin.password);
      } else {
        // Fallback check if existing password was stored in plain text
        isMatch = currentPassword.trim() === admin.password;
      }

      if (!isMatch) {
        return NextResponse.json(
          { error: 'Current password verification failed. Please check your current password.' },
          { status: 401 }
        );
      }
    }

    // 4. Build update payload conditionally
    const updateData: { email?: string; password?: string } = {};

    if (newEmail && newEmail.trim().length > 0) {
      updateData.email = newEmail.trim().toLowerCase();
    }

    if (newPassword && newPassword.trim().length > 0) {
      if (newPassword.trim().length < 6) {
        return NextResponse.json(
          { error: 'New password must be at least 6 characters long.' },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(newPassword.trim(), 10);
    }

    // 5. Update the admin user record
    const updatedAdmin = await prisma.adminUser.update({
      where: { id: admin.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Credentials updated successfully.',
      email: updatedAdmin.email,
    });
  } catch (error) {
    console.error('Password/Email change error:', error);
    return NextResponse.json(
      { error: 'Failed to update credentials on server.' },
      { status: 500 }
    );
  }
}