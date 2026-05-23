// scripts/validate-content.mjs
// Basic content validator for ANOM Social Sanctuary

import fs from "fs";
import path from "path";

const CONTENT_DIRS = ["content", "templates"];

function validateDirectory(dir) {
  const fullPath = path.resolve(dir);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipping missing directory: ${dir}`);
    return true;
  }

  const files = fs.readdirSync(fullPath);

  for (const file of files) {
    const filePath = path.join(fullPath, file);

    // Check for empty files
    const stats = fs.statSync(filePath);
    if (stats.isFile() && stats.size === 0) {
      console.error(`❌ Empty file found: ${filePath}`);
      return false;
    }

    // Check for JSON validity
    if (file.endsWith(".json")) {
      try {
        JSON.parse(fs.readFileSync(filePath, "utf8"));
      } catch (err) {
        console.error(`❌ Invalid JSON in: ${filePath}`);
        console.error(err.message);
        return false;
      }
    }
  }

  return true;
}

let allGood = true;

for (const dir of CONTENT_DIRS) {
  const ok = validateDirectory(dir);
  if (!ok) allGood = false;
}

if (!allGood) {
  console.error("❌ Content validation failed.");
  process.exit(1);
}

console.log("✅ Content validation passed.");
