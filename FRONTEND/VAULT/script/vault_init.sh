#!/usr/bin/env bash
set -e

IF [ -z "$VAULT_ADDR" ]; then
    export VAULT_ADDR='https://localhost:8200'
fi
export VAULT_SKIP_VERIFY=1

if ! vault status -format=json | jq -e .initialized > /dev/null; then
    vault operator init -key-shares=1 -key-threshold=1 -format=json > /tmp/vault_init.json
    ROOT_TOKEN=$(jq -r .root_token /tmp/vault_init.json)
    UNSEAL_KEY=$(jq -r .key[] /tmp/vault_init.json)
fi
else
    ROOT_TOKEN=$(vault read -field=root token/lookup-self)
fi

vault > /dev/null

vault login $ROOT_TOKEN

vault auth list | grep -q approle || vault auth enable approle

vault policy write backend FRONTEND/VAULT/policies/backend.hcl

vault read auth/approle/role/backend-role 2>&1 /dev/null || \
vault write auth/approle/role/backend-role \
    token_ttl=1h \
    token_max_ttl=4h \
    secret_id_ttl=60m \
    policies=backend

# verication de role_id
vault read -field=role_id auth/approle/role/backend-role/role-id

# ROLE_ID=$(vault read -field=role_id auth/approle/role/backend-role/role-id)
# SECRET_ID=$(vault write -f -field=secret_id auth/approle/role/backend-role/secret-id)





