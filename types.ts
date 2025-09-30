// /types.ts
export type Service = {
  id: string;
  name: string;
  price: number;
  duration?: number | null;
  approxDuration?: boolean | null;
  category?: string | null;
  description?: string | null;
  order?: number | null;  // <- champ ordre
};

export type Category = {
  id: string;
  name: string; // toujours MAJUSCULE
};
