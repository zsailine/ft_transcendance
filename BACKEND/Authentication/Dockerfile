FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm ci
RUN npm install googleapis



COPY . .
# RUN node migration.js

EXPOSE 3002

CMD ["npm", "run", "dev"]