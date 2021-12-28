FROM node:16.13-alpine3.12
WORKDIR /app
ADD package*.json ./
RUN npm install
ADD . .
WORKDIR /app/client
ADD /client/package*.json ./
RUN npm install
WORKDIR /app
CMD npm run dev
