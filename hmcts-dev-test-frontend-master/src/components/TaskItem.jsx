import { formatDateTime } from '../utils/date.js';

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
    <tr className="govuk-table__row">
      <td className="govuk-table__cell">
        <strong className="govuk-!-font-weight-bold">{task.title}</strong>
        <div className="govuk-hint govuk-!-margin-bottom-0">
          {task.description ?? 'No description'}
        </div>
      </td>
      <td className="govuk-table__cell">{formatDateTime(task.dueDate)}</td>
      <td className="govuk-table__cell">
        <span className="govuk-body-s">
          Created {formatDateTime(task.createdAt)}
          <br />
          Updated {formatDateTime(task.updatedAt)}
        </span>
      </td>
      <td className="govuk-table__cell">
        <select
          className="govuk-select"
          value={task.status}
          aria-label={`Update status for ${task.title}`}
          onChange={handleStatusChange}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </td>
      <td className="govuk-table__cell">
        <button
          className="govuk-button govuk-button--warning"
          type="button"
          onClick={handleDelete}
        >
          Delete task
        </button>
      </td>
    </tr>
  );
}
