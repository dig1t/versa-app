FROM node:18-slim AS base
WORKDIR /usr/src/app
COPY package*.json yarn.lock ./

FROM base AS dependencies
RUN yarn install

FROM dependencies AS test
COPY . .
RUN yarn run test

FROM node:18-slim AS release
WORKDIR /usr/src/app
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY package*.json yarn.lock ./
CMD [ "node", "dist/index.js" ]