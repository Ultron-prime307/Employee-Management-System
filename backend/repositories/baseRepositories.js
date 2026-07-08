const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("path");
const { makeId } = require("../seed");
const { client, spreadsheetId } = require("../googleSheetsAuth");

const dataDir = path.join(__dirname, "..", "..", "data");

// 1. File Repository Creator
function createFileRepository(filename, defaultData = [], normalizeFn = (x) => x, validateFn = () => {}) {
  const dataFile = path.join(dataDir, `${filename}.json`);

  async function ensureDataFile() {
    await fs.mkdir(dataDir, { recursive: true });
    try {
      await fs.access(dataFile);
    } catch {
      await fs.writeFile(dataFile, JSON.stringify(defaultData, null, 2));
    }
  }

  async function readAll() {
    await ensureDataFile();
    const raw = await fs.readFile(dataFile, "utf8");
    return JSON.parse(raw);
  }

  async function writeAll(data) {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
  }

  return {
    async list() {
      return await readAll();
    },
    async get(id) {
      const items = await readAll();
      return items.find((x) => x.id === id) || null;
    },
    async create(input) {
      const items = await readAll();
      const item = {
        id: input.id || makeId(),
        ...normalizeFn(input),
      };
      validateFn(item);
      items.push(item);
      await writeAll(items);
      return item;
    },
    async update(id, input) {
      const items = await readAll();
      const idx = items.findIndex((x) => x.id === id);
      if (idx === -1) return null;
      const item = normalizeFn(input, items[idx]);
      validateFn(item);
      items[idx] = { ...items[idx], ...item };
      await writeAll(items);
      return items[idx];
    },
    async remove(id) {
      const items = await readAll();
      const filtered = items.filter((x) => x.id !== id);
      if (filtered.length === items.length) return false;
      await writeAll(filtered);
      return true;
    },
  };
}

// 2. MongoDB Repository Creator
function createMongoRepository(Model, defaultData = [], normalizeFn = (x) => x, validateFn = () => {}) {
  function toApi(doc) {
    if (!doc) return null;
    const { _id, __v, uid, createdAt, updatedAt, ...rest } = doc;
    return { id: uid, ...rest };
  }

  async function ensureSeed() {
    const count = await Model.countDocuments();
    if (count > 0) return;
    await Model.insertMany(
      defaultData.map(({ id, ...rest }) => ({
        uid: id,
        ...rest,
      }))
    );
  }

  return {
    async list() {
      await ensureSeed();
      const docs = await Model.find().sort({ createdAt: 1 }).lean();
      return docs.map(toApi);
    },
    async get(id) {
      const doc = await Model.findOne({ uid: id }).lean();
      return toApi(doc);
    },
    async create(input) {
      const item = {
        uid: input.id || makeId(),
        ...normalizeFn(input),
      };
      validateFn(item);
      const created = await Model.create(item);
      return toApi(created.toObject());
    },
    async update(id, input) {
      const existing = await Model.findOne({ uid: id }).lean();
      if (!existing) return null;
      const item = normalizeFn(input, existing);
      validateFn(item);
      const updated = await Model.findOneAndUpdate({ uid: id }, item, { new: true }).lean();
      return toApi(updated);
    },
    async remove(id) {
      const result = await Model.deleteOne({ uid: id });
      return result.deletedCount > 0;
    },
  };
}

// 3. Google Sheets Repository Creator
function createGoogleSheetsRepository(sheetName, columns, defaultData = [], normalizeFn = (x) => x, validateFn = () => {}) {
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
    let sheet = sheets.find((item) => item.properties.title === sheetName);

    // If sheet tab does not exist, automatically add it!
    if (!sheet) {
      const addRes = await client().spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            },
          ],
        },
      });
      const newSheetProps = addRes.data.replies[0].addSheet.properties;
      sheet = { properties: newSheetProps };
    }

    sheetInfo = {
      id: sheet.properties.sheetId,
      title: sheet.properties.title,
    };
    return sheetInfo;
  }

  function toRow(item) {
    return columns.map((col) => item[col] ?? "");
  }

  function fromRow(row) {
    const item = {};
    columns.forEach((col, idx) => {
      item[col] = row[idx] ?? "";
    });
    // Parse numeric fields if any
    if (item.salary !== undefined) {
      item.salary = Number(item.salary) || 0;
    }
    if (item.budget !== undefined) {
      item.budget = Number(item.budget) || 0;
    }
    return item;
  }

  async function ensureSheet() {
    await getSheetInfo();

    // Read first row to check headers
    const res = await client().spreadsheets.values.get({
      spreadsheetId,
      range: range("A1:Z1"),
    });

    const headers = res.data.values?.[0] || [];
    const hasHeaders = columns.every((col, idx) => headers[idx] === col);

    if (!hasHeaders) {
      // Write column headers
      const colLetter = String.fromCharCode(65 + columns.length - 1);
      await client().spreadsheets.values.update({
        spreadsheetId,
        range: range(`A1:${colLetter}1`),
        valueInputOption: "RAW",
        requestBody: { values: [columns] },
      });
    }
  }

  async function readWithRows() {
    await ensureSheet();

    const colLetter = String.fromCharCode(65 + columns.length - 1);
    const res = await client().spreadsheets.values.get({
      spreadsheetId,
      range: range(`A2:${colLetter}`),
    });

    const rows = res.data.values || [];
    const items = rows
      .map((row, idx) => ({ item: fromRow(row), rowNumber: idx + 2 }))
      .filter(({ item }) => item.id);

    if (items.length > 0) return items;

    // Seed default data if empty
    if (defaultData.length > 0) {
      await client().spreadsheets.values.append({
        spreadsheetId,
        range: range(`A:${colLetter}`),
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: defaultData.map(toRow) },
      });
    }

    return defaultData.map((item, idx) => ({
      item,
      rowNumber: idx + 2,
    }));
  }

  return {
    async list() {
      const rows = await readWithRows();
      return rows.map(({ item }) => item);
    },
    async get(id) {
      const rows = await readWithRows();
      return rows.find(({ item }) => item.id === id)?.item || null;
    },
    async create(input) {
      const items = await this.list();
      const item = {
        id: input.id || makeId(),
        ...normalizeFn(input),
      };
      validateFn(item);

      const colLetter = String.fromCharCode(65 + columns.length - 1);
      await client().spreadsheets.values.append({
        spreadsheetId,
        range: range(`A:${colLetter}`),
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: [toRow(item)] },
      });

      return item;
    },
    async update(id, input) {
      const rows = await readWithRows();
      const found = rows.find(({ item }) => item.id === id);
      if (!found) return null;

      const item = normalizeFn(input, found.item);
      validateFn(item);

      const colLetter = String.fromCharCode(65 + columns.length - 1);
      await client().spreadsheets.values.update({
        spreadsheetId,
        range: range(`A${found.rowNumber}:${colLetter}${found.rowNumber}`),
        valueInputOption: "RAW",
        requestBody: { values: [toRow(item)] },
      });

      return item;
    },
    async remove(id) {
      const rows = await readWithRows();
      const found = rows.find(({ item }) => item.id === id);
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
    },
  };
}

module.exports = {
  createFileRepository,
  createMongoRepository,
  createGoogleSheetsRepository,
};
