import { NextResponse } from 'next/server';
import { setAdminCookie } from '@/lib/auth';
import { env } from '@/lib/env';

export async function POST(req: Request) {
  const fd = await req.formData();
  if (String(fd.get('password')) !== env.adminPassword) {
    return NextResponse.redirect(new URL('/admin?error=bad_password', req.url));
  }
  setAdminCookie();
  return NextResponse.redirect(new URL('/admin/requests', req.url));
}
