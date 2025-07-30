export function sanitizeBigInts(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeBigInts);
  }

  if (obj !== null && typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = sanitizeBigInts(value);
    }
    return result;
  }

  return typeof obj === 'bigint' ? Number(obj) : obj;
}
