import { useState } from 'react';
import { createTaskFormSchema } from '../validators/taskForm.validator.js';

const initialFormValues = {
  title: '',
  description: '',
  status: 'pending',
  dueDate: '',
};

function getFieldErrors(error) {
  const fieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (field && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
}

export default function TaskForm({ onSubmit }) {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [fieldErrors, setFieldErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validation = createTaskFormSchema.safeParse(formValues);

    if (!validation.success) {
      setFieldErrors(getFieldErrors(validation.error));
      return;
    }

    setFieldErrors({});

    try {
      await onSubmit(validation.data);
      setFormValues(initialFormValues);
    } catch {
      // API errors are shown in the page-level banner.
    }
  }

  return (
    <form className="govuk-form" onSubmit={handleSubmit} noValidate>
      <div
        className={`govuk-form-group${
          fieldErrors.title ? ' govuk-form-group--error' : ''
        }`}
      >
        <label className="govuk-label" htmlFor="task-title">
          Title
        </label>
        {fieldErrors.title ? (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span>
            {fieldErrors.title}
          </p>
        ) : null}
        <input
          className={`govuk-input${
            fieldErrors.title ? ' govuk-input--error' : ''
          }`}
          id="task-title"
          name="title"
          type="text"
          value={formValues.title}
          onChange={handleChange}
        />
      </div>

      <div className="govuk-form-group">
        <label className="govuk-label" htmlFor="task-description">
          Description
        </label>
        <textarea
          className="govuk-textarea"
          id="task-description"
          name="description"
          rows="4"
          value={formValues.description}
          onChange={handleChange}
        />
      </div>

      <div
        className={`govuk-form-group${
          fieldErrors.status ? ' govuk-form-group--error' : ''
        }`}
      >
        <label className="govuk-label" htmlFor="task-status">
          Status
        </label>
        {fieldErrors.status ? (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span>
            {fieldErrors.status}
          </p>
        ) : null}
        <select
          className={`govuk-select${
            fieldErrors.status ? ' govuk-select--error' : ''
          }`}
          id="task-status"
          name="status"
          value={formValues.status}
          onChange={handleChange}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div
        className={`govuk-form-group${
          fieldErrors.dueDate ? ' govuk-form-group--error' : ''
        }`}
      >
        <label className="govuk-label" htmlFor="task-due-date">
          Due date and time
        </label>
        {fieldErrors.dueDate ? (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span>
            {fieldErrors.dueDate}
          </p>
        ) : null}
        <input
          className={`govuk-input${
            fieldErrors.dueDate ? ' govuk-input--error' : ''
          }`}
          id="task-due-date"
          name="dueDate"
          type="datetime-local"
          value={formValues.dueDate}
          onChange={handleChange}
        />
      </div>

      <button className="govuk-button" type="submit">
        Create task
      </button>
    </form>
  );
}
