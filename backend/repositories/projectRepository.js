const resolveRepository = require("./resolveRepository");
const Project = require("../models/Project");

const COLUMNS = [
  "id",
  "name",
  "department",
  "lead",
  "status",
  "budget",
  "deadline",
];

const DEFAULT_DATA = [
  {
    id: "p-1",
    name: "Acme Web App Redesign",
    department: "Design",
    lead: "Cody Fisher",
    status: "In Progress",
    budget: 450000,
    deadline: "2026-09-30",
  },
  {
    id: "p-2",
    name: "API Integration Gateway",
    department: "Engineering",
    lead: "Priya Sharma",
    status: "Planning",
    budget: 850000,
    deadline: "2026-11-15",
  },
];

function normalizeFn(input, existing = {}) {
  return {
    ...existing,
    name: String(input.name || existing.name || "").trim(),
    department: String(input.department || existing.department || "Design").trim(),
    lead: String(input.lead || existing.lead || "").trim(),
    status: String(input.status || existing.status || "In Progress").trim(),
    budget: Number(input.budget ?? existing.budget ?? 0) || 0,
    deadline: String(input.deadline || existing.deadline || "").trim(),
  };
}

function validateFn(item) {
  if (!item.name) throw new Error("Project Name is required.");
  if (!item.lead) throw new Error("Project Lead is required.");
  if (!item.deadline) throw new Error("Deadline is required.");
}

module.exports = resolveRepository({
  filename: "projects",
  model: Project,
  sheetName: "Projects",
  columns: COLUMNS,
  defaultData: DEFAULT_DATA,
  normalizeFn,
  validateFn,
});
