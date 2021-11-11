FROM node:12-alpine
RUN apk --no-cache add git

WORKDIR /usr/src/app

RUN git clone -b master https://github.com/andrasmarkus/DISSECT-CF-Fog-WebApp.git /usr/src/app

WORKDIR /usr/src/app/dissect-cf-fog-client

RUN npm install

EXPOSE 4200
CMD ["npm", "start"]