# FROM node:20.9.0
FROM node:20-alpine
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

WORKDIR /app
COPY package.json .

RUN pnpm install
COPY . .

CMD pnpm run start:dev