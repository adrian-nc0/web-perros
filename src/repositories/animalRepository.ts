import type { Animal, AnimalFormData } from "../types/animal";

const STORAGE_KEY = "huellas_animals";
const TABLE = "animals";
const BUCKET = "animal-photos";

const initialAnimals: Animal[] = [
  { id: 1, name: "Milo", type: "Perro", breed: "Mestizo/a", age: "2 años", size: "Mediano", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=900&q=85", story: "Curioso, cariñoso y siempre listo para una aventura.", tags: ["Sociable", "Energético"], healthCare: ["Desparasitación registrada", "Control veterinario realizado"] },
  { id: 2, name: "Luna", type: "Gato", breed: "Doméstico de pelo corto", age: "1 año", size: "Pequeño", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=85", story: "Una compañera tranquila que adora las siestas al sol.", tags: ["Tranquila", "Hogar"], healthCare: ["Vacunación registrada"] },
  { id: 3, name: "Bruno", type: "Perro", breed: "Pastor Alemán", age: "4 años", size: "Grande", location: "Sucre, Bolivia", image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCABuADMDASIAAhEBAxEB/8QAGgAAAQUBAAAAAAAAAAAAAAAABAABAgMFBv/EACsQAAICAgECBgAGAwAAAAAAAAECAAMEESESMQUTIjJBURQVYXGhsTOBkf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwAnw6wfjtA8MD8amnZ/kExsfNpbMrYBupjrZE2be4MCfxGMQ7RGAxkTJGMYEYo8UDkcRicne/byJ1th2qmcsMS2ixWYD1DkA9pu25lVHh9VrnuBoDueIBV2RVj1ddrhR/cVGRXkViyttqZymdnPl29R4UcKPoQjwbJarJCbJV+4gdPEYynYjmBGKKKBhZVoQE7AmRZdbaqI7EqnCj6nUNjUOvSaaz9FhuALZiY+U6PVUoQd+ne4E6PCguNX0UrazgFnbkD9ofTjeTtlrVGPcgQB/GX6dUVAgduYKvi+V16LKOexHEDb84rYobXJ1wYRuYFPiSWXs2RwToKRwBNRckdK6Zef5gFxSkWFhsa/7FAxsh8tVPXW1Y+zM29j5ps1vf3zOpyXFtDopHqXWiZzj45pJa9fSh+DwYA7ZLBent+0fyrQgsKnpPY6k8psfIVWprNbDgr8GTsuyMhKq0Uqq8DUAInXGzxCKFtsAFYYnegB3jthWvmeUqkdR2Cfgfc6LAx6sKjQ5Py33AAqOUK1DVOSOORFD7PEaVcjvqKBohUI4UQPxCjzKmAUEfI+5K3LSo9+foSv8alg10EwA/y7HrxrLE42vBPxAfDctcezot0VY8foZpZgstpKVIwB7giYn5ff5vsI/UwNyqgI72GxrCxOhvQAhHSLE6XPGuwMBqLFVX4X+TDEHSPV3+YDjHxgNClP9iKUtlPs9FRK/BigWjGrUes7k1qVPYoErDhOXMrfJazaoOIF1mXWnpJBaBXObHCJ7m/iQtoJPG+s/EKxMcUDqY7Y94F1FCV1hddpK06XjkfRiLgjg8Sh7gW4PAgP1gdyR+kUqN3POooFaqbW2x4l7MKx0Vr6v6jWuuOg6Rye0rQk+o9zAJpUKNsdtI2Ps6ErNh9olbXdA4EB36+3aQLIvHzBr8wjfECGQ9xI3of3APbKrViN9ooEKk17YoH/2Q==", story: "Noble y leal; busca una familia con mucho amor.", tags: ["Cariñoso", "Paseos"] },
  { id: 4, name: "Nala", type: "Gato", breed: "Mestizo/a", age: "3 años", size: "Mediano", location: "Sucre, Bolivia", image: "data:image/jpeg;base64,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", story: "Dulce e independiente, con un ronroneo inolvidable.", tags: ["Mimos", "Adaptable"], healthCare: ["Desparasitación registrada"] },
  { id: 5, name: "Toby", type: "Perro", breed: "Labrador Retriever", age: "8 meses", size: "Pequeño", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=85", story: "Un pequeño explorador que llenará tu casa de alegría.", tags: ["Cachorro", "Juguetón"], healthCare: ["Vacunación registrada", "Desparasitación registrada"] },
  { id: 6, name: "Simba", type: "Gato", breed: "Siamés", age: "2 años", size: "Mediano", location: "Sucre, Bolivia", image: "data:image/jpeg;base64,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", story: "Observador y afectuoso cuando gana confianza.", tags: ["Curioso", "Interior"] },
  { id: 7, name: "Canela", type: "Perro", breed: "Mestiza", age: "1 año", size: "Mediano", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85", story: "Amigable y juguetona; disfruta los paseos y conocer gente nueva.", tags: ["Juguetona", "Sociable"], healthCare: [] },
  { id: 8, name: "Pelusa", type: "Gato", breed: "Doméstico de pelo largo", age: "8 meses", size: "Pequeño", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=900&q=85", story: "Una gatita curiosa que busca un hogar paciente y lleno de cariño.", tags: ["Curiosa", "Cariñosa"], healthCare: [] },
  { id: 9, name: "Rocky", type: "Perro", breed: "Mestizo", age: "3 años", size: "Grande", location: "Sucre, Bolivia", image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCABTAG4DASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAAMBAgQFBv/EACsQAAICAQMDAwQCAwEAAAAAAAECAAMRBCExEkFREyJhBXGBoRSRUrHB4f/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABURAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIRAxEAPwDuSJMiVkQhCRRAwgSFGSQB5MgjMYtvZv7lCJXEo0hgeCITNGLwP3AqbRYSBnCnEjvGEqASoAPmVOSATjIhV0lxFAkjYxinIzAWRIMuRmUlQQhCQEVqBmlvjeNzE6tymlcqMkjA/MgQNatR6XBK9sSw1q2e2tT1eT2nMUtaTWFAbsZoqt9G119PI4B87w02072MQTxvmPJPTgHB8zPpGDiw+TmP7QzSq7X9Rkb3DOxxxNHUuOnIJ+ItFC8SegAkgbmVTEH6jFGIuriNgVlTzLSGlRSRJMiQEVqVD6dwW6RjOfEZMP1a7ooFY5fn7SDFWUdlK7EEE+7E0uayeqskOeOntOQumvdsqCR5WdbSoVr4Yt4O2YabNMMIzHHUTviNzM+n9mVPeP7QzVhLSFG0sJVFRjpjGppqY9dij8xqavTvxav5MBkDxIihqqDa1QtXrXkSouZEpdalSF2OwnO1GuNysmnsIbHgDEg323V1Y63C54nD+qXi+4tUcqFAEzik2Xn+Rc5I3yJFgAsUgkZ2B8QrXorHpUFcEHmbxcWwcjmcim51sYEr0/6mitrvUNeQw6u8iuiLQjFncIDwT3ma9qlb1H1lj+FGMSdRhUUsFYlgozwDiYNRRWx9yWIB3VdpUaz9UJrCVWEDON+Y2q52UjqJ/PM5HTQVKrlGHfuZo0jNX1DqyAdjA12XIGUWKcN53iXWnlQp+zdMYSloIcDng8f+RbaNTvXYV+CYV3eozNZodNY5dqV6jy3BlMnyf7hn5/cIz36NUUrSr5PcucTn2aTUgYzj7Ts5+ZBbHeBxDTqkR2sUkY58RdZ9TKscb53nYtsyrLgEEdzOQKbhaD6WVzvgjiA7VULRWtteSH2bvL6FX1DdbWMvwsdaM6H0xuwIIEZoCtYIYdP3kEa/PodGCxzz/wBnMFuqqOFDEfadhWFrEmpiBwSMZjhWv+CD8Sjz9j2XHL1NnyFlq0tQ5Xf4Kmd41qRjG3wJT+PX4MDmqXxg9Wdt+mTTZqgT11gjsc4M6S11rwoEsBnt+oEdlPnmVYkPgQhAuR7czOWJJBMIQFMMZlfEIQL4EnAyIQgalHAl+0IQK5JJlhvvCEAHMGAHAhCB/9k=", story: "Tranquilo y atento, ideal para una familia que disfrute compartir tiempo al aire libre.", tags: ["Tranquilo", "Compañero"], healthCare: [] },
  { id: 10, name: "Michi", type: "Gato", breed: "Doméstico de pelo corto", age: "2 años", size: "Pequeño", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=900&q=85", story: "Le encanta explorar rincones cómodos y descansar cerca de sus personas favoritas.", tags: ["Independiente", "Hogar"], healthCare: [] },
  { id: 11, name: "Max", type: "Perro", breed: "Labrador mestizo", age: "5 años", size: "Grande", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=85", story: "Un compañero noble que disfruta la compañía y los paseos tranquilos.", tags: ["Noble", "Paseos"], healthCare: [] },
  { id: 12, name: "Mora", type: "Gato", breed: "Mestiza", age: "1 año", size: "Pequeño", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=900&q=85", story: "Dulce y observadora, está lista para descubrir un nuevo hogar a su ritmo.", tags: ["Dulce", "Curiosa"], healthCare: [] },
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
        const normalized = parsed.map((animal) => {
          const sample = initialAnimals.find((demo) => demo.id === animal.id && demo.name === animal.name && demo.image === animal.image);
          return { ...animal, breed: animal.breed || "Mestizo/a", healthCare: animal.healthCare ?? sample?.healthCare ?? [] };
        });
        // Agrega los nuevos ejemplos una sola vez en navegadores que ya tenían el catálogo guardado.
        const photoSeedVersion = "huellas_real_photos_v1";
        if (!localStorage.getItem(photoSeedVersion)) {
          const photoById: Record<number, string> = { 3: initialAnimals[2].image, 4: initialAnimals[3].image, 6: initialAnimals[5].image, 9: initialAnimals[8].image };
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
