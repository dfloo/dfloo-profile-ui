FROM node:24.7.0-alpine AS builder
WORKDIR /app

ARG API_SERVER_URL
ARG AUTH0_CLIENT_ID
ARG AUTH0_DOMAIN
ARG AUTH0_AUDIENCE
ARG AUTH0_CALLBACK_URL

ENV API_SERVER_URL=$API_SERVER_URL
ENV AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID
ENV AUTH0_DOMAIN=$AUTH0_DOMAIN
ENV AUTH0_AUDIENCE=$AUTH0_AUDIENCE
ENV AUTH0_CALLBACK_URL=$AUTH0_CALLBACK_URL

COPY ./package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

FROM nginxinc/nginx-unprivileged:alpine3.22 AS runner
COPY nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx --from=builder /app/dist/*/browser /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
