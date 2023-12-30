# FROM node:20.9.0
FROM node:20-alpine

WORKDIR /app
COPY package.json .

RUN pnpm install
COPY . .

CMD npm run start:dev