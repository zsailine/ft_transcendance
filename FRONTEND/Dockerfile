FROM node:22-bullseye AS page-builder

WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY ./ ./
RUN npm run build

FROM alpine AS waf_modsec

RUN apk add --no-cache \
  git g++ make automake autoconf libtool \
  pcre2-dev libxml2-dev yajl-dev curl-dev \
  linux-headers openssl-dev geoip-dev \
  zlib-dev

RUN git clone --depth 1 https://github.com/SpiderLabs/ModSecurity \
    && cd ModSecurity \
    && git submodule init \
    && git submodule update \
    && sed -i '1i #include <cstdint>' headers/modsecurity/collection/collection.h \
    && sed -i '1i #include <cstdint>' headers/modsecurity/collection/collections.h \
    && ./build.sh \
    && ./configure \
    && make \
    && make install

RUN git clone --depth 1 https://github.com/SpiderLabs/ModSecurity-nginx.git

RUN wget http://nginx.org/download/nginx-1.24.0.tar.gz \
    && tar xvf nginx-1.24.0.tar.gz \
    && cd nginx-1.24.0 \
    && ./configure --with-compat --add-dynamic-module=../ModSecurity-nginx \
    && make modules


FROM nginx:alpine 

RUN apk --no-cache add openssl
RUN mkdir -p /etc/ssl/certs
RUN openssl req -x509 -nodes -days 365 \
    -subj "/C=FR/ST=Denial/L=Springfield/O=Dis/CN=www.example.com" \
    -newkey rsa:2048 \
    -keyout /etc/ssl/certs/nginx-selfsigned.key \
    -out /etc/ssl/certs/nginx-selfsigned.crt

COPY --from=page-builder /app/dist /usr/share/nginx/html

COPY --from=waf_modsec /ModSecurity/modsecurity.conf-recommended /etc/modesecurity/modsecurity.conf
COPY --from=waf_modsec /nginx-1.24.0/objs/ngx_http_modsecurity_module.so /etc/nginx/modules/ngx_http_modsecurity_module.so

RUN sed -i 's/SecRuleEngine DetectionOnly/SecRuleEngine On/' /etc/modesecurity/modsecurity.conf

RUN chown -R nginx:nginx /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf


EXPOSE 8443

CMD ["nginx", "-g", "daemon off;"]
