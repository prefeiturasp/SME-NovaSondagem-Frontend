#!/bin/sh

envsubst \
  '${VITE_NOVA_SONDAGEM_API} ${VITE_NOVA_SONDAGEM_VERSAO}' \
  < /usr/share/nginx/html/env.js \
  > /tmp/env.js

mv /tmp/env.js /usr/share/nginx/html/env.js

nginx -g 'daemon off;'
