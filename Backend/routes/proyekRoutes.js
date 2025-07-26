// routes/proyekRoutes.js
const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const { getAuth } = require("../utils/googleAuth");

const SHEET_NAME = "data_proyek";

const getSheetData = async (sheets) => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: `${SHEET_NAME}`,
  });
  return response.data.values;
};

router.get("/", async (req, res) => {
  try {
    const auth = await getAuth();
    const sheets = google.sheets({ version: "v4", auth });
    const rows = await getSheetData(sheets);

    if (!rows || rows.length < 2) return res.status(200).json([]);

    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      const obj = {};
      headers.forEach((key, i) => {
        obj[key] = row[i] || "";
      });
      return obj;
    });

    res.json(data);
  } catch (err) {
    console.error("GET proyek error:", err);
    res.status(500).json({ error: "Failed to fetch data_proyek" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newData = req.body;
    const auth = await getAuth();
    const sheets = google.sheets({ version: "v4", auth });
    const rows = await getSheetData(sheets);
    const headers = rows[0];

    const values = headers.map((h) => newData[h] || "");
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${SHEET_NAME}`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [values] },
    });

    res.status(201).json({ message: "Proyek added successfully" });
  } catch (err) {
    console.error("POST proyek error:", err);
    res.status(500).json({ error: "Failed to add proyek" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;

    const auth = await getAuth();
    const sheets = google.sheets({ version: "v4", auth });
    const rows = await getSheetData(sheets);
    const headers = rows[0];

    const rowIndex = rows.findIndex((row, i) => i > 0 && row[0] === id);
    if (rowIndex === -1) return res.status(404).json({ error: "Proyek not found" });

    const values = headers.map((h) => newData[h] || "");
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${rowIndex + 1}`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [values] },
    });

    res.json({ message: "Proyek updated successfully" });
  } catch (err) {
    console.error("PUT proyek error:", err);
    res.status(500).json({ error: "Failed to update proyek" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const auth = await getAuth();
    const sheets = google.sheets({ version: "v4", auth });
    const rows = await getSheetData(sheets);

    const rowIndex = rows.findIndex((row, i) => i > 0 && row[0] === id);
    if (rowIndex === -1) return res.status(404).json({ error: "Proyek not found" });

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: process.env.SPREADSHEET_ID,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0,
                dimension: "ROWS",
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });

    res.json({ message: "Proyek deleted successfully" });
  } catch (err) {
    console.error("DELETE proyek error:", err);
    res.status(500).json({ error: "Failed to delete proyek" });
  }
});

module.exports = router;
