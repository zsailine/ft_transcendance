FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install



COPY . .
# RUN node migration.js

EXPOSE 3002

CMD ["npm", "run", "dev"]