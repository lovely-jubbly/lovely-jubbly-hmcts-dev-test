import { useState } from 'react';

export default function App() {
  const [tasks] = useState([]);
  const [statusFilter] = useState('all');
  const [isLoading] = useState(false);
  const [apiError] = useState(null);

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
        </section>

        <section aria-labelledby="status-filter-heading">
          <h2 className="govuk-visually-hidden" id="status-filter-heading">
            Filter tasks by status
          </h2>
          <p className="govuk-body">Status filter: {statusFilter}</p>
        </section>

        <section aria-labelledby="tasks-heading">
          <h2 className="govuk-heading-l" id="tasks-heading">
            Tasks
          </h2>
          {isLoading ? (
            <p className="govuk-body">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="govuk-body">
              No tasks yet. Create a task using the form above.
            </p>
          ) : null}
        </section>

        {apiError ? (
          <section aria-labelledby="page-error-heading">
            <h2 className="govuk-visually-hidden" id="page-error-heading">
              Page error
            </h2>
            <div
              className="govuk-error-summary"
              aria-labelledby="error-summary-title"
              role="alert"
            >
              <h3 className="govuk-error-summary__title" id="error-summary-title">
                There is a problem
              </h3>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
