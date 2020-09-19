FROM node:12

RUN mkdir -p /srv/app/backend
WORKDIR /srv/app/backend


RUN apt-get update
RUN apt-get install -y libgbm-dev wget unzip fontconfig locales gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils

RUN npm install -g sequelize-cli
RUN npm install -g sequelize
RUN npm install dotenv
RUN npm install -g mysql2

COPY package*.json /srv/app/backend

ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

RUN pwd
RUN ls -al
RUN npm install
COPY . /srv/app/backend
RUN sh -c "/wait mysql:3306"

RUN sequelize db:migrate --debug

RUN npx sequelize db:seed:all --debug

EXPOSE 8080

CMD [ "npm", "start" ]