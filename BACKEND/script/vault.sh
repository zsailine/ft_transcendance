#!/usr/bin/env bash
set -euo pipefail

export VAULT_ADDR=https://vault:8200
export VAULT_SKIP_VERIFY=1  # pour certificat auto-signé local

ROLE_ID=$(vault read -field=role_id auth/approle/role/backend/role-id)

# Générer SECRET_ID à la volée depuis Vault
SECRET_ID=$(vault write -f auth/approle/role/backend/secret-id -format=json | jq -r '.data.secret_id')

# Login Vault pour obtenir token
TOKEN=$(vault write auth/approle/login role_id=$ROLE_ID secret_id=$SECRET_ID -format=json | jq -r '.auth.client_token')

export VAULT_TOKEN=$TOKEN

# Lancer ton backend Node.js
exec node app.js
