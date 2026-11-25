import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appSource = readFileSync(path.join(__dirname, "App.jsx"), "utf8");
const homeSource = readFileSync(path.join(__dirname, "pages/HomePage.jsx"), "utf8");
const productsSource = readFileSync(
  path.join(__dirname, "pages/ProductCatalogPage.jsx"),
  "utf8"
);

describe("localized content smoke checks", () => {
  it("defines aboutPage and home content for en, zh, and ja", () => {
    expect(appSource).toContain('langCode: "en"');
    expect(appSource).toContain('langCode: "zh-CN"');
    expect(appSource).toContain('langCode: "ja"');

    const aboutBlocks = appSource.match(/aboutPage:\s*\{/g) || [];
    expect(aboutBlocks.length).toBe(3);

    const homeBlocks = appSource.match(/home:\s*\{\s*focusTitle:/g) || [];
    expect(homeBlocks.length).toBe(3);
  });

  it("uses a dedicated home page and unified products catalog route", () => {
    expect(homeSource).toContain("function HomePage");
    expect(appSource).toContain('path="/"');
    expect(appSource).toContain("<HomePage t={t} />");
    expect(appSource).toContain('path="/products"');
    expect(appSource).toContain("<ProductCatalogPage t={t} language={language} />");
    expect(appSource).toContain('path="/catalog"');
    expect(appSource).toContain("element={<QueryRedirect />}");
  });

  it("folds hybrid series into products and keeps secondary routes hidden from nav", () => {
    expect(productsSource).toContain('id="hybrid-series"');
    expect(productsSource).toContain("t.hybridSeries.rows");
    expect(appSource).toContain('to: "/hybrid-series"');
    expect(appSource).toContain('to="/products#hybrid-series"');
    expect(appSource).toContain('to: "/selection-guide"');
    expect(appSource).toContain('to: "/featured"');
    expect(appSource).toContain('to: "/catalog"');
    expect(appSource).toContain('to: "/contact"');
    expect(appSource).toContain('to: "/certifications"');
    expect(appSource).toContain("hidden: true");
    expect(appSource).toContain(".filter((item) => !item.hidden)");
    expect(appSource).toContain('id="contact"');
    expect(appSource).toContain('id="certifications"');
    expect(appSource).toContain('to="/about#contact"');
    expect(appSource).toContain('to="/about#certifications"');
  });

  it("exposes Home in the primary nav for all locales", () => {
    expect(appSource).toContain('home: "Home"');
    expect(appSource).toContain('home: "首页"');
    expect(appSource).toContain('home: "ホーム"');
    expect(appSource).toContain('{ to: "/", label: t.nav.home, end: true }');
  });
});

