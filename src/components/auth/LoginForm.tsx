import { useState } from "react";
import type { FormEventHandler } from "react";
import type { LoginCredentials } from "../../types/auth";


interface LoginFormProps {
  error?: string;
  onSubmit: (credentials: LoginCredentials) => void;
}


function LoginForm({ error, onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();


    const normalizedEmail = email.trim().toLowerCase();


    if (!normalizedEmail || !password) {
      return;
    }


    onSubmit({
      email: normalizedEmail,
      password,
    });
  };


  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <span className="form-paw" aria-hidden="true">🐶</span>
        <div>
          <p className="form-kicker">Bienvenido de vuelta</p>
          <h2>Iniciar sesión</h2>
        </div>
      </div>
      <p className="form-description">Ingresa tus datos para continuar cuidando historias.</p>



      <div className="form-field">

      <div>

        <label htmlFor="email">Correo electrónico</label>


        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Ingrese su correo electrónico"
          autoComplete="email"
          required
        />
      </div>


      <div className="form-field">
        <label htmlFor="password">Contraseña</label>


        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Ingrese su contraseña"
          autoComplete="current-password"
          required
        />
      </div>


      {error && (
        <p className="form-error" role="alert" aria-live="polite">
          {error}
        </p>
      )}


      <button className="login-submit" type="submit">
        Entrar a la comunidad <span aria-hidden="true">→</span>
      </button>

      <p className="form-footer">Cada adopción transforma dos vidas. <span aria-hidden="true">♥</span></p>
    </form>
  );
}


export default LoginForm;
