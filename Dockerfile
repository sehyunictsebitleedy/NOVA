FROM node:24-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci --no-audit --no-fund && npm run build

FROM node:24-alpine AS runtime
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4000
WORKDIR /app
COPY --from=build --chown=node:node /app/apps/portal/.output ./
USER node
EXPOSE 4000
CMD ["node", "server/index.mjs"]
