FROM node:19-alpine
WORKDIR /hb-dcbot
COPY . .
RUN echo -e "update-notifier=false\nloglevel=error" > ~/.npmrc
RUN npm i && node .