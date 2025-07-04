FROM node:18-alpine AS builder

WORKDIR /opt

COPY package*.json .

RUN npm install

COPY . .

RUN ls -la

RUN npm run build

FROM nginx:alpine

COPY --from=builder /opt/dist /usr/share/nginx/html