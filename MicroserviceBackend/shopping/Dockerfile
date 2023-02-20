# FROM node:16-alpine AS builder

# WORKDIR /app/shopping

# COPY package.json ./
# COPY tsconfig.json ./

# COPY . .

# RUN ls -a
# RUN yarn install
# RUN yarn build

# ## Stage two: where the app actually runs
# FROM node:16-alpine AS runner
# WORKDIR /app/shopping
# COPY package.json ./
# RUN yarn install --only=prod

# # Here we copy all of our dist folder to the docker image
# COPY --from=builder /app/shopping/dist ./

# EXPOSE 8003

# CMD ["yarn", "start:prod"]

FROM node:16-alpine
WORKDIR  /app/shopping
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 8003
CMD ["yarn", "start:prod"]