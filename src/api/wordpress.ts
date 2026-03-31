import axios from 'axios';
import { WPPost, WPCategory, Recipe, Category } from '../types';

const BASE_URL = 'https://smakidnia.pl/wp-json/wp/v2';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

function mapPost(post: WPPost): Recipe {
  const embedded = post._embedded;
  const featuredImage =
    embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null;
  const categories: Category[] =
    embedded?.['wp:term']?.[0]?.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      count: 0,
    })) ?? [];

  return {
    id: post.id,
    title: post.title.rendered,
    slug: post.slug,
    excerpt: post.excerpt.rendered,
    content: post.content.rendered,
    featuredImage,
    categories,
    date: post.date,
    link: post.link,
  };
}

export async function fetchRecipes(params?: {
  page?: number;
  perPage?: number;
  categories?: number[];
  search?: string;
}): Promise<{ recipes: Recipe[]; totalPages: number }> {
  const response = await api.get<WPPost[]>('/posts', {
    params: {
      _embed: true,
      per_page: params?.perPage ?? 12,
      page: params?.page ?? 1,
      categories: params?.categories?.join(','),
      search: params?.search,
    },
  });

  const totalPages = parseInt(response.headers['x-wp-totalpages'] ?? '1', 10);

  return {
    recipes: response.data.map(mapPost),
    totalPages,
  };
}

export async function fetchRecipeById(id: number): Promise<Recipe> {
  const response = await api.get<WPPost>(`/posts/${id}`, {
    params: { _embed: true },
  });
  return mapPost(response.data);
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await api.get<WPCategory[]>('/categories', {
    params: { per_page: 50, orderby: 'count', order: 'desc' },
  });
  return response.data
    .filter((c) => c.count > 0)
    .map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: c.count }));
}
