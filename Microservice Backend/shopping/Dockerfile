FROM node:16-alpine

WORKDIR /app/shopping

COPY package.json .

COPY . .

EXPOSE 8003

CMD ["yarn", "start:prod"]