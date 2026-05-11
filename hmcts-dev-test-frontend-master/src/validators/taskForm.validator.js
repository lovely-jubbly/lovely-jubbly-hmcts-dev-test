import { z } from 'zod';
import { toIsoDateTime } from '../utils/date.js';

export const taskStatusSchema = z.enum(['pending', 'in_progress', 'done']);

export const createTaskFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().optional(),
    status: taskStatusSchema,
    dueDate: z
      .string()
      .min(1, 'Due date is required')
      .refine((value) => !Number.isNaN(new Date(value).getTime()), {
        message: 'Due date is required',
      }),
  })
  .transform(({ title, description = '', status, dueDate }) => {
    const trimmedDescription = description.trim();

    return {
      title,
      ...(trimmedDescription ? { description: trimmedDescription } : {}),
      status,
      dueDate: toIsoDateTime(dueDate),
    };
  });
