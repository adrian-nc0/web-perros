import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";


import LoginForm from "../../components/auth/LoginForm";
import { authRepository } from "../../repositories/authRepository";


import type { LoginCredentials } from "../../types/auth";


function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");


  if (authRepository.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }


  const handleLogin = (credentials: LoginCredentials) => {
    setError("");


    const user = authRepository.login(credentials);


    if (!user) {
      setError("El correo electrónico o la contraseña son incorrectos.");
      return;
    }


    navigate("/", { replace: true });
  };


  return (
    <main className="login-page">
      <section className="login-shell" aria-label="Acceso a la plataforma">
        <div className="login-intro">
          <span className="brand-mark" aria-hidden="true">🐾</span>
          <p className="eyebrow">Red de adopción responsable</p>
          <h1>Una segunda oportunidad comienza aquí.</h1>
          <p className="intro-copy">
            Ingresa para acercar familias a sus nuevos compañeros de vida.
          </p>
          <div className="intro-paws" aria-hidden="true">
            <span>♥</span>
            <span>🐾</span>
            <span>♥</span>
          </div>
        </div>

        <div className="login-card">
          <LoginForm
            error={error}
            onSubmit={handleLogin}
          />
        </div>
      </section>
    </main>
  );
}


export default LoginPage;
