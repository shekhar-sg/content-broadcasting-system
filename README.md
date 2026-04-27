# Content Broadcasting System

Backend for teacher-to-student content broadcasting with scheduling, approval workflow, and live rotation.

## Stack

- **Express 5** + **TypeScript**
- **PostgreSQL** via **Prisma 7**
- **Zod** validation · **JWT** + **argon2** auth
- **Cloudinary** file uploads (streamed directly, no local disk)
- **Redis** caching for live broadcast

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env` — at minimum you need `DATABASE_URL`, `JWT_SECRET`, and the three `CLOUDINARY_*` vars.

```bash
npm run migrate:deploy   # run migrations
npm run seed             # create principal + demo teacher
npm run dev              # start dev server
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with tsx watch |
| `npm run build` | Compile TypeScript |
| `npm run migrate:dev` | Create + apply a new migration |
| `npm run migrate:deploy` | Apply existing migrations |
| `npm run db:push` | Sync schema without migration (local dev) |
| `npm run seed` | Seed principal + demo teacher |
| `npm run studio` | Open Prisma Studio |
| `npm run check` | Biome format + lint |

## Seeded accounts

| Role | Email | Password |
|------|-------|----------|
| Principal | `principal@school.edu` | `Admin@1234` |
| Teacher | `teacher1@school.edu` | `Teacher@123` |

## API

### Auth

```
POST /api/auth/register
POST /api/auth/login
```

### Content (teacher)

```
POST   /api/content        multipart/form-data — file + metadata
GET    /api/content/mine   ?page=1&limit=10&subject=&status=
```

### Moderation (principal)

```
GET    /api/content                          ?page&limit&subject&status&teacherId
GET    /api/approval/pending
PATCH  /api/approval/:contentId/approve
PATCH  /api/approval/:contentId/reject       { reason }
```

### Live broadcast (public)

```
GET /content/live/:teacherId
GET /content/live/:teacherId?subject=maths
```

### Analytics (principal)

```
GET /api/analytics/subjects
GET /api/analytics/subjects/most-active
GET /api/analytics/teachers
```

## Subjects

`maths` · `science` · `english` · `history` · `geography` · `physics` · `chemistry` · `biology` · `computer`

## Notes

- Principal accounts are seeded only — teachers self-register
- Uploads go directly to Cloudinary CDN; `filePath` in DB is a permanent HTTPS URL
- Redis is optional — if unavailable, live broadcast falls back to DB on every request
- Live rotation uses a UTC midnight anchor so slot order is deterministic across requests

