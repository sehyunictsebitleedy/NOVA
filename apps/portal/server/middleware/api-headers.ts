export default defineEventHandler(event => {
  if (getRequestURL(event).pathname.startsWith('/api/')) {
    setResponseHeaders(event, { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
  }
})
