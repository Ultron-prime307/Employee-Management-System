const resolveRepository = require("./resolveRepository");
const Report = require("../models/Report");

const COLUMNS = [
  "id",
  "title",
  "type",
  "generatedBy",
  "dateCreated",
  "description",
];

const DEFAULT_DATA = [
  {
    id: "r-1",
    title: "Q2 Headcount Analysis",
    type: "Headcount",
    generatedBy: "Ananya Iyer",
    dateCreated: "2026-07-01",
    description: "Detailed breakdown of hires, terminations, and active contractors for Q2.",
  },
  {
    id: "r-2",
    title: "Annual Payroll Summary",
    type: "Financial",
    generatedBy: "Karan Malhotra",
    dateCreated: "2026-06-15",
    description: "Comparison of department budgets and payroll spending.",
  },
];

function normalizeFn(input, existing = {}) {
  return {
    ...existing,
    title: String(input.title || existing.title || "").trim(),
    type: String(input.type || existing.type || "Headcount").trim(),
    generatedBy: String(input.generatedBy || existing.generatedBy || "System").trim(),
    dateCreated: String(input.dateCreated || existing.dateCreated || new Date().toISOString().slice(0, 10)).trim(),
    description: String(input.description || existing.description || "").trim(),
  };
}

function validateFn(item) {
  if (!item.title) throw new Error("Report Title is required.");
  if (!item.type) throw new Error("Report Type is required.");
}

module.exports = resolveRepository({
  filename: "reports",
  model: Report,
  sheetName: "Reports",
  columns: COLUMNS,
  defaultData: DEFAULT_DATA,
  normalizeFn,
  validateFn,
});
