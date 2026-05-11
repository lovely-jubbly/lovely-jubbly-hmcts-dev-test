jest.mock('../../src/lib/prisma', () => ({
  task: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const prisma = require('../../src/lib/prisma');
const {
  createTask,
  getTaskById,
  listTasks,
  updateTaskStatus,
  deleteTask,
} = require('../../src/services/tasks.service');

const taskRecord = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: 'Review case file',
  description: 'Check witness statements',
  status: 'pending',
  dueDate: new Date('2026-05-15T09:00:00.000Z'),
  createdAt: new Date('2026-05-11T10:00:00.000Z'),
  updatedAt: new Date('2026-05-11T10:00:00.000Z'),
};

const serializedTask = {
  id: taskRecord.id,
  title: taskRecord.title,
  description: taskRecord.description,
  status: taskRecord.status,
  dueDate: '2026-05-15T09:00:00.000Z',
  createdAt: '2026-05-11T10:00:00.000Z',
  updatedAt: '2026-05-11T10:00:00.000Z',
};

describe('tasks.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('creates and serializes a task', async () => {
      prisma.task.create.mockResolvedValue(taskRecord);

      await expect(
        createTask({
          title: taskRecord.title,
          description: taskRecord.description,
          status: taskRecord.status,
          dueDate: serializedTask.dueDate,
        }),
      ).resolves.toEqual(serializedTask);

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          title: taskRecord.title,
          description: taskRecord.description,
          status: taskRecord.status,
          dueDate: new Date(serializedTask.dueDate),
        },
      });
    });
  });

  describe('getTaskById', () => {
    it('returns a serialized task when found', async () => {
      prisma.task.findUnique.mockResolvedValue(taskRecord);

      await expect(getTaskById(taskRecord.id)).resolves.toEqual(serializedTask);
    });

    it('throws a not-found error when the task is missing', async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      await expect(getTaskById(taskRecord.id)).rejects.toMatchObject({
        code: 'P2025',
      });
    });
  });

  describe('listTasks', () => {
    it('returns serialized tasks in due date order', async () => {
      prisma.task.findMany.mockResolvedValue([taskRecord]);

      await expect(listTasks()).resolves.toEqual([serializedTask]);

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        orderBy: [{ dueDate: 'asc' }, { createdAt: 'asc' }],
      });
    });
  });

  describe('updateTaskStatus', () => {
    it('updates and serializes a task', async () => {
      const updatedTask = {
        ...taskRecord,
        status: 'in_progress',
        updatedAt: new Date('2026-05-11T11:00:00.000Z'),
      };

      prisma.task.update.mockResolvedValue(updatedTask);

      await expect(
        updateTaskStatus(taskRecord.id, 'in_progress'),
      ).resolves.toEqual({
        ...serializedTask,
        status: 'in_progress',
        updatedAt: '2026-05-11T11:00:00.000Z',
      });
    });

    it('throws a not-found error when the task is missing', async () => {
      prisma.task.update.mockRejectedValue({ code: 'P2025' });

      await expect(
        updateTaskStatus(taskRecord.id, 'done'),
      ).rejects.toMatchObject({
        code: 'P2025',
      });
    });
  });

  describe('deleteTask', () => {
    it('deletes an existing task', async () => {
      prisma.task.delete.mockResolvedValue(taskRecord);

      await expect(deleteTask(taskRecord.id)).resolves.toBeUndefined();
    });

    it('throws a not-found error when the task is missing', async () => {
      prisma.task.delete.mockRejectedValue({ code: 'P2025' });

      await expect(deleteTask(taskRecord.id)).rejects.toMatchObject({
        code: 'P2025',
      });
    });
  });
});
