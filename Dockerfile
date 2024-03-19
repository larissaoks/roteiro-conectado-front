FROM node:alpine as build-stage
USER root
WORKDIR /app
COPY package*.json ./

ARG REACT_APP_URL_BACK_END
ARG REACT_APP_URL_VIA_CEP_API
ENV REACT_APP_URL_BACK_END=$REACT_APP_URL_BACK_END
ENV REACT_APP_URL_VIA_CEP_API=$REACT_APP_URL_VIA_CEP_API

RUN npm ci 
COPY . .
RUN npm run build

FROM nginx:alpine as production-stage

RUN rm /etc/nginx/conf.d/default.conf
RUN echo 'server {' >> /etc/nginx/conf.d/default.conf \
    && echo '    listen 80;' >> /etc/nginx/conf.d/default.conf \
    && echo '    location / {' >> /etc/nginx/conf.d/default.conf \
    && echo '        root /usr/share/nginx/html;' >> /etc/nginx/conf.d/default.conf \
    && echo '        index index.html index.htm;' >> /etc/nginx/conf.d/default.conf \
    && echo '        try_files $uri $uri/ /index.html;' >> /etc/nginx/conf.d/default.conf \
    && echo '    }' >> /etc/nginx/conf.d/default.conf \
    && echo '}' >> /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


