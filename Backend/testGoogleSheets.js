require("dotenv").config();
const { getSheetData } = require("./utils/googleSheets");

(async () => {
  try {
    const data = await getSheetData('data_klien'); // ganti nama sheet sesuai Google Sheet kamu
    console.log("✅ Data dari Google Sheet:");
    console.log(data);
  } catch (error) {
    console.error("❌ Gagal ambil data:", error.message);
  }
})();
