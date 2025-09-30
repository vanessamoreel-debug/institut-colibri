// /types.ts
export type Service = {
  id: string;
  name: string;
  price: number;
  duration?: number | null;        // minutes
  approxDuration?: boolean | null; // true => afficher "± duration min"
  category?: string | null;
  description?: string | null;
};

export type Category = {
  id: string;
  name: string; // toujours MAJUSCULE
};
