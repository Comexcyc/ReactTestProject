import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appSource = readFileSync(path.join(__dirname, "App.jsx"), "utf8");

describe("localized content smoke checks", () => {
  it("defines aboutPage content for en, zh, and ja", () => {
    expect(appSource).toContain('langCode: "en"');
    expect(appSource).toContain('langCode: "zh-CN"');
    expect(appSource).toContain('langCode: "ja"');

    const aboutBlocks = appSource.match(/aboutPage:\s*\{/g) || [];
    expect(aboutBlocks.length).toBe(3);
  });

  it("keeps selection-guide, featured, contact, and certifications hidden from nav", () => {
    expect(appSource).toContain('to: "/selection-guide"');
    expect(appSource).toContain('to: "/featured"');
    expect(appSource).toContain('to: "/contact"');
    expect(appSource).toContain('to: "/certifications"');
    expect(appSource).toContain("hidden: true");
    expect(appSource).toContain(".filter((item) => !item.hidden)");
    expect(appSource).toContain('id="contact"');
    expect(appSource).toContain('id="certifications"');
    expect(appSource).toContain('to="/about#contact"');
    expect(appSource).toContain('to="/about#certifications"');
  });
});
