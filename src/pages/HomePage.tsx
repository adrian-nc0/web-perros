import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import { animalRepository } from "../repositories/animalRepository";
import type { Animal } from "../types/animal";

const WHATSAPP_NUMBER = "59157956302";

const handleWhatsApp = (animal: Animal, message: string) => {
  const text = `Hola, estoy interesado/a en adoptar a ${animal.name}, ${animal.type.toLowerCase()} de ${animal.location}.

${message}

Me gustaría recibir más información sobre su proceso de adopción. Gracias.`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

function HomePage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [catalogError, setCatalogError] = useState("");

  useEffect(() => {
    let active = true;
    const refreshCatalog = async () => {
      try {
        const currentAnimals = await animalRepository.getAll();
        if (active) {
          setAnimals(currentAnimals);
          setCatalogError("");
        }
      } catch (error) {
        if (active) setCatalogError(error instanceof Error ? error.message : "No se pudo cargar el catálogo compartido.");
      }
    };
    void refreshCatalog();
    const interval = window.setInterval(() => void refreshCatalog(), 10000);
    return () => { active = false; window.clearInterval(interval); };
  }, []);
  const [filter, setFilter] = useState<"Todos" | Animal["type"]>("Todos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Animal | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [request, setRequest] = useState({
    personName: "", personPhone: "", animalName: "", type: "Perro", sex: "No sé",
    age: "No sé", size: "No sé", location: "Sucre, Bolivia", situation: "Rescatado",
    story: "", tags: "", vaccinated: "No sé", dewormed: "No sé",
    sterilized: "No sé", vetChecked: "No sé", extra: "",
  });
  const submitAnimalRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = `Hola, quiero solicitar que publiquen una mascota en Huellas a Casa.

DATOS DE CONTACTO
Nombre: ${request.personName}
Teléfono: ${request.personPhone}

DATOS DE LA MASCOTA
Nombre: ${request.animalName || "Sin nombre"}
Especie: ${request.type}
Sexo: ${request.sex}
Edad aproximada: ${request.age}
Tamaño: ${request.size}
Ubicación: ${request.location}
Situación: ${request.situation}
Historia: ${request.story}
Características: ${request.tags || "No especificadas"}

SALUD Y CUIDADOS
Vacunación: ${request.vaccinated}
Desparasitación: ${request.dewormed}
Esterilización: ${request.sterilized}
Revisión veterinaria: ${request.vetChecked}
Información adicional: ${request.extra || "Ninguna"}

Por favor, indícame cómo enviarte fotografías y cualquier información que falte para revisar su publicación.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setRequestOpen(false);
  };
  const visibleAnimals = useMemo(() => animals.filter((animal) => (filter === "Todos" || animal.type === filter) && `${animal.name} ${animal.location} ${animal.story} ${animal.tags.join(" ")}`.toLocaleLowerCase().includes(search.toLocaleLowerCase())), [animals, filter, search]);

  const handleLogout = () => { authRepository.logout(); navigate("/", { replace: true }); };
  const openAdoption = (animal: Animal) => { setSelected(animal); };

  return (
    <main className="home-page">
      <header className="site-header"><a className="logo" href="#inicio" aria-label="Huellas a casa, inicio"><span>🐾</span>Huellas <em>a casa</em></a><nav aria-label="Navegación principal"><a href="#adoptar">Adoptar</a><a href="#como-funciona">Cómo funciona</a><a href="#impacto">Nuestro impacto</a></nav><div className="header-actions"><button className="user-menu" type="button" onClick={handleLogout} title="Cerrar sesión">{user?.name.split(" ")[0] ?? "Perfil"} <b>⌄</b></button></div></header>
      <section className="hero" id="inicio"><div className="hero-copy"><p className="section-kicker">ADOPTA, CUIDA, TRANSFORMA</p><h1>Tu próximo mejor amigo <i>te está esperando.</i></h1><p>Conectamos perros y gatos que necesitan un hogar con familias de Sucre, Bolivia, dispuestas a cambiarles la vida para siempre.</p><div className="hero-actions"><a className="primary-button" href="#adoptar">Conocer animales <span>→</span></a><a className="text-button" href="#como-funciona">¿Cómo funciona? <span>↗</span></a></div><div className="hero-people"><button className="request-animal-button" type="button" onClick={() => setRequestOpen(true)}>＋ Solicitar registro de animales <span>→</span></button></div></div><div className="hero-image"><img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=90" alt="Dos perros felices junto a su familia" /><div className="adoption-note"><span>♥</span><p><strong>Una historia a la vez</strong><br />El amor siempre encuentra el camino.</p></div></div></section>
      <section className="animal-section" id="adoptar"><div className="section-heading"><div><p className="section-kicker">ENCUENTRA TU COMPAÑERO</p><h2>Alguien especial espera por ti.</h2><p className="section-description">Cada uno tiene una historia. Quizá la próxima sea contigo.</p></div><label className="search-box"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, ubicación o característica" aria-label="Buscar animales por nombre, ubicación o característica" /></label></div><div className="animal-toolbar"><div className="filters" role="group" aria-label="Filtrar por tipo">{(["Todos", "Perro", "Gato"] as const).map((item) => <button key={item} className={filter === item ? "active" : ""} type="button" onClick={() => setFilter(item)}>{item === "Todos" ? "Todos" : `${item === "Perro" ? "🐶" : "🐱"} ${item}s`}</button>)}</div><p>{visibleAnimals.length} amigos esperando un hogar</p></div>{catalogError && <p className="empty-state" role="alert">No se pudo actualizar el catálogo: {catalogError}</p>}<div className="animal-grid">{visibleAnimals.map((animal) => <article className="animal-card" key={animal.id} role="button" tabIndex={0} aria-label={`Ver ficha de ${animal.name}`} onClick={() => openAdoption(animal)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openAdoption(animal); } }}><div className="animal-photo"><img src={animal.image} alt={`Foto de ${animal.name}`} loading="lazy" decoding="async" /><span>{animal.type}</span></div><div className="animal-info"><div><h3>{animal.name}</h3><p>{animal.age} · {animal.size}</p></div><small>⌖ {animal.location}</small><p className="animal-story">{animal.story}</p><div className="tag-row">{animal.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><button className="meet-button" type="button" onClick={(event) => { event.stopPropagation(); openAdoption(animal); }}>Ver ficha completa <span>→</span></button></div></article>)}</div>{visibleAnimals.length === 0 && <p className="empty-state">No encontramos amigos con esa búsqueda. Prueba con otro nombre o ciudad.</p>}</section>
      <section className="how-section" id="como-funciona"><div><p className="section-kicker">UN CAMINO A CASA</p><h2>Adoptar es más sencillo de lo que imaginas.</h2></div><div className="steps"><article><b>01</b><span>⌕</span><h3>Encuentra</h3><p>Conoce a los animales y descubre quién encaja contigo.</p></article><article><b>02</b><span>♡</span><h3>Conecta</h3><p>Envía tu solicitud y habla con el refugio responsable.</p></article><article><b>03</b><span>⌂</span><h3>Bienvenido a casa</h3><p>Prepárate para comenzar una historia que lo cambia todo.</p></article></div></section>
      <section className="impact-section" id="impacto"><div><p className="section-kicker">JUNTOS HACEMOS MÁS</p><h2>Un hogar cambia<br />una vida. Y la tuya también.</h2><a className="primary-button" href="#adoptar">Dar el primer paso <span>→</span></a></div><div className="impact-stats"><p><strong>2.400+</strong> adopciones felices</p><p><strong>38</strong> refugios aliados</p><p><strong>96%</strong> de familias satisfechas</p></div></section>
      <footer><a className="logo" href="#inicio"><span>🐾</span>Huellas <em>a casa</em></a><p>Hecho con amor para dar segundas oportunidades.</p><button type="button" onClick={handleLogout}>Cerrar sesión</button></footer>
      {selected && <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}><section className="adoption-modal animal-detail-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setSelected(null)} aria-label="Cerrar">×</button><img src={selected.image} alt={`Foto de ${selected.name}`} decoding="async" /><div className="animal-detail-content"><p className="section-kicker">FICHA DE PRESENTACIÓN</p><h2 id="modal-title">{selected.name}</h2><p className="animal-detail-type">{selected.type} · {selected.age} · Tamaño {selected.size}</p><p className="animal-detail-location">⌖ {selected.location}, Bolivia</p><p>{selected.story}</p><div className="tag-row">{selected.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>{(selected.healthCare?.length ?? 0) > 0 ? <div className="animal-health-info"><h3>Salud y cuidados</h3><ul>{selected.healthCare?.map((care) => <li key={care}>✓ {care}</li>)}</ul></div> : <p className="animal-health-pending">No hay cuidados veterinarios confirmados registrados.</p>}<button className="primary-button" type="button" onClick={() => handleWhatsApp(selected, `Me gustaría recibir más información sobre ${selected.name} y conocer los requisitos para su adopción.`)}>Consultar por WhatsApp <span>→</span></button><button className="detail-back-button" type="button" onClick={() => setSelected(null)}>Volver al catálogo</button></div></section></div>}
    
      {requestOpen && <div className="modal-backdrop request-modal-backdrop" role="presentation" onMouseDown={() => setRequestOpen(false)}><section className="adoption-modal animal-request-modal" role="dialog" aria-modal="true" aria-labelledby="request-modal-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setRequestOpen(false)} aria-label="Cerrar formulario">×</button><div className="animal-request-content"><p className="section-kicker">AYÚDANOS A DARLE UN HOGAR</p><h2 id="request-modal-title">Solicitar registro de animales</h2><p>Cuéntanos sobre el perro o gato encontrado, rescatado o que necesita un hogar. Tu solicitud se enviará por WhatsApp al administrador para revisar la publicación. No se publicará automáticamente.</p><form className="animal-request-form" onSubmit={submitAnimalRequest}><h3>Tu información de contacto</h3><label>Nombre completo<input required maxLength={100} value={request.personName} onChange={(event) => setRequest({ ...request, personName: event.target.value })} placeholder="¿Cómo te llamas?" /></label><label>Teléfono de contacto<input required type="tel" maxLength={30} value={request.personPhone} onChange={(event) => setRequest({ ...request, personPhone: event.target.value })} placeholder="Tu número de teléfono" /></label><h3>Datos de la mascota</h3><label>Nombre de la mascota (si tiene)<input maxLength={80} value={request.animalName} onChange={(event) => setRequest({ ...request, animalName: event.target.value })} placeholder="Ej. Luna o sin nombre" /></label><div className="animal-request-grid"><label>Especie<select value={request.type} onChange={(event) => setRequest({ ...request, type: event.target.value })}><option>Perro</option><option>Gato</option></select></label><label>Sexo<select value={request.sex} onChange={(event) => setRequest({ ...request, sex: event.target.value })}><option>No sé</option><option>Macho</option><option>Hembra</option></select></label><label>Edad aproximada<input required value={request.age} onChange={(event) => setRequest({ ...request, age: event.target.value })} placeholder="Ej. 6 meses o no sé" /></label><label>Tamaño<select value={request.size} onChange={(event) => setRequest({ ...request, size: event.target.value })}><option>No sé</option><option>Pequeño</option><option>Mediano</option><option>Grande</option></select></label><label>¿Cómo llegó a ti?<select value={request.situation} onChange={(event) => setRequest({ ...request, situation: event.target.value })}><option>Encontrado</option><option>Rescatado</option><option>Lo tengo a mi cuidado</option><option>Busco hogar para mi mascota</option></select></label><label>Ubicación<input required value={request.location} onChange={(event) => setRequest({ ...request, location: event.target.value })} placeholder="Barrio o zona, ciudad" /></label></div><label>Historia y descripción<textarea required minLength={10} rows={4} value={request.story} onChange={(event) => setRequest({ ...request, story: event.target.value })} placeholder="Dónde lo encontraste, cómo se comporta, cómo está y qué necesita..." /></label><label>Características<input value={request.tags} onChange={(event) => setRequest({ ...request, tags: event.target.value })} placeholder="Ej. cariñoso, tranquilo, sociable" /></label><h3>Salud y cuidados</h3><p className="request-help">Si no tienes la información, elige “No sé”. No marques cuidados como realizados si no están confirmados.</p><div className="animal-request-grid"><label>Vacunación<select value={request.vaccinated} onChange={(event) => setRequest({ ...request, vaccinated: event.target.value })}><option>No sé</option><option>Sí</option><option>No</option><option>Parcial / incompleta</option></select></label><label>Desparasitación<select value={request.dewormed} onChange={(event) => setRequest({ ...request, dewormed: event.target.value })}><option>No sé</option><option>Sí</option><option>No</option></select></label><label>Esterilización<select value={request.sterilized} onChange={(event) => setRequest({ ...request, sterilized: event.target.value })}><option>No sé</option><option>Sí</option><option>No</option></select></label><label>Revisión veterinaria<select value={request.vetChecked} onChange={(event) => setRequest({ ...request, vetChecked: event.target.value })}><option>No sé</option><option>Sí</option><option>No</option></select></label></div><label>Otra información importante<textarea rows={2} value={request.extra} onChange={(event) => setRequest({ ...request, extra: event.target.value })} placeholder="Necesidades conocidas, medicación, cuidados especiales..." /></label><p className="request-help">Al enviar, se abrirá WhatsApp con los datos. Después, adjunta allí una o varias fotos claras de la mascota.</p><div className="animal-request-actions"><button className="detail-back-button" type="button" onClick={() => setRequestOpen(false)}>Cancelar</button><button className="primary-button" type="submit">Enviar solicitud por WhatsApp <span>→</span></button></div></form></div></section></div>}

      </main>
  );
}

export default HomePage;
