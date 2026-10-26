import { useNavigate } from "react-router-dom";

function RoleSelectionPage() {
  const navigate = useNavigate();

  return (
    <main className="role-page">
      <section className="role-shell">
        <div className="role-brand">
          <div className="role-topline">
            <span className="role-brand-mark" aria-hidden="true">🐾</span>
            <span className="role-brand-name">Huellas <b>a Casa</b></span>
          </div>

          <p className="role-eyebrow">ADOPCIÓN RESPONSABLE · SUCRE, BOLIVIA</p>
          <h1>Un hogar cambia <em>toda una vida.</em></h1>
          <p className="role-brand-copy">
            Hay una amistad esperando por ti. Encuentra a tu nuevo compañero
            y dale la oportunidad de formar parte de tu familia.
          </p>

          <div className="role-pet-scene" aria-label="Ilustración decorativa de mascotas">
            <div className="role-sun" />
            <span className="role-floating-paw paw-one">🐾</span>
            <span className="role-floating-paw paw-two">✦</span>
            <div className="role-pet-circle">
              <span className="role-pet-dog">🐶</span>
              <span className="role-pet-cat">🐱</span>
            </div>
            <div className="role-pet-caption">
              <span>♡</span>
              <p><strong>Amor que se adopta</strong><small>Una segunda oportunidad empieza aquí</small></p>
            </div>
          </div>

          <div className="role-location"><span>⌖</span> Hecho con cariño en Sucre, Bolivia</div>
        </div>

        <div className="role-options">
          <span className="role-step">BIENVENIDO/A A HUELLAS A CASA</span>
          <h2>¿Cómo deseas ingresar?</h2>
          <p className="role-subtitle">Selecciona tu perfil para continuar.</p>

          <button className="role-option role-adopter" type="button" onClick={() => navigate("/adoptar")}>
            <span className="role-icon" aria-hidden="true">♡</span>
            <span className="role-option-copy">
              <strong>Quiero adoptar</strong>
              <small>Explorar perros y gatos que buscan una familia.</small>
              <span className="role-option-tag">PARA FUTUROS ADOPTANTES</span>
            </span>
            <span className="role-arrow" aria-hidden="true">↗</span>
          </button>

          <button className="role-option role-admin" type="button" onClick={() => navigate("/login")}>
            <span className="role-icon" aria-hidden="true">⌘</span>
            <span className="role-option-copy">
              <strong>Acceso administrador</strong>
              <small>Gestionar el sitio mediante correo y contraseña.</small>
              <span className="role-option-tag">ÁREA PRIVADA</span>
            </span>
            <span className="role-arrow" aria-hidden="true">↗</span>
          </button>

          <div className="role-trust-note"><span>✓</span><p><strong>Adoptar es un compromiso.</strong><br />Te acompañamos para dar este paso de forma responsable.</p></div>
          <p className="role-note">Al continuar, ayudas a construir una comunidad que cuida y respeta a los animales.</p>
        </div>
      </section>
    </main>
  );
}

export default RoleSelectionPage;
