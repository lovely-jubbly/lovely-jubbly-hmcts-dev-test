const tasksService = require('../services/tasks.service');

async function createTask(req, res, next) {
  try {
    const task = await tasksService.createTask(req.validated.body);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

async function listTasks(_req, res, next) {
  try {
    const tasks = await tasksService.listTasks();
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
}

async function getTaskById(req, res, next) {
  try {
    const task = await tasksService.getTaskById(req.validated.params.id);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

async function updateTaskStatus(req, res, next) {
  try {
    const task = await tasksService.updateTaskStatus(
      req.validated.params.id,
      req.validated.body.status,
    );
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    await tasksService.deleteTask(req.validated.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTask,
  listTasks,
  getTaskById,
  updateTaskStatus,
  deleteTask,
};
