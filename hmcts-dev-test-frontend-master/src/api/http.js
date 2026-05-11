import { apiBaseUrl } from '../config/env.js';

export class ApiError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = 'ApiError';
    this.details = details;
  }
}

async function parseJson(response) {
  const contentType = response.headers.get('content-type');

  if (!contentType?.includes('application/json')) {
    return null;
  }

  return response.json();
}

export async function request(path, options = {}) {
  const { body, headers, ...rest } = options;

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...rest,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await parseJson(response);

  if (!response.ok) {
    throw new ApiError(
      payload?.error?.message ?? 'Request failed',
      payload?.error?.details ?? [],
    );
  }

  return payload;
}
