FROM node:12-alpine AS build
WORKDIR /opt/powertac/ui
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:12-alpine
WORKDIR /opt/powertac/ui
RUN npm i -g http-server
COPY --from=build /opt/powertac/ui/dist .
EXPOSE 80
ENTRYPOINT ["http-server", "/opt/powertac/ui", "-p", "80"]
