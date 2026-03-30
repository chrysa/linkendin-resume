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
