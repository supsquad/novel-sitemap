FROM node:18-alpine

WORKDIR /app

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
RUN yarn install

COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json
RUN yarn build