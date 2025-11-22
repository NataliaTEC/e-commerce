import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./login.css";
import emailIcon from "../assets/icons/email.svg";
import padlockIcon from "../assets/icons/padlock.svg";
import eyeIcon from "../assets/icons/eye.svg";
import eyeClosedIcon from "../assets/icons/eye-closed.svg";
import googleLogo from "../assets/icons/google.svg";
import facebookLogo from "../assets/icons/facebook-i.svg";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const ingresar = (e) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      alert("Llena todos los campos");
      return;
    }

    setLoading(true);

    fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, remember }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          navigate("/");
        } else {
          alert("Error al iniciar sesión: " + data.error);
        }
      })
      .catch((err) => alert(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Iniciar sesión</h1>
        <p className="login-subtitle">
          Ingresa tus credenciales para acceder
        </p>

        <form className="login-form" onSubmit={ingresar}>
          {/* Correo */}
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              <img src={emailIcon} alt="" className="label-icon" />
              Correo electrónico <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              <img src={padlockIcon} alt="padlock" className="label-icon" />
              Contraseña <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="input-field no-left-icon"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <img src={showPassword ? eyeIcon : eyeClosedIcon} alt="toggle" />
              </button>
            </div>
          </div>

          {/* Recordarme / Olvidaste contraseña */}
          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={loading}
              />
              <span>Recordarme</span>
            </label>

            <button
              type="button"
              className="link-button small-link"
              onClick={() => alert("Aquí iría el flujo de recuperación de contraseña")}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Botón principal */}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <div className="spinner-login" /> : "INICIAR SESIÓN"}
          </button>
        </form>

        {/* Separador */}
        <div className="login-divider">
          <span>o</span>
        </div>

        {/* Botones sociales (sin lógica aún, solo UI) */}
        <button
          type="button"
          className="social-btn google-btn"
          disabled={loading}
        >
          <img src={googleLogo} alt="google" className="social-raw-icon" />
          <span>Continuar con Google</span>
        </button>

        <button
          type="button"
          className="social-btn facebook-btn"
          disabled={loading}
        >
          <img src={facebookLogo} alt="facebook" className="social-raw-icon" />
          <span>Continuar con Facebook</span>
        </button>

        {/* Registro */}
        <p className="register-text">
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            className="link-button"
            onClick={() => navigate("/registro")}
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
}
