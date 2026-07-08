const fs = require("fs/promises");
const path = require("path");
const { defaultEmployees, makeId } = require("../seed");

const dataDir = path.join(__dirname, "..", "..", "data");
const dataFile = path.join(dataDir, "employees.json");

async function ensureDataFile() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(defaultEmployees, null, 2));
  }
}

async function readEmployees() {
  await ensureDataFile();
  const raw = await fs.readFile(dataFile, "utf8");
  return JSON.parse(raw);
}

async function writeEmployees(employees) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(employees, null, 2));
}

function nextEmployeeCode(employees) {
  const max = employees.reduce((highest, employee) => {
    const match = String(employee.code || "").match(/^#EP(\d+)$/);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  return "#EP" + String(max + 1).padStart(4, "0");
}

function normalizeInput(input, existing = {}) {
  return {
    ...existing,
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

function validateEmployee(employee) {
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

async function list() {
  return readEmployees();
}

async function get(id) {
  const employees = await readEmployees();
  return employees.find((employee) => employee.id === id) || null;
}

async function create(input) {
  const employees = await readEmployees();
  const employee = {
    id: input.id || makeId(),
    code: input.code || nextEmployeeCode(employees),
    ...normalizeInput(input),
  };

  validateEmployee(employee);
  employees.push(employee);
  await writeEmployees(employees);
  return employee;
}

async function update(id, input) {
  const employees = await readEmployees();
  const index = employees.findIndex((employee) => employee.id === id);
  if (index === -1) return null;

  const employee = normalizeInput(input, employees[index]);
  validateEmployee(employee);
  employees[index] = employee;
  await writeEmployees(employees);
  return employee;
}

async function remove(id) {
  const employees = await readEmployees();
  const next = employees.filter((employee) => employee.id !== id);
  if (next.length === employees.length) return false;

  await writeEmployees(next);
  return true;
}

module.exports = { list, get, create, update, remove };
