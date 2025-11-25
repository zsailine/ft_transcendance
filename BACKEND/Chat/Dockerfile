FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm ci

RUN mkdir -p ./data
COPY migration.js .
COPY ./migrations ./migrations
RUN node migration.js


COPY . .

EXPOSE 3004

CMD ["npm", "run", "dev"]