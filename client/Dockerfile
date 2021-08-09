FROM node:12-alpine

RUN apk add python make gcc g++

WORKDIR /app

ARG NPM_TOKEN

COPY package.json .

# Create a temporary .npmrc file and delete it to prevent the NPM_TOKEN
# from being built into any of the FS layers.
RUN npm install && \
    npm update

COPY . .

RUN npm run build

# NGINX web server setup
FROM fholzer/nginx-brotli

WORKDIR /nginx

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /app/build /etc/nginx/html