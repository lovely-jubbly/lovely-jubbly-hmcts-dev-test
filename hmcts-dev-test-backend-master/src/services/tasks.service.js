const prisma = require('../lib/prisma');

function serializeTask(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate.toISOString(),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

function createNotFoundError() {
  const error = new Error('Task not found');
  error.code = 'P2025';
  return error;
}

async function createTask(input) {
  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description ?? null,
      status: input.status,
      dueDate: new Date(input.dueDate),
    },
  });

  return serializeTask(task);
}

async function getTaskById(id) {
  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task) {
    throw createNotFoundError();
  }

  return serializeTask(task);
}

async function listTasks() {
  const tasks = await prisma.task.findMany({
    orderBy: [{ dueDate: 'asc' }, { createdAt: 'asc' }],
  });

  return tasks.map(serializeTask);
}

async function updateTaskStatus(id, status) {
  try {
    const task = await prisma.task.update({
      where: { id },
      data: { status },
    });

    return serializeTask(task);
  } catch (error) {
    if (error.code === 'P2025') {
      throw createNotFoundError();
    }

    throw error;
  }
}

async function deleteTask(id) {
  try {
    await prisma.task.delete({
      where: { id },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw createNotFoundError();
    }

    throw error;
  }
}

module.exports = {
  createTask,
  getTaskById,
  listTasks,
  updateTaskStatus,
  deleteTask,
};
