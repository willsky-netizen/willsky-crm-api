// routes/quotationLineitemsRoutes.js
const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const { getAuth } = require("../utils/googleAuth");

const SHEET_NAME = "data_quotation_lineitems";

const getSheetData = async (sheets) => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: `${SHEET_NAME}`,
  });
  return response.data.values;
};

// GET all quotation lineitems
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
    console.error("GET quotation lineitems error:", err);
    res.status(500).json({ error: "Failed to fetch quotation lineitems" });
  }
});

// POST new quotation lineitem
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

    res.status(201).json({ message: "Quotation lineitem added successfully" });
  } catch (err) {
    console.error("POST quotation lineitems error:", err);
    res.status(500).json({ error: "Failed to add quotation lineitem" });
  }
});

// PUT update quotation lineitem by id_quotation
router.put(":id", async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;

    const auth = await getAuth();
    const sheets = google.sheets({ version: "v4", auth });
    const rows = await getSheetData(sheets);
    const headers = rows[0];

    const rowIndex = rows.findIndex((row, i) => i > 0 && row[0] === id);
    if (rowIndex === -1) return res.status(404).json({ error: "Lineitem not found" });

    const values = headers.map((h) => newData[h] || "");
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${rowIndex + 1}`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [values] },
    });

    res.json({ message: "Quotation lineitem updated successfully" });
  } catch (err) {
    console.error("PUT quotation lineitems error:", err);
    res.status(500).json({ error: "Failed to update quotation lineitem" });
  }
});

// DELETE quotation lineitem by id_quotation
router.delete(":id", async (req, res) => {
  try {
    const { id } = req.params;
    const auth = await getAuth();
    const sheets = google.sheets({ version: "v4", auth });
    const rows = await getSheetData(sheets);

    const rowIndex = rows.findIndex((row, i) => i > 0 && row[0] === id);
    if (rowIndex === -1) return res.status(404).json({ error: "Lineitem not found" });

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

    res.json({ message: "Quotation lineitem deleted successfully" });
  } catch (err) {
    console.error("DELETE quotation lineitems error:", err);
    res.status(500).json({ error: "Failed to delete quotation lineitem" });
  }
});

module.exports = router;
