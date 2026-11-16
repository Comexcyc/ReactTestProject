import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MDB_PATH = path.resolve(__dirname, "../test-JODOUK.mdb");

let productCache = null;
let seriesCache = null;
let typeCache = null;
let catalogCache = null;
let cacheMtime = null;

function stripHtml(value) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function ensureMdbExists() {
  if (!fs.existsSync(MDB_PATH)) {
    throw new Error(`MDB file not found: ${MDB_PATH}`);
  }
}

function getMdbMtime() {
  return fs.statSync(MDB_PATH).mtimeMs;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0];
  return rows.slice(1).map((cells) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = cells[index] ?? "";
    });
    return record;
  });
}

function exportTable(tableName) {
  ensureMdbExists();
  const result = spawnSync("mdb-export", [MDB_PATH, tableName], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(result.stderr || `Failed to export table: ${tableName}`);
  }

  return parseCsv(result.stdout);
}

function sanitizeLikeInput(value) {
  return String(value ?? "").replace(/[^a-zA-Z0-9*_()%.-]/g, "");
}

function normalizeKeyword(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function resolveModelIdsFromKeyword(keyword) {
  const pattern = normalizeKeyword(keyword);
  if (!pattern) {
    return new Set();
  }

  const modelIds = new Set();

  for (const series of seriesCache) {
    const seriesText = [
      series.name,
      series.nameEn,
      series.intro
    ]
      .map(normalizeKeyword)
      .join(" ");

    if (seriesText.includes(pattern)) {
      for (const type of typeCache) {
        if (type.seriesId === series.seriesId && type.modelId) {
          modelIds.add(type.modelId.toLowerCase());
        }
      }
    }
  }

  for (const type of typeCache) {
    const typeText = [
      type.modelId,
      type.description,
      type.descriptionEn,
      type.standard
    ]
      .map(normalizeKeyword)
      .join(" ");

    if (typeText.includes(pattern) && type.modelId) {
      modelIds.add(type.modelId.toLowerCase());
    }
  }

  return modelIds;
}

function matchesKeyword(row, keyword, modelIds) {
  const pattern = normalizeKeyword(keyword);
  if (!pattern) {
    return true;
  }

  const productText = [
    row.partNumber,
    row.seriesId,
    row.description,
    row.tolerance,
    row.caseCode
  ]
    .map(normalizeKeyword)
    .join(" ");

  return (
    productText.includes(pattern) ||
    modelIds.has(row.seriesId.toLowerCase())
  );
}

function toNumber(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function mapProductRow(row) {
  // Intentionally omit unit_price / pricing fields from public API responses.
  // Source data in the MDB file is left unchanged.
  return {
    partNumber: row["JODO_P/N"] ?? "",
    seriesId: row.jodo_series_id ?? "",
    description: row.description ?? "",
    ratingVoltage: toNumber(row.rating_voltage),
    capacitance: toNumber(row.capacitance),
    esr: toNumber(row.ESR),
    tolerance: row.tolerance ?? "",
    caseCode: row.case ?? ""
  };
}

function mapTypeRow(row) {
  return {
    modelId: row.jodo_series_id ?? "",
    description: row.description ?? "",
    descriptionEn: row.description_e ?? "",
    seriesId: toNumber(row.series_ID),
    standard: row.standard ?? "",
    voltMin: toNumber(row.VOLT_MIN),
    voltMax: toNumber(row.VOLT_MAX),
    capMin: toNumber(row.CAPA_MIN),
    capMax: toNumber(row.CAPA_MAX),
    features: stripHtml(row.features ?? "").slice(0, 180)
  };
}

function loadProducts() {
  const mtime = getMdbMtime();
  if (!productCache || cacheMtime !== mtime) {
    productCache = exportTable("PRODUCT").map(mapProductRow);
    typeCache = exportTable("TYPE").map(mapTypeRow);
    seriesCache = exportTable("series").map((row) => ({
      seriesId: toNumber(row.series_ID),
      name: row.series ?? "",
      nameEn: row.series_e ?? "",
      intro: stripHtml(row.page1 ?? "").slice(0, 220)
    }));
    catalogCache = null;
    cacheMtime = mtime;
  }
}

function countProductsForModel(modelId) {
  const pattern = modelId.toLowerCase();
  return productCache.filter((row) =>
    row.seriesId.toLowerCase().includes(pattern)
  ).length;
}

export function getSeriesList() {
  loadProducts();
  return seriesCache;
}

export function getCatalog() {
  loadProducts();

  if (!catalogCache) {
    catalogCache = seriesCache.map((series) => {
      const types = typeCache
        .filter((type) => type.seriesId === series.seriesId)
        .map((type) => ({
          ...type,
          productCount: countProductsForModel(type.modelId)
        }));

      return {
        ...series,
        typeCount: types.length,
        productCount: types.reduce((sum, type) => sum + type.productCount, 0),
        types
      };
    });
  }

  return catalogCache;
}

export function getTypesBySeries(seriesId) {
  loadProducts();
  const id = toNumber(seriesId);
  if (id === null) {
    return [];
  }

  return typeCache
    .filter((type) => type.seriesId === id)
    .map((type) => ({
      ...type,
      productCount: countProductsForModel(type.modelId)
    }));
}

export function searchProducts(filters = {}) {
  loadProducts();

  const {
    partNumber = "",
    keyword = "",
    q = "",
    seriesId = "",
    capMin,
    capMax,
    voltMin,
    voltMax,
    limit = 50,
    offset = 0
  } = filters;

  const searchKeyword = normalizeKeyword(keyword || q);
  const safePartNumber = sanitizeLikeInput(partNumber);
  const safeSeriesId = sanitizeLikeInput(seriesId);
  const modelIdsFromKeyword = searchKeyword
    ? resolveModelIdsFromKeyword(searchKeyword)
    : new Set();
  const capMinNum = toNumber(capMin);
  const capMaxNum = toNumber(capMax);
  const voltMinNum = toNumber(voltMin);
  const voltMaxNum = toNumber(voltMax);
  const limitNum = Math.min(Math.max(toNumber(limit) ?? 50, 1), 200);
  const offsetNum = Math.max(toNumber(offset) ?? 0, 0);

  let rows = productCache;

  if (searchKeyword) {
    rows = rows.filter((row) =>
      matchesKeyword(row, searchKeyword, modelIdsFromKeyword)
    );
  } else if (safePartNumber) {
    const pattern = safePartNumber.toLowerCase();
    rows = rows.filter((row) =>
      row.partNumber.toLowerCase().includes(pattern)
    );
  }

  if (safeSeriesId) {
    const pattern = safeSeriesId.toLowerCase();
    rows = rows.filter((row) =>
      row.seriesId.toLowerCase().includes(pattern)
    );
  }

  if (capMinNum !== null) {
    rows = rows.filter(
      (row) => row.capacitance !== null && row.capacitance >= capMinNum
    );
  }

  if (capMaxNum !== null) {
    rows = rows.filter(
      (row) => row.capacitance !== null && row.capacitance <= capMaxNum
    );
  }

  if (voltMinNum !== null) {
    rows = rows.filter(
      (row) => row.ratingVoltage !== null && row.ratingVoltage >= voltMinNum
    );
  }

  if (voltMaxNum !== null) {
    rows = rows.filter(
      (row) => row.ratingVoltage !== null && row.ratingVoltage <= voltMaxNum
    );
  }

  const total = rows.length;
  const items = rows.slice(offsetNum, offsetNum + limitNum);

  return {
    total,
    limit: limitNum,
    offset: offsetNum,
    refreshedAt: new Date(cacheMtime).toISOString(),
    items
  };
}

export function getMdbStatus() {
  ensureMdbExists();
  loadProducts();
  return {
    ok: true,
    productCount: productCache.length,
    seriesCount: seriesCache.length
  };
}
