# frontend/Dockerfile
FROM node:22-alpine AS base

WORKDIR /app
COPY ./app/. /app/
RUN npm ci

FROM base AS dev
CMD ["npm", "run", "dev"]

FROM base AS prod
CMD ["npm", "run", "prod"]