import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from '../../src/App.jsx';
import ErrorBanner from '../../src/components/ErrorBanner.jsx';
import StatusFilter from '../../src/components/StatusFilter.jsx';
import TaskList from '../../src/components/TaskList.jsx';
import * as tasksApi from '../../src/api/tasks.js';

vi.mock('../../src/api/tasks.js', () => ({
  listTasks: vi.fn(),
  createTask: vi.fn(),
  updateTaskStatus: vi.fn(),
  deleteTask: vi.fn(),
}));

const sampleTask = {
  id: '11111111-1111-4111-8111-111111111111',
  title: 'Review case file',
  description: 'Check witness statements',
  status: 'pending',
  dueDate: '2026-05-15T09:00:00.000Z',
  createdAt: '2026-05-11T10:00:00.000Z',
  updatedAt: '2026-05-11T10:00:00.000Z',
};

describe('TaskList', () => {
  it('shows a loading message', () => {
    render(
      <TaskList
        tasks={[]}
        isLoading
        onStatusChange={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  it('shows the empty state', () => {
    render(
      <TaskList
        tasks={[]}
        isLoading={false}
        onStatusChange={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(
      screen.getByText('No tasks yet. Create a task using the form above.'),
    ).toBeInTheDocument();
  });

  it('updates task status through the row select', async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn().mockResolvedValue(undefined);

    render(
      <TaskList
        tasks={[sampleTask]}
        isLoading={false}
        onStatusChange={onStatusChange}
        onDelete={vi.fn()}
      />,
    );

    await user.selectOptions(screen.getByLabelText('Update status'), 'done');

    expect(onStatusChange).toHaveBeenCalledWith(sampleTask.id, 'done');
  });

  it('deletes a task after confirmation', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(true));

    render(
      <TaskList
        tasks={[sampleTask]}
        isLoading={false}
        onStatusChange={vi.fn()}
        onDelete={onDelete}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Delete task' }));

    expect(window.confirm).toHaveBeenCalledWith('Delete this task?');
    expect(onDelete).toHaveBeenCalledWith(sampleTask.id);

    vi.unstubAllGlobals();
  });
});

describe('StatusFilter', () => {
  it('reports the selected filter value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<StatusFilter value="all" onChange={onChange} />);
    await user.click(screen.getByLabelText('Done'));

    expect(onChange).toHaveBeenCalledWith('done');
  });
});

describe('ErrorBanner', () => {
  it('shows API error details', () => {
    render(
      <ErrorBanner
        error={{
          message: 'Validation failed',
          details: ['title: Required'],
        }}
      />,
    );

    expect(
      screen.getByRole('link', { name: 'Validation failed' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'title: Required' })).toBeInTheDocument();
  });
});

describe('App', () => {
  it('filters tasks without calling the API again', async () => {
    const user = userEvent.setup();

    tasksApi.listTasks.mockResolvedValue([
      sampleTask,
      {
        ...sampleTask,
        id: '22222222-2222-4222-8222-222222222222',
        title: 'Completed task',
        status: 'done',
      },
    ]);

    render(<App />);

    expect(await screen.findByText('Review case file')).toBeInTheDocument();
    expect(screen.getByText('Completed task')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Done'));

    expect(screen.queryByText('Review case file')).not.toBeInTheDocument();
    expect(screen.getByText('Completed task')).toBeInTheDocument();
    expect(tasksApi.listTasks).toHaveBeenCalledTimes(1);
  });
});
