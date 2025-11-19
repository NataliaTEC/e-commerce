import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const ingresar = (e) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      alert("Llena todos los campos");
      return;
    }

    fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          alert("Ingreso exitoso");
          navigate("/");
        } else {
          alert("Error al iniciar sesión: " + data.error);
        }
      })
      .catch((err) => alert(err));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Bienvenido</h2>
        <p className="login-subtitle">Inicia sesión para continuar</p>

        <form className="login-form" onSubmit={ingresar}>
          <div className="input-group">
            <label className="input-label">Correo electrónico</label>
            <input
              type="email"
              className="input-field"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Contraseña</label>
            <input
              type="password"
              className="input-field"
              placeholder="*********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
