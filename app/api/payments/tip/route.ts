import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { env } from '@/lib/env';

async function createTipSession(bookingId: string) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${env.baseUrl}/tip/${bookingId}?success=1`,
    cancel_url: `${env.baseUrl}/tip/${bookingId}?canceled=1`,
    metadata: { booking_id: bookingId, type: 'tip' },
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: 'Bartender tip' },
        unit_amount: 2000
      },
      quantity: 1
    }]
  });

  await supabaseAdmin.from('payments').insert({
    booking_id: bookingId,
    type: 'tip',
    stripe_session_id: session.id,
    amount: 20,
    currency: 'usd',
    status: 'pending'
  });
  return session;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get('booking_id');
  if (!bookingId) return NextResponse.json({ error: 'booking_id required' }, { status: 400 });
  const session = await createTipSession(bookingId);
  return NextResponse.redirect(session.url || `${env.baseUrl}/tip/${bookingId}`);
}

export async function POST(req: Request) {
  const fd = await req.formData();
  const bookingId = String(fd.get('booking_id') ?? '');
  if (!bookingId) return NextResponse.json({ error: 'booking_id required' }, { status: 400 });
  const session = await createTipSession(bookingId);
  return NextResponse.redirect(session.url || `${env.baseUrl}/tip/${bookingId}`);
}
