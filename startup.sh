#!/bin/sh

echo "DEBUG: VITE_NOVA_SONDAGEM_API=${VITE_NOVA_SONDAGEM_API}"
echo "DEBUG: VITE_NOVA_SONDAGEM_VERSAO=${VITE_NOVA_SONDAGEM_VERSAO}"

envsubst \
  '${VITE_NOVA_SONDAGEM_API} ${VITE_NOVA_SONDAGEM_VERSAO}' \
  < /usr/share/nginx/html/env.js \
  > /tmp/env.js

mv /tmp/env.js /usr/share/nginx/html/env.js

echo "DEBUG: env.js content after envsubst:"
cat /usr/share/nginx/html/env.js

nginx -g 'daemon off;'
