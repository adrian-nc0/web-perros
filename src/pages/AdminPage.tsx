import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import { animalRepository, isCloudCatalogEnabled } from "../repositories/animalRepository";
import type { Animal, AnimalFormData, AnimalType } from "../types/animal";

type AdminSection = "resumen" | "mascotas";

const emptyForm: AnimalFormData = {
  name: "",
  type: "Perro",
  age: "",
  size: "Mediano",
  location: "Sucre, Bolivia",
  image: "",
  story: "",
  tags: [],
  healthCare: [],
};

function AdminPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();
  const [section, setSection] = useState<AdminSection>("resumen");
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [catalogError, setCatalogError] = useState("");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AnimalFormData>(emptyForm);
  const [notice, setNotice] = useState("");
  const [isDraggingImage, setIsDraggingImage] = useState(false);

  const dogs = animals.filter((animal) => animal.type === "Perro").length;
  const cats = animals.filter((animal) => animal.type === "Gato").length;
  const filteredAnimals = useMemo(
    () => animals.filter((animal) => `${animal.name} ${animal.type}`.toLowerCase().includes(search.toLowerCase())),
    [animals, search],
  );

  const refreshAnimals = async () => {
    try {
      setAnimals(await animalRepository.getAll());
      setCatalogError("");
    } catch (error) {
      setCatalogError(error instanceof Error ? error.message : "No se pudo conectar con el catálogo compartido.");
    }
  };

  useEffect(() => {
    void refreshAnimals();
    const interval = window.setInterval(() => void refreshAnimals(), 10000);
    return () => window.clearInterval(interval);
  }, []);

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  const openNewForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setFormOpen(true);
    setNotice("");
  };

  const openEditForm = (animal: Animal) => {
    setEditingId(animal.id);
    setForm({
      name: animal.name,
      type: animal.type,
      age: animal.age,
      size: animal.size,
      location: animal.location,
      image: animal.image,
      story: animal.story,
      tags: animal.tags,
      healthCare: animal.healthCare ?? [],
    });
    setFormOpen(true);
    setNotice("");
  };

  const handleImageFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setNotice("Selecciona un archivo de imagen válido.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setNotice("La foto debe pesar menos de 2 MB. Prueba una imagen más pequeña.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      const photo = new Image();
      photo.onload = () => {
        const maxDimension = 1000;
        const scale = Math.min(1, maxDimension / Math.max(photo.width, photo.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(photo.width * scale));
        canvas.height = Math.max(1, Math.round(photo.height * scale));
        const context = canvas.getContext("2d");
        if (!context) {
          setNotice("No se pudo procesar la foto. Intenta con otro archivo.");
          return;
        }
        context.drawImage(photo, 0, 0, canvas.width, canvas.height);
        setForm((previous) => ({ ...previous, image: canvas.toDataURL("image/jpeg", 0.78) }));
        setNotice("");
      };
      photo.onerror = () => setNotice("No se pudo abrir la imagen. Intenta con otra foto.");
      photo.src = reader.result;
    };
    reader.onerror = () => setNotice("No se pudo leer la foto. Intenta con otro archivo.");
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData: AnimalFormData = {
      ...form,
      name: form.name.trim(),
      age: form.age.trim(),
      location: form.location.trim(),
      image: form.image.trim(),
      story: form.story.trim(),
      tags: Array.isArray(form.tags) ? form.tags : [],
    };

    try {
      if (editingId !== null) {
        await animalRepository.update({ ...formData, id: editingId });
        setNotice("Los datos de la mascota se actualizaron.");
      } else {
        await animalRepository.create(formData);
        setNotice("La mascota se registró correctamente.");
      }
      await refreshAnimals();
      setFormOpen(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No se pudo guardar la mascota. Revisa la conexión con la base de datos.");
    }
  };

  const handleDelete = async (animal: Animal) => {
    if (!window.confirm(`¿Seguro que quieres eliminar a ${animal.name} del catálogo?`)) return;
    try {
      await animalRepository.remove(animal.id);
      await refreshAnimals();
      setNotice(`${animal.name} fue eliminado del catálogo.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No se pudo eliminar la mascota.");
    }
  };

  const handleLogout = () => {
    authRepository.logout();
    navigate("/", { replace: true });
  };

  return (
    <main className="admin-dashboard">
      <aside className="admin-sidebar">
        <a className="admin-logo" href="/" onClick={(event) => { event.preventDefault(); navigate("/"); }}>
          <span>🐾</span><strong>Huellas <em>a Casa</em></strong>
        </a>
        <p className="admin-side-label">MENÚ PRINCIPAL</p>
        <nav className="admin-nav" aria-label="Menú de administración">
          <button className={section === "resumen" ? "active" : ""} onClick={() => { setSection("resumen"); setFormOpen(false); }}><span>▦</span> Resumen</button>
          <button className={section === "mascotas" ? "active" : ""} onClick={() => { setSection("mascotas"); setFormOpen(false); }}><span>🐾</span> Mascotas <small>{animals.length}</small></button>
        </nav>
        <div className="admin-sidebar-bottom">
          <div className="admin-user-avatar">A</div>
          <div className="admin-user-info"><strong>{user.name}</strong><small>Administrador</small></div>
          <button className="admin-logout-icon" onClick={handleLogout} aria-label="Cerrar sesión" title="Cerrar sesión">↪</button>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div><p className="admin-breadcrumb">HUELLAS A CASA <span>/</span> ADMINISTRACIÓN</p><h1>{section === "resumen" ? "Panel de control" : "Gestión de mascotas"}</h1></div>
          <div className="admin-topbar-right"><span className="admin-live-dot" /> <span>Sucre, Bolivia</span><button onClick={handleLogout}>Cerrar sesión ↗</button></div>
        </header>

        {catalogError && <div className="admin-notice" role="alert"><span>!</span>{catalogError}<button onClick={() => setCatalogError("")} aria-label="Cerrar aviso">×</button></div>}
        {notice && <div className="admin-notice" role="status"><span>✓</span>{notice}<button onClick={() => setNotice("")} aria-label="Cerrar aviso">×</button></div>}

        {section === "resumen" && (
          <div className="admin-content">
            <div className="admin-welcome">
              <div><p>HOLA, {user.name.toUpperCase()} 👋</p><h2>Hoy es un buen día para<br />encontrar un hogar.</h2><span>Administra los perfiles de mascotas de tu comunidad.</span></div>
              <div className="admin-welcome-art" aria-hidden="true"><span>☀</span><strong>🐶</strong><strong>🐱</strong><i>♡</i></div>
            </div>
            <div className="admin-section-heading"><div><h2>Vista general</h2><p>Un resumen del catálogo actual.</p></div><button className="admin-primary-button" onClick={() => { setSection("mascotas"); openNewForm(); }}>＋ Registrar mascota</button></div>
            <div className="admin-stat-grid">
              <article className="admin-stat-card"><span className="admin-stat-icon green">🐾</span><div><p>Mascotas en catálogo</p><strong>{animals.length}</strong><small>Perfiles compartidos en el catálogo</small></div></article>
              <article className="admin-stat-card"><span className="admin-stat-icon peach">🐶</span><div><p>Perros</p><strong>{dogs}</strong><small>En búsqueda de una familia</small></div></article>
              <article className="admin-stat-card"><span className="admin-stat-icon yellow">🐱</span><div><p>Gatos</p><strong>{cats}</strong><small>En búsqueda de una familia</small></div></article>
            </div>
            <div className="admin-section-heading admin-recent-heading"><div><h2>Últimas mascotas</h2><p>Perfiles disponibles en el catálogo.</p></div><button className="admin-text-button" onClick={() => setSection("mascotas")}>Ver todas →</button></div>
            <div className="admin-recent-list">
              {animals.slice(-4).reverse().map((animal) => <article key={animal.id} className="admin-recent-item"><img src={animal.image} alt={animal.name} /><div><strong>{animal.name}</strong><small>{animal.type} · {animal.age}</small></div><span className="admin-status-pill">En catálogo</span><button onClick={() => { setSection("mascotas"); openEditForm(animal); }} aria-label={`Editar a ${animal.name}`}>✎</button></article>)}
              {animals.length === 0 && <p className="admin-empty">Todavía no hay mascotas registradas.</p>}
            </div>
            <p className="admin-demo-note">Nota: los perfiles iniciales son datos de demostración. Reemplázalos por información real y autorizada antes de publicar el sistema.</p>
          </div>
        )}

        {section === "mascotas" && (
          <div className="admin-content">
            <div className="admin-section-heading admin-list-heading"><div><h2>Catálogo de mascotas</h2><p>Registra y actualiza los perfiles que se muestran a los adoptantes.</p></div><button className="admin-primary-button" onClick={openNewForm}>＋ Nueva mascota</button></div>
            <div className="admin-table-tools"><label><span aria-hidden="true">⌕</span><input aria-label="Buscar mascotas por nombre o especie" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre o especie..." /></label><span>{filteredAnimals.length} resultados</span></div>

            {formOpen && <form className="admin-animal-form" onSubmit={handleSubmit}>
              <div className="admin-form-heading"><div><p>{editingId !== null ? "ACTUALIZAR PERFIL" : "NUEVO PERFIL"}</p><h3>{editingId !== null ? "Editar mascota" : "Registrar una mascota"}</h3></div><button type="button" onClick={() => setFormOpen(false)} aria-label="Cerrar formulario">×</button></div>
              <div className="admin-form-grid">
                <label>Nombre<input required maxLength={50} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ej. Canela" /></label>
                <label>Especie<select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as AnimalType })}><option>Perro</option><option>Gato</option></select></label>
                <label>Edad aproximada<input required value={form.age} onChange={(event) => setForm({ ...form, age: event.target.value })} placeholder="Ej. 1 año" /></label>
                <label>Tamaño<select value={form.size} onChange={(event) => setForm({ ...form, size: event.target.value })}><option>Pequeño</option><option>Mediano</option><option>Grande</option></select></label>
                <div className="wide admin-photo-field">
                  <span className="admin-photo-label">Fotografía de la mascota</span>
                  <label
                    className={`admin-photo-dropzone ${isDraggingImage ? "dragging" : ""} ${form.image ? "has-image" : ""}`}
                    onDragOver={(event) => { event.preventDefault(); setIsDraggingImage(true); }}
                    onDragLeave={() => setIsDraggingImage(false)}
                    onDrop={(event) => { event.preventDefault(); setIsDraggingImage(false); handleImageFile(event.dataTransfer.files[0]); }}
                  >
                    {form.image ? <img className="admin-photo-preview" src={form.image} alt="Vista previa de la mascota" /> : <span className="admin-photo-placeholder">📷</span>}
                    <span className="admin-photo-instructions"><strong>{form.image ? "Cambiar fotografía" : "Arrastra la foto aquí"}</strong><small>o haz clic para elegir una imagen de tu dispositivo</small><small>JPG, PNG o WEBP · máximo 2 MB</small></span>
                    <input className="admin-photo-input" required={!form.image} type="file" accept="image/*" onChange={(event) => { handleImageFile(event.target.files?.[0]); event.currentTarget.value = ""; }} />
                  </label>
                  {form.image && <button type="button" className="admin-remove-photo" onClick={() => setForm({ ...form, image: "" })}>Quitar fotografía</button>}
                </div>
                <label className="wide">Historia o descripción<textarea required minLength={10} rows={3} value={form.story} onChange={(event) => setForm({ ...form, story: event.target.value })} placeholder="Describe su personalidad y lo que necesita..." /></label>
                <fieldset className="wide admin-health-field"><legend>Salud y cuidados registrados</legend><p>Marca solo los cuidados que estén confirmados en la cartilla o por el veterinario.</p>{["Vacunación registrada", "Desparasitación registrada", "Esterilización registrada", "Control veterinario realizado"].map((care) => <label key={care}><input type="checkbox" checked={(form.healthCare ?? []).includes(care)} onChange={(event) => setForm((previous) => ({ ...previous, healthCare: event.target.checked ? [...(previous.healthCare ?? []), care] : (previous.healthCare ?? []).filter((item) => item !== care) }))} />{care}</label>)}</fieldset>
                <label className="wide">Características (separadas por coma)<input value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })} placeholder="Cariñoso, Juguetón" /></label>
              </div>
              <div className="admin-form-actions"><button type="button" className="admin-cancel-button" onClick={() => setFormOpen(false)}>Cancelar</button><button type="submit" className="admin-primary-button">{editingId !== null ? "Guardar cambios" : "Registrar mascota"}</button></div>
            </form>}

            <div className="admin-animal-table">
              <div className="admin-table-head"><span>MASCOTA</span><span>ESPECIE</span><span>EDAD</span><span>TAMAÑO</span><span>ACCIONES</span></div>
              {filteredAnimals.map((animal) => <article className="admin-table-row" key={animal.id}><div className="admin-table-animal"><img src={animal.image} alt={`Foto de ${animal.name}`} loading="lazy" decoding="async" /><div><strong>{animal.name}</strong><small>{animal.location}</small></div></div><span data-label="Especie"><i className={animal.type === "Perro" ? "species-dot dog" : "species-dot cat"} />{animal.type}</span><span data-label="Edad">{animal.age}</span><span data-label="Tamaño">{animal.size}</span><div className="admin-row-actions" data-label="Acciones"><button onClick={() => openEditForm(animal)} aria-label={`Editar a ${animal.name}`} title="Editar">✎</button><button className="delete" onClick={() => handleDelete(animal)} aria-label={`Eliminar a ${animal.name}`} title="Eliminar">⌫</button></div></article>)}
              {filteredAnimals.length === 0 && <p className="admin-empty">No se encontraron mascotas. Prueba otra búsqueda o registra una nueva.</p>}
            </div>
            <p className="admin-demo-note">{isCloudCatalogEnabled ? "El catálogo está configurado para usar Supabase. Comprueba que la conexión y los permisos estén activos para compartir cambios entre dispositivos." : "Modo local: los cambios se guardan en este navegador y no se sincronizan con otros dispositivos. Para compartir el catálogo, configura Supabase."}</p>
          </div>
        )}

      </section>
    </main>
  );
}

export default AdminPage;
