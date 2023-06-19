# Base Stage
FROM node:18-slim AS base
WORKDIR /usr/src/app
COPY package*.json yarn.lock ./

# Dependency Stage
FROM base AS dependencies
RUN yarn install --production

FROM dependencies AS test
CMD [ "yarn", "test" ]

# Development Stage
FROM base AS development
EXPOSE 8080
EXPOSE 8888
CMD [ "yarn", "dev" ]

# Release Stage
FROM base AS release
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
EXPOSE 80
EXPOSE 443
CMD [ "yarn", "serve" ]