FROM node:lts-alpine AS build
WORKDIR /service-manager
#RUN npm install -g @vue/cli
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:lts-alpine
WORKDIR /service-manager
RUN npm i -g http-server
COPY --from=build /service-manager/dist .
VOLUME /service-manager/discovery.json
EXPOSE 80
ENTRYPOINT ["http-server", "/service-manager", "-p", "80"]