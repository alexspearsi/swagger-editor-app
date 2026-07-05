export function generateCurl(
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: string,
): string {
  const parts = [`curl -X ${method.toUpperCase()} '${url}'`];

  for (const [key, value] of Object.entries(headers)) {
    if (value) {
      parts.push(`  -H '${key}: ${value}'`);
    }
  }

  if (body) {
    parts.push(`  -d '${body.replace(/'/g, "\\'")}'`);
  }

  return parts.join(' \\\n');
}
