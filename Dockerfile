#####################################
## Build
FROM node:14.9-alpine3.10 as builder
WORKDIR /app/eithub/
COPY core ./core
COPY apps ./apps
COPY package*.json ./
RUN npm install


#####################################
# Test
RUN npm audit
RUN npm run test


#####################################
# Release
EXPOSE 3000
# Set user context and execute startup
USER node
CMD ["npm", "start"]