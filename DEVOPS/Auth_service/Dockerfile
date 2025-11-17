FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN node migration.js

COPY . .

EXPOSE 3002

CMD ["npm", "run", "dev"]