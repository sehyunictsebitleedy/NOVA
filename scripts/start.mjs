process.env.PORT ||= '4000'
process.env.HOST ||= '127.0.0.1'
await import('../apps/portal/.output/server/index.mjs')
