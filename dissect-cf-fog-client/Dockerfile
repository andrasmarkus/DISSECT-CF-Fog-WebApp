FROM node:12-alpine
RUN apk --no-cache add git

WORKDIR /usr/src/app

RUN git clone https://github.com/andrasmarkus/DISSECT-CF-Fog-WebApp.git

WORKDIR /usr/src/app/DISSECT-CF-Fog-WebApp/dissect-cf-fog-client

RUN npm install

EXPOSE 4200
CMD ["npm", "start"]