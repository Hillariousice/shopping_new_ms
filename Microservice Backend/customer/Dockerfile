FROM node:16-alpine

WORKDIR /app/customer

COPY package.json .

COPY . .

EXPOSE 8001

CMD ["yarn", "start:prod"]