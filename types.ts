export type Service = {
  id: string;
  name: string;
  price: number;
  duration?: number | null;
  category?: string | null;
  description?: string | null;
};
