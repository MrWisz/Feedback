import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Estilos en JS
const styles = {
  container: {
    minHeight: "100vh",
    width: "100vw",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 12px",
  },
  form: {
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 4px 24px #0001",
    width: "100%",
    maxWidth: 390,
    padding: "36px 28px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  h2: {
    fontSize: "1.7rem",
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1e2337",
    textAlign: "center"
  },
  input: {
    padding: "12px",
    fontSize: "1.1rem",
    borderRadius: 7,
    border: "1.2px solid #ddd",
    marginBottom: 6
  },
  button: {
    width: "100%",
    background: "linear-gradient(90deg,#16a34a,#059669)",
    color: "#fff",
    fontWeight: 700,
    padding: "14px 0",
    border: "none",
    borderRadius: 7,
    fontSize: "1.15rem",
    boxShadow: "0 2px 8px #16a34a22",
    cursor: "pointer",
    marginTop: 6,
    transition: "background 0.16s, box-shadow 0.16s"
  }
};

// Responsive media query
const mediaQuery = `
@media (max-width: 600px) {
  .register-form {
    padding: 22px 6px !important;
    max-width: 100vw !important;
  }
  .register-form input, .register-form button {
    font-size: 1rem !important;
    padding: 12px !important;
  }
}
`;

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  async function handleRegister(e) {
    e.preventDefault();
    setError(""); setOk("");
    try {
      await axios.post(`${API_URL}/api/auth/register`, { email, password, tipo: 1 });
      setOk("Usuario creado, ahora inicia sesión");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.response?.data?.msg || "Error al registrar");
    }
  }

  return (
    <div style={styles.container}>
      <style>{mediaQuery}</style>
      <form onSubmit={handleRegister} style={styles.form} className="register-form">
        <h2 style={styles.h2}>Registro de estudiante</h2>
        {error && <div style={{ color: "#dc2626", marginBottom: 5, textAlign: "center" }}>{error}</div>}
        {ok && <div style={{ color: "#059669", marginBottom: 5, textAlign: "center" }}>{ok}</div>}
        <input
          type="email"
          placeholder="Correo institucional"
          style={styles.input}
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Contraseña"
          style={styles.input}
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <button
          type="submit"
          style={styles.button}
          onMouseOver={e => { e.currentTarget.style.background = "#059669"; }}
          onMouseOut={e => { e.currentTarget.style.background = "linear-gradient(90deg,#16a34a,#059669)"; }}
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
