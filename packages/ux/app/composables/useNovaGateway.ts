// The browser calls only NOVA BFF routes. Service keys stay on the server.
export function useNovaGateway() {
  const request = useRequestFetch()
  return {
    getShowcase: () => request('/api/showcase'),
    runNexus: (input: string) => request('/api/nexus/run', { method: 'POST', body: { input } }),
  }
}
