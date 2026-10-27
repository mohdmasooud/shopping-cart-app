import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional().default(''),
  price: z.number(),
  discountPercentage: z.number().optional().default(0),
  rating: z.number().optional().default(0),
  stock: z.number().optional().default(0),
  brand: z.string().optional().default('Brand'),
  category: z.string(),
  thumbnail: z.string().optional().default(''),
  images: z.array(z.string()).optional().default([]),
});

export const productsResponseSchema = z.object({
  products: z.array(productSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type Product = z.infer<typeof productSchema>;

export const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('https://dummyjson.com/products?limit=30');
      if (!res.ok) {
        throw new Error(`Failed to fetch products (HTTP ${res.status})`);
      }
      const json = await res.json();
      const parsed = productsResponseSchema.safeParse(json);
      if (!parsed.success) {
        console.error('Zod API validation errors:', parsed.error.format());
        throw new Error('Product API response failed schema validation');
      }
      return parsed.data.products;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
