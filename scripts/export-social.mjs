// scripts/export-social.mjs
// Build & export social content packs for ANOM Social Sanctuary

import fs from "fs";
import path from "path";

const ENV = process.argv.includes("--env=dev") ? "dev" : "prod";
const OUTPUT_DIR = path.resolve("dist/social-packs");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Simple pack builder: copy content + templates into a bundle
function buildPack() {
  const packName = `social-pack-${ENV}.json`;
  const packPath = path.join(OUTPUT_DIR, packName);

  const contentDir = path.resolve("content");
  const templatesDir = path.resolve("templates");

  const pack = {
    environment: ENV,
    generatedAt: new Date().toISOString(),
    content: {},
    templates: {}
  };

  if (fs.existsSync(contentDir)) {
    const files = fs.readdirSync(contentDir);
    for (const file of files) {
      if (file.endsWith(".json")) {
        const data = JSON.parse(fs.readFileSync(path.join(contentDir, file), "utf8"));
        pack.content[file] = data;
      }
    }
  }

  if (fs.existsSync(templatesDir)) {
    const files = fs.readdirSync(templatesDir);
    for (const file of files) {
      if (file.endsWith(".json")) {
        const data = JSON.parse(fs.readFileSync(path.join(templatesDir, file), "utf8"));
        pack.templates[file] = data;
      }
    }
  }

  fs.writeFileSync(packPath, JSON.stringify(pack, null, 2));
  console.log(`✅ Exported social pack: ${packPath}`);
}

buildPack();
