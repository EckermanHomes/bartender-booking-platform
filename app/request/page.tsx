import { redirect } from 'next/navigation';

export default function RequestPage() {
  async function submit(formData: FormData) {
    'use server';
    const addOns = formData.getAll('add_ons').map(String);
    const payload = {
      host_name: String(formData.get('host_name') ?? ''),
      host_email: String(formData.get('host_email') ?? ''),
      host_phone: String(formData.get('host_phone') ?? ''),
      event_date: String(formData.get('event_date') ?? ''),
      start_time: String(formData.get('start_time') ?? ''),
      hours: Number(formData.get('hours') ?? 0),
      guest_count: Number(formData.get('guest_count') ?? 0),
      address: String(formData.get('address') ?? ''),
      city: String(formData.get('city') ?? ''),
      notes: String(formData.get('notes') ?? ''),
      add_ons: addOns
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store'
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Could not submit request');
    }
    redirect(`/request/received?rid=${data.id}`);
  }

  return (
    <main className="card">
      <h1>Request a Bartender</h1>
      <form action={submit}>
        <div className="grid two">
          <label>Name<input name="host_name" required /></label>
          <label>Email<input name="host_email" type="email" required /></label>
          <label>Phone<input name="host_phone" required /></label>
          <label>Event Date<input name="event_date" type="date" required /></label>
          <label>Start Time<input name="start_time" type="time" required /></label>
          <label>Hours<input name="hours" type="number" min={2} required /></label>
          <label>Guest Count<input name="guest_count" type="number" min={1} required /></label>
          <label>Address<input name="address" required /></label>
          <label>City<input name="city" required /></label>
        </div>
        <fieldset>
          <legend>Add-ons</legend>
          <label><input type="checkbox" name="add_ons" value="mixers" /> Mixers bundle</label>
          <label><input type="checkbox" name="add_ons" value="ice" /> Ice delivery</label>
          <label><input type="checkbox" name="add_ons" value="glassware" /> Glassware rental</label>
        </fieldset>
        <label>Notes<textarea name="notes" rows={4} /></label>
        <button className="btn" type="submit">Submit Request</button>
      </form>
    </main>
  );
}
