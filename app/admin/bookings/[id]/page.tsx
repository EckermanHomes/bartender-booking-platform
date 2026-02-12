import { isAdminAuthed } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  if (!isAdminAuthed()) redirect('/admin');
  const { data: booking } = await supabaseAdmin
    .from('bookings')
    .select('*, booking_requests(*), bartender_profiles(*)')
    .eq('id', params.id)
    .single();

  if (!booking) return <main className="card">Not found.</main>;

  return (
    <main className="card">
      <h1>Booking {booking.id.slice(0, 8)}</h1>
      <p>Status: {booking.status}</p>
      <p>Host: {booking.booking_requests.host_name}</p>
      <p>Bartender: {booking.bartender_profiles.name}</p>
      <form action="/api/payments/deposit" method="post">
        <input type="hidden" name="booking_id" value={booking.id} />
        <button className="btn" type="submit">Create Deposit Checkout</button>
      </form>
      <p><a href={`/tip/${booking.id}`}>Tip page</a></p>
    </main>
  );
}
