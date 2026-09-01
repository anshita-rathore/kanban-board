import { useState } from "react";
import "./cardmodel.css";

export default function CardModal({ card, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [dueDate, setDueDate] = useState(card.dueDate ? card.dueDate.slice(0, 10) : "");

  const save = () => {
    onSave({ title, description, dueDate: dueDate || null });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <input className="modal-title-input" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea
          className="modal-desc-input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
        <input className="modal-date-input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <div className="modal-actions">
          <button className="modal-delete" onClick={onDelete}>Delete</button>
          <div className="modal-actions-right">
            <button className="modal-cancel" onClick={onClose}>Cancel</button>
            <button className="modal-save" onClick={save}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}