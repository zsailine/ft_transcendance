FROM node:22-bullseye AS page-builder

WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY ./ ./
RUN npm run build

FROM nginx:alpine

RUN apk --no-cache add openssl
RUN mkdir -p /etc/ssl/certs
RUN openssl req -x509 -nodes -days 365 \
    -subj "/C=FR/ST=Denial/L=Springfield/O=Dis/CN=www.example.com" \
    -newkey rsa:2048 \
    -keyout /etc/ssl/certs/nginx-selfsigned.key \
    -out /etc/ssl/certs/nginx-selfsigned.crt

COPY --from=page-builder /app/dist /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf


EXPOSE 8443

CMD ["nginx", "-g", "daemon off;"]
