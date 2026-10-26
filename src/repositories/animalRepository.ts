import type { Animal, AnimalFormData } from "../types/animal";

const STORAGE_KEY = "huellas_animals";

const initialAnimals: Animal[] = [
  { id: 1, name: "Milo", type: "Perro", age: "2 años", size: "Mediano", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=900&q=85", story: "Curioso, cariñoso y siempre listo para una aventura.", tags: ["Sociable", "Energético"] },
  { id: 2, name: "Luna", type: "Gato", age: "1 año", size: "Pequeño", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=85", story: "Una compañera tranquila que adora las siestas al sol.", tags: ["Tranquila", "Hogar"] },
  { id: 3, name: "Bruno", type: "Perro", age: "4 años", size: "Grande", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=85", story: "Noble y leal; busca una familia con mucho amor.", tags: ["Cariñoso", "Paseos"] },
  { id: 4, name: "Nala", type: "Gato", age: "3 años", size: "Mediano", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=85", story: "Dulce e independiente, con un ronroneo inolvidable.", tags: ["Mimos", "Adaptable"] },
  { id: 5, name: "Toby", type: "Perro", age: "8 meses", size: "Pequeño", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=85", story: "Un pequeño explorador que llenará tu casa de alegría.", tags: ["Cachorro", "Juguetón"] },
  { id: 6, name: "Simba", type: "Gato", age: "2 años", size: "Mediano", location: "Sucre, Bolivia", image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=85", story: "Observador y afectuoso cuando gana confianza.", tags: ["Curioso", "Interior"] },
];

export const animalRepository = {
  getAll(): Animal[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Animal[];
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Si el almacenamiento no está disponible, usamos los datos iniciales.
    }
    return initialAnimals;
  },

  saveAll(animals: Animal[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(animals));
  },

  create(data: AnimalFormData): Animal {
    const animals = this.getAll();
    const nextId = animals.reduce((max, animal) => Math.max(max, animal.id), 0) + 1;
    const newAnimal: Animal = { ...data, id: nextId };
    this.saveAll([...animals, newAnimal]);
    return newAnimal;
  },

  update(updatedAnimal: Animal): void {
    this.saveAll(this.getAll().map((animal) => animal.id === updatedAnimal.id ? updatedAnimal : animal));
  },

  remove(id: number): void {
    this.saveAll(this.getAll().filter((animal) => animal.id !== id));
  },
};
