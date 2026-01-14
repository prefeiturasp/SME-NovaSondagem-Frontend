#!/bin/sh
set -e

envsubst \
  '${VITE_NOVA_SONDAGEM_API} ${VITE_NOVA_SONDAGEM_VERSAO}' \
  < /app/dist/env.js \
  > /tmp/env.js

mv /tmp/env.js /app/dist/env.js

exec "$@"