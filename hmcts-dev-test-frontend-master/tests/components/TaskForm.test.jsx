import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import TaskForm from '../../src/components/TaskForm.jsx';

describe('TaskForm', () => {
  it('shows validation errors without calling onSubmit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<TaskForm onSubmit={onSubmit} />);
    await user.click(screen.getByRole('button', { name: 'Create task' }));

    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits valid form data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<TaskForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Title'), 'Review case file');
    await user.type(
      screen.getByLabelText('Description'),
      'Check witness statements',
    );
    await user.selectOptions(screen.getByLabelText('Status'), 'pending');
    await user.type(
      screen.getByLabelText('Due date and time'),
      '2026-05-15T09:00',
    );
    await user.click(screen.getByRole('button', { name: 'Create task' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Review case file',
        description: 'Check witness statements',
        status: 'pending',
        dueDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      }),
    );
  });
});
