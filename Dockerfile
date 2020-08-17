FROM node

WORKDIR /app/eithub/

COPY package*.json ./
RUN npm install

COPY core ./core
COPY apps ./apps

USER node

EXPOSE 3000

CMD [ "node", "apps/shuttle/services/index.js" ]