import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { ContactCard } from "../components/ContactCard";

const AGENDA_URL = "https://playground.4geeks.com/contact";
const AGENDA_SLUG = "my-contact-list-4geeks";

export const ContactList = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  useEffect(() => {
    const initAndLoad = async () => {
      dispatch({ type: "set_loading", payload: true });
      try {
        const checkRes = await fetch(`${AGENDA_URL}/agendas/${AGENDA_SLUG}`);
        if (checkRes.status === 404) {
          await fetch(`${AGENDA_URL}/agendas/${AGENDA_SLUG}`, { method: "POST" });
        }
        const res = await fetch(`${AGENDA_URL}/agendas/${AGENDA_SLUG}/contacts`);
        const data = await res.json();
        dispatch({ type: "set_contacts", payload: data.contacts || [] });
      } catch (err) {
        dispatch({ type: "set_error", payload: "Error cargando contactos" });
      } finally {
        dispatch({ type: "set_loading", payload: false });
      }
    };
    initAndLoad();
  }, []);

  const handleDeleteRequest = (contact) => {
    setContactToDelete(contact);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await fetch(
        `${AGENDA_URL}/agendas/${AGENDA_SLUG}/contacts/${contactToDelete.id}`,
        { method: "DELETE" }
      );
      dispatch({ type: "delete_contact", payload: contactToDelete.id });
    } catch (err) {
      console.error("Error eliminando:", err);
    } finally {
      setShowModal(false);
      setContactToDelete(null);
    }
  };

  return (
    <div className="contact-list-page">
      <div className="add-btn-wrapper">
        <button className="btn-add" onClick={() => navigate("/add")}>
          Add new contact
        </button>
      </div>

      {store.loading && <p className="status-msg">Loading...</p>}
      {store.error && <p className="status-msg error">{store.error}</p>}

      {!store.loading && store.contacts.length === 0 && (
        <div className="empty-state">
          <p>No contacts yet. Add one!</p>
        </div>
      )}

      <div className="contact-list">
        {store.contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onDeleteRequest={handleDeleteRequest}
          />
        ))}
      </div>

      {/* MODAL — renderizado fuera del flujo normal con portal-like fixed positioning */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "8px",
              padding: "2rem",
              maxWidth: "380px",
              width: "90%",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              zIndex: 10000,
            }}
          >
            <h2 style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>
              Delete contact?
            </h2>
            <p style={{ color: "#555", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              Are you sure you want to delete{" "}
              <strong>{contactToDelete?.name}</strong>? This cannot be undone.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                style={{
                  background: "#e2e8f0", color: "#333", border: "none",
                  padding: "0.5rem 1.2rem", borderRadius: "4px",
                  cursor: "pointer", fontSize: "0.9rem",
                }}
                onClick={() => { setShowModal(false); setContactToDelete(null); }}
              >
                Cancel
              </button>
              <button
                style={{
                  background: "#dc3545", color: "white", border: "none",
                  padding: "0.5rem 1.2rem", borderRadius: "4px",
                  cursor: "pointer", fontSize: "0.9rem",
                }}
                onClick={handleConfirmDelete}
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
