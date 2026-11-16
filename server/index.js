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
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "127.0.0.1";
const CORS_ORIGINS = (process.env.CORS_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const rateBuckets = new Map();

function getClientIp(req) {
  return req.ip || req.socket?.remoteAddress || "unknown";
}

function rateLimit({ windowMs = 60_000, max = 120 } = {}) {
  return (req, res, next) => {
    const ip = getClientIp(req);
    const now = Date.now();
    let bucket = rateBuckets.get(ip);

    if (!bucket || now >= bucket.resetAt) {
      bucket = { count: 0, resetAt: now + windowMs };
      rateBuckets.set(ip, bucket);
    }

    bucket.count += 1;

    if (bucket.count > max) {
      res.setHeader("Retry-After", Math.ceil((bucket.resetAt - now) / 1000));
      return res.status(429).json({ error: "Too many requests" });
    }

    return next();
  };
}

function sendError(res, error) {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
}

app.set("trust proxy", false);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || CORS_ORIGINS.includes("*") || CORS_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    }
  })
);
app.use(express.json({ limit: "32kb" }));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/mdb/status", (_req, res) => {
  try {
    res.json(getMdbStatus());
  } catch (error) {
    sendError(res, error);
  }
});

app.get("/api/series", (_req, res) => {
  try {
    res.json(getSeriesList());
  } catch (error) {
    sendError(res, error);
  }
});

app.get("/api/catalog", (_req, res) => {
  try {
    res.json(getCatalog());
  } catch (error) {
    sendError(res, error);
  }
});

app.get("/api/types", (req, res) => {
  try {
    res.json(getTypesBySeries(req.query.seriesId));
  } catch (error) {
    sendError(res, error);
  }
});

app.get("/api/products/search", (req, res) => {
  try {
    const result = searchProducts(req.query);
    res.json(result);
  } catch (error) {
    sendError(res, error);
  }
});

app.listen(PORT, HOST, () => {
  console.log(`JODO API running at http://${HOST}:${PORT}`);
});
