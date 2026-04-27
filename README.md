# Content Broadcasting System Backend

Backend-only implementation of the teacher-to-student content broadcasting assignment using **Express 5**, **TypeScript**, **Prisma 7**, **PostgreSQL**, **Zod**, **argon2**, and **Redis**.

## Stack

- **Node.js + Express 5** 
- **TypeScript** 
- **Database:** PostgreSQL
- **ORM:** Prisma 7 with `@prisma/adapter-pg`
- **Validation:** Zod
- **Auth:** JWT + argon2
- **Uploads:** Multer 2 (local storage)
- **Caching:** Redis via ioredis

## Folder structure

```text
docs/
  postman/
prisma/
  migrations/
  schema.prisma
  seed.ts
src/
  create-app.ts
  main.ts
  common/
    filters/
    guards/
    middleware/
    utils/
  config/
  modules/
    analytics/
    approval/
    auth/
    broadcast/
    content/
  prisma/
```

## Setup

1. Install dependencies

```bash
npm install
```

2. Copy env values

```bash
cp .env.example .env
```

3. Create a PostgreSQL database and update `DATABASE_URL` in `.env`

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/content_broadcasting
```

4. Generate the Prisma client and apply migrations

```bash
npm run generate
npm run migrate
```

5. Seed the principal and demo teacher

```bash
npm run seed
```

6. Start the API

```bash
npm run dev
```

## Available scripts

```bash
npm run dev         # tsx watch
npm run build       # compile TypeScript
npm test            # run Vitest
npm run generate    # prisma generate
npm run migrate     # prisma migrate deploy
npm run db:push     # sync schema directly in local development
npm run seed        # seed principal + demo teacher
npm run studio      # prisma studio
npm run format      # biome format
```

## Seeded accounts

- **Principal:** `principal@school.edu` / `Admin@1234`
- **Teacher:** `teacher1@school.edu` / `Teacher@123`

## API overview

### Auth

- `POST /api/auth/register` — teacher self-registration only
- `POST /api/auth/login` — principal or teacher login

### Teacher content

- `POST /api/content` — upload content
- `GET /api/content/mine` — list own content with status

### Principal moderation

- `GET /api/content` — list all content
- `GET /api/approval/pending` — list pending content
- `PATCH /api/approval/:contentId/approve` — approve content
- `PATCH /api/approval/:contentId/reject` — reject content with reason

### Public broadcasting

- `GET /content/live/:teacherId`
- Optional query: `?subject=maths`

### Analytics

- `GET /api/analytics/subjects`
- `GET /api/analytics/subjects/most-active`
- `GET /api/analytics/teachers`

## Upload rules

- Allowed formats: `jpg`, `jpeg`, `png`, `gif`
- Max size: `10 MB`
- Stored locally in `uploads/`
- Filenames are server-generated

## Scheduling behavior

- Content must be **approved**
- Content must have both `startTime` and `endTime`
- Content is eligible only when `startTime <= now < endTime`
- Rotation is computed per **teacher + subject slot**
- Rotation uses a **UTC midnight anchor** so the order is deterministic
- If no content is eligible, the public API returns:

```json
{
  "success": true,
  "message": "No content available",
  "data": null
}
```

## Validation rules

- `title` is required
- `subject` must be one of the configured subjects
- `startTime` and `endTime` must be provided together
- `endTime` must be after `startTime`
- Only principals can approve or reject
- Rejection requires a non-empty reason

## Postman documentation

Import this collection into Postman:

```text
docs/postman/content-broadcasting-system.postman_collection.json
```

It includes auth, teacher, principal, analytics, and public broadcast requests with collection variables.

## Assumptions

- Principal accounts are seeded, not self-registered
- One uploaded content item belongs to one subject slot
- New content is appended to the end of the slot rotation order
- Redis is optional; if unavailable, live broadcasting still works
