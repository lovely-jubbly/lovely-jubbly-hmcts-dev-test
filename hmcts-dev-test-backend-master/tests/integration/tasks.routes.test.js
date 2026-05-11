const request = require('supertest');
const { loadEnv } = require('../../src/config/env');
const { createApp } = require('../../src/app');
const prisma = require('../../src/lib/prisma');
const { resetDatabase } = require('../helpers/testDb');

const validTask = {
  title: 'Review case file',
  description: 'Check witness statements',
  status: 'pending',
  dueDate: '2026-05-15T09:00:00.000Z',
};

describe('Task routes', () => {
  const app = createApp(loadEnv());

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /tasks', () => {
    it('creates a task with valid input', async () => {
      const response = await request(app).post('/tasks').send(validTask).expect(201);

      expect(response.body).toMatchObject({
        title: validTask.title,
        description: validTask.description,
        status: validTask.status,
        dueDate: validTask.dueDate,
      });
      expect(response.body.id).toEqual(expect.any(String));
      expect(response.body.createdAt).toEqual(expect.any(String));
      expect(response.body.updatedAt).toEqual(expect.any(String));
    });

    it('creates a task without description', async () => {
      const { description: _description, ...input } = validTask;

      const response = await request(app).post('/tasks').send(input).expect(201);

      expect(response.body.description).toBeNull();
    });

    it('rejects invalid create input', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          ...validTask,
          title: '   ',
        })
        .expect(400);

      expect(response.body).toEqual({
        error: {
          message: 'Validation failed',
          details: expect.arrayContaining([expect.stringContaining('title')]),
        },
      });
    });

    it('rejects malformed JSON', async () => {
      const response = await request(app)
        .post('/tasks')
        .set('Content-Type', 'application/json')
        .send('{')
        .expect(400);

      expect(response.body).toEqual({
        error: {
          message: 'Invalid JSON body',
          details: [],
        },
      });
    });
  });

  describe('GET /tasks', () => {
    it('returns an empty list when no tasks exist', async () => {
      await request(app).get('/tasks').expect(200, []);
    });

    it('returns tasks ordered by due date then created date', async () => {
      await request(app)
        .post('/tasks')
        .send({
          ...validTask,
          title: 'Later task',
          dueDate: '2026-05-20T09:00:00.000Z',
        })
        .expect(201);

      await request(app)
        .post('/tasks')
        .send({
          ...validTask,
          title: 'Earlier task',
          dueDate: '2026-05-10T09:00:00.000Z',
        })
        .expect(201);

      const response = await request(app).get('/tasks').expect(200);

      expect(response.body.map((task) => task.title)).toEqual(['Earlier task', 'Later task']);
    });
  });

  describe('GET /tasks/:id', () => {
    it('returns a task by id', async () => {
      const created = await request(app).post('/tasks').send(validTask).expect(201);

      const response = await request(app).get(`/tasks/${created.body.id}`).expect(200);

      expect(response.body.id).toBe(created.body.id);
    });

    it('returns not found for a missing task', async () => {
      const response = await request(app)
        .get('/tasks/550e8400-e29b-41d4-a716-446655440000')
        .expect(404);

      expect(response.body).toEqual({
        error: {
          message: 'Task not found',
          details: [],
        },
      });
    });

    it('rejects an invalid task id', async () => {
      const response = await request(app).get('/tasks/not-a-uuid').expect(400);

      expect(response.body.error.message).toBe('Validation failed');
    });
  });

  describe('PATCH /tasks/:id/status', () => {
    it('updates task status', async () => {
      const created = await request(app).post('/tasks').send(validTask).expect(201);

      const response = await request(app)
        .patch(`/tasks/${created.body.id}/status`)
        .send({ status: 'in_progress' })
        .expect(200);

      expect(response.body.status).toBe('in_progress');
      expect(response.body.updatedAt).not.toBe(created.body.updatedAt);
    });

    it('rejects invalid status updates', async () => {
      const created = await request(app).post('/tasks').send(validTask).expect(201);

      await request(app)
        .patch(`/tasks/${created.body.id}/status`)
        .send({ status: 'archived' })
        .expect(400);
    });

    it('returns not found for a missing task', async () => {
      await request(app)
        .patch('/tasks/550e8400-e29b-41d4-a716-446655440000/status')
        .send({ status: 'done' })
        .expect(404);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('deletes an existing task', async () => {
      const created = await request(app).post('/tasks').send(validTask).expect(201);

      await request(app).delete(`/tasks/${created.body.id}`).expect(204);
      await request(app).get(`/tasks/${created.body.id}`).expect(404);
    });

    it('returns not found for a missing task', async () => {
      await request(app)
        .delete('/tasks/550e8400-e29b-41d4-a716-446655440000')
        .expect(404);
    });

    it('rejects an invalid task id', async () => {
      await request(app).delete('/tasks/not-a-uuid').expect(400);
    });
  });
});
