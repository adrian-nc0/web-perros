import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import LoginForm from "../../components/auth/LoginForm";
import { authRepository } from "../../repositories/authRepository";
import type { LoginCredentials } from "../../types/auth";

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const currentUser = authRepository.getCurrentUser();
  if (currentUser) {
    return <Navigate to={currentUser.role === "ADMIN" ? "/admin" : "/adoptar"} replace />;
  }

  const handleLogin = (credentials: LoginCredentials) => {
    setError("");
    const user = authRepository.login(credentials);

    if (!user || user.role !== "ADMIN") {
      if (user) authRepository.logout();
      setError("El correo o la contraseña son incorrectos, o la cuenta no tiene permisos de administrador.");
      return;
    }

    navigate("/admin", { replace: true });
  };

  return (
    <main className="login-page">
      <section className="login-shell" aria-label="Acceso de administrador">
        <div className="login-intro">
          <span className="brand-mark" aria-hidden="true">🐾</span>
          <p className="eyebrow">Huellas a Casa · Sucre, Bolivia</p>
          <h1>Gestión responsable, mejores oportunidades.</h1>
          <p className="intro-copy">
            Esta sección está reservada para el administrador de la plataforma.
          </p>
          <div className="intro-paws" aria-hidden="true">
            <span>♥</span>
            <span>🐾</span>
            <span>♥</span>
          </div>
        </div>

        <div className="login-card">
          <div className="admin-login-top">
            <button className="back-role-button" type="button" onClick={() => navigate("/")}>← Volver a elegir perfil</button>
          </div>
          <LoginForm error={error} onSubmit={handleLogin} />
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
