const { google } = require("googleapis");

const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

let sheetsClient;

function getAuth() {
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (credentialsPath) {
    return new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  }

  if (clientEmail && privateKey) {
    return new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  }

  throw new Error(
    "Google Sheets credentials are missing. Set GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY."
  );
}

function client() {
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID is required.");
  }

  if (!sheetsClient) {
    sheetsClient = google.sheets({ version: "v4", auth: getAuth() });
  }

  return sheetsClient;
}

module.exports = { client, getAuth, spreadsheetId };
