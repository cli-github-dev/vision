export const capitalize = (str: string) => {
  if (typeof str !== 'string') return '';
  return str
    .split('_')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
};

export const isJsonString = (str: string): object | boolean => {
  if (!Number.isNaN(Number(str))) return false;

  try {
    return JSON.parse(str);
  } catch (_) {
    return false;
  }
};
