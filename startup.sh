#!/bin/sh

echo "VITE_NOVA_SONDAGEM_API=${VITE_NOVA_SONDAGEM_API}"
echo "VITE_NOVA_SONDAGEM_VERSAO=${VITE_NOVA_SONDAGEM_VERSAO}"

cd /usr/share/nginx/html/assets
for file in $(ls); do
  cp "$file" "/tmp/$file"
  envsubst '${VITE_NOVA_SONDAGEM_API} ${VITE_NOVA_SONDAGEM_VERSAO}' < "/tmp/$file" > "$file"
  rm "/tmp/$file"
done

nginx -g 'daemon off;'
