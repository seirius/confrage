FROM node:12.13.1-alpine AS build

WORKDIR /usr/src/app

COPY ./package.json ./package-lock.json ./

RUN npm install && npm install -g @nestjs/cli

COPY ./src ./migration ./test ./nest-cli.json ./tsconfig.build.json ./tsconfig.json ./tslint.json ./

RUN nest build

EXPOSE 3000/tcp

FROM build AS local
COPY --from=jwilder/dockerize /usr/local/bin/dockerize /usr/local/bin

CMD ["npm", "run", "start:prod"]