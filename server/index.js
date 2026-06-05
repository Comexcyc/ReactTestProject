import cors from "cors";
import express from "express";
import {
  getCatalog,
  getMdbStatus,
  getSeriesList,
  getTypesBySeries,
  searchProducts
} from "./mdb.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/mdb/status", (_req, res) => {
  try {
    res.json(getMdbStatus());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/series", (_req, res) => {
  try {
    res.json(getSeriesList());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/catalog", (_req, res) => {
  try {
    res.json(getCatalog());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/types", (req, res) => {
  try {
    res.json(getTypesBySeries(req.query.seriesId));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/products/search", (req, res) => {
  try {
    const result = searchProducts(req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`JODO API running at http://localhost:${PORT}`);
});
