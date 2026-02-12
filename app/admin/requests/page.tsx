import Link from 'next/link';
import { isAdminAuthed } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';

export default async function RequestsListPage() {
  if (!isAdminAuthed()) redirect('/admin');

  const { data } = await supabaseAdmin.from('booking_requests').select('*').order('created_at', { ascending: false });

  return (
    <main className="card">
      <h1>Booking Requests</h1>
      <p><Link href="/admin/bartenders">Manage bartenders</Link></p>
      <table className="table">
        <thead><tr><th>ID</th><th>Host</th><th>Date</th><th>Status</th></tr></thead>
        <tbody>
          {data?.map((r) => (
            <tr key={r.id}>
              <td><Link href={`/admin/requests/${r.id}`}>{r.id.slice(0, 8)}</Link></td>
              <td>{r.host_name}</td>
              <td>{r.event_date}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
