const resolveRepository = require("./resolveRepository");
const Job = require("../models/Job");

const COLUMNS = [
  "id",
  "title",
  "department",
  "location",
  "type",
  "salaryRange",
  "status",
  "datePosted",
];

const DEFAULT_DATA = [
  {
    id: "j-1",
    title: "Senior UI/UX Designer",
    department: "Design",
    location: "San Francisco, CA (Hybrid)",
    type: "Full-time",
    salaryRange: "$130k - $160k",
    status: "Open",
    datePosted: "2026-07-01",
  },
  {
    id: "j-2",
    title: "Backend Node.js Engineer",
    department: "Engineering",
    location: "Remote (US/Canada)",
    type: "Contract",
    salaryRange: "$90 - $110 / hr",
    status: "Open",
    datePosted: "2026-07-04",
  },
];

function normalizeFn(input, existing = {}) {
  return {
    ...existing,
    title: String(input.title || existing.title || "").trim(),
    department: String(input.department || existing.department || "Design").trim(),
    location: String(input.location || existing.location || "Remote").trim(),
    type: String(input.type || existing.type || "Full-time").trim(),
    salaryRange: String(input.salaryRange || existing.salaryRange || "").trim(),
    status: String(input.status || existing.status || "Open").trim(),
    datePosted: String(input.datePosted || existing.datePosted || new Date().toISOString().slice(0, 10)).trim(),
  };
}

function validateFn(item) {
  if (!item.title) throw new Error("Job Title is required.");
  if (!item.department) throw new Error("Department is required.");
}

module.exports = resolveRepository({
  filename: "jobs",
  model: Job,
  sheetName: "Jobs",
  columns: COLUMNS,
  defaultData: DEFAULT_DATA,
  normalizeFn,
  validateFn,
});
