const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
];

export default function StatusFilter({ value, onChange }) {
  return (
    <div className="govuk-form-group">
      <fieldset className="govuk-fieldset">
        <legend
          className="govuk-fieldset__legend govuk-fieldset__legend--m"
          id="status-filter-heading"
        >
          Filter tasks by status
        </legend>
        <div className="govuk-radios govuk-radios--inline">
          {FILTER_OPTIONS.map((option) => (
            <div className="govuk-radios__item" key={option.value}>
              <input
                className="govuk-radios__input"
                id={`status-filter-${option.value}`}
                name="status-filter"
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={(event) => onChange(event.target.value)}
              />
              <label
                className="govuk-label govuk-radios__label"
                htmlFor={`status-filter-${option.value}`}
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
