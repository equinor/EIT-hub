FROM node

WORKDIR /app/eithub/

COPY package*.json ./
RUN npm install

COPY backend ./backend
COPY public ./public

USER node

EXPOSE 3000

CMD [ "node", "backend/index.js" ]