#!/usr/bin/env node
/**
 * ESLint auto-fix — PostToolUse hook (file writes).
 *
 * After Claude writes/edits a TS/TSX file under app/src, runs
 * `eslint --fix` on that file. Informative only — never blocks.
 *
 * Hook type: PostToolUse — target: Write, Edit, MultiEdit
 */

"use strict";

const path = require("path");
const { spawnSync } = require("child_process");

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const event = JSON.parse(raw || "{}");
    const filePath =
      event?.tool_input?.file_path ?? event?.tool_input?.path ?? null;

    if (!filePath || !/\.tsx?$/.test(filePath)) {
      process.exit(0);
    }

    const appDir = path.join(process.env.CLAUDE_PROJECT_DIR || ".", "app");
    if (!filePath.includes(`${path.sep}app${path.sep}src${path.sep}`)) {
      process.exit(0);
    }

    const result = spawnSync(
      "npx",
      ["eslint", "--fix", filePath],
      { cwd: appDir, encoding: "utf8", timeout: 15000 },
    );

    if (result.status !== 0 && result.stdout) {
      process.stderr.write(`eslint-autofix: ${result.stdout}\n`);
    }
  } catch (error) {
    process.stderr.write(`eslint-autofix: ${error.message}\n`);
  }
  process.exit(0);
});
