import { NextResponse } from 'next/server';
import { bookingRequestSchema } from '@/lib/validation';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = bookingRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('booking_requests')
    .insert({ ...parsed.data, status: 'submitted' })
    .select('id')
    .single();

  if (error || !data) return NextResponse.json({ error: error?.message || 'Insert failed' }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
