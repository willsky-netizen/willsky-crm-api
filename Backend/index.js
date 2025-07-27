require("dotenv").config();
const express = require("express");
const cors = require("cors");

const perusahaanRoutes = require("./routes/perusahaanRoutes");
const klienRoutes = require("./routes/klienRoutes");
const proyekRoutes = require("./routes/proyekRoutes");
const produkRoutes = require("./routes/produkRoutes");
const quotationRoutes = require("./routes/quotationLineitemsRoutes");
const invoiceLineitemsRoutes = require("./routes/invoiceLineitemsRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const testSheetRoute = require("./routes/testSheetRoute"); // ← Tambahan

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main routes
app.use("/api/perusahaan", perusahaanRoutes);
app.use("/api/klien", klienRoutes);
app.use("/api/proyek", proyekRoutes);
app.use("/api/produk", produkRoutes);
app.use("/api/quotation", quotationRoutes);
app.use("/api/invoice-lineitems", invoiceLineitemsRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/test-sheet", testSheetRoute); // ← Tambahan

app.get("/", (req, res) => {
  res.send("WILLSKY CRM Backend is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
