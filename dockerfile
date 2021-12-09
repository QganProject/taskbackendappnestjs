
FROM node:16.13-alpine as build
WORKDIR /app
COPY package*.json .
RUN yarn
COPY . .
RUN yarn build
EXPOSE 8080/udp
EXPOSE 8080/tcp
CMD ["yarn", "start:prod"]

