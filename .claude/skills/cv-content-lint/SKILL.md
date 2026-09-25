---
name: cv-content-lint
description: "Validates app/cv.json (the resume's single content source of truth): required sections/fields present, and every referenced URL is reachable. Use before shipping a content edit to app/cv.json."
when_to_use: "cv.json changed, validate resume content, check cv.json, before publishing content"
metadata:
  version: "1.0.0"
---

# CV Content Lint

`app/cv.json` drives all resume content. This skill catches a bad edit
(missing required field, broken link) before it ships silently.

## Run

```bash
node .claude/skills/cv-content-lint/scripts/validate.mjs app/cv.json
```

Exits non-zero and lists every issue if:

- a required top-level section is missing (`basics`, `education`, `experience`, `skills`)
- a required `basics` field is missing (`firstName`, `lastName`, `headline`, `summary`)
- any `http(s)://` URL found anywhere in the file returns a non-2xx status or is unreachable

## When to use

Run after any edit to `app/cv.json`, or when asked to validate/check resume content.
