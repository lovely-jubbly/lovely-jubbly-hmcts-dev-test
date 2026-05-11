import { describe, expect, it } from 'vitest';
import { formatDateTime, toIsoDateTime } from '../../src/utils/date.js';

describe('toIsoDateTime', () => {
  it('converts datetime-local input to ISO 8601', () => {
    const isoDateTime = toIsoDateTime('2026-05-15T09:00');

    expect(isoDateTime).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    );
    expect(Number.isNaN(new Date(isoDateTime).getTime())).toBe(false);
  });

  it('throws for invalid datetime-local input', () => {
    expect(() => toIsoDateTime('not-a-date')).toThrow('Invalid datetime');
  });
});

describe('formatDateTime', () => {
  it('formats API timestamps for en-GB display', () => {
    const formatted = formatDateTime('2026-05-15T09:00:00.000Z');

    expect(formatted).toContain('2026');
    expect(formatted).toMatch(/15/);
  });

  it('throws for invalid API timestamps', () => {
    expect(() => formatDateTime('not-a-date')).toThrow('Invalid datetime');
  });
});
