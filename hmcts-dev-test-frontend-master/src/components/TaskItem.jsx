import { formatDateTime } from '../utils/date.js';

const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In progress',
  done: 'Done',
};

export default function TaskItem({ task, onStatusChange, onDelete }) {
  async function handleStatusChange(event) {
    await onStatusChange(task.id, event.target.value);
  }

  async function handleDelete() {
    if (!window.confirm('Delete this task?')) {
      return;
    }

    await onDelete(task.id);
  }

  return (
    <li className="govuk-!-margin-bottom-6">
      <h3 className="govuk-heading-m">{task.title}</h3>
      <p className="govuk-body">
        {task.description ?? 'No description'}
      </p>
      <p className="govuk-body">
        <strong className="govuk-tag">{STATUS_LABELS[task.status]}</strong>
      </p>
      <p className="govuk-body">
        <strong>Due:</strong> {formatDateTime(task.dueDate)}
      </p>
      <p className="govuk-body-s">
        Created: {formatDateTime(task.createdAt)}. Updated:{' '}
        {formatDateTime(task.updatedAt)}
      </p>

      <div className="govuk-form-group">
        <label className="govuk-label" htmlFor={`task-status-${task.id}`}>
          Update status
        </label>
        <select
          className="govuk-select"
          id={`task-status-${task.id}`}
          value={task.status}
          onChange={handleStatusChange}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <button
        className="govuk-button govuk-button--warning"
        type="button"
        onClick={handleDelete}
      >
        Delete task
      </button>
    </li>
  );
}
