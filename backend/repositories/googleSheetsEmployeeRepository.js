const { google } = require("googleapis");
const { defaultEmployees, makeId } = require("../seed");

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

const { client, spreadsheetId } = require("../googleSheetsAuth");
const configuredSheetName = process.env.GOOGLE_SHEETS_TAB_NAME;

let sheetInfo;

function range(a1) {
  return `'${sheetInfo.title.replace(/'/g, "''")}'!${a1}`;
}

async function getSheetInfo() {
  if (sheetInfo) return sheetInfo;

  const res = await client().spreadsheets.get({
    spreadsheetId,
    fields: "sheets(properties(sheetId,title))",
  });

  const sheets = res.data.sheets || [];
  const sheet = configuredSheetName
    ? sheets.find((item) => item.properties.title === configuredSheetName)
    : sheets[0];

  if (!sheet) {
    throw new Error(
      configuredSheetName
        ? `Google Sheets tab "${configuredSheetName}" was not found.`
        : "The spreadsheet does not contain any sheets."
    );
  }

  sheetInfo = {
    id: sheet.properties.sheetId,
    title: sheet.properties.title,
  };
  return sheetInfo;
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

function toRow(employee) {
  return COLUMNS.map((column) => employee[column] ?? "");
}

function fromRow(row) {
  const employee = {};
  COLUMNS.forEach((column, index) => {
    employee[column] = row[index] ?? "";
  });
  employee.salary = Number(employee.salary) || 0;
  return employee;
}

async function ensureSheet() {
  await getSheetInfo();

  const res = await client().spreadsheets.values.get({
    spreadsheetId,
    range: range("A1:K1"),
  });

  const headers = res.data.values?.[0] || [];
  const hasHeaders = COLUMNS.every((column, index) => headers[index] === column);
  if (!hasHeaders) {
    await client().spreadsheets.values.update({
      spreadsheetId,
      range: range("A1:K1"),
      valueInputOption: "RAW",
      requestBody: { values: [COLUMNS] },
    });
  }
}

async function readEmployeesWithRows() {
  await ensureSheet();

  const res = await client().spreadsheets.values.get({
    spreadsheetId,
    range: range("A2:K"),
  });

  const rows = res.data.values || [];
  const employees = rows
    .map((row, index) => ({ employee: fromRow(row), rowNumber: index + 2 }))
    .filter(({ employee }) => employee.id);

  if (employees.length > 0) return employees;

  await client().spreadsheets.values.append({
    spreadsheetId,
    range: range("A:K"),
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: defaultEmployees.map(toRow) },
  });

  return defaultEmployees.map((employee, index) => ({
    employee,
    rowNumber: index + 2,
  }));
}

function nextEmployeeCode(employees) {
  const max = employees.reduce((highest, employee) => {
    const match = String(employee.code || "").match(/^#EP(\d+)$/);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  return "#EP" + String(max + 1).padStart(4, "0");
}

async function list() {
  const rows = await readEmployeesWithRows();
  return rows.map(({ employee }) => employee);
}

async function get(id) {
  const rows = await readEmployeesWithRows();
  return rows.find(({ employee }) => employee.id === id)?.employee || null;
}

async function create(input) {
  const employees = await list();
  const employee = {
    id: input.id || makeId(),
    code: input.code || nextEmployeeCode(employees),
    ...normalizeInput(input),
  };

  validateEmployee(employee);

  await client().spreadsheets.values.append({
    spreadsheetId,
    range: range("A:K"),
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [toRow(employee)] },
  });

  return employee;
}

async function update(id, input) {
  const rows = await readEmployeesWithRows();
  const found = rows.find(({ employee }) => employee.id === id);
  if (!found) return null;

  const employee = normalizeInput(input, found.employee);
  validateEmployee(employee);

  await client().spreadsheets.values.update({
    spreadsheetId,
    range: range(`A${found.rowNumber}:K${found.rowNumber}`),
    valueInputOption: "RAW",
    requestBody: { values: [toRow(employee)] },
  });

  return employee;
}

async function remove(id) {
  const rows = await readEmployeesWithRows();
  const found = rows.find(({ employee }) => employee.id === id);
  if (!found) return false;

  await client().spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: sheetInfo.id,
              dimension: "ROWS",
              startIndex: found.rowNumber - 1,
              endIndex: found.rowNumber,
            },
          },
        },
      ],
    },
  });

  return true;
}

module.exports = { list, get, create, update, remove };
