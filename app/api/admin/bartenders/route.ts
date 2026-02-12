import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  const fd = await req.formData();
  const payload = {
    name: String(fd.get('name') ?? ''),
    bio: String(fd.get('bio') ?? ''),
    photo_url: String(fd.get('photo_url') ?? ''),
    hourly_rate: Number(fd.get('hourly_rate') ?? 0),
    travel_radius_mi: Number(fd.get('travel_radius_mi') ?? 0),
    verified: fd.get('verified') === 'true'
  };
  const { error } = await supabaseAdmin.from('bartender_profiles').insert(payload);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.redirect(new URL('/admin/bartenders', req.url));
}
