import QRCode from 'qrcode';
import { env } from '@/lib/env';

export default async function TipPage({ params }: { params: { bookingId: string } }) {
  const tipUrl = `${env.baseUrl}/api/payments/tip?booking_id=${params.bookingId}`;
  const qrDataUri = await QRCode.toDataURL(tipUrl);

  return (
    <main className="card" style={{ textAlign: 'center' }}>
      <h1>Tip your bartender</h1>
      <p>Scan to leave a tip securely via Stripe Checkout.</p>
      <img src={qrDataUri} alt="Tip QR code" style={{ maxWidth: 280, width: '100%' }} />
      <p><a className="btn" href={tipUrl}>Open tip checkout</a></p>
    </main>
  );
}
