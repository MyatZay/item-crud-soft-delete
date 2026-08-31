export default function Home() {
  return (
    <main>
      <section className="card">
        <p className="eyebrow">CSX4107 • Item CRUD</p>
        <h1>Soft Delete API</h1>
        <p>The backend keeps deleted records in MongoDB and filters them from the active item list.</p>
        <div className="links">
          <a href="/api/items">GET /api/items</a>
        </div>
      </section>
    </main>
  );
}
