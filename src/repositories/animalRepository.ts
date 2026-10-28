import type { Animal, AnimalFormData } from "../types/animal";

const STORAGE_KEY = "huellas_animals";
const initialAnimals: Animal[] = [
  { id: 1, name: "Milo", type: "Perro", sex: "Macho", breed: "Mestizo/a", age: "2 años", size: "Mediano", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=900&q=85", story: "Curioso, cariñoso y siempre listo para una aventura.", tags: ["Sociable", "Energético"], healthCare: ["Desparasitación registrada", "Control veterinario realizado"] },
  { id: 3, name: "Bruno", type: "Perro", sex: "Macho", breed: "Doberman en miniatura", age: "4 años", size: "Pequeño", location: "Sucre, Bolivia", image: "/images/download.jpg", story: "Noble y leal; ya realizó una consulta veterinaria y está desparasitado. Busca una familia con mucho amor.", tags: ["Cariñoso", "Paseos"], healthCare: ["Consulta veterinaria realizada", "Desparasitación realizada"] },
  { id: 4, name: "Nala", type: "Gato", sex: "Hembra", breed: "Mestizo/a", age: "3 años", size: "Mediano", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=85", story: "Dulce e independiente, con un ronroneo inolvidable.", tags: ["Mimos", "Adaptable"], healthCare: ["Desparasitación registrada"] },
  { id: 5, name: "Toby", type: "Perro", sex: "Macho", breed: "Labrador Retriever", age: "1 año", size: "Mediano", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=85", story: "Un pequeño explorador que llenará tu casa de alegría.", tags: ["Cachorro", "Juguetón"], healthCare: ["Vacunación registrada", "Desparasitación registrada"] },
  { id: 6, name: "Simba", type: "Gato", sex: "Macho", breed: "Siamés", age: "2 años", size: "Mediano", location: "Sucre, Bolivia", image: "/images/dc2516a5-3ea6-4948-b344-01bccdf5ae1e.jpg", story: "Observador y afectuoso cuando gana confianza.", tags: ["Curioso", "Interior"] },
  { id: 7, name: "Canela", type: "Perro", sex: "Hembra", breed: "Mestiza", age: "1 año", size: "Mediano", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85", story: "Amigable y juguetona; disfruta los paseos y conocer gente nueva.", tags: ["Juguetona", "Sociable"], healthCare: [] },
  { id: 9, name: "Rocky", type: "Perro", sex: "Macho", breed: "Boxer", age: "2 meses", size: "Grande", location: "Sucre, Bolivia", image: "/images/7fb44a67-49bc-4c5c-b9d5-564ddebc9d22.jpg", story: "Tranquilo y atento, ideal para una familia que disfrute compartir tiempo al aire libre.", tags: ["Tranquilo", "Compañero"], healthCare: [] },
  { id: 10, name: "Michi", type: "Gato", sex: "Macho", breed: "Persa", age: "2 años", size: "Pequeño", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=900&q=85", story: "Le encanta explorar rincones cómodos y descansar cerca de sus personas favoritas.", tags: ["Independiente", "Hogar"], healthCare: [] },
  { id: 11, name: "Max", type: "Perro", sex: "Macho", breed: "Labrador mestizo", age: "5 años", size: "Grande", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=85", story: "Un compañero noble que disfruta la compañía y los paseos tranquilos.", tags: ["Noble", "Paseos"], healthCare: [] },
  { id: 12, name: "Mora", type: "Gato", sex: "Hembra", breed: "Mestiza", age: "1 año", size: "Pequeño", location: "Sucre, Bolivia", image: "/images/7d58b216-c792-4e55-ae6f-463fd29bf375.jpg", story: "Dulce y observadora, está lista para descubrir un nuevo hogar a su ritmo.", tags: ["Dulce", "Curiosa"], healthCare: [] },
];

function readLocal(): Animal[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Animal[];
      if (Array.isArray(parsed)) {
        let normalized = parsed.map((animal) => {
          const sample = initialAnimals.find((demo) => demo.id === animal.id && demo.name === animal.name && demo.image === animal.image);
          return { ...animal, sex: animal.sex === "Macho" || animal.sex === "Hembra" ? animal.sex : sample?.sex ?? "Macho", breed: animal.breed || "Mestizo/a", healthCare: animal.healthCare ?? sample?.healthCare ?? [] };
        });
        const sexMigrationVersion = "huellas_animal_sex_v1";
        if (!localStorage.getItem(sexMigrationVersion)) {
          saveLocal(normalized);
          localStorage.setItem(sexMigrationVersion, "true");
        }
        // Elimina a Luna del catálogo guardado en navegadores que ya tenían datos anteriores.
        const lunaRemovalVersion = "huellas_remove_luna_v1";
        if (!localStorage.getItem(lunaRemovalVersion)) {
          normalized = normalized.filter((animal) => !(animal.id === 2 && animal.name === "Luna"));
          saveLocal(normalized);
          localStorage.setItem(lunaRemovalVersion, "true");
        }
        // Elimina a Bobby y Nube de catálogos guardados en navegadores con datos anteriores.
        const bobbyNubeRemovalVersion = "huellas_remove_bobby_nube_v1";
        if (!localStorage.getItem(bobbyNubeRemovalVersion)) {
          normalized = normalized.filter((animal) => !((animal.id === 13 && animal.name === "Bobby") || (animal.id === 14 && animal.name === "Nube")));
          saveLocal(normalized);
          localStorage.setItem(bobbyNubeRemovalVersion, "true");
        }
        // Fuerza los datos actualizados de Bruno en catálogos guardados previamente.
        const brunoUpdateVersion = "huellas_update_bruno_v2";
        if (!localStorage.getItem(brunoUpdateVersion)) {
          normalized = normalized.map((animal) => animal.id === 3 && animal.name === "Bruno" ? {
            ...animal,
            breed: "Doberman en miniatura",
            size: "Pequeño",
            story: "Noble y leal; ya realizó una consulta veterinaria y está desparasitado. Busca una familia con mucho amor.",
            healthCare: ["Consulta veterinaria realizada", "Desparasitación realizada"],
          } : animal);
          saveLocal(normalized);
          localStorage.setItem(brunoUpdateVersion, "true");
        }
        // Actualiza la raza de Michi en catálogos guardados previamente.
        const michiBreedVersion = "huellas_update_michi_breed_v1";
        if (!localStorage.getItem(michiBreedVersion)) {
          normalized = normalized.map((animal) => animal.id === 10 && animal.name === "Michi" ? { ...animal, breed: "Persa" } : animal);
          saveLocal(normalized);
          localStorage.setItem(michiBreedVersion, "true");
        }
        // Actualiza raza y edad de Rocky en catálogos guardados previamente.
        const rockyUpdateVersion = "huellas_update_rocky_v1";
        if (!localStorage.getItem(rockyUpdateVersion)) {
          normalized = normalized.map((animal) => animal.id === 9 && animal.name === "Rocky" ? { ...animal, breed: "Boxer", age: "2 meses" } : animal);
          saveLocal(normalized);
          localStorage.setItem(rockyUpdateVersion, "true");
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
    return readLocal();
  },

  async create(data: AnimalFormData): Promise<Animal> {
    const animals = readLocal();
    const id = animals.reduce((max, animal) => Math.max(max, animal.id), 0) + 1;
    const newAnimal: Animal = { ...data, id };
    saveLocal([...animals, newAnimal]);
    return newAnimal;
  },

  async update(updatedAnimal: Animal): Promise<void> {
    saveLocal(readLocal().map((animal) => animal.id === updatedAnimal.id ? updatedAnimal : animal));
  },

  async remove(id: number): Promise<void> {
    saveLocal(readLocal().filter((animal) => animal.id !== id));
  },
};
