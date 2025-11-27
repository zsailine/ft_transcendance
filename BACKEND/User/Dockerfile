FROM node:22

WORKDIR /app

COPY package*.json ./

RUN mkdir ./data
RUN npm install
COPY migration.js .
COPY ./migrations ./migrations
RUN ls -la ./migrations
RUN node migration.js


COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]