import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../src/api/http.js';
import {
  createTask,
  deleteTask,
  listTasks,
  updateTaskStatus,
} from '../../src/api/tasks.js';

function jsonResponse({ status, body }) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => body,
  };
}

describe('tasks api', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('listTasks calls GET /tasks and returns the task list', async () => {
    const tasks = [
      {
        id: '11111111-1111-4111-8111-111111111111',
        title: 'Review case file',
        description: null,
        status: 'pending',
        dueDate: '2026-05-15T09:00:00.000Z',
        createdAt: '2026-05-11T10:00:00.000Z',
        updatedAt: '2026-05-11T10:00:00.000Z',
      },
    ];

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ status: 200, body: tasks })),
    );

    await expect(listTasks()).resolves.toEqual(tasks);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/tasks',
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/json',
        }),
      }),
    );
  });

  it('createTask calls POST /tasks with the request body', async () => {
    const task = {
      title: 'Review case file',
      status: 'pending',
      dueDate: '2026-05-15T09:00:00.000Z',
    };
    const createdTask = {
      id: '11111111-1111-4111-8111-111111111111',
      description: null,
      createdAt: '2026-05-11T10:00:00.000Z',
      updatedAt: '2026-05-11T10:00:00.000Z',
      ...task,
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ status: 201, body: createdTask })),
    );

    await expect(createTask(task)).resolves.toEqual(createdTask);
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/tasks',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(task),
        headers: expect.objectContaining({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it('updateTaskStatus calls PATCH /tasks/:id/status with status', async () => {
    const updatedTask = {
      id: '11111111-1111-4111-8111-111111111111',
      title: 'Review case file',
      description: null,
      status: 'done',
      dueDate: '2026-05-15T09:00:00.000Z',
      createdAt: '2026-05-11T10:00:00.000Z',
      updatedAt: '2026-05-11T11:00:00.000Z',
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ status: 200, body: updatedTask })),
    );

    await expect(
      updateTaskStatus(updatedTask.id, updatedTask.status),
    ).resolves.toEqual(updatedTask);
    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:3000/tasks/${updatedTask.id}/status`,
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ status: updatedTask.status }),
      }),
    );
  });

  it('deleteTask calls DELETE /tasks/:id and returns null', async () => {
    const taskId = '11111111-1111-4111-8111-111111111111';

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
        headers: new Headers(),
        json: async () => {
          throw new Error('No JSON body expected');
        },
      }),
    );

    await expect(deleteTask(taskId)).resolves.toBeNull();
    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:3000/tasks/${taskId}`,
      expect.objectContaining({
        method: 'DELETE',
      }),
    );
  });

  it('throws ApiError with the backend error envelope on failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({
          status: 400,
          body: {
            error: {
              message: 'Validation failed',
              details: ['title: Required'],
            },
          },
        }),
      ),
    );

    await expect(listTasks()).rejects.toEqual(
      new ApiError('Validation failed', ['title: Required']),
    );
  });
});
