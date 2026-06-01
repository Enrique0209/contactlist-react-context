import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const AGENDA_URL = "https://playground.4geeks.com/contact";
const AGENDA_SLUG = "my-contact-list-4geeks";

const emptyForm = { name: "", phone: "", email: "", address: "" };

export const AddContact = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const existing = store.contacts.find((c) => c.id === parseInt(id));
      if (existing) {
        setForm({
          name: existing.name || "",
          phone: existing.phone || "",
          email: existing.email || "",
          address: existing.address || "",
        });
      }
    }
  }, [id, store.contacts]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("El nombre es obligatorio."); return; }
    setSaving(true);
    setError(null);
    try {
      if (isEditing) {
        const res = await fetch(`${AGENDA_URL}/agendas/${AGENDA_SLUG}/contacts/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const updated = await res.json();
        dispatch({ type: "update_contact", payload: updated });
      } else {
        const res = await fetch(`${AGENDA_URL}/agendas/${AGENDA_SLUG}/contacts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const created = await res.json();
        dispatch({ type: "add_contact", payload: created });
      }
      navigate("/");
    } catch (err) {
      setError("Error al guardar el contacto.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="add-contact-page">
      <div className="form-card">
        <h1>{isEditing ? "Edit contact" : "Add a new contact"}</h1>

        {error && <p className="form-error">{error}</p>}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" type="text" placeholder="Full Name" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="Enter email" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input name="phone" type="text" placeholder="Enter phone" value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input name="address" type="text" placeholder="Enter address" value={form.address} onChange={handleChange} />
          </div>

          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? "saving..." : "save"}
          </button>
        </form>

        <div className="back-link">
          <a onClick={() => navigate("/")}>or get back to contacts</a>
        </div>
      </div>
    </div>
  );
};
