import { request } from './http.js';

export function listTasks() {
  return request('/tasks');
}

export function createTask(task) {
  return request('/tasks', {
    method: 'POST',
    body: task,
  });
}

export function updateTaskStatus(id, status) {
  return request(`/tasks/${id}/status`, {
    method: 'PATCH',
    body: { status },
  });
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: 'DELETE',
  });
}
