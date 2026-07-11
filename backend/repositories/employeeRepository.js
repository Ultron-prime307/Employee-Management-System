const resolveRepository = require("./resolveRepository");
const Employee = require("../models/Employee");
const { defaultEmployees } = require("../seed");

const COLUMNS = [
  "id",
  "code",
  "name",
  "email",
  "phone",
  "gender",
  "department",
  "title",
  "status",
  "joined",
  "salary",
];

function normalizeFn(input, existing = {}) {
  return {
    ...existing,
    code: String(input.code || existing.code || "").trim(),
    name: String(input.name || existing.name || "").trim(),
    email: String(input.email || existing.email || "").trim(),
    phone: String(input.phone || existing.phone || "").trim(),
    gender: input.gender || existing.gender || "Other",
    department: input.department || existing.department || "Design",
    title: String(input.title || existing.title || "Team Member").trim(),
    status: input.status || existing.status || "Full-time",
    joined: input.joined || existing.joined || new Date().toISOString().slice(0, 10),
    salary: Number(input.salary ?? existing.salary ?? 0) || 0,
  };
}

function validateFn(employee) {
  if (!employee.name) {
    const error = new Error("Name is required.");
    error.status = 400;
    throw error;
  }

  if (!employee.email) {
    const error = new Error("Email is required.");
    error.status = 400;
    throw error;
  }
}

function nextEmployeeCode(employees) {
  const max = employees.reduce((highest, employee) => {
    const match = String(employee.code || "").match(/^#EP(\d+)$/);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  return "#EP" + String(max + 1).padStart(4, "0");
}

const baseRepo = resolveRepository({
  filename: "employees",
  model: Employee,
  sheetName: process.env.GOOGLE_SHEETS_TAB_NAME || "Employees",
  columns: COLUMNS,
  defaultData: defaultEmployees,
  normalizeFn,
  validateFn,
});

module.exports = {
  ...baseRepo,
  async create(input) {
    const list = await baseRepo.list();
    const code = input.code || nextEmployeeCode(list);
    return await baseRepo.create({ ...input, code });
  },
};
