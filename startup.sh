#!/bin/sh

echo "DEBUG: VITE_NOVA_SONDAGEM_API=${VITE_NOVA_SONDAGEM_API}"
echo "DEBUG: VITE_NOVA_SONDAGEM_VERSAO=${VITE_NOVA_SONDAGEM_VERSAO}"
echo "DEBUG: VITE_SGP_API=${VITE_SGP_API}"

envsubst \
  '${VITE_NOVA_SONDAGEM_API} ${VITE_NOVA_SONDAGEM_VERSAO} ${VITE_SGP_API}' \
  < /usr/share/nginx/html/env.js \
  > /tmp/env.js

mv /tmp/env.js /usr/share/nginx/html/env.js

echo "DEBUG: env.js content after envsubst:"
cat /usr/share/nginx/html/env.js

nginx -g 'daemon off;'
