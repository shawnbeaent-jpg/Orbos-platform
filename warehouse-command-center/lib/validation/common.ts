import { z } from 'zod';

/** Shared Zod primitives used across client forms and server mutations. */

export const uuid = z.string().uuid();

export const nonEmptyString = z.string().trim().min(1, 'Required');

/** A physical quantity: finite, non-negative, at most 3 decimals (matches numeric(14,3)). */
export const quantity = z
  .number({ invalid_type_error: 'Enter a number' })
  .finite()
  .nonnegative('Cannot be negative')
  .refine((n) => Number.isInteger(Math.round(n * 1000)), 'At most 3 decimal places');

/** A positive quantity (must be greater than zero). */
export const positiveQuantity = quantity.refine((n) => n > 0, 'Must be greater than zero');

/** ISO date (YYYY-MM-DD). */
export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');

export const priorityEnum = z.enum(['normal', 'urgent', 'emergency']);
