import { z } from 'zod';

export const bookingRequestSchema = z.object({
  host_name: z.string().min(2),
  host_email: z.string().email(),
  host_phone: z.string().min(7),
  event_date: z.string().min(5),
  start_time: z.string().min(3),
  hours: z.coerce.number().min(2).max(16),
  guest_count: z.coerce.number().min(1).max(500),
  address: z.string().min(4),
  city: z.string().min(2),
  notes: z.string().optional(),
  add_ons: z.array(z.string()).default([])
});
