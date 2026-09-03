export type Artwork = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  image_url: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
};
