export function formatApiUrl(path?: string) {
  const apiRoot = process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:3002';

  // if api root ends with a slash, remove it
  if (apiRoot[apiRoot.length - 1] === '/') {
    return `${apiRoot.slice(0, -1)}${path ? path : ''}`;
  }

  return `${apiRoot}${path ? path : ''}`;
}
