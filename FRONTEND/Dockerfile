FROM node:alpine AS page-builder

WORKDIR /app
COPY ./package*.json ./
RUN npm ci
COPY ./ ./
RUN npm run build

FROM nginx:stable-alpine

COPY --from=page-builder /app/dist /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
