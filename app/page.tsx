import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <header className="hero">
        <h1>Book a private-event bartender in minutes.</h1>
        <p className="small">Concierge staffing for house parties, corporate events, and weddings.</p>
        <Link className="btn" href="/request">Request a Bartender</Link>
      </header>

      <section className="grid two" style={{ marginBottom: '1rem' }}>
        <article className="card"><h3>Packages</h3><p>2-hour minimum, verified professionals, setup guidance, and optional mixers add-ons.</p></article>
        <article className="card"><h3>FAQ</h3><p>Host provides alcohol. We provide service staff and non-alcoholic prep support.</p></article>
      </section>
      <section className="card">
        <h3>Service Area</h3>
        <p>Metro coverage within 30 miles of downtown. Extended travel available with fee.</p>
      </section>
    </main>
  );
}
