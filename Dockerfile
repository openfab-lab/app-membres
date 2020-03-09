FROM node:8-alpine

ENV APP_NAME openfab-membres

# Add wait script to the image. Then used with WAIT_HOSTS env var
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

WORKDIR /var/www

COPY ./config /var/www/config
COPY ./src /var/www/src
COPY ./package.json /var/www/package.json

RUN npm install

CMD npm run wait-start
