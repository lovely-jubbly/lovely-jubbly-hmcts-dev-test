import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError } from './api/http.js';
import {
  createTask,
  deleteTask,
  listTasks,
  updateTaskStatus,
} from './api/tasks.js';
import ErrorBanner from './components/ErrorBanner.jsx';
import StatusFilter from './components/StatusFilter.jsx';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';

function toApiError(error) {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      details: error.details,
    };
  }

  return {
    message: 'Something went wrong',
    details: [],
  };
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const filteredTasks = useMemo(() => {
    if (statusFilter === 'all') {
      return tasks;
    }

    return tasks.filter((task) => task.status === statusFilter);
  }, [statusFilter, tasks]);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      const nextTasks = await listTasks();
      setTasks(nextTasks);
    } catch (error) {
      setApiError(toApiError(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleCreateTask(payload) {
    setApiError(null);

    try {
      await createTask(payload);
      await loadTasks();
    } catch (error) {
      setApiError(toApiError(error));
      throw error;
    }
  }

  async function handleStatusChange(id, status) {
    setApiError(null);

    try {
      const updatedTask = await updateTaskStatus(id, status);
      setTasks((current) =>
        current.map((task) => (task.id === id ? updatedTask : task)),
      );
    } catch (error) {
      setApiError(toApiError(error));
    }
  }

  async function handleDelete(id) {
    setApiError(null);

    try {
      await deleteTask(id);
      setTasks((current) => current.filter((task) => task.id !== id));
    } catch (error) {
      setApiError(toApiError(error));
    }
  }

  return (
    <div className="govuk-width-container">
      <main
        className="govuk-main-wrapper govuk-main-wrapper--l"
        id="main-content"
        role="main"
      >
        <h1 className="govuk-heading-xl">HMCTS Task Management</h1>

        <section aria-labelledby="create-task-heading">
          <h2 className="govuk-heading-l" id="create-task-heading">
            Create a task
          </h2>
          <TaskForm onSubmit={handleCreateTask} />
        </section>

        <section aria-labelledby="status-filter-heading">
          <StatusFilter value={statusFilter} onChange={setStatusFilter} />
        </section>

        <section aria-labelledby="tasks-heading">
          <h2 className="govuk-heading-l" id="tasks-heading">
            Tasks
          </h2>
          <TaskList
            tasks={filteredTasks}
            isLoading={isLoading}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </section>

        <ErrorBanner error={apiError} />
      </main>
    </div>
  );
}
