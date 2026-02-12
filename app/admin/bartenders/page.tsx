import { isAdminAuthed } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';

export default async function BartendersPage() {
  if (!isAdminAuthed()) redirect('/admin');
  const { data } = await supabaseAdmin.from('bartender_profiles').select('*').order('created_at', { ascending: false });

  return (
    <main className="card">
      <h1>Bartenders</h1>
      <form action="/api/admin/bartenders" method="post" className="grid two">
        <label>Name<input name="name" required /></label>
        <label>Photo URL<input name="photo_url" /></label>
        <label>Hourly Rate<input type="number" name="hourly_rate" min={0} required /></label>
        <label>Travel Radius (mi)<input type="number" name="travel_radius_mi" min={0} required /></label>
        <label>Bio<textarea name="bio" rows={3} /></label>
        <label>Verified<input type="checkbox" name="verified" value="true" /></label>
        <div><button className="btn" type="submit">Save Bartender</button></div>
      </form>
      <table className="table">
        <thead><tr><th>Name</th><th>Rate</th><th>Radius</th><th>Verified</th></tr></thead>
        <tbody>
          {data?.map((b) => <tr key={b.id}><td>{b.name}</td><td>${b.hourly_rate}</td><td>{b.travel_radius_mi}</td><td>{b.verified ? 'Yes':'No'}</td></tr>)}
        </tbody>
      </table>
    </main>
  );
}
