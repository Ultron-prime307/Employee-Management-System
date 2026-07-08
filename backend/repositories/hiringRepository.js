const resolveRepository = require("./resolveRepository");
const Hiring = require("../models/Hiring");

const COLUMNS = [
  "id",
  "candidateName",
  "email",
  "phone",
  "jobTitle",
  "stage",
  "status",
  "interviewDate",
];

const DEFAULT_DATA = [
  {
    id: "h-1",
    candidateName: "Alice Smith",
    email: "alice.smith@example.com",
    phone: "+1 555 9876",
    jobTitle: "Senior UI/UX Designer",
    stage: "Interview",
    status: "Active",
    interviewDate: "2026-07-12",
  },
  {
    id: "h-2",
    candidateName: "Bob Jones",
    email: "bob.jones@example.com",
    phone: "+1 555 4321",
    jobTitle: "Backend Node.js Engineer",
    stage: "Applied",
    status: "Active",
    interviewDate: "",
  },
];

function normalizeFn(input, existing = {}) {
  return {
    ...existing,
    candidateName: String(input.candidateName || existing.candidateName || "").trim(),
    email: String(input.email || existing.email || "").trim(),
    phone: String(input.phone || existing.phone || "").trim(),
    jobTitle: String(input.jobTitle || existing.jobTitle || "").trim(),
    stage: String(input.stage || existing.stage || "Applied").trim(),
    status: String(input.status || existing.status || "Active").trim(),
    interviewDate: String(input.interviewDate || existing.interviewDate || "").trim(),
  };
}

function validateFn(item) {
  if (!item.candidateName) throw new Error("Candidate Name is required.");
  if (!item.email) throw new Error("Email is required.");
  if (!item.jobTitle) throw new Error("Job Title is required.");
}

module.exports = resolveRepository({
  filename: "hiring",
  model: Hiring,
  sheetName: "Hiring",
  columns: COLUMNS,
  defaultData: DEFAULT_DATA,
  normalizeFn,
  validateFn,
});
