FROM node:12
RUN apt-get update && apt-get install -y openjdk-8-jdk

WORKDIR /usr/src/app

RUN git clone https://github.com/andrasmarkus/DISSECT-CF-Fog-WebApp.git

WORKDIR /usr/src/app/DISSECT-CF-Fog-WebApp/dissect-cf-fog-server

RUN npm install

EXPOSE 3000
CMD ["npm", "start"]