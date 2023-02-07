FROM node:16-alpine

WORKDIR /app/products

COPY package.json .

COPY . .

EXPOSE 8002

CMD ["yarn", "start:prod"]