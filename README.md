# Catatan App — UTS Container & CI/CD

Aplikasi catatan sederhana (Node.js + Express) yang di-deploy menggunakan Docker dengan pipeline CI/CD GitHub Actions.

## Menjalankan lokal
```bash
docker compose up --build      # buka http://localhost:3000
npm install && npm test         # menjalankan unit test tanpa Docker
```

## Alur CI/CD (`.github/workflows/ci-cd.yml`)
1. **test** — `npm ci` + `npm test` (CI)
2. **build-and-push** — build image Docker dan push ke GHCR (CI)
3. **deploy** — SSH ke server, `docker compose pull && up -d` (CD)

## Secrets repository yang dibutuhkan
| Secret | Isi |
|---|---|
| `SERVER_HOST` | IP/domain server |
| `SERVER_USER` | user SSH |
| `SERVER_SSH_KEY` | private key SSH |
| `GHCR_PAT` | Personal Access Token (scope `read:packages`) untuk pull image di server |
