import { useNavigate } from "react-router-dom";

function RoleSelectionPage() {
  const navigate = useNavigate();

  return (
    <main className="role-page">
      <section className="role-shell">
        <div className="role-brand">
          <span className="role-brand-mark" aria-hidden="true">🐾</span>
          <p className="role-eyebrow">HUELLAS A CASA · SUCRE, BOLIVIA</p>
          <h1>Una nueva historia puede comenzar contigo.</h1>
          <p>Elige cómo quieres ingresar a nuestra comunidad de adopción responsable.</p>
        </div>

        <div className="role-options">
          <p className="role-question">¿Cómo deseas continuar?</p>
          <button className="role-option role-adopter" type="button" onClick={() => navigate("/adoptar")}>
            <span className="role-icon" aria-hidden="true">♡</span>
            <span className="role-option-copy">
              <strong>Soy adoptante</strong>
              <small>Conocer perros y gatos que buscan un hogar.</small>
            </span>
            <span className="role-arrow" aria-hidden="true">→</span>
          </button>

          <button className="role-option role-admin" type="button" onClick={() => navigate("/login")}>
            <span className="role-icon" aria-hidden="true">⚙</span>
            <span className="role-option-copy">
              <strong>Soy administrador</strong>
              <small>Ingresar con correo electrónico y contraseña.</small>
            </span>
            <span className="role-arrow" aria-hidden="true">→</span>
          </button>

          <p className="role-note">Promovemos adopciones responsables para perros y gatos en Sucre.</p>
        </div>
      </section>
    </main>
  );
}

export default RoleSelectionPage;
