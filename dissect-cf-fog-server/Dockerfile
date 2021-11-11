FROM node:12
RUN apt-get update && apt-get install -y openjdk-8-jdk

WORKDIR /usr/src/app

RUN git clone -b master https://github.com/andrasmarkus/DISSECT-CF-Fog-WebApp.git .

WORKDIR /usr/src/app/dissect-cf-fog-server

RUN npm install

COPY ./config/dissect-cf-firebase-config.json ./config/

EXPOSE 3000
CMD ["npm", "start"]