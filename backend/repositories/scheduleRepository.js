const resolveRepository = require("./resolveRepository");
const Schedule = require("../models/Schedule");

const COLUMNS = [
  "id",
  "employeeId",
  "employeeName",
  "shiftDate",
  "startTime",
  "endTime",
  "role",
  "status",
];

const DEFAULT_DATA = [
  {
    id: "s-1",
    employeeId: "e-cody-fisher",
    employeeName: "Cody Fisher",
    shiftDate: new Date().toISOString().slice(0, 10),
    startTime: "09:00",
    endTime: "17:00",
    role: "Web Designer",
    status: "Scheduled",
  },
  {
    id: "s-2",
    employeeId: "e-priya-sharma",
    employeeName: "Priya Sharma",
    shiftDate: new Date().toISOString().slice(0, 10),
    startTime: "10:00",
    endTime: "18:00",
    role: "Senior Software Engineer",
    status: "Scheduled",
  },
];

function normalizeFn(input, existing = {}) {
  return {
    ...existing,
    employeeId: String(input.employeeId || existing.employeeId || "").trim(),
    employeeName: String(input.employeeName || existing.employeeName || "").trim(),
    shiftDate: String(input.shiftDate || existing.shiftDate || new Date().toISOString().slice(0, 10)).trim(),
    startTime: String(input.startTime || existing.startTime || "09:00").trim(),
    endTime: String(input.endTime || existing.endTime || "17:00").trim(),
    role: String(input.role || existing.role || "Team Member").trim(),
    status: String(input.status || existing.status || "Scheduled").trim(),
  };
}

function validateFn(item) {
  if (!item.employeeName) throw new Error("Employee Name is required.");
  if (!item.shiftDate) throw new Error("Shift Date is required.");
  if (!item.startTime || !item.endTime) throw new Error("Start and End times are required.");
}

module.exports = resolveRepository({
  filename: "schedule",
  model: Schedule,
  sheetName: "Schedule",
  columns: COLUMNS,
  defaultData: DEFAULT_DATA,
  normalizeFn,
  validateFn,
});
