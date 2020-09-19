FROM mhart/alpine-node:12

RUN mkdir -p /srv/app/frontend
workdir /srv/app/frontend

COPY package*.json /src/app/backend

RUN npm install

COPY . /srv/app/frontend

EXPOSE 3000

CMD [ "npm", "start" ]