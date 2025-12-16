FROM owasp/modsecurity-crs:nginx

# RUN mkdir -p /etc/modsecurity/
USER root

RUN apt-get update
RUN mkdir -p /etc/ssl/certs/ && chmod 755 /etc/ssl/certs/
# RUN mkdir -p /var/run/nginx/ && chown nginx:nginx /var/run/nginx/

# Revenir à l'utilisateur nginx (important)
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/certs/nginx.key -out /etc/ssl/certs/nginx.crt -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=localhost"

RUN chown nginx:nginx /etc/ssl/certs/nginx.key /etc/ssl/certs/nginx.crt \
    && chmod 600 /etc/ssl/certs/nginx.key \
    && chmod 644 /etc/ssl/certs/nginx.crt
# COPY ./conf/modsecurity.conf /etc/modsecurity/modsecurity.conf

COPY ./conf/waf.conf /etc/nginx/conf.d/waf.conf

RUN rm /etc/nginx/conf.d/default.conf

USER nginx

# ENV NGINX_ENTRYPOINT_QUIET_LOGS=1

EXPOSE 9443

CMD ["nginx", "-g", "daemon off;"]