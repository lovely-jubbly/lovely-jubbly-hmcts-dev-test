export function toIsoDateTime(datetimeLocal) {
  const parsed = new Date(datetimeLocal);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid datetime');
  }

  return parsed.toISOString();
}

export function formatDateTime(isoDateTime) {
  const parsed = new Date(isoDateTime);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid datetime');
  }

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed);
}
