import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { calcDeposit } from '@/lib/payments';
import { env } from '@/lib/env';

export async function POST(req: Request) {
  const fd = await req.formData();
  const bookingId = String(fd.get('booking_id') ?? '');

  const { data: booking } = await supabaseAdmin
    .from('bookings')
    .select('id, deposit_amount, booking_requests(host_name,host_email,hours), bartender_profiles(hourly_rate)')
    .eq('id', bookingId)
    .single();

  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

  const estimated = Number(booking.booking_requests.hours) * Number(booking.bartender_profiles.hourly_rate);
  const amount = Number(booking.deposit_amount ?? calcDeposit(estimated));

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${env.baseUrl}/deposit/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.baseUrl}/deposit/cancel`,
    customer_email: booking.booking_requests.host_email,
    metadata: { booking_id: bookingId, type: 'deposit' },
    line_items: [{ price_data: { currency: 'usd', product_data: { name: 'Bartender booking deposit' }, unit_amount: amount * 100 }, quantity: 1 }]
  });

  await supabaseAdmin.from('payments').insert({
    booking_id: bookingId,
    type: 'deposit',
    stripe_session_id: session.id,
    amount,
    currency: 'usd',
    status: 'pending'
  });

  return NextResponse.redirect(session.url || `${env.baseUrl}/admin/bookings/${bookingId}`);
}
