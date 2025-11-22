import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./login.css";
import userIcon from "../assets/icons/email.svg";
import emailIcon from "../assets/icons/correo.svg";
import padlockIcon from "../assets/icons/padlock.svg";
import eyeIcon from "../assets/icons/eye.svg";
import eyeClosedIcon from "../assets/icons/eye-closed.svg";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim() || !confirm.trim()) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al registrar usuario");
        setLoading(false);
        return;
      }


      navigate("/login");
    } catch (err) {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Crear cuenta</h1>
        <p className="login-subtitle">Regístrate para comenzar a comprar</p>

        <form className="login-form" onSubmit={submit}>
          <div className="input-group">
            <label htmlFor="name" className="input-label">
              <img src={userIcon} alt="user" className="label-icon" />
              Nombre completo <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input id="name" className="input-field" placeholder="Maurio Mora" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email" className="input-label">
              <img src={emailIcon} alt="" className="label-icon" />
              Correo electrónico <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input id="email" type="email" className="input-field" placeholder="ejemplo@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              <img src={padlockIcon} alt="padlock" className="label-icon" />
              Contraseña <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input id="password" type={showPassword ? "text" : "password"} className="input-field no-left-icon" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                <img src={showPassword ? eyeIcon : eyeClosedIcon} alt="toggle" />
              </button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirm" className="input-label">
              <img src={padlockIcon} alt="padlock" className="label-icon" />
              Confirmar contraseña <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input id="confirm" type={showConfirmPassword ? "text" : "password"} className="input-field no-left-icon" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} disabled={loading} />
              <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(s => !s)} aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                <img src={showConfirmPassword ? eyeIcon : eyeClosedIcon} alt="toggle" />
              </button>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>{loading ? <div className="spinner-login" /> : 'REGISTRARSE'}</button>
        </form>

        <p className="register-text">¿Ya tienes cuenta? <button type="button" className="link-button" onClick={() => navigate('/login')}>Inicia sesión</button></p>
      </div>
    </div>
  );
}
