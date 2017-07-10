FROM node:7.4
MAINTAINER Maciej Matuszewski <maciek.matuszewski@gmail.com>

WORKDIR /www/app
COPY package.json /www/app/package.json
RUN npm install
COPY . /www/app
