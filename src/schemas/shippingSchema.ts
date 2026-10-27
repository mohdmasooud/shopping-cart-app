import { z } from 'zod';

export const shippingSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  phoneNumber: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .regex(/^[0-9+()\- ]{7,20}$/, 'Please enter a valid phone number'),
  address: z.string().trim().min(1, 'Address is required'),
  city: z.string().trim().min(1, 'City is required'),
  postalCode: z
    .string()
    .trim()
    .min(1, 'Postal code is required')
    .min(3, 'Postal code must be at least 3 characters'),
});

export type ShippingFormData = z.infer<typeof shippingSchema>;

export type ShippingFormErrors = Partial<Record<keyof ShippingFormData, string>>;
