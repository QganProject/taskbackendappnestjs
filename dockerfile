
FROM node:16.13-alpine as build
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
RUN cd /app \
&& yarn install 
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start:prod"]

