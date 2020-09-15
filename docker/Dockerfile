FROM node:12.13.1-slim

WORKDIR /application/
COPY /app/package.json /application/

RUN npm cache clean --force && npm install
COPY /app/ /application/

EXPOSE 3000

CMD [ "npm", "run-script" , "start"]