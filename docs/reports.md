# Public reports feed

The frontend public feed is available at `/reports` and supports pagination + interactions.

## Expected backend endpoints (optional but recommended)

If these endpoints don’t exist yet, the UI falls back to `localStorage` (device-local only).

### List reports

- `GET /api/reports/public?page=1&limit=8`
- Response (example):
  - `{ items: Report[], nextPage: number | null }`

### Create a public report

- `POST /api/reports/public-pet` (multipart form-data)
- Fields:
  - `firstName`, `lastName`, `phoneNumber`, `petStatus` (`lost|found`), `location`, `description?`, `photo` (file)

### Comments

- `POST /api/reports/:reportId/comments`
- Body: `{ name?: string, text: string }`

### Reactions

- `POST /api/reports/:reportId/reactions`
- Body: `{ reaction: "like" | "heart" | "help" }`

### Flag content

- `POST /api/reports/:reportId/flag`
- Body: `{ reason: string, details?: string }`

## Frontend files

- Feed page: `src/pages/ReportsFeed.jsx`
- Report card + interactions: `src/components/ReportCard.jsx`
- Local fallback store: `src/lib/localReportsStore.js`
- API wrappers: `src/services/reportsFeed.js`
