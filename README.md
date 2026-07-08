# Brightly — Employee Management System

A self-contained, single-page employee management dashboard with a modern dark UI. Open `roster.html` in any browser — no install or server required.

## Features

- **Dashboard** — stat cards with trends, work performance chart, attendance gauge, and employee preview table
- **Employee management** — add, edit, delete, search, and filter records
- **Departments** — auto-generated department cards with team previews
- **Persistent storage** — data saved locally and restored on reload
- **Keyboard shortcut** — `Ctrl+K` / `⌘K` to focus global search

## Quick Start

1. Run `npm start`
2. Open `http://127.0.0.1:8080/` in your browser
2. Browse the dashboard or use **+ Add New** to create employees
3. Click any row to view full employee details

You can still open [`roster.html`](roster.html) directly, but the page will use browser storage instead of the backend API.

## Backend

The app includes an Express backend with employee CRUD routes:

- `GET /api/health`
- `GET /api/employees`
- `GET /api/employees/:id`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`

By default, data is stored in `data/employees.json`. To use MongoDB, copy `.env.example` to `.env` and set `MONGODB_URI`.

To use Google Sheets, copy `.env.example` to `.env`, set `GOOGLE_SHEETS_SPREADSHEET_ID`, and add service account credentials with either `GOOGLE_APPLICATION_CREDENTIALS` or `GOOGLE_SERVICE_ACCOUNT_EMAIL` plus `GOOGLE_PRIVATE_KEY`. Share the spreadsheet with the service account email so the backend can read and write employee rows. Google Sheets takes priority when `GOOGLE_SHEETS_SPREADSHEET_ID` is set.

## Tech

- Single HTML frontend (HTML + CSS + JavaScript)
- Express REST API
- JSON file storage by default, optional MongoDB through Mongoose or Google Sheets through the Sheets API
- SVG charts rendered in vanilla JS

See [Roster-Documentation.md](Roster-Documentation.md) for full field reference and usage guide.
