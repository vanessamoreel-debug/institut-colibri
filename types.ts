// /types.ts
export type Service = {
  id: string;
  name: string;

  // Prix: soit un prix unique (price), soit un intervalle (priceMin/priceMax).
  // Dans l'admin on renseigne surtout priceMin/priceMax ; on garde "price" pour compatibilité.
  price?: number | null;
  priceMin?: number | null;
  priceMax?: number | null;

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
  order?: number | null;  // ordre de la catégorie (section)
};
