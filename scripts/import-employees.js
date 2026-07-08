const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");
const dataFile = path.join(dataDir, "employees.json");
const { makeId } = require("../backend/seed");

// Helper to generate employee code
function generateCode(existingEmployees) {
  const max = existingEmployees.reduce((highest, emp) => {
    const match = String(emp.code || "").match(/^#EP(\d+)$/);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  return "#EP" + String(max + 1).padStart(4, "0");
}

// Simple CSV parser that handles quotes and commas
function parseCSV(text) {
  const lines = text.split(/\r?\n/);
  const result = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const row = [];
    let inQuotes = false;
    let currentField = "";
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(currentField.trim());
        currentField = "";
      } else {
        currentField += char;
      }
    }
    row.push(currentField.trim());
    result.push(row);
  }
  return result;
}

function importCSV(csvPath) {
  try {
    if (!fs.existsSync(csvPath)) {
      console.error(`Error: File not found at ${csvPath}`);
      return;
    }
    
    const content = fs.readFileSync(csvPath, "utf8");
    const rows = parseCSV(content);
    
    if (rows.length < 2) {
      console.error("Error: CSV must contain a header row and at least one data row.");
      return;
    }
    
    // Normalize headers
    const headers = rows[0].map(h => h.toLowerCase().replace(/[\s_]/g, ""));
    const dataRows = rows.slice(1);
    
    // Read current database file
    let existingEmployees = [];
    if (fs.existsSync(dataFile)) {
      try {
        existingEmployees = JSON.parse(fs.readFileSync(dataFile, "utf8"));
      } catch (err) {
        console.warn("Could not read existing employees database, starting fresh.");
      }
    }
    
    console.log(`Currently there are ${existingEmployees.length} employees in the local database.`);
    
    let importedCount = 0;
    
    for (const row of dataRows) {
      // Map row elements to columns using headers
      const empData = {};
      headers.forEach((header, index) => {
        empData[header] = row[index] || "";
      });
      
      // Clean up fields and map to final keys
      const name = empData.name || empData.employeename || "";
      if (!name) {
        console.log("Skipping row with missing name.");
        continue;
      }
      
      const email = empData.email || `${name.toLowerCase().replace(/\s+/g, ".")}@company.com`;
      const code = empData.code || empData.employeecode || generateCode([...existingEmployees]);
      const phone = empData.phone || empData.mobile || "";
      const gender = empData.gender || "Other";
      const department = empData.department || empData.dept || "Design";
      const title = empData.title || empData.role || empData.designation || "Team Member";
      const status = empData.status || "Full-time";
      const joined = empData.joined || empData.joiningdate || new Date().toISOString().slice(0, 10);
      const salary = Number(empData.salary || empData.pay || 0) || 0;
      const id = empData.id || "e-" + Math.random().toString(36).slice(2, 10);
      
      const employee = {
        id,
        code,
        name,
        email,
        phone,
        gender,
        department,
        title,
        status,
        joined,
        salary
      };
      
      // Check if employee already exists by email/code
      const duplicateIndex = existingEmployees.findIndex(
        emp => emp.email.toLowerCase() === email.toLowerCase() || emp.code === code
      );
      
      if (duplicateIndex !== -1) {
        console.log(`Updating existing employee: ${name} (${code})`);
        existingEmployees[duplicateIndex] = { ...existingEmployees[duplicateIndex], ...employee };
      } else {
        console.log(`Adding new employee: ${name} (${code})`);
        existingEmployees.push(employee);
      }
      importedCount++;
    }
    
    // Save updated employees
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dataFile, JSON.stringify(existingEmployees, null, 2));
    console.log(`Successfully imported/updated ${importedCount} employees! Total employees: ${existingEmployees.length}`);
    
  } catch (error) {
    console.error("An error occurred during import:", error);
  }
}

// Get CSV path from command line arguments
const args = process.argv.slice(2);
const csvFilePath = args[0] || path.join(dataDir, "import.csv");

console.log(`Starting import from CSV file: ${csvFilePath}`);
importCSV(csvFilePath);
