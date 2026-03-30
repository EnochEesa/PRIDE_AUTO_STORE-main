type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const getBody = (value: unknown): UnknownRecord | null => (
  isRecord(value) ? value : null
);

export const getQuery = (value: unknown): UnknownRecord | null => (
  isRecord(value) ? value : null
);

export const getQueryString = (value: unknown): string | undefined => {
  if (Array.isArray(value)) return normalizeString(value[0]);
  return normalizeString(value);
};

export const getRequiredBodyString = (body: UnknownRecord, key: string): string | null => {
  const value = normalizeString(body[key]);
  return value ?? null;
};

export const getOptionalBodyString = (body: UnknownRecord, key: string): string | undefined => (
  normalizeString(body[key])
);

export const getBooleanQuery = (value: unknown): boolean | undefined => {
  const normalized = getQueryString(value)?.toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  return undefined;
};

export const getPositiveIntQuery = (
  value: unknown,
  fallback: number,
  max: number
): number => {
  const normalized = getQueryString(value);
  const parsed = normalized ? Number.parseInt(normalized, 10) : fallback;
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
};
