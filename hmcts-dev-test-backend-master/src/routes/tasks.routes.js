const express = require('express');
const validate = require('../middleware/validate');
const tasksController = require('../controllers/tasks.controller');
const {
  createTaskBodySchema,
  taskIdParamSchema,
  updateTaskStatusBodySchema,
} = require('../validators/tasks.validator');

const router = express.Router();

router.post(
  '/tasks',
  validate({ body: createTaskBodySchema }),
  tasksController.createTask,
);
router.get('/tasks', tasksController.listTasks);
router.get(
  '/tasks/:id',
  validate({ params: taskIdParamSchema }),
  tasksController.getTaskById,
);
router.patch(
  '/tasks/:id/status',
  validate({ params: taskIdParamSchema, body: updateTaskStatusBodySchema }),
  tasksController.updateTaskStatus,
);
router.delete(
  '/tasks/:id',
  validate({ params: taskIdParamSchema }),
  tasksController.deleteTask,
);

module.exports = router;
