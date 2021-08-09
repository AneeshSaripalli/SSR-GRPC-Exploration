FROM node:12-alpine

WORKDIR /app

COPY package.json .
COPY tsconfig.json .

RUN npm install && \
    npm update

RUN NODE_ENV=production npm install

COPY . .

RUN NODE_ENV=production npm run build

CMD ["node", "dist"]