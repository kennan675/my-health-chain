My Health Chain - Backend

## Quick Start

### 1. Generate keys and secrets (first time only)

```powershell
# Generate RSA key pair (written to local/keys/)
node .\local\generate_keys.js

# Generate AES-256 master key
node .\backend\scripts\generate-aes-key.js
# Copy the output AES_MASTER_KEY=... to your .env.local file
```

### 2. Set up environment

Copy `.env.local.example` to `.env.local` and edit with your values:

```powershell
cd backend
cp .env.local.example .env.local
# Edit .env.local with:
# - Your DATABASE_URL (Postgres connection)
# - The AES_MASTER_KEY from step 1
# - A strong JWT_SECRET
```

### 3. Start infrastructure

```powershell
# From repo root, start Postgres + Redis
cd infra/docker
docker-compose up -d
```

### 4. Initialize database

```powershell
cd backend
npm ci
npm run build
# Run migrations (if any SQL init needed)
psql -U postgres -d mhc -f ../sql/schema.sql
npm run seed
```

### 5. Start the server

```powershell
npm run dev
```

Server will start on `http://localhost:4000`

**Health check:**
```bash
curl http://localhost:4000/health
# { "status": "ok" }
```

## API Endpoints

- `POST /api/auth/login` — authenticate with username/password
- `POST /api/patients` — create a patient (requires auth)
- `GET /api/patients/lookup/:nationalId` — lookup patient by ID

## Architecture Notes

- **Ledger**: Simulated blockchain ledger in `src/core/ledger.ts`. Replace with Hyperledger Fabric for production.
- **Encryption**: AES-256-GCM for data at rest, RSA for key exchange.
- **Keys**: Generated to `local/keys/` (gitignored). Use a secure KMS in production.
- **RBAC**: Role-based access control enforced via `requireRole` middleware.

## Folder Structure

```
backend/
├── src/
│   ├── core/          # Ledger and core business logic
│   ├── routes/        # Express route handlers
│   ├── middleware/    # Auth, RBAC
│   ├── utils/         # Crypto, helpers
│   ├── index.ts       # Server entry
│   ├── config.ts      # Config loader
│   ├── db.ts          # Postgres pool
│   └── logger.ts      # Winston logger
├── scripts/
│   ├── seed.ts        # Database seeding
│   └── generate-aes-key.js
├── package.json
├── tsconfig.json
└── README.md (this file)
```

## Environment Variables

| Variable | Example | Description |
|----------|---------|-------------|
| PORT | 4000 | Server port |
| DATABASE_URL | postgresql://... | Postgres connection |
| REDIS_URL | redis://localhost:6379 | Redis connection |
| JWT_SECRET | your-secret-key | Secret for signing JWTs |
| NODE_ENV | development | Environment |
| AES_MASTER_KEY | (base64 32-byte key) | AES encryption key |
| RSA_KEY_DIR | ./local/keys | Directory containing RSA keys |

## Development

```powershell
# Watch and rebuild on changes
npm run dev

# Type-check and build
npm run build

# Run tests
npm test

# Lint
npm run lint
```

## Production

- Replace the simulated ledger with Hyperledger Fabric.
- Use a managed KMS (Azure Key Vault, AWS Secrets Manager) for key storage.
- Enable HTTPS/TLS.
- Use strong passwords and API keys.
- Enable audit logging and monitoring.
