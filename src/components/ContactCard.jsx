import { useNavigate } from "react-router-dom";

export const ContactCard = ({ contact, onDeleteRequest }) => {
  const navigate = useNavigate();

  return (
    <div className="contact-card">
      <img
        src="https://cdn-icons-png.flaticon.com/512/8102/8102780.png"
        alt={contact.name}
        className="contact-avatar"
      />
      <div className="contact-info">
        <h3 className="contact-name">{contact.name}</h3>
        <p className="contact-detail">
          <i className="fa fa-map-marker"></i> {contact.address || "No address"}
        </p>
        <p className="contact-detail">
          <i className="fa fa-phone"></i> {contact.phone || "No phone"}
        </p>
        <p className="contact-detail">
          <i className="fa fa-envelope"></i> {contact.email || "No email"}
        </p>
      </div>
      <div className="contact-actions">
        <button
          className="btn-icon edit"
          onClick={() => navigate(`/edit/${contact.id}`)}
          title="Edit"
        >
          <i className="fa fa-pencil"></i>
        </button>
        <button
          className="btn-icon delete"
          onClick={() => onDeleteRequest(contact)}
          title="Delete"
        >
          <i className="fa fa-trash"></i>
        </button>
      </div>
    </div>
  );
};
