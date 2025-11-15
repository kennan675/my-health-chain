# My Health Chain

National digital health record system for Kenya — monorepo scaffold.

This repository contains three main components:

- **backend**: Node.js + TypeScript API server (Express)
- **frontend**: Next.js 14 app (React + TypeScript + Tailwind + shadcn)
- **mobile**: React Native (Expo) app

**Security**: AES-256 encrypted records, RSA key-exchange, blockchain-backed immutability (Hyperledger Fabric or simulated ledger module)

## Quick Start (Local Dev)

**FIRST TIME ONLY: Fix PowerShell Execution Policy** (Windows)
```powershell
# Open PowerShell as Administrator and run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then proceed:

### 1. Generate keys and secrets

```powershell
# Generate RSA key pair (stored in local/keys/)
node .\local\generate_keys.js

# Generate AES-256 key
node .\backend\scripts\generate-aes-key.js
# Copy the output line into your .env.local
```

### 2. Start infrastructure (Postgres + Redis)

```powershell
cd infra/docker
docker-compose up -d
```

### 3. Initialize backend

```powershell
cd backend
npm ci
npm run build
psql -U postgres -d mhc -f ../sql/schema.sql
npm run seed
npm run dev
```

Server runs at http://localhost:4000/health

### 4. Next: Start frontend (Next.js)

```powershell
cd frontend
npm ci
npm run dev
```

Frontend runs at http://localhost:3000

## Project Structure

- `/backend` — Express + Node API
- `/frontend` — Next.js 14 app (App Router)
- `/mobile` — React Native (Expo)
- `/sql` — PostgreSQL schema and seed scripts
- `/infra` — Docker compose, Kubernetes manifests, Helm charts
- `/local` — Development artifacts (keys, env files) — **gitignored**
- `/docs` — Architecture, API docs, ERD

## Security & Architecture

See `/docs/ARCHITECTURE.md` for details on:
- Blockchain ledger integration
- Data flow and encryption
- Role-based access control (RBAC)
- Audit logging

## Key Files

- `sql/schema.sql` — Full database schema
- `backend/src/core/ledger.ts` — Simulated blockchain ledger
- `backend/src/utils/crypto.ts` — AES-256 + RSA utilities
- `backend/src/middleware/auth.ts` — JWT + RBAC middleware
- `infra/docker/docker-compose.yml` — Local dev infrastructure

## Next Steps

See `/SETUP_GUIDE.md` for **detailed step-by-step local setup instructions** including:
- PowerShell execution policy fix
- Docker infrastructure startup
- Database initialization
- Backend, frontend, and mobile installation
- Troubleshooting common issues

## Key References

- `/SETUP_GUIDE.md` — Complete local setup guide
- `/PROJECT_SUMMARY.md` — Full project overview with status
- `/FILE_STRUCTURE.md` — Detailed file tree and architecture
- `/docs/ARCHITECTURE.md` — System design and data flow
- `/docs/DEPLOYMENT.md` — Cloud deployment (Azure, AWS, Safaricom)
- `/backend/README.md` — Backend-specific setup
- `/frontend/README.md` — Frontend-specific setup
- `/mobile/README.md` — Mobile app setup
