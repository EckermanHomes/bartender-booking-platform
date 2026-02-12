import { isAdminAuthed } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';

export default async function RequestDetailPage({ params }: { params: { id: string } }) {
  if (!isAdminAuthed()) redirect('/admin');
  const { data: request } = await supabaseAdmin.from('booking_requests').select('*').eq('id', params.id).single();
  const { data: bartenders } = await supabaseAdmin.from('bartender_profiles').select('*').eq('verified', true);

  if (!request) return <main className="card"><p>Request not found.</p></main>;

  return (
    <main className="card">
      <h1>Request {request.id.slice(0, 8)}</h1>
      <p>{request.host_name} • {request.host_email} • {request.host_phone}</p>
      <p>{request.event_date} at {request.start_time}, {request.hours}h, {request.guest_count} guests</p>
      <p>{request.address}, {request.city}</p>
      <p>Notes: {request.notes || 'None'}</p>
      <h3>Assign bartender</h3>
      <form action="/api/admin/assign" method="post">
        <input type="hidden" name="booking_request_id" value={request.id} />
        <label>Bartender
          <select name="bartender_profile_id" required>
            <option value="">Choose...</option>
            {bartenders?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>
        <button className="btn" type="submit">Assign & create booking</button>
      </form>
    </main>
  );
}
