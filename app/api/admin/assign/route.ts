import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  const fd = await req.formData();
  const booking_request_id = String(fd.get('booking_request_id'));
  const bartender_profile_id = String(fd.get('bartender_profile_id'));

  const { data: request } = await supabaseAdmin.from('booking_requests').select('id, hours').eq('id', booking_request_id).single();
  const { data: bartender } = await supabaseAdmin.from('bartender_profiles').select('id, hourly_rate').eq('id', bartender_profile_id).single();
  if (!request || !bartender) return NextResponse.json({ error: 'Invalid assignment' }, { status: 400 });

  const estimatedTotal = Number(request.hours) * Number(bartender.hourly_rate);
  const deposit = Math.round(estimatedTotal * 0.2);

  const { data: booking, error } = await supabaseAdmin
    .from('bookings')
    .insert({ booking_request_id, bartender_profile_id, status: 'pending_deposit', deposit_amount: deposit })
    .select('id')
    .single();
  if (error || !booking) return NextResponse.json({ error: error?.message ?? 'Could not create booking' }, { status: 500 });

  await supabaseAdmin.from('booking_requests').update({ status: 'assigned' }).eq('id', booking_request_id);

  return NextResponse.redirect(new URL(`/admin/bookings/${booking.id}`, req.url));
}
