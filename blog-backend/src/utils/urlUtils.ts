export function getBaseUrl(): string {
  if (process.env.NODE_ENV === 'production') {
    return process.env.RENDER_URL
      || (process.env.RENDER_SERVICE_NAME ? `https://${process.env.RENDER_SERVICE_NAME}.onrender.com` : '');
  }
  return `http://localhost:${process.env.PORT ?? 3001}`;
}
