// /types.ts

export type Service = {
  id: string;
  name: string;
  price?: number | null;
  priceMin?: number | null;
  priceMax?: number | null;
  duration?: number | null;
  approxDuration?: boolean;
  category?: string | null;
  description?: string | null;
  order?: number | null;
  spacing?: number | null;
};

export type Category = {
  id: string;
  name: string;
  order?: number | null;
};

export type PageDoc = {
  id: string;        // id Firestore (= slug)
  slug: string;      // "contact" | "a-propos"
  title: string;
  body: string;      // Markdown ou texte simple
  updatedAt?: number;
};
