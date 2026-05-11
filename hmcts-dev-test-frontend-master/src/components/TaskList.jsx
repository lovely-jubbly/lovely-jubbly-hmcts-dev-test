import TaskItem from './TaskItem.jsx';

export default function TaskList({
  tasks,
  isLoading,
  onStatusChange,
  onDelete,
}) {
  if (isLoading) {
    return <p className="govuk-body">Loading tasks...</p>;
  }

  if (tasks.length === 0) {
    return (
      <div className="govuk-inset-text">
        No tasks yet. Create a task using the form above.
      </div>
    );
  }

  return (
    <table className="govuk-table">
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th scope="col" className="govuk-table__header">
            Task
          </th>
          <th scope="col" className="govuk-table__header">
            Due
          </th>
          <th scope="col" className="govuk-table__header">
            Created / updated
          </th>
          <th scope="col" className="govuk-table__header">
            Status
          </th>
          <th scope="col" className="govuk-table__header">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
}
