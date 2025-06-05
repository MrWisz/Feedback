import { useEffect, useState } from "react";
import axios from "axios";

// Estilos (idénticos al anterior para que se vea bien)
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
    maxWidth: 550,
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 4px 24px #0001",
    padding: "38px 26px 30px 26px",
    display: "flex",
    flexDirection: "column",
    gap: 12
  },
  h2: {
    fontSize: "1.45rem",
    fontWeight: 800,
    color: "#1e2337",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: "-0.5px"
  },
  feedbackItem: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "1px solid #eee",
    background: "#f8fafc",
    borderRadius: 8,
    padding: "14px 14px"
  },
  comment: {
    fontSize: "1.13rem",
    color: "#1e2337",
    wordBreak: "break-word"
  },
  paginacion: {
    display: "flex",
    gap: 14,
    marginTop: 25,
    justifyContent: "center"
  },
  pagBtn: {
    minWidth: 90,
    padding: "10px 0",
    borderRadius: 8,
    fontWeight: 600,
    border: "none",
    background: "#e5e7eb",
    color: "#222",
    cursor: "pointer",
    transition: "background 0.18s"
  },
  pagBtnDisabled: {
    background: "#cbd5e1",
    color: "#666",
    cursor: "not-allowed"
  }
};

const mediaQuery = `
@media (max-width: 600px) {
  .prof-card {
    padding: 12px 2vw 8px 2vw !important;
    max-width: 99vw !important;
  }
  .prof-card h2 {
    font-size: 1.12rem !important;
  }
  .prof-card li {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .prof-card button {
    min-width: 44vw !important;
    font-size: 1rem !important;
    padding: 9px 0 !important;
  }
}
`;

export default function ProfessorHome({ user }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const [noMore, setNoMore] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
   axios
  .get(`${API_URL}/api/feedback?page=${page}&limit=1`, {
    headers: { Authorization: `Bearer ${user.token}` }
  })
      .then(res => {
        setFeedbacks(res.data);
        setNoMore(res.data.length === 0);
      })
      .catch(() => {
        setFeedbacks([]);
        setNoMore(true);
      });
  }, [user.token, page]);

  return (
    <div style={styles.container}>
      <style>{mediaQuery}</style>
      <div style={styles.card} className="prof-card">
        <h2 style={styles.h2}>Feedback de estudiantes</h2>
        {feedbacks.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888", fontWeight: 500 }}>No hay feedbacks en esta página.</div>
        ) : (
          <div style={styles.feedbackItem}>
            <div style={styles.comment}>{feedbacks[0].feedback}</div>
          </div>
        )}
        <div style={styles.paginacion}>
          <button
            style={page === 1 ? { ...styles.pagBtn, ...styles.pagBtnDisabled } : styles.pagBtn}
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >Anterior</button>
          <button
            style={noMore ? { ...styles.pagBtn, ...styles.pagBtnDisabled } : styles.pagBtn}
            disabled={noMore}
            onClick={() => setPage(page + 1)}
          >Siguiente</button>
        </div>
      </div>
    </div>
  );
}
