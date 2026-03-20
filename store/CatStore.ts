import { create } from 'zustand';

export interface Cat {
  id: string;
  name: string;
  price: string; // Storing as string to handle TextInput easily
  avatar: any; // We'll store the result of require()
  description: string;
}

interface CatState {
  cats: Cat[];
  addCat: (cat: Omit<Cat, 'id'>) => void;
  updateCat: (id: string, updatedCat: Omit<Cat, 'id'>) => void;
  removeCat: (id: string) => void;
}

export const useCatStore = create<CatState>((set) => ({
  cats: [],
  addCat: (catData) =>
    set((state) => ({
      cats: [
        ...state.cats,
        {
          ...catData,
          id: Date.now().toString(),
        },
      ],
    })),
  updateCat: (id, updatedCat) =>
    set((state) => ({
      cats: state.cats.map((cat) =>
        cat.id === id ? { ...updatedCat, id } : cat
      ),
    })),
  removeCat: (id) =>
    set((state) => ({
      cats: state.cats.filter((cat) => cat.id !== id),
    })),
}));
