import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { env } from '@/lib/env';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, env.stripeWebhookSecret);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid signature', detail: String(e) }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingId = session.metadata?.booking_id;
    const type = session.metadata?.type;

    if (bookingId && type) {
      await supabaseAdmin.from('payments').update({ status: 'paid' }).eq('stripe_session_id', session.id);
      if (type === 'deposit') {
        await supabaseAdmin.from('bookings').update({ status: 'confirmed' }).eq('id', bookingId);
      }
    }
  }

  return NextResponse.json({ received: true });
}
