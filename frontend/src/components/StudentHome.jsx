import { useState, useEffect } from "react";
import axios from "axios";

// Estilos en JS
const styles = {
  container: {
    minHeight: "100vh",
    width: "100vw",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 10px"
  },
  card: {
    width: "100%",
    maxWidth: 470,
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 4px 24px #0001",
    padding: "38px 26px 30px 26px",
    display: "flex",
    flexDirection: "column",
    gap: 18
  },
  h2: {
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "#1e2337",
    marginBottom: 7,
    textAlign: "center"
  },
  textarea: {
    resize: "vertical",
    minHeight: 100,
    fontSize: "1.08rem",
    borderRadius: 7,
    border: "1.2px solid #ddd",
    padding: "14px",
    marginBottom: 4,
    outline: "none",
    background: "#f8fafc",
    color: "#18181b"
  },
  button: {
    width: "100%",
    background: "linear-gradient(90deg,#2563eb,#1d4ed8)",
    color: "#fff",
    fontWeight: 700,
    padding: "13px 0",
    border: "none",
    borderRadius: 7,
    fontSize: "1.15rem",
    boxShadow: "0 2px 8px #2563eb22",
    cursor: "pointer",
    marginTop: 6,
    transition: "background 0.16s, box-shadow 0.16s"
  },
  msg: {
    marginTop: 50,
    textAlign: "center",
    color: "#059669",
    fontWeight: 600,
    fontSize: "1.2rem"
  }
};

const mediaQuery = `
@media (max-width: 600px) {
  .student-card {
    padding: 18px 5px 14px 5px !important;
    max-width: 99vw !important;
  }
  .student-card textarea, .student-card button {
    font-size: 1rem !important;
    padding: 12px !important;
  }
}
`;

const API_URL = import.meta.env.VITE_API_URL;

export default function StudentHome({ user }) {
  const [feedback, setFeedback] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [verificando, setVerificando] = useState(true);

  // Para el placeholder solo visible en blur
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/api/feedback/mine`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => {
        if (res.data.feedback) setEnviado(true);
        else setEnviado(false);
        setVerificando(false);
      })
      .catch(() => setVerificando(false));
  }, [user.token]);

  const enviar = async () => {
    try {
      await axios.post(`${API_URL}/api/feedback`, { feedback }, {
  headers: { Authorization: `Bearer ${user.token}` }
});
      setEnviado(true);
    } catch (err) {
      setEnviado(true);
    }
  };

  if (verificando)
    return (
      <div style={{ ...styles.container, background: "#f3f4f6" }}>
        <div style={styles.msg}>Verificando...</div>
      </div>
    );
  if (enviado)
    return (
      <div style={{ ...styles.container, background: "#f3f4f6" }}>
        <div style={styles.msg}>¡Ya enviaste tu feedback, gracias!</div>
      </div>
    );

  // Muestra el placeholder solo si no está en focus y feedback está vacío
  const showPlaceholder = !focus && feedback.length === 0;

  return (
    <div style={styles.container}>
      <style>{mediaQuery}</style>
      <form
        style={styles.card}
        className="student-card"
        onSubmit={e => { e.preventDefault(); enviar(); }}
      >
        <h2 style={styles.h2}>Envía tu feedback sobre el profesor</h2>
        <textarea
          style={styles.textarea}
          rows={5}
          maxLength={800}
          value={feedback}
          placeholder={showPlaceholder ? "Escribe aquí tu opinión, sugerencia o comentario." : ""}
          onChange={e => setFeedback(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          required
        />
        <button
          type="submit"
          style={styles.button}
          onMouseOver={e => { e.currentTarget.style.background = "#1d4ed8"; }}
          onMouseOut={e => { e.currentTarget.style.background = "linear-gradient(90deg,#2563eb,#1d4ed8)"; }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
