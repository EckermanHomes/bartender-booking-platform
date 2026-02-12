import { isAdminAuthed } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  if (!isAdminAuthed()) {
    return (
      <main className="card" style={{ maxWidth: 420 }}>
        <h1>Admin Login</h1>
        <form action="/api/admin/login" method="post">
          <label>Password<input name="password" type="password" required /></label>
          <button className="btn" type="submit">Log In</button>
        </form>
      </main>
    );
  }

  redirect('/admin/requests');
  return null;
}
