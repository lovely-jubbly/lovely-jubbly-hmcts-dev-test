const express = require('express');
const validate = require('../middleware/validate');
const tasksController = require('../controllers/tasks.controller');
const {
  createTaskBodySchema,
  taskIdParamSchema,
  updateTaskStatusBodySchema,
} = require('../validators/tasks.validator');

const router = express.Router();

/**
 * @openapi
 * /tasks:
 *   post:
 *     summary: Create a task
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskRequest'
 *     responses:
 *       201:
 *         description: Task created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   get:
 *     summary: List all tasks
 *     tags:
 *       - Tasks
 *     responses:
 *       200:
 *         description: Tasks returned in due date order
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  '/tasks',
  validate({ body: createTaskBodySchema }),
  tasksController.createTask,
);
router.get('/tasks', tasksController.listTasks);

/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by id
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Task found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   delete:
 *     summary: Delete a task
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Task deleted
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/tasks/:id',
  validate({ params: taskIdParamSchema }),
  tasksController.getTaskById,
);
router.delete(
  '/tasks/:id',
  validate({ params: taskIdParamSchema }),
  tasksController.deleteTask,
);

/**
 * @openapi
 * /tasks/{id}/status:
 *   patch:
 *     summary: Update task status
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskStatusRequest'
 *     responses:
 *       200:
 *         description: Task status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.patch(
  '/tasks/:id/status',
  validate({ params: taskIdParamSchema, body: updateTaskStatusBodySchema }),
  tasksController.updateTaskStatus,
);

module.exports = router;
