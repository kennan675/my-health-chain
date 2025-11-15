# My Health Chain - Architecture Overview

This document outlines the high-level architecture for the My Health Chain platform.

Components:

- Backend: Node.js + TypeScript + Express. Handles authentication, RBAC, business logic, DB access, ledger integration.
- Database: PostgreSQL stores raw medical data encrypted at rest. Contains blockchain_ledger table which stores hashes of records for immutability.
- Cache & sessions: Redis used for session store, caching, and ephemeral data like OTPs.
- Ledger: Hyperledger Fabric (recommended) or the provided simulated ledger module (`/backend/src/core/ledger.ts`) for audit and immutability.
- Frontend: Next.js 14 (app router), React + TypeScript, TailwindCSS, shadcn UI.
- Mobile: Expo managed React Native app for iOS/Android with offline sync.
- Infra: Docker and Kubernetes manifests for production deployment; GitHub Actions for CI/CD.

Security
- AES-256 encryption for stored records.
- RSA for key exchange and key wrapping.
- JWT and OAuth integration (eCitizen) for government SSO.
- Comprehensive audit logging for all actions.

Data Flow
1. User writes a medical record via web/mobile.
2. Server stores encrypted raw data in Postgres.
3. Server computes hash of the record and writes the hash into the blockchain ledger.
4. Audit logs store access events (who, what, when).

Next steps
- Wire ledger to persistent storage and implement verification tooling.
- Implement encryption utilities and key management.
- Implement SMART-on-FHIR API layer.
