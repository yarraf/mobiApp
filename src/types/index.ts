export interface Recipe {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  categories: Category[];
  date: string;
  link: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface WPPost {
  id: number;
  title: { rendered: string };
  slug: string;
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  link: string;
  categories: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export type RootStackParamList = {
  MainTabs: undefined;
  RecipeDetail: { recipeId: number; title: string };
};

export type TabParamList = {
  Home: undefined;
  Categories: undefined;
  Search: undefined;
  Favorites: undefined;
};
