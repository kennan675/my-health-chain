# My Health Chain - Local Setup & Build Guide

## Environment Issue

The current PowerShell session has **script execution disabled**. To fix this and run npm commands:

### Fix PowerShell Execution Policy

**Option 1: Run PowerShell as Administrator**

```powershell
# Open PowerShell as Administrator, then:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Confirm with 'Y' when prompted
```

Then all npm commands will work normally.

**Option 2: Use Command Prompt (cmd.exe) instead**

```cmd
cd C:\workspace\my-health-chain\backend
npm ci
npm run build
npm test
```

**Option 3: Use Git Bash or WSL**

```bash
cd /workspace/my-health-chain/backend
npm ci
npm run build
```

---

## Installation Commands (Once PowerShell is Fixed)

### Backend Setup

```powershell
cd C:\workspace\my-health-chain\backend

# Install dependencies
npm ci

# Type-check and compile
npm run build

# Run tests (if configured)
npm test

# Start dev server (watch mode)
npm run dev

# Seed database (requires Postgres running)
npm run seed
```

### Frontend Setup

```powershell
cd C:\workspace\my-health-chain\frontend

# Install dependencies
npm ci

# Build next.js app
npm run build

# Start dev server
npm run dev
```

### Mobile Setup

```powershell
cd C:\workspace\my-health-chain\mobile

# Install dependencies
npm ci

# Start Expo dev server
npm start
```

---

## Complete Local Development Setup (Step-by-Step)

### Step 1: Fix PowerShell (Windows Only)

```powershell
# Open PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# Type 'Y' and press Enter
```

### Step 2: Start Infrastructure

```powershell
cd C:\workspace\my-health-chain\infra\docker
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379

### Step 3: Initialize Database

```powershell
cd C:\workspace\my-health-chain\sql

# Using psql (if installed)
psql -U postgres -d mhc -f schema.sql

# Or using a database GUI tool (DBeaver, pgAdmin, etc.)
# - Connect to localhost:5432 (postgres/postgres)
# - Create database 'mhc'
# - Run sql/schema.sql
```

### Step 4: Install & Start Backend

```powershell
cd C:\workspace\my-health-chain\backend

npm ci
npm run seed
npm run dev
```

**Expected output:**
```
Backend running on port 4000
```

**Test:**
```powershell
curl http://localhost:4000/health
# Should return: {"status":"ok"}
```

### Step 5: Install & Start Frontend (New Terminal)

```powershell
cd C:\workspace\my-health-chain\frontend

npm ci
npm run dev
```

**Expected output:**
```
ready - started server on 0.0.0.0:3000
```

**Open browser:** http://localhost:3000

### Step 6: Install & Start Mobile (New Terminal, Optional)

```powershell
cd C:\workspace\my-health-chain\mobile

npm ci
npm start
```

**Expected output:**
```
Expo dev server is running at http://localhost:19000
```

Scan QR code with Expo Go app on your phone, or use Android emulator.

---

## Build & Test Commands

### Backend

```powershell
cd backend

# Type-check (no emit)
npm run build

# Run tests
npm test

# Run linter
npm run lint

# Watch mode (for development)
npm run dev
```

### Frontend

```powershell
cd frontend

# Build for production
npm run build

# Start production build
npm start

# Lint
npm run lint
```

### Mobile

```powershell
cd mobile

# Prebuild for native compilation
npx expo prebuild

# Build APK (Android)
npm run android

# Build IPA (iOS)
npm run ios

# Expo web preview
npm run web
```

---

## Troubleshooting

### Issue: "npm: command not found"

**Solution:** Node.js is not installed or not in PATH

```powershell
# Check if installed
node --version
npm --version

# If not found, install from https://nodejs.org/
```

### Issue: "Cannot find module 'express'"

**Solution:** Dependencies not installed or outdated

```powershell
cd backend
npm ci  # Clean install
```

### Issue: "ECONNREFUSED 127.0.0.1:5432" (PostgreSQL)

**Solution:** Database not running

```powershell
# Verify Docker is running
docker ps

# Start if not running
cd infra/docker
docker-compose up -d

# Check logs
docker-compose logs postgres
```

### Issue: "Port 4000 already in use"

**Solution:** Another process is using the port

```powershell
# Find process on port 4000
netstat -ano | findstr :4000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or use different port
set PORT=4001
npm run dev
```

### Issue: TypeScript compile errors

**Solution:** Make sure dependencies are installed and types are available

```powershell
cd backend
npm ci
npm install --save-dev @types/node
npm run build
```

---

## Environment Variables

### Backend (.env.local)

Create `backend/.env.local`:

```
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mhc
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-dev-secret-key-here
AES_MASTER_KEY=ZKf7nJ2xykPgfWm4fxaTIndXL/ikIoL0RwkT1s/X63M=
NODE_ENV=development
```

### Frontend (.env.local)

Create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Mobile (N/A)

Mobile uses environment detection for localhost by default.

---

## Verification Checklist

After setup, verify everything works:

- [ ] Docker containers running: `docker ps`
- [ ] PostgreSQL accessible: `psql -U postgres -d mhc`
- [ ] Redis accessible: `redis-cli ping`
- [ ] Backend running: `curl http://localhost:4000/health`
- [ ] Frontend running: Open http://localhost:3000
- [ ] Can login to frontend (test user: admin / adminpassword after seed)
- [ ] Mobile app starts in Expo

---

## Database Seeding

To populate the database with initial data:

```powershell
cd backend
npm run seed
```

This creates:
- Roles: Patient, Doctor, Nurse, Hospital Admin, Super Admin
- Sample Hospital: Nairobi General Hospital
- Admin User: username=admin, password=adminpassword (bcrypt hashed)

**Login credentials for testing:**
```
Username: admin
Password: adminpassword
```

---

## API Testing

Once backend is running, test endpoints:

```powershell
# Health check
curl http://localhost:4000/health

# Login (get JWT token)
curl -X POST http://localhost:4000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"adminpassword"}'

# The response will have a token. Use it for subsequent requests:
curl -H "Authorization: Bearer YOUR_TOKEN" `
  http://localhost:4000/api/patients/lookup/KE123456789
```

Or use a REST client like **Postman**, **Insomnia**, or **VS Code REST Client**.

---

## Performance Notes

### Backend
- Start time: ~2-5 seconds
- Memory usage: ~80-120 MB
- CPU: Minimal (idle < 1%)

### Frontend
- Build time: ~30-60 seconds first build, ~5-10 seconds incremental
- Dev server startup: ~3-5 seconds
- Memory usage: ~200-300 MB

### Mobile (Expo)
- Startup time: ~10 seconds
- Requires Expo Go app installed on phone/emulator

---

## Next Steps After Setup

1. **Run tests** (when implemented):
   ```powershell
   cd backend
   npm test
   ```

2. **Build for production**:
   ```powershell
   cd backend && npm run build
   cd ../frontend && npm run build
   cd ../mobile && npm run android  # or npm run ios
   ```

3. **Deploy to cloud** (see DEPLOYMENT.md):
   ```bash
   helm install my-health-chain infra/helm -n mhc
   ```

---

## Useful Commands Summary

| Command | Description |
|---------|-------------|
| `npm ci` | Clean install (use for CI/CD) |
| `npm install` | Install with package-lock updates |
| `npm run build` | Compile/type-check |
| `npm test` | Run tests |
| `npm run dev` | Start dev server (watch mode) |
| `npm start` | Start production server |
| `npm run lint` | Run linter |
| `docker-compose up -d` | Start Docker containers |
| `docker-compose down` | Stop Docker containers |
| `psql -U postgres -d mhc` | Connect to database |
| `redis-cli` | Connect to Redis |

---

## Support

For detailed information, see:
- `/backend/README.md` — Backend setup & API details
- `/frontend/README.md` — Frontend setup & pages
- `/mobile/README.md` — Mobile setup & screens
- `/docs/DEPLOYMENT.md` — Cloud deployment guide
- `/docs/ARCHITECTURE.md` — System architecture
- `/PROJECT_SUMMARY.md` — Complete project overview

---

**Last Updated:** 2025-11-15  
**Status:** Ready for local development (pending PowerShell fix on Windows)
