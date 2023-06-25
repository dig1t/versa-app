# Base Stage
FROM node:18-slim AS base
WORKDIR /usr/app
COPY package*.json yarn.lock ./

# Dependency Stage
FROM base AS dependencies

FROM dependencies AS test
RUN yarn install --production
COPY . .
CMD [ "yarn", "test" ]

# Development Stage
FROM base AS development
RUN yarn install
COPY . .
EXPOSE 8080
EXPOSE 8888
CMD [ "yarn", "dev" ]

# Release Stage
FROM base AS release
RUN yarn install --production
COPY . .
EXPOSE 80
EXPOSE 443
CMD [ "yarn", "serve" ]