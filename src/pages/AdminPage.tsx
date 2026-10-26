import { Navigate, useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";

function AdminPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    authRepository.logout();
    navigate("/", { replace: true });
  };

  return (
    <main className="admin-placeholder-page">
      <section className="admin-placeholder-card">
        <span className="role-brand-mark" aria-hidden="true">🐾</span>
        <p className="role-eyebrow">HUELLAS A CASA · ADMINISTRACIÓN</p>
        <h1>¡Bienvenido, administrador!</h1>
        <p>El acceso se realizó correctamente. En la siguiente etapa construiremos los controles del panel de administración.</p>
        <button className="role-primary-button" type="button" onClick={handleLogout}>Cerrar sesión</button>
      </section>
    </main>
  );
}

export default AdminPage;
