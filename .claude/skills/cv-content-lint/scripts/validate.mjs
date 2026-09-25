#!/usr/bin/env node
/**
 * Validates app/cv.json: required top-level sections, required basics
 * fields, and that every http(s) URL responds (HEAD, best-effort).
 *
 * Usage: node validate.mjs [path/to/cv.json]
 */

import { readFileSync } from "node:fs";

const cvPath = process.argv[2] ?? "app/cv.json";
const errors = [];

let cv;
try {
  cv = JSON.parse(readFileSync(cvPath, "utf8"));
} catch (error) {
  console.error(`cv-content-lint: cannot read/parse ${cvPath}: ${error.message}`);
  process.exit(1);
}

const REQUIRED_SECTIONS = ["basics", "education", "experience", "skills"];
for (const section of REQUIRED_SECTIONS) {
  if (!(section in cv)) errors.push(`missing top-level section: ${section}`);
}

const REQUIRED_BASICS_FIELDS = ["firstName", "lastName", "headline", "summary"];
for (const field of REQUIRED_BASICS_FIELDS) {
  if (!cv.basics?.[field]) errors.push(`missing basics.${field}`);
}

function collectUrls(node, urls = []) {
  if (typeof node === "string" && /^https?:\/\//.test(node)) {
    urls.push(node);
  } else if (Array.isArray(node)) {
    node.forEach((item) => collectUrls(item, urls));
  } else if (node && typeof node === "object") {
    Object.values(node).forEach((value) => collectUrls(value, urls));
  }
  return urls;
}

const urls = [...new Set(collectUrls(cv))];

async function checkUrl(url) {
  try {
    const response = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(5000) });
    if (!response.ok) errors.push(`broken link (${response.status}): ${url}`);
  } catch (error) {
    errors.push(`unreachable link (${error.message}): ${url}`);
  }
}

await Promise.all(urls.map(checkUrl));

if (errors.length > 0) {
  console.error(`cv-content-lint: ${errors.length} issue(s) found in ${cvPath}\n`);
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}

console.log(`cv-content-lint: ${cvPath} OK (${urls.length} link(s) checked)`);
