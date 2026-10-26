export type AnimalType = "Perro" | "Gato";

export interface Animal {
  id: number;
  name: string;
  type: AnimalType;
  age: string;
  size: string;
  location: string;
  image: string;
  story: string;
  tags: string[];
  healthCare?: string[];
}

export type AnimalFormData = Omit<Animal, "id">;
