FROM node:18-alpine as BUILD

WORKDIR /app

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
RUN yarn install

COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json
RUN yarn build


FROM node:18-alpine

WORKDIR /app

COPY --from=BUILD ./app/dist ./dist
COPY --from=BUILD ./app/node_modules ./node_modules
COPY --from=BUILD ./app/package.json ./package.json