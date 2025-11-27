FROM node:22-bullseye

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN mkdir -p ./data
COPY migration.js .
COPY ./migrations ./migrations
RUN node migration.js


COPY . .

EXPOSE 3004

CMD ["npm", "run", "dev"]