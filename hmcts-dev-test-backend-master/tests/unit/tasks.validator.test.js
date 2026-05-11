const {
  createTaskBodySchema,
  taskIdParamSchema,
  updateTaskStatusBodySchema,
} = require('../../src/validators/tasks.validator');

const validCreateInput = {
  title: 'Review case file',
  description: 'Check witness statements',
  status: 'pending',
  dueDate: '2026-05-15T09:00:00.000Z',
};

describe('createTaskBodySchema', () => {
  it('accepts a valid create task body', () => {
    expect(createTaskBodySchema.parse(validCreateInput)).toEqual(
      validCreateInput,
    );
  });

  it('accepts create task body without description', () => {
    const { description: _description, ...input } = validCreateInput;

    expect(createTaskBodySchema.parse(input)).toEqual(input);
  });

  it('rejects missing title', () => {
    const { title: _title, ...input } = validCreateInput;

    expect(() => createTaskBodySchema.parse(input)).toThrow();
  });

  it('rejects whitespace-only title', () => {
    expect(() =>
      createTaskBodySchema.parse({
        ...validCreateInput,
        title: '   ',
      }),
    ).toThrow();
  });

  it('rejects unknown status', () => {
    expect(() =>
      createTaskBodySchema.parse({
        ...validCreateInput,
        status: 'archived',
      }),
    ).toThrow();
  });

  it('rejects invalid dueDate', () => {
    expect(() =>
      createTaskBodySchema.parse({
        ...validCreateInput,
        dueDate: 'not-a-date',
      }),
    ).toThrow();
  });
});

describe('taskIdParamSchema', () => {
  it('accepts a valid UUID', () => {
    expect(
      taskIdParamSchema.parse({
        id: '550e8400-e29b-41d4-a716-446655440000',
      }),
    ).toEqual({
      id: '550e8400-e29b-41d4-a716-446655440000',
    });
  });

  it('rejects a non-UUID id', () => {
    expect(() =>
      taskIdParamSchema.parse({
        id: 'not-a-uuid',
      }),
    ).toThrow();
  });
});

describe('updateTaskStatusBodySchema', () => {
  it('accepts a valid status update body', () => {
    expect(
      updateTaskStatusBodySchema.parse({
        status: 'in_progress',
      }),
    ).toEqual({
      status: 'in_progress',
    });
  });

  it('rejects missing status', () => {
    expect(() => updateTaskStatusBodySchema.parse({})).toThrow();
  });

  it('rejects unknown status', () => {
    expect(() =>
      updateTaskStatusBodySchema.parse({
        status: 'archived',
      }),
    ).toThrow();
  });
});
