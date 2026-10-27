import type { Animal, AnimalFormData } from "../types/animal";

const STORAGE_KEY = "huellas_animals";
const TABLE = "animals";
const BUCKET = "animal-photos";

const initialAnimals: Animal[] = [
  { id: 1, name: "Milo", type: "Perro", age: "2 años", size: "Mediano", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=900&q=85", story: "Curioso, cariñoso y siempre listo para una aventura.", tags: ["Sociable", "Energético"], healthCare: ["Desparasitación registrada", "Control veterinario realizado"] },
  { id: 2, name: "Luna", type: "Gato", age: "1 año", size: "Pequeño", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=85", story: "Una compañera tranquila que adora las siestas al sol.", tags: ["Tranquila", "Hogar"], healthCare: ["Vacunación registrada"] },
  { id: 3, name: "Bruno", type: "Perro", age: "4 años", size: "Grande", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=85", story: "Noble y leal; busca una familia con mucho amor.", tags: ["Cariñoso", "Paseos"] },
  { id: 4, name: "Nala", type: "Gato", age: "3 años", size: "Mediano", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=85", story: "Dulce e independiente, con un ronroneo inolvidable.", tags: ["Mimos", "Adaptable"], healthCare: ["Desparasitación registrada"] },
  { id: 5, name: "Toby", type: "Perro", age: "8 meses", size: "Pequeño", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=85", story: "Un pequeño explorador que llenará tu casa de alegría.", tags: ["Cachorro", "Juguetón"], healthCare: ["Vacunación registrada", "Desparasitación registrada"] },
  { id: 6, name: "Simba", type: "Gato", age: "2 años", size: "Mediano", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=85", story: "Observador y afectuoso cuando gana confianza.", tags: ["Curioso", "Interior"] },
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
      if (Array.isArray(parsed)) return parsed.map((animal) => {
        const sample = initialAnimals.find((demo) => demo.id === animal.id && demo.name === animal.name && demo.image === animal.image);
        return { ...animal, breed: animal.breed || "Mestizo/a", healthCare: animal.healthCare ?? sample?.healthCare ?? [] };
      });
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
