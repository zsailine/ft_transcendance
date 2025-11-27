FROM node:22-bullseye

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install googleapis --save

COPY . .
# RUN node migration.js

EXPOSE 3002

CMD ["npm", "run", "dev"]