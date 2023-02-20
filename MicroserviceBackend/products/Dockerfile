# FROM node:16-alpine

# WORKDIR /app/products

# COPY package.json ./
# COPY tsconfig.json ./

# COPY . .

# RUN ls -a
# RUN yarn install
# RUN yarn build

# ## Stage two: where the app actually runs
# FROM node:16-alpine AS runner
# WORKDIR /app/products
# COPY package.json ./
# RUN yarn install --only=prod

# # Here we copy all of our dist folder to the docker image
# COPY --from=builder /app/products/dist ./


# EXPOSE 8002

# CMD ["yarn", "start:prod"]

FROM node:16-alpine
WORKDIR /app/products
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 8002
CMD ["yarn", "start:prod"]