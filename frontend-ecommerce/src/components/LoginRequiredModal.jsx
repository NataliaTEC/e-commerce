// src/components/modals/LoginRequiredModal.jsx
import React from "react";
import dangerIcon from "../assets/icons/danger.svg";
import "./LoginRequiredModal.css"; // opcional si quieres estilos separados

export default function LoginRequiredModal({ open, title, message, onClose, onLogin }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-dialog">
        <div className="modal-icon-shell">
          <img src={dangerIcon} alt="Advertencia" className="modal-icon" />
        </div>

        <div className="modal-content">
          <h3 className="modal-title">{title}</h3>
          <p className="modal-message">{message}</p>

          <div className="modal-actions">
            <button className="modal-btn primary" onClick={onLogin}>
              Iniciar sesión
            </button>

            <button className="modal-btn ghost" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
