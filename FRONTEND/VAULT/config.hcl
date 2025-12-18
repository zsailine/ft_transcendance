ui = true

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_cert_file = "/vault/config/vault.crt"
  tls_key_file  = "/vault/config/vault.key"
  tls_disable = 1

}

storage "file" {
  path = "/vault/data"

}

seal "awskms" {
  region     = "eu-west-1"
  kms_key_id = "alias/vault-unseal"
}
