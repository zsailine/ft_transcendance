FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY .env env

COPY . .

EXPOSE 3005

CMD ["npm", "run", "dev"]