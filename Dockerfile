# https://medium.com/joolsoftware/how-to-set-up-an-angular-cli-project-with-docker-compose-a3ec78f179ab
FROM node:14.19.0 as node
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
RUN npm install -g @angular/cli
COPY . .
