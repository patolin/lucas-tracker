# frontend/Dockerfile
FROM node:22-alpine

WORKDIR /app
COPY . /app/

RUN npm ci

RUN npm run build

CMD ["npm", "run", "start"]