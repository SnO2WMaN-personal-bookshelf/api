FROM node:12.18 AS build

WORKDIR /projects

COPY package.json yarn.lock tsconfig.json tsconfig.build.json ./
COPY src ./src

RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:12.18-slim

WORKDIR /projects

COPY package.json yarn.lock ./
COPY --from=build /projects/dist ./dist

RUN yarn install --frozen-lockfile --production

EXPOSE 4000

CMD ["yarn", "run", "start:prod"]
