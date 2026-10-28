import type { Animal, AnimalFormData } from "../types/animal";

const STORAGE_KEY = "huellas_animals";
const TABLE = "animals";
const BUCKET = "animal-photos";

const initialAnimals: Animal[] = [
  { id: 1, name: "Milo", type: "Perro", breed: "Mestizo/a", age: "2 años", size: "Mediano", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=900&q=85", story: "Curioso, cariñoso y siempre listo para una aventura.", tags: ["Sociable", "Energético"], healthCare: ["Desparasitación registrada", "Control veterinario realizado"] },
  { id: 3, name: "Bruno", type: "Perro", breed: "Doberman en miniatura", age: "4 años", size: "Pequeño", location: "Sucre, Bolivia", image: "/images/download.jpg", story: "Noble y leal; ya realizó una consulta veterinaria y está desparasitado. Busca una familia con mucho amor.", tags: ["Cariñoso", "Paseos"], healthCare: ["Consulta veterinaria realizada", "Desparasitación realizada"] },
  { id: 4, name: "Nala", type: "Gato", breed: "Mestizo/a", age: "3 años", size: "Mediano", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=85", story: "Dulce e independiente, con un ronroneo inolvidable.", tags: ["Mimos", "Adaptable"], healthCare: ["Desparasitación registrada"] },
  { id: 5, name: "Toby", type: "Perro", breed: "Labrador Retriever", age: "1 año", size: "Mediano", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=85", story: "Un pequeño explorador que llenará tu casa de alegría.", tags: ["Cachorro", "Juguetón"], healthCare: ["Vacunación registrada", "Desparasitación registrada"] },
  { id: 6, name: "Simba", type: "Gato", breed: "Siamés", age: "2 años", size: "Mediano", location: "Sucre, Bolivia", image: "/images/dc2516a5-3ea6-4948-b344-01bccdf5ae1e.jpg", story: "Observador y afectuoso cuando gana confianza.", tags: ["Curioso", "Interior"] },
  { id: 7, name: "Canela", type: "Perro", breed: "Mestiza", age: "1 año", size: "Mediano", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85", story: "Amigable y juguetona; disfruta los paseos y conocer gente nueva.", tags: ["Juguetona", "Sociable"], healthCare: [] },
  { id: 9, name: "Rocky", type: "Perro", breed: "Mestizo", age: "3 años", size: "Grande", location: "Sucre, Bolivia", image: "/images/7fb44a67-49bc-4c5c-b9d5-564ddebc9d22.jpg", story: "Tranquilo y atento, ideal para una familia que disfrute compartir tiempo al aire libre.", tags: ["Tranquilo", "Compañero"], healthCare: [] },
  { id: 10, name: "Michi", type: "Gato", breed: "Doméstico de pelo corto", age: "2 años", size: "Pequeño", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=900&q=85", story: "Le encanta explorar rincones cómodos y descansar cerca de sus personas favoritas.", tags: ["Independiente", "Hogar"], healthCare: [] },
  { id: 11, name: "Max", type: "Perro", breed: "Labrador mestizo", age: "5 años", size: "Grande", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=85", story: "Un compañero noble que disfruta la compañía y los paseos tranquilos.", tags: ["Noble", "Paseos"], healthCare: [] },
  { id: 12, name: "Mora", type: "Gato", breed: "Mestiza", age: "1 año", size: "Pequeño", location: "Sucre, Bolivia", image: "/images/7d58b216-c792-4e55-ae6f-463fd29bf375.jpg", story: "Dulce y observadora, está lista para descubrir un nuevo hogar a su ritmo.", tags: ["Dulce", "Curiosa"], healthCare: [] },
  { id: 13, name: "Bobby", type: "Perro", breed: "Mestizo", age: "6 meses", size: "Pequeño", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f97?auto=format&fit=crop&w=900&q=85", story: "Un cachorro lleno de energía que necesita compañía, juegos y aprendizaje.", tags: ["Cachorro", "Activo"], healthCare: [] },
  { id: 14, name: "Nube", type: "Gato", breed: "Doméstico de pelo corto", age: "4 años", size: "Mediano", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?auto=format&fit=crop&w=900&q=85", story: "Serena y adaptable; sueña con una casa tranquila donde sentirse segura.", tags: ["Serena", "Adaptable"], healthCare: [] },
];

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const isCloudCatalogEnabled = Boolean(supabaseUrl && supabaseKey);

type AnimalRow = {
  id: number;
  name: string;
  type: Animal["type"];
  breed?: string;
  age: string;
  size: string;
  location: string;
  image: string;
  story: string;
  tags: string[];
  health_care?: string[];
};

function toAnimal(row: AnimalRow): Animal {
  return { ...row, breed: row.breed || "Mestizo/a", id: Number(row.id), tags: Array.isArray(row.tags) ? row.tags : [], healthCare: Array.isArray(row.health_care) ? row.health_care : [] };
}

function headers(extra: Record<string, string> = {}): Record<string, string> {
  if (!supabaseKey) throw new Error("Falta configurar VITE_SUPABASE_ANON_KEY.");
  return { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, ...extra };
}

async function cloudRequest(path: string, init: RequestInit = {}): Promise<Response> {
  if (!supabaseUrl || !supabaseKey) throw new Error("Falta configurar Supabase. Revisa el archivo .env.local y la guía de configuración.");
  const response = await fetch(`${supabaseUrl}${path}`, { ...init, headers: headers({ ...(init.headers as Record<string, string> | undefined) }) });
  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase respondió ${response.status}: ${details || response.statusText}`);
  }
  return response;
}

async function uploadPhoto(image: string): Promise<string> {
  if (!image.startsWith("data:image/")) return image;
  const [metadata] = image.split(",");
  const mimeType = metadata.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
  const extension = mimeType.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
  const blob = await (await fetch(image)).blob();
  const fileName = `${crypto.randomUUID()}.${extension}`;
  await cloudRequest(`/storage/v1/object/${BUCKET}/${fileName}`, {
    method: "POST",
    headers: { "Content-Type": mimeType, "x-upsert": "true" },
    body: blob,
  });
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${fileName}`;
}

function readLocal(): Animal[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Animal[];
      if (Array.isArray(parsed)) {
        let normalized = parsed.map((animal) => {
          const sample = initialAnimals.find((demo) => demo.id === animal.id && demo.name === animal.name && demo.image === animal.image);
          return { ...animal, breed: animal.breed || "Mestizo/a", healthCare: animal.healthCare ?? sample?.healthCare ?? [] };
        });
        // Elimina a Luna del catálogo guardado en navegadores que ya tenían datos anteriores.
        const lunaRemovalVersion = "huellas_remove_luna_v1";
        if (!localStorage.getItem(lunaRemovalVersion)) {
          normalized = normalized.filter((animal) => !(animal.id === 2 && animal.name === "Luna"));
          saveLocal(normalized);
          localStorage.setItem(lunaRemovalVersion, "true");
        }
        // Elimina a Pelusa de catálogos guardados en navegadores que ya tenían datos anteriores.
        const pelusaRemovalVersion = "huellas_remove_pelusa_v1";
        if (!localStorage.getItem(pelusaRemovalVersion)) {
          normalized = normalized.filter((animal) => !(animal.id === 8 && animal.name === "Pelusa"));
          saveLocal(normalized);
          localStorage.setItem(pelusaRemovalVersion, "true");
        }
        // Actualiza la edad y el tamaño de Toby en catálogos guardados previamente.
        const tobyUpdateVersion = "huellas_update_toby_v1";
        if (!localStorage.getItem(tobyUpdateVersion)) {
          normalized = normalized.map((animal) => animal.id === 5 && animal.name === "Toby" ? { ...animal, age: "1 año", size: "Mediano" } : animal);
          saveLocal(normalized);
          localStorage.setItem(tobyUpdateVersion, "true");
        }
        // Agrega los nuevos ejemplos una sola vez en navegadores que ya tenían el catálogo guardado.
        const photoSeedVersion = "huellas_real_photos_v3";
        if (!localStorage.getItem(photoSeedVersion)) {
          const photoById: Record<number, string> = { 3: initialAnimals[2].image, 6: initialAnimals[5].image, 9: initialAnimals[8].image, 12: initialAnimals[11].image };
          const withPhotos = normalized.map((animal) => photoById[animal.id] ? { ...animal, image: photoById[animal.id] } : animal);
          saveLocal(withPhotos);
          localStorage.setItem(photoSeedVersion, "true");
          return withPhotos;
        }
        const seedVersion = "huellas_animals_seed_v2";
        if (!localStorage.getItem(seedVersion)) {
          const existingIds = new Set(normalized.map((animal) => animal.id));
          const additions = initialAnimals.filter((animal) => animal.id >= 7 && !existingIds.has(animal.id));
          const migrated = [...normalized, ...additions];
          saveLocal(migrated);
          localStorage.setItem(seedVersion, "true");
          return migrated;
        }
        return normalized;
      }
    }
  } catch {
    // El almacenamiento local puede estar bloqueado por el navegador.
  }
  return initialAnimals;
}

function saveLocal(animals: Animal[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(animals));
}

export const animalRepository = {
  async getAll(): Promise<Animal[]> {
    if (!isCloudCatalogEnabled) return readLocal();
    const response = await cloudRequest(`/rest/v1/${TABLE}?select=*&order=id.asc`);
    const rows = await response.json() as AnimalRow[];
    return rows.map(toAnimal);
  },

  async create(data: AnimalFormData): Promise<Animal> {
    if (!isCloudCatalogEnabled) {
      const animals = readLocal();
      const id = animals.reduce((max, animal) => Math.max(max, animal.id), 0) + 1;
      const newAnimal: Animal = { ...data, id };
      saveLocal([...animals, newAnimal]);
      return newAnimal;
    }
    const { healthCare, ...animalData } = data;
    const row = { ...animalData, health_care: healthCare ?? [], image: await uploadPhoto(data.image) };
    const response = await cloudRequest(`/rest/v1/${TABLE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(row),
    });
    const rows = await response.json() as AnimalRow[];
    if (!rows[0]) throw new Error("La mascota se guardó, pero Supabase no devolvió su registro.");
    return toAnimal(rows[0]);
  },

  async update(updatedAnimal: Animal): Promise<void> {
    if (!isCloudCatalogEnabled) {
      saveLocal(readLocal().map((animal) => animal.id === updatedAnimal.id ? updatedAnimal : animal));
      return;
    }
    const { id, healthCare, ...data } = updatedAnimal;
    const row = { ...data, health_care: healthCare ?? [], image: await uploadPhoto(data.image) };
    await cloudRequest(`/rest/v1/${TABLE}?id=eq.${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(row),
    });
  },

  async remove(id: number): Promise<void> {
    if (!isCloudCatalogEnabled) {
      saveLocal(readLocal().filter((animal) => animal.id !== id));
      return;
    }
    await cloudRequest(`/rest/v1/${TABLE}?id=eq.${id}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
  },
};
