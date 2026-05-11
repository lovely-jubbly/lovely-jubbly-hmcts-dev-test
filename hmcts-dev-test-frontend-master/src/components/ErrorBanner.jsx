export default function ErrorBanner({ error }) {
  if (!error) {
    return null;
  }

  return (
    <div
      className="govuk-error-summary"
      aria-labelledby="error-summary-title"
      role="alert"
    >
      <h2 className="govuk-error-summary__title" id="error-summary-title">
        There is a problem
      </h2>
      <div className="govuk-error-summary__body">
        <ul className="govuk-list govuk-error-summary__list">
          <li>
            <a href="#page-error-message">{error.message}</a>
          </li>
          {error.details.map((detail) => (
            <li key={detail}>
              <a href="#page-error-message">{detail}</a>
            </li>
          ))}
        </ul>
        <p className="govuk-visually-hidden" id="page-error-message">
          {error.message}
        </p>
      </div>
    </div>
  );
}
