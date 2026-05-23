// scripts/sync-readme.mjs
// Sync README badges + metadata for ANOM Social Sanctuary

import fs from "fs";
import path from "path";

const README_PATH = path.resolve("README.md");

// Basic badge template
const BADGES = `
<!-- AUTO-GENERATED: DO NOT EDIT -->
<p align="center">
  <img src="https://img.shields.io/badge/ANOM-Sanctuary-blueviolet?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Build-Automated-blue?style=for-the-badge" />
</p>
`;

function syncReadme() {
  if (!fs.existsSync(README_PATH)) {
    console.error("❌ README.md not found.");
    process.exit(1);
  }

  const original = fs.readFileSync(README_PATH, "utf8");

  // Remove old auto-generated block if present
  const cleaned = original.replace(
    /<!-- AUTO-GENERATED: DO NOT EDIT -->[\s\S]*?<\/p>/,
    ""
  );

  const updated = `${BADGES}\n${cleaned.trim()}\n`;

  fs.writeFileSync(README_PATH, updated);
  console.log("✅ README synced with badges + metadata.");
}

syncReadme();
