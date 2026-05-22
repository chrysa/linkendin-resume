---
applyTo: "**/*.py"
---
# Python Guidelines

- All public functions must have type annotations
- Use dataclasses or pydantic models, not raw dicts for structured data
- Avoid mutable default arguments
- Use pathlib.Path instead of os.path
- Prefer f-strings over .format() or % formatting
- Maximum line length: 120 characters
- All imports must be sorted (isort/ruff)

---

## Structure Rules (from Notion Engineering Standards 2026-05-21)

- **One class per file.** Each class lives in its own module (e.g. `models/user.py` contains only `User`).
- **Domain-driven structure.** Organise by domain (`connectors/`, `services/`, `schemas/`) — not by layer.
- **No `print()` in production.** Use `structlog` or `logging` with JSON formatter.
