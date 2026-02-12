export default function ReceivedPage({ searchParams }: { searchParams: { rid?: string } }) {
  return (
    <main className="card">
      <h1>Request Received</h1>
      <p>Your request ID is <strong>{searchParams.rid ?? 'unknown'}</strong>.</p>
      <p className="small">We will confirm availability and email a deposit link once a bartender is assigned.</p>
    </main>
  );
}
