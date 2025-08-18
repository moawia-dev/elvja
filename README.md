# Elvja – All-in-one v2 (MVP → prod-härdad)

Det här repot innehåller en körbar MVP med produktion-hygien:
- Backend (NestJS + Prisma): DTO-validering, global error-handler, throttling (120 req/min), S3-uppladdning (valfritt), CSV-export, AI (opt-in), KPI endpoints.
- Frontend (React/Vite/Tailwind): Dashboard, Onboarding, Brandkit, Editor, AI-verktyg, mörkt läge.
- DevOps: Compose för dev/staging/prod, nginx + Let's Encrypt, GitHub Actions (CI + staging/prod deploy + smoke).

## Lokal start
```bash
docker compose -f docker-compose.dev.yml up -d db redis
cd backend && npm ci && npm run prisma:generate
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/elvja?schema=public"
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
npm run start:dev

# i ny terminal
cd ../frontend && npm ci && npm run dev
```
- Backend: http://localhost:3000
- Frontend: http://localhost:5173

## Staging/Prod
- Fyll i .env variabler (DOMAIN, EMAIL, ev. S3_*).
- På servern:
```bash
export DOMAIN=your.domain EMAIL=ops@company.com
docker compose -f docker-compose.staging.yml up -d
# för prod första gången: ./proxy/obtain-cert.sh
```

## Notis
- OAuth-rutter är stubs (redo att kopplas).
- S3-uppladdning aktiveras när `S3_BUCKET` är satt. Annars används lokal `/uploads`.
- AI är opt-in per request (`useAI: true`).


## v3 LIVE (det här repot)
- **Riktig OAuth** (Google + LinkedIn via Passport) som ger **JWT** i callbacken.
- **JWT Guard** i API; byt ut dev-stubben.
- **Staging/Prod compose** använder **container images** (BACKEND_IMAGE/FRONTEND_IMAGE).
- **GitHub Actions** bygger & pushar till **GHCR**, deployar via SSH, kör **smoke**.

### GitHub Secrets (måste sättas)
**Gemensamt:**
- `S3_BUCKET` (valfritt, aktiverar S3-upload), `S3_REGION`, `CDN_BASE`

**Staging:**
- `STAGING_SSH_HOST`, `STAGING_SSH_USER`, `STAGING_SSH_KEY`
- `STAGING_DOMAIN`, `STAGING_EMAIL`
- `S3_BUCKET`, `S3_REGION`, `CDN_BASE` (om ni vill ha S3 i staging)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
- `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_CALLBACK_URL`
- `JWT_SECRET`

**Production:**
- `PROD_SSH_HOST`, `PROD_SSH_USER`, `PROD_SSH_KEY`
- `PROD_DOMAIN`, `PROD_EMAIL`
- `S3_BUCKET`, `S3_REGION`, `CDN_BASE`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
- `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_CALLBACK_URL`
- `JWT_SECRET`

### Backend ENV (på servern eller via secrets)
```
JWT_SECRET=superhemligt
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://<DOMAIN>/api/auth/google/callback
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
LINKEDIN_CALLBACK_URL=https://<DOMAIN>/api/auth/linkedin/callback
S3_BUCKET=...
S3_REGION=eu-north-1
CDN_BASE=https://<CDN eller S3 public base>
DATABASE_URL=postgresql://postgres:postgres@db:5432/elvja?schema=public
```

### Flöde
1. Push till `staging` → Actions bygger/pushar images → SSH-deploy → smoke mot `/api/health`.
2. Tagga `vX.Y.Z` → samma sak mot **production**.

