// /types.ts
export type Service = {
  id: string;
  name: string;
  price: number;
  duration?: number | null;
  approxDuration?: boolean | null;
  category?: string | null;
  description?: string | null;
  order?: number | null;    // ordre du soin
  spacing?: number | null;  // espace sous le soin (px)
};

export type Category = {
  id: string;
  name: string;           // toujours MAJUSCULE
  order?: number | null;  // ordre de la catégorie
};
