import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Bartender Booking Platform',
  description: 'Request a private event bartender.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <nav>
            <Link href="/"><strong>BarShift Concierge</strong></Link>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link href="/request">Request</Link>
              <Link href="/admin">Admin</Link>
            </div>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
