import { describe, expect, it } from 'vitest';
import { createTaskFormSchema } from '../../src/validators/taskForm.validator.js';

const validFormInput = {
  title: 'Review case file',
  description: 'Check witness statements',
  status: 'pending',
  dueDate: '2026-05-15T09:00',
};

describe('createTaskFormSchema', () => {
  it('accepts valid create form input', () => {
    const result = createTaskFormSchema.parse(validFormInput);

    expect(result.title).toBe(validFormInput.title);
    expect(result.description).toBe(validFormInput.description);
    expect(result.status).toBe(validFormInput.status);
    expect(result.dueDate).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    );
  });

  it('omits blank description from the parsed payload', () => {
    const result = createTaskFormSchema.parse({
      ...validFormInput,
      description: '   ',
    });

    expect(result).not.toHaveProperty('description');
  });

  it('rejects missing title', () => {
    const { title: _title, ...input } = validFormInput;

    expect(() => createTaskFormSchema.parse(input)).toThrow();
  });

  it('rejects whitespace-only title', () => {
    expect(() =>
      createTaskFormSchema.parse({
        ...validFormInput,
        title: '   ',
      }),
    ).toThrow();
  });

  it('rejects unknown status', () => {
    expect(() =>
      createTaskFormSchema.parse({
        ...validFormInput,
        status: 'archived',
      }),
    ).toThrow();
  });

  it('rejects missing due date', () => {
    const { dueDate: _dueDate, ...input } = validFormInput;

    expect(() => createTaskFormSchema.parse(input)).toThrow();
  });

  it('rejects invalid due date', () => {
    expect(() =>
      createTaskFormSchema.parse({
        ...validFormInput,
        dueDate: 'not-a-date',
      }),
    ).toThrow();
  });
});
