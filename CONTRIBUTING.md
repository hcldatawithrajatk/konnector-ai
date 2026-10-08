# Contributing to Konnector AI

Thank you for contributing to **Konnector AI: Your Digital Workforce on WhatsApp**.

---

## Code of Conduct
We are committed to providing a welcoming, secure, and harassment-free environment for all contributors.

---

## Development Setup

1. **Prerequisites:**
   - Node.js `v20.x` or later
   - Docker & Docker Compose
   - PostgreSQL 16 (with `pgvector` extension)
   - Redis 7

2. **Clone & Install:**
   ```bash
   git clone https://github.com/your-org/konnector-ai.git
   cd konnector-ai
   npm run install:all
   ```

3. **Environment Configuration:**
   ```bash
   cp .env.example .env
   cp apps/backend/.env.example apps/backend/.env
   cp apps/frontend/.env.example apps/frontend/.env
   ```

4. **Run Database Migrations & Seeds:**
   ```bash
   cd apps/backend
   npx prisma generate
   npx prisma db push
   npm run prisma:seed
   ```

5. **Start Dev Servers:**
   ```bash
   # From root:
   npm run dev:backend   # NestJS on port 4000
   npm run dev:frontend  # Next.js on port 3000
   ```

---

## Testing & Quality Assurance

Always run tests before submitting a Pull Request:
```bash
# Run all backend unit tests:
cd apps/backend
npm run test

# Run type check and lint:
npm run lint
```

---

## Git Workflow & Branching
Please consult [`BRANCHING_STRATEGY.md`](./BRANCHING_STRATEGY.md) for branch naming conventions, Conventional Commits format, and PR rules.
