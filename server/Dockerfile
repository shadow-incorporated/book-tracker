FROM node:24-alpine

WORKDIR /app

COPY package*.json ./ 

RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 5000

CMD [ "nodemon", "server.js" ]
