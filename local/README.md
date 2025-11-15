# Local folder for development

This `local/` folder is intended for ephemeral, developer-only artifacts that should not be committed to source control.

Examples:
- RSA key pairs generated for local testing (store under `local/keys/`)
- SQLite DB or exported DB dumps for local dev
- Local logs or temporary files

Security note: Never commit secrets to the repository. Add any generated keys or secrets to your platform's secret manager or a secure vault in production.

Suggested usage:
- Generate keys into `local/keys` during local setup
- Keep `local/keys` listed in `.gitignore` (provided)

To generate a key pair locally (example, OpenSSL):

```powershell
# generate 2048-bit RSA private key
openssl genrsa -out local/keys/private.pem 2048
# extract public key
openssl rsa -in local/keys/private.pem -pubout -out local/keys/public.pem
```

Or run a Node script in `backend/scripts` if provided.
