import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Register from "./components/Register";
import StudentHome from "./components/StudentHome";
import ProfessorHome from "./components/ProfessorHome";
import RegisterProfesor from "./components/RegisterProfesor";

export default function App() {
  // Recupera usuario guardado en localStorage (si existe)
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // Actualiza localStorage cada vez que cambia el usuario
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-profesor6" element={<RegisterProfesor />} />
        <Route
          path="/home"
          element={
            !user
              ? <Navigate to="/login" />
              : user.tipo === 1
              ? <StudentHome user={user} />
              : <ProfessorHome user={user} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
