FROM node:alpine

WORKDIR /app/eithub/

COPY package*.json ./
RUN npm install

COPY backend ./backend
COPY public ./public

RUN adduser -S -D -h /app/eithub/ eithub eithub

USER eithub

EXPOSE 3000

CMD [ "node", "backend/index.js" ]