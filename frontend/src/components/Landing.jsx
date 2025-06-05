import { Link } from "react-router-dom";

const styles = {
  root: {
    minHeight: "100vh",
    width: "100vw",
    background: "#f3f4f6",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 16px",
  },
  heading: {
    fontSize: "clamp(2rem, 5vw, 2.8rem)",
    marginBottom: 42,
    fontWeight: 800,
    textAlign: "center",
    color: "#1e2337",
    letterSpacing: "-1px",
    lineHeight: 1.14,
    textShadow: "0 2px 8px #0001"
  },
  btnContainer: {
    display: "flex",
    gap: 30,
    flexDirection: "row",
    width: "100%",
    maxWidth: 430,
    justifyContent: "center"
  },
  button: {
    flex: 1,
    padding: "20px 0",
    borderRadius: 15,
    fontSize: "1.22rem",
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 3px 16px #0002",
    outline: "none",
    minWidth: 140,
    maxWidth: 180,
    margin: 0,
    marginBottom: 0,
    transition: "background 0.2s, color 0.2s, transform 0.12s, box-shadow 0.2s"
  },
  login: {
    background: "linear-gradient(90deg,#2563eb,#1d4ed8)",
    color: "#fff"
  },
  register: {
    background: "linear-gradient(90deg,#16a34a,#059669)",
    color: "#fff"
  }
};

const mediaQuery = `
@media (max-width: 600px) {
  .landing-btns {
    flex-direction: column !important;
    gap: 18px !important;
    max-width: 100vw !important;
  }
  .landing-btns button {
    min-width: 120px !important;
    font-size: 1rem !important;
    padding: 15px 0 !important;
    max-width: 100% !important;
  }
}
`;

export default function Landing() {
  return (
    <div style={styles.root}>
      <style>{mediaQuery}</style>
      <h1 style={styles.heading}>Bienvenido al sistema de <span style={{color:"#2563eb"}}>Feedback</span></h1>
      <div style={styles.btnContainer} className="landing-btns">
        <Link to="/login" style={{flex: 1, textAlign: "center"}}>
          <button
            style={styles.button}
            onMouseOver={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 4px 16px #2563eb30"; }}
            onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = styles.button.boxShadow; }}
            className="btn"
          >
            Login
          </button>
        </Link>
        <Link to="/register" style={{flex: 1, textAlign: "center"}}>
          <button
            style={{ ...styles.button, ...styles.register }}
            onMouseOver={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 4px 16px #16a34a30"; }}
            onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = styles.button.boxShadow; }}
            className="btn"
          >
            Registro
          </button>
        </Link>
      </div>
    </div>
  );
}
