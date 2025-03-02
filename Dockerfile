FROM node:22-alpine

RUN apk add --no-cache python3 py3-pip make g++

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "node", "dist/index.js" ]