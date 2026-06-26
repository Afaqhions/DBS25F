import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{7,20}$/, 'Invalid phone number').optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const customerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{7,20}$/, 'Invalid phone number').optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
  gender: z.string().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
  address: z.string().max(500).optional().or(z.literal('')),
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
