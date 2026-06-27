import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export const customerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{7,20}$/, 'Invalid phone number').optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
  gender: z.string().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
  address: z.string().max(500).optional().or(z.literal('')),
  countryId: z.string().optional().or(z.literal('')),
});

export const countrySchema = z.object({
  name: z.string().min(2, 'Country name must be at least 2 characters').max(100),
  code: z.string().min(2, 'Country code must be at least 2 characters').max(10),
  continent: z.string().max(50).optional().or(z.literal('')),
  currency: z.string().min(1, 'Currency is required').max(50),
});

export const merchantSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters').max(200),
  contactPerson: z.string().max(100).optional().or(z.literal('')),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{7,20}$/, 'Invalid phone number').optional().or(z.literal('')),
  countryId: z.string().min(1, 'Country is required'),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters').max(100),
  description: z.string().max(2000).optional().or(z.literal('')),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, 'Price must be >= 0'),
  stockQuantity: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, 'Stock must be >= 0'),
  categoryId: z.string().min(1, 'Category is required'),
});

export const orderSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  remarks: z.string().max(500).optional().or(z.literal('')),
});

export const supplierSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters').max(200),
  contactPerson: z.string().max(100).optional().or(z.literal('')),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{7,20}$/, 'Invalid phone number').optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
});
