FROM node:18

WORKDIR /usr/src/app

ARG REGISTRY_TOKEN

COPY ../../ .

RUN npm config set @edotnet:registry https://npm.pkg.github.com/
RUN npm config set //npm.pkg.github.com/:_authToken $REGISTRY_TOKEN

RUN npm i

CMD [ "npm", "run", "start:debug" ]
