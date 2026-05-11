const { z } = require('zod');

const taskStatusSchema = z.enum(['pending', 'in_progress', 'done']);

const createTaskBodySchema = z.object({
  title: z.string().trim().min(1, 'title is required'),
  description: z.string().nullish(),
  status: taskStatusSchema,
  dueDate: z.string().datetime({ message: 'dueDate must be a valid ISO 8601 datetime' }),
});

const taskIdParamSchema = z.object({
  id: z.string().uuid('id must be a valid UUID'),
});

const updateTaskStatusBodySchema = z.object({
  status: taskStatusSchema,
});

module.exports = {
  createTaskBodySchema,
  taskIdParamSchema,
  updateTaskStatusBodySchema,
  taskStatusSchema,
};
