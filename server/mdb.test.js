import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";
import {
  getCatalog,
  getMdbStatus,
  getSeriesList,
  getTypesBySeries,
  searchProducts
} from "./mdb.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MDB_PATH = path.resolve(__dirname, "../test-JODOUK.mdb");

describe("MDB catalog API", () => {
  beforeAll(() => {
    if (!existsSync(MDB_PATH)) {
      throw new Error(`Missing catalog database at ${MDB_PATH}`);
    }
  });

  it("reports healthy status with products and series", () => {
    const status = getMdbStatus();
    expect(status.ok).toBe(true);
    expect(status.productCount).toBeGreaterThan(1000);
    expect(status.seriesCount).toBeGreaterThan(5);
    expect(status).not.toHaveProperty("file");
    expect(status).not.toHaveProperty("sizeMb");
  });

  it("returns series list", () => {
    const series = getSeriesList();
    expect(Array.isArray(series)).toBe(true);
    expect(series.length).toBeGreaterThan(5);
    expect(series[0]).toHaveProperty("seriesId");
    expect(series[0]).toHaveProperty("name");
  });

  it("builds catalog with nested types", () => {
    const catalog = getCatalog();
    expect(catalog.length).toBeGreaterThan(5);
    expect(catalog.some((item) => Array.isArray(item.types))).toBe(true);
  });

  it("filters types by series id", () => {
    const types = getTypesBySeries("1");
    expect(Array.isArray(types)).toBe(true);
    expect(types.length).toBeGreaterThan(0);
    expect(types.every((item) => item.seriesId === 1)).toBe(true);
  });

  it("searches products without exposing unitPrice", () => {
    const result = searchProducts({ keyword: "T3010", limit: 5 });
    expect(result.total).toBeGreaterThan(0);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.length).toBeLessThanOrEqual(5);
    expect(result).not.toHaveProperty("source");
    for (const item of result.items) {
      expect(item).toHaveProperty("partNumber");
      expect(item).not.toHaveProperty("unitPrice");
    }
  });

  it("clamps search limit to a safe maximum", () => {
    const result = searchProducts({ limit: 9999 });
    expect(result.limit).toBe(200);
    expect(result.items.length).toBeLessThanOrEqual(200);
  });
});
