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
    <ul className="govuk-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
