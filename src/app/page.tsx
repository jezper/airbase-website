export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-text p-12">
      <h1 className="font-display text-hero font-black leading-hero tracking-hero">
        Everything<br />Else Could<br />Wait
      </h1>
      <p className="font-body text-lg text-text-muted mt-6 max-w-prose">
        Body text in Syne. Angular, assertive, art-world energy.
      </p>
      <p className="font-mono text-sm text-text-faint mt-2">
        2026-02-06 · Single · Black Hole Recordings
      </p>
      <button className="mt-6 bg-accent text-bg font-body text-sm font-bold uppercase tracking-widest px-6 py-3 rounded">
        Listen Now
      </button>
      <div className="accent-line mt-12" />
      <div className="mt-8 bg-bg-card border border-border rounded-lg p-6">
        <p className="text-gold font-mono text-xs uppercase tracking-wider">Card on bg-card</p>
      </div>
    </main>
  );
}
