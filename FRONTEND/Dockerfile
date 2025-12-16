FROM node:22-bullseye AS page-builder

WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY ./ ./
RUN npm run build

# lancment de serveur node pour servir les fichiers statics

EXPOSE 8080

CMD ["npx", "serve", "-s", "dist", "-l", "8080"]

