const express = require("express");
const router = express.Router();
const { getSheetData } = require("../utils/googleSheets");

router.get("/", async (req, res) => {
  try {
    const data = await getSheetData("data_klien"); // bisa diganti ke sheet lain
    res.json({ success: true, data });
  } catch (err) {
    console.error("Test Google Sheets error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
