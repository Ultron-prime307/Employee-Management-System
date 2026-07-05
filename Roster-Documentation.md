# Roster — Employee Management System
### Documentation

## 1. Overview
Roster is a self-contained, single-page Employee Management System. It lets you add, edit, search, filter, and remove employee records, view summary analytics on a dashboard, and browse staff grouped by department. All data is saved automatically and privately to your account, so it's still there next time you open the file.

**File:** `roster.html` — open it directly, no installation or server required.

## 2. Data Model
Each employee record contains:

| Field | Description |
|---|---|
| `code` | Auto-generated unique ID, format `EMP-0001` |
| `name` | Full name |
| `email` | Work email address |
| `phone` | Contact number |
| `department` | One of: Engineering, Sales, Marketing, Human Resources, Finance, Operations, Support |
| `title` | Job title |
| `status` | Active / On Leave / Inactive |
| `joined` | Date joined |
| `salary` | Annual salary (numeric, displayed in ₹) |

## 3. Features

### Dashboard
- Headcount totals: Total, Active, On Leave, Inactive
- Headcount by department (bar breakdown)
- Recently joined employees (last 5, sorted by join date)

### Employees
- Full searchable, filterable table of every record (search by name, email, or title; filter by department and status)
- **Add Employee** — opens a form panel to create a new record; a unique employee code is generated automatically
- **Edit** — update any field on an existing record
- **Delete** — remove a record (with a confirmation prompt)
- Click any row to open a full **personnel file** detail view with all fields, plus Edit/Delete shortcuts

### Departments
- Auto-generated cards for every department currently in use, showing headcount and a preview of team members

## 4. How To

**Add an employee**
1. Click **+ Add Employee** (Dashboard or Employees page)
2. Fill in name, email, department, title, status, join date, and salary
3. Click **Save Employee**

**Edit an employee**
1. Click a row to open their file, or click **Edit** directly from the table
2. Update fields and click **Save Employee**

**Delete an employee**
1. Click **Delete** from the table row or the detail view
2. Confirm the prompt

**Search & filter**
- Type in the search box to match name, email, or title
- Use the Department / Status dropdowns to narrow the list further (combinable with search)

## 5. Data Storage & Privacy
- Data is stored using the app's built-in persistent storage, scoped privately to your account — no one else can see it.
- Nothing is sent to an external server; all logic runs in the page itself.
- The app ships with 5 sample employees pre-loaded on first use so the Dashboard and table aren't empty; edit or delete these freely.

## 6. Design Notes
- **Layout:** fixed sidebar navigation (Dashboard / Employees / Departments) with a content area on the right.
- **Visual language:** an "official ledger" aesthetic — serif headings (Fraunces) for structure, a clean sans body (IBM Plex Sans) for readability, and monospace (IBM Plex Mono) for employee codes, echoing a filing/records system.
- **Color coding:** each department has a distinct accent color used consistently across avatars, department cards, and the detail-view tab, so a department is recognizable at a glance anywhere in the app.
- **Status badges:** green = Active, amber = On Leave, red-brown = Inactive.
- Fully responsive down to mobile (sidebar collapses to icon-only).

### Design Inspiration
- The interface was shaped with inspiration from the HR dashboard concept at [this Dribbble shot](https://dribbble.com/shots/25121521-HR-Management-Dashboard-Design), using a similar dashboard-first structure, refined typography, and department-based visual hierarchy.

## 7. Possible Extensions
If you'd like to grow this further, natural next steps include:
- CSV export/import of employee records
- Role-based access (admin vs viewer)
- Org-chart / reporting-line view
- Attendance or leave-tracking module
- Multi-user shared roster (the storage layer already supports a "shared" mode for this)

## 8. Support
This is a static, client-side app — if you want changes to fields, styling, or new features (e.g., CSV export, org chart, leave tracking), just ask and it can be extended.
