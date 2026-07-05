# Brightly — Employee Management System
### Documentation

## 1. Overview

Brightly is a self-contained, single-page Employee Management System with a modern dark dashboard UI. It lets you add, edit, search, filter, and remove employee records, view summary analytics, charts, and browse staff grouped by department. All data is saved automatically in your browser.

**File:** `roster.html` — open it directly, no installation or server required.

## 2. Data Model

Each employee record contains:

| Field | Description |
|---|---|
| `code` | Auto-generated unique ID, format `#EP0001` |
| `name` | Full name |
| `email` | Work email address |
| `phone` | Contact number |
| `department` | Engineering, Sales, Marketing, Human Resources, Finance, Operations, Design, Support |
| `title` | Job title |
| `status` | Full-time / Freelance / Part-time / On Leave |
| `gender` | Male / Female / Other |
| `joined` | Date joined |
| `salary` | Annual salary (numeric, displayed in ₹) |

## 3. Features

### Dashboard
- KPI cards: Total Employee, New Employee, Man Employee, Woman Employee (with month-over-month trends)
- **Work Performance** — line chart showing active workforce percentage over time
- **Attendance Overview** — semi-circular gauge (On Time, Delay Time, On Leave)
- **All Employee** — preview table with search and quick actions

### Employee
- Full searchable, filterable table (search by name, email, or title; filter by department and status)
- **Add New** — create a record with auto-generated employee code
- **Edit / Delete** — from table row actions or detail drawer
- Click any row to open a full detail view

### Departments
- Cards for every department in use, showing headcount and team preview

### Other Sections
Schedule, Projects, Report, Notes, Job, and Hiring are placeholder views for future expansion.

## 4. How To

**Add an employee**
1. Click **Add New** (header) or open the Employee page
2. Fill in name, email, department, title, status, gender, join date, and salary
3. Click **Save Employee**

**Edit an employee**
1. Click a row to open their detail drawer, or use **Edit** from the table
2. Update fields and click **Save Employee**

**Delete an employee**
1. Click **Delete** from the row menu or detail view
2. Confirm the prompt

**Search**
- Use the sidebar search (⌘K / Ctrl+K) or the Employee page search box
- Filter by Department and Status dropdowns on the Employee page

## 5. Data Storage & Privacy
- Data is stored in `localStorage` under keys `brightly:employees` and `brightly:seq`
- Nothing is sent to an external server; all logic runs in the page
- The app ships with sample employees on first use; edit or delete them freely
- Legacy data from the previous "Roster" theme is migrated automatically on load

## 6. Design Notes
- **Theme:** Dark mode "Brightly" dashboard inspired by modern HR dashboard concepts
- **Layout:** Fixed sidebar with Dashboard, Schedule, Employee, Departments, Projects, Report, Notes, Job, Hiring
- **Typography:** Inter (Google Fonts)
- **Charts:** Pure SVG — no external chart libraries
- **Status indicators:** Green = Full-time, Blue = Freelance, Orange = Part-time, Cyan = On Leave
- Fully responsive down to mobile (sidebar collapses to icon-only)

## 7. Possible Extensions
- CSV export/import of employee records
- Role-based access (admin vs viewer)
- Org-chart / reporting-line view
- Attendance or leave-tracking module
- Full implementation of Schedule, Projects, Report, Notes, Job, and Hiring sections

## 8. Support
This is a static, client-side app. For changes to fields, styling, or new features, extend `roster.html` directly.
