import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const emptyForm = { name: "", description: "" };

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  async function loadItems() {
    setLoading(true);
    try {
      const response = await fetch("/api/items");
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setItems(result.data);
    } catch (error) {
      setNotice(error.message || "Unable to load items");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadItems(); }, []);

  async function saveItem(event) {
    event.preventDefault();
    const response = await fetch(editingId ? `/api/items/${editingId}` : "/api/items", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await response.json();
    if (!response.ok) return setNotice(result.error || "Unable to save item");
    setNotice(editingId ? "Item updated successfully." : "Item created successfully.");
    setForm(emptyForm);
    setEditingId(null);
    loadItems();
  }

  function startEditing(item) {
    setEditingId(item._id);
    setForm({ name: item.name, description: item.description });
    setNotice("");
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function softDelete(item) {
    if (!window.confirm(`Soft delete “${item.name}”? The record will remain in MongoDB.`)) return;
    const response = await fetch(`/api/items/${item._id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) return setNotice(result.error || "Unable to delete item");
    setNotice(`“${item.name}” was marked as DELETED and filtered from this list.`);
    loadItems();
  }

  return (
    <main>
      <header className="page-header">
        <div>
          <span className="eyebrow">Next.js + MongoDB</span>
          <h1>Item CRUD</h1>
          <p>Manage active items with a safe, auditable soft-delete workflow.</p>
        </div>
        <div className="status-key"><span /> Active records only</div>
      </header>

      <section className="explanation">
        <strong>How deletion works</strong>
        <p>Delete changes an item&apos;s status from <code>ACTIVE</code> to <code>DELETED</code>. MongoDB keeps the record, while the active-items query filters it from this page.</p>
      </section>

      <div className="workspace">
        <section className="panel form-panel">
          <span className="section-number">01</span>
          <h2>{editingId ? "Edit item" : "Create item"}</h2>
          <p>{editingId ? "Update the selected item details." : "Add an active record to MongoDB."}</p>
          <form onSubmit={saveItem}>
            <label>Item name<input required maxLength="80" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Example: Wireless keyboard" /></label>
            <label>Description<textarea required maxLength="240" rows="5" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Add a short description" /></label>
            <div className="form-actions">{editingId && <button type="button" className="secondary" onClick={cancelEditing}>Cancel</button>}<button className="primary">{editingId ? "Save changes" : "Create item"}</button></div>
          </form>
        </section>

        <section className="panel list-panel">
          <div className="list-heading"><div><span className="section-number">02</span><h2>Active items</h2><p>Deleted records are intentionally excluded.</p></div><span className="count">{items.length}</span></div>
          {notice && <div className="notice" role="status">{notice}</div>}
          {loading ? <div className="empty">Loading items…</div> : items.length === 0 ? <div className="empty">No active items. Create the first one.</div> : <div className="item-list">{items.map((item) => <article className="item" key={item._id}><div className="item-copy"><span className="active-badge">ACTIVE</span><h3>{item.name}</h3><p>{item.description}</p><small>MongoDB ID: {item._id}</small></div><div className="item-actions"><button className="secondary" onClick={() => startEditing(item)}>Edit</button><button className="delete" onClick={() => softDelete(item)}>Soft delete</button></div></article>)}</div>}
        </section>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
