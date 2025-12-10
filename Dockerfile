FROM node:22-alpine as build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:1.27.3-alpine
WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist .

COPY configuracoes/default.conf /etc/nginx/conf.d/default.conf

COPY startup.sh /

RUN chmod +x /startup.sh

EXPOSE 80

ENTRYPOINT ["/startup.sh"]
